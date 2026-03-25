import axios from "axios";
import * as cheerio from "cheerio";

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

const IGNORED_EMAILS = new Set([
  "example@example.com",
  "email@example.com",
  "your@email.com",
  "info@example.com",
  "name@example.com",
  "username@example.com",
]);

const IGNORED_DOMAINS = new Set([
  "sentry.io",
  "wixpress.com",
  "googleusercontent.com",
  "w3.org",
  "schema.org",
  "googleapis.com",
  "gstatic.com",
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "youtube.com",
  "example.com",
]);

export async function scrapeEmailFromWebsite(url) {
  if (!url) return null;

  try {
    // Normalize URL
    if (!url.startsWith("http")) url = "https://" + url;

    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      maxRedirects: 3,
    });

    const $ = cheerio.load(html);

    // Method 1: mailto links (most reliable)
    const mailtoEmails = [];
    $('a[href^="mailto:"]').each((_, el) => {
      const href = $(el).attr("href") || "";
      const email = href.replace("mailto:", "").split("?")[0].trim().toLowerCase();
      if (email && isValidEmail(email)) mailtoEmails.push(email);
    });

    if (mailtoEmails.length > 0) return mailtoEmails[0];

    // Method 2: regex scan of page text
    const pageText = $.text() + " " + $.html();
    const matches = pageText.match(EMAIL_REGEX) || [];
    const validEmails = matches
      .map((e) => e.toLowerCase())
      .filter(isValidEmail)
      .filter((e) => !IGNORED_EMAILS.has(e))
      .filter((e) => !IGNORED_DOMAINS.has(e.split("@")[1]));

    if (validEmails.length > 0) return validEmails[0];

    // Method 3: check /contact page
    const contactLinks = [];
    $("a").each((_, el) => {
      const href = $(el).attr("href") || "";
      if (/contact|about|get-in-touch/i.test(href)) {
        contactLinks.push(href);
      }
    });

    for (const link of contactLinks.slice(0, 2)) {
      try {
        const contactUrl = link.startsWith("http")
          ? link
          : new URL(link, url).href;
        const { data: contactHtml } = await axios.get(contactUrl, {
          timeout: 8000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          maxRedirects: 3,
        });
        const $c = cheerio.load(contactHtml);

        // Check mailto on contact page
        const contactMailto = [];
        $c('a[href^="mailto:"]').each((_, el) => {
          const href = $c(el).attr("href") || "";
          const email = href.replace("mailto:", "").split("?")[0].trim().toLowerCase();
          if (email && isValidEmail(email)) contactMailto.push(email);
        });
        if (contactMailto.length > 0) return contactMailto[0];

        // Regex on contact page
        const contactText = $c.text() + " " + $c.html();
        const contactMatches = contactText.match(EMAIL_REGEX) || [];
        const contactValid = contactMatches
          .map((e) => e.toLowerCase())
          .filter(isValidEmail)
          .filter((e) => !IGNORED_EMAILS.has(e))
          .filter((e) => !IGNORED_DOMAINS.has(e.split("@")[1]));
        if (contactValid.length > 0) return contactValid[0];
      } catch {
        // Contact page failed, continue
      }
    }

    return null;
  } catch {
    return null;
  }
}

function isValidEmail(email) {
  if (!email || email.length > 100) return false;
  if (email.includes("..") || email.startsWith(".") || email.endsWith(".")) return false;
  if (/\.(png|jpg|jpeg|gif|svg|css|js|webp)$/i.test(email)) return false;
  return EMAIL_REGEX.test(email);
}
