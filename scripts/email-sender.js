import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getDb } from "./db.js";
import { sequences, personalizeEmail } from "./email-sequences.js";

dotenv.config();

// --- Config ---

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER, // azan@getdineline.com
    pass: process.env.SMTP_PASS, // Google Workspace app password
  },
};

const FROM_NAME = process.env.FROM_NAME || "Azan";
const FROM_EMAIL = process.env.SMTP_USER;

// Sending limits
const MAX_PER_DAY = parseInt(process.env.MAX_EMAILS_PER_DAY || "40");
const DELAY_BETWEEN_EMAILS_MS = parseInt(process.env.DELAY_BETWEEN_MS || "90000"); // 90 seconds

// --- Transporter ---

function createTransporter() {
  if (!SMTP_CONFIG.auth.user || !SMTP_CONFIG.auth.pass) {
    console.error("Error: SMTP_USER and SMTP_PASS must be set in .env");
    console.error("For Google Workspace, use an App Password:");
    console.error("  1. Go to myaccount.google.com > Security > 2-Step Verification");
    console.error("  2. At the bottom, click 'App passwords'");
    console.error("  3. Create one for 'Mail'");
    process.exit(1);
  }

  return nodemailer.createTransport(SMTP_CONFIG);
}

// --- Send email ---

async function sendEmail(transporter, to, subject, body, restaurantId, step) {
  const db = getDb();

  const mailOptions = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject,
    text: body,
    headers: {
      "X-DineLine-RestaurantId": String(restaurantId),
      "X-DineLine-Step": String(step),
    },
  };

  try {
    await transporter.sendMail(mailOptions);

    // Log the send
    db.prepare(`
      INSERT INTO email_log (restaurant_id, step, subject)
      VALUES (?, ?, ?)
    `).run(restaurantId, step, subject);

    // Update restaurant status
    db.prepare(`
      UPDATE restaurants
      SET email_status = 'emailed',
          email_sequence_step = ?,
          last_emailed_at = datetime('now')
      WHERE id = ?
    `).run(step, restaurantId);

    return true;
  } catch (err) {
    console.error(`  Failed to send to ${to}: ${err.message}`);
    return false;
  }
}

// --- Process queue ---

