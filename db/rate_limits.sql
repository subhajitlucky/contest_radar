-- Per-IP request limits for browser-facing mutation routes.
-- Run after the base schemas:
--   psql "$DATABASE_URL" -f db/rate_limits.sql

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS rate_limits_reset_idx
  ON rate_limits (reset_at);
