import { getDb } from "./db.js";
import fs from "fs";

const db = getDb();
const command = process.argv[2];

const commands = {
  stats() {
    const total = db.prepare("SELECT COUNT(*) as c FROM restaurants").get().c;
    const withEmail = db.prepare("SELECT COUNT(*) as c FROM restaurants WHERE email IS NOT NULL").get().c;
    const withPhone = db.prepare("SELECT COUNT(*) as c FROM restaurants WHERE phone IS NOT NULL").get().c;
    const withWebsite = db.prepare("SELECT COUNT(*) as c FROM restaurants WHERE website IS NOT NULL").get().c;
    const byCity = db.prepare("SELECT city, COUNT(*) as c FROM restaurants GROUP BY city ORDER BY c DESC").all();
    const byStatus = db.prepare("SELECT email_status, COUNT(*) as c FROM restaurants GROUP BY email_status ORDER BY c DESC").all();
    const replied = db.prepare("SELECT COUNT(*) as c FROM restaurants WHERE replied = 1").get().c;
    const booked = db.prepare("SELECT COUNT(*) as c FROM restaurants WHERE booked = 1").get().c;

    console.log(`\nLead Database Stats`);
    console.log(`===================`);
    console.log(`Total restaurants:  ${total}`);
    console.log(`With email:         ${withEmail} (${total ? Math.round((withEmail / total) * 100) : 0}%)`);
    console.log(`With phone:         ${withPhone}`);
    console.log(`With website:       ${withWebsite}`);
    console.log(`Replied:            ${replied}`);
    console.log(`Booked:             ${booked}`);
    console.log(`\nBy city:`);
    byCity.forEach((r) => console.log(`  ${r.city}: ${r.c}`));
    console.log(`\nBy email status:`);
    byStatus.forEach((r) => console.log(`  ${r.email_status}: ${r.c}`));
  },

  list() {
    const city = process.argv[3];
    const filter = process.argv[4]; // "email-only", "no-email", "new"

    let query = "SELECT * FROM restaurants WHERE 1=1";
    const params = [];

    if (city) {
      query += " AND city LIKE ?";
      params.push(`%${city}%`);
    }
    if (filter === "email-only") {
      query += " AND email IS NOT NULL";
    } else if (filter === "no-email") {
      query += " AND email IS NULL AND website IS NOT NULL";
    } else if (filter === "new") {
      query += " AND email_status = 'new' AND email IS NOT NULL";
    }

    query += " ORDER BY review_count DESC LIMIT 50";

    const rows = db.prepare(query).all(...params);
    console.log(`\nShowing ${rows.length} restaurants:\n`);
    rows.forEach((r) => {
      console.log(`  ${r.name}`);
      console.log(`    ${r.address}`);
      if (r.email) console.log(`    Email: ${r.email}`);
      if (r.phone) console.log(`    Phone: ${r.phone}`);
      if (r.website) console.log(`    Web: ${r.website}`);
      console.log(`    Rating: ${r.rating || "?"} (${r.review_count || 0} reviews) | Status: ${r.email_status}`);
      console.log();
    });
  },

  export() {
    const filter = process.argv[3] || "all";
    let query = "SELECT name, email, phone, website, address, city, rating, review_count FROM restaurants WHERE 1=1";

    if (filter === "email-only") {
      query += " AND email IS NOT NULL";
    } else if (filter === "new") {
      query += " AND email IS NOT NULL AND email_status = 'new'";
    }

    query += " ORDER BY city, review_count DESC";
    const rows = db.prepare(query).all();

    // CSV export
    const header = "Name,Email,Phone,Website,Address,City,Rating,Reviews";
    const lines = rows.map(
      (r) =>
        `"${(r.name || "").replace(/"/g, '""')}","${r.email || ""}","${r.phone || ""}","${r.website || ""}","${(r.address || "").replace(/"/g, '""')}","${r.city || ""}",${r.rating || ""},${r.review_count || ""}`
    );

    const csv = [header, ...lines].join("\n");
    const filename = `leads_${filter}_${new Date().toISOString().slice(0, 10)}.csv`;
    fs.writeFileSync(filename, csv);
    console.log(`Exported ${rows.length} leads to ${filename}`);
  },
};

if (!command || !commands[command]) {
  console.log(`
DineLine Lead Manager
=====================

Commands:
  node scripts/leads.js stats                       — Show database stats
  node scripts/leads.js list [city] [filter]        — List restaurants
  node scripts/leads.js export [filter]             — Export to CSV

Filters: email-only, no-email, new, all (default)

Examples:
  node scripts/leads.js stats
  node scripts/leads.js list London email-only
  node scripts/leads.js export new
  `);
} else {
  commands[command]();
}
