-- Applied migration ledger. The migrate script creates this table automatically;
-- this file exists so a manual setup uses the same shape.
CREATE TABLE IF NOT EXISTS schema_migrations (
  filename TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
