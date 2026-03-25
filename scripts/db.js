import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "leads.db");

let db;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initTables();
  }
  return db;
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      place_id TEXT UNIQUE,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      phone TEXT,
      website TEXT,
      email TEXT,
      rating REAL,
      review_count INTEGER,
      price_level INTEGER,
      cuisine TEXT,
      google_maps_url TEXT,
      scraped_at TEXT DEFAULT (datetime('now')),
      email_status TEXT DEFAULT 'new',
      email_sequence_step INTEGER DEFAULT 0,
      last_emailed_at TEXT,
      replied INTEGER DEFAULT 0,
      booked INTEGER DEFAULT 0,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS email_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER REFERENCES restaurants(id),
      step INTEGER NOT NULL,
      subject TEXT,
      sent_at TEXT DEFAULT (datetime('now')),
      opened INTEGER DEFAULT 0,
      replied INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants(city);
    CREATE INDEX IF NOT EXISTS idx_restaurants_email_status ON restaurants(email_status);
    CREATE INDEX IF NOT EXISTS idx_restaurants_place_id ON restaurants(place_id);
  `);
}
