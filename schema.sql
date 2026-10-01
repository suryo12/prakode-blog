-- Cloudflare D1 schema for the privacy-friendly view counter.
-- Apply with: npx wrangler d1 execute prakode-blog-db --remote --file=schema.sql

-- One counter per key: "site" (daily-unique visitors) or "post:<slug>" (daily-unique reads).
CREATE TABLE IF NOT EXISTS stats (
  key   TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);

-- Salted, one-way daily fingerprints, only used to avoid double counting the
-- same browser on the same day. No IP address or user agent is ever stored,
-- and rows older than a few days are purged.
CREATE TABLE IF NOT EXISTS seen (
  h   TEXT PRIMARY KEY,
  day TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS seen_day ON seen(day);
