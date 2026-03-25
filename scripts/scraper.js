import axios from "axios";
import dotenv from "dotenv";
import { getDb } from "./db.js";
import { scrapeEmailFromWebsite } from "./scrape-emails.js";

dotenv.config();

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// --- Google Places API (New) ---

async function searchRestaurants(query, location) {
  const results = [];
  let pageToken = null;

  // New API uses POST and returns up to 20 per page, max 3 pages
  for (let page = 0; page < 3; page++) {
    const body = {
      textQuery: `${query} in ${location}`,
      includedType: "restaurant",
      languageCode: "en",
      maxResultCount: 20,
    };

    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.priceLevel,places.googleMapsUri,nextPageToken",
    };

    if (pageToken) {
      body.pageToken = pageToken;
      await sleep(2000);
    }

    try {
      const { data } = await axios.post(
        "https://places.googleapis.com/v1/places:searchText",
        body,
        { headers }
      );

      if (data.places) {
        results.push(...data.places);
      }

      pageToken = data.nextPageToken;
      if (!pageToken) break;
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message;
      console.error(`API error: ${msg}`);
      break;
    }
  }

  return results;
}

// --- Main scraper ---

async function scrapeCity(query, city) {
  const db = getDb();

  console.log(`\nSearching: "${query}" in ${city}...`);
  const places = await searchRestaurants(query, city);
  console.log(`Found ${places.length} results from Google Places\n`);

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO restaurants
      (place_id, name, address, city, phone, website, email, rating, review_count, price_level, google_maps_url)
    VALUES
      (@place_id, @name, @address, @city, @phone, @website, @email, @rating, @review_count, @price_level, @google_maps_url)
  `);

  let newCount = 0;
  let emailCount = 0;

  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    const placeId = place.id;

    // Skip if already in DB
    const existing = db
      .prepare("SELECT id FROM restaurants WHERE place_id = ?")
      .get(placeId);
    if (existing) {
      process.stdout.write(`  [${i + 1}/${places.length}] ${place.displayName?.text || "Unknown"} — already in DB, skipping\n`);
      continue;
    }

    const name = place.displayName?.text || "Unknown";
    const website = place.websiteUri || null;

    // Scrape email from website
    let email = null;
    if (website) {
      process.stdout.write(`  [${i + 1}/${places.length}] ${name} — scraping website...`);
      email = await scrapeEmailFromWebsite(website);
      if (email) {
        emailCount++;
        process.stdout.write(` found ${email}\n`);
      } else {
        process.stdout.write(` no email found\n`);
      }
    } else {
      process.stdout.write(`  [${i + 1}/${places.length}] ${name} — no website\n`);
    }

    // Map price level from new API format
    let priceLevel = null;
    if (place.priceLevel) {
      const priceLevels = {
        PRICE_LEVEL_FREE: 0,
        PRICE_LEVEL_INEXPENSIVE: 1,
        PRICE_LEVEL_MODERATE: 2,
        PRICE_LEVEL_EXPENSIVE: 3,
        PRICE_LEVEL_VERY_EXPENSIVE: 4,
      };
      priceLevel = priceLevels[place.priceLevel] ?? null;
    }

    insertStmt.run({
      place_id: placeId,
      name: name,
      address: place.formattedAddress || null,
      city: city,
      phone: place.nationalPhoneNumber || null,
      website: website,
      email: email,
      rating: place.rating || null,
      review_count: place.userRatingCount || null,
      price_level: priceLevel,
      google_maps_url: place.googleMapsUri || null,
    });

    newCount++;

    // Rate limit — be respectful to restaurant websites
    await sleep(500);
  }

  console.log(`\nDone: ${newCount} new restaurants added, ${emailCount} emails found`);
}

// --- CLI ---

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
DineLine Restaurant Scraper
============================

Usage:
  node scripts/scraper.js <city> [query]

Examples:
  node scripts/scraper.js "London"
  node scripts/scraper.js "Manchester" "Italian restaurant"
  node scripts/scraper.js "Edinburgh" "restaurant"
  node scripts/scraper.js "Birmingham" "Indian restaurant"

The scraper will:
  1. Search Google Places for restaurants in the given city
  2. Get phone, website, address, ratings for each
  3. Scrape each restaurant's website for email addresses
  4. Save everything to leads.db

You need a Google Places API key in .env:
  GOOGLE_PLACES_API_KEY=your_key_here
  `);
  process.exit(0);
}

if (!API_KEY) {
  console.error("Error: GOOGLE_PLACES_API_KEY not set in .env file");
  process.exit(1);
}

const city = args[0];
const query = args[1] || "restaurant";

scrapeCity(query, city).catch((err) => {
  console.error("Scraper error:", err.message);
  process.exit(1);
});

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