async function processQueue(dryRun = false) {
  const db = getDb();

  // Count emails sent today
  const sentToday = db.prepare(`
    SELECT COUNT(*) as c FROM email_log
    WHERE sent_at >= datetime('now', 'start of day')
  `).get().c;

  const remaining = MAX_PER_DAY - sentToday;
  if (remaining <= 0) {
    console.log(`Daily limit reached (${MAX_PER_DAY} emails). Try again tomorrow.`);
    return;
  }

  console.log(`Emails sent today: ${sentToday}/${MAX_PER_DAY} — ${remaining} remaining\n`);

  // Get leads that need emails
  const leadsToEmail = [];

  // Step 1: New leads with emails that haven't been contacted
  const newLeads = db.prepare(`
    SELECT * FROM restaurants
    WHERE email IS NOT NULL
      AND email_status = 'new'
    ORDER BY review_count DESC
    LIMIT ?
  `).all(remaining);

  for (const lead of newLeads) {
    leadsToEmail.push({ ...lead, nextStep: 1 });
  }

  // Steps 2-3: Follow-ups due
  for (const seq of sequences.slice(1)) {
    if (leadsToEmail.length >= remaining) break;

    const followUps = db.prepare(`
      SELECT * FROM restaurants
      WHERE email IS NOT NULL
        AND email_status = 'emailed'
        AND email_sequence_step = ?
        AND replied = 0
        AND last_emailed_at <= datetime('now', '-${seq.delayDays} days')
      ORDER BY last_emailed_at ASC
      LIMIT ?
    `).all(seq.step - 1, remaining - leadsToEmail.length);

    for (const lead of followUps) {
      leadsToEmail.push({ ...lead, nextStep: seq.step });
    }
  }

  if (leadsToEmail.length === 0) {
    console.log("No emails to send. Either no new leads with emails, or follow-ups aren't due yet.");
    return;
  }

  console.log(`${leadsToEmail.length} emails to send:\n`);

  if (dryRun) {
    for (const lead of leadsToEmail) {
      const template = sequences[lead.nextStep - 1];
      const { subject } = personalizeEmail(template, lead);
      console.log(`  [DRY RUN] Step ${lead.nextStep} → ${lead.email} — "${subject}"`);
    }
    console.log("\nRun without --dry-run to actually send.");
    return;
  }

  const transporter = createTransporter();

  // Verify connection
  try {
    await transporter.verify();
    console.log("SMTP connection verified.\n");
  } catch (err) {
    console.error(`SMTP connection failed: ${err.message}`);
    process.exit(1);
  }

  let sentCount = 0;

  for (let i = 0; i < leadsToEmail.length; i++) {
    const lead = leadsToEmail[i];
    const template = sequences[lead.nextStep - 1];
    const { subject, body } = personalizeEmail(template, lead);

    process.stdout.write(`  [${i + 1}/${leadsToEmail.length}] Step ${lead.nextStep} → ${lead.email}...`);

    const sent = await sendEmail(transporter, lead.email, subject, body, lead.id, lead.nextStep);

    if (sent) {
      sentCount++;
      process.stdout.write(" sent\n");
    }

    // Wait between sends to avoid rate limits
    if (i < leadsToEmail.length - 1) {
      const delaySec = Math.round(DELAY_BETWEEN_EMAILS_MS / 1000);
      process.stdout.write(`  Waiting ${delaySec}s before next send...\n`);
      await new Promise((r) => setTimeout(r, DELAY_BETWEEN_EMAILS_MS));
    }
  }

  console.log(`\nDone: ${sentCount} emails sent.`);
}

// --- Mark replies ---

function markReplied(restaurantId) {
  const db = getDb();
  db.prepare(`
    UPDATE restaurants SET replied = 1, email_status = 'replied' WHERE id = ?
  `).run(restaurantId);
  console.log(`Marked restaurant #${restaurantId} as replied.`);
}

function markBooked(restaurantId) {
  const db = getDb();
  db.prepare(`
    UPDATE restaurants SET booked = 1, email_status = 'booked' WHERE id = ?
  `).run(restaurantId);
  console.log(`Marked restaurant #${restaurantId} as booked.`);
}

// --- CLI ---

const command = process.argv[2];

const commands = {
  send: () => processQueue(false),
  preview: () => processQueue(true),
  "mark-replied": () => {
    const id = process.argv[3];
    if (!id) { console.error("Usage: node email-sender.js mark-replied <restaurant_id>"); return; }
    markReplied(parseInt(id));
  },
  "mark-booked": () => {
    const id = process.argv[3];
    if (!id) { console.error("Usage: node email-sender.js mark-booked <restaurant_id>"); return; }
    markBooked(parseInt(id));
  },
};

if (!command || !commands[command]) {
  console.log(`
DineLine Email Sender
=====================

Commands:
  node scripts/email-sender.js preview          — See what would be sent (dry run)
  node scripts/email-sender.js send             — Actually send emails
  node scripts/email-sender.js mark-replied <id> — Mark a restaurant as replied
  node scripts/email-sender.js mark-booked <id>  — Mark a restaurant as booked

Sequence:
  Step 1: Initial outreach (sent immediately to new leads)
  Step 2: Follow-up (3 days after step 1)
  Step 3: Final follow-up (4 days after step 2)

Config (.env):
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=azan@getdineline.com
  SMTP_PASS=your_app_password
  FROM_NAME=Azan
  MAX_EMAILS_PER_DAY=40
  DELAY_BETWEEN_MS=90000
  `);
} else {
  commands[command]().catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
}
