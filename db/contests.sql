-- Contest schedule storage, change snapshots, and source health.
-- Run after the base alerts/auth schemas:
--   psql "$DATABASE_URL" -f db/contests.sql

CREATE TABLE IF NOT EXISTS contests (
  platform TEXT NOT NULL,
  contest_id TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'Contest',
  difficulty TEXT,
  participants INTEGER,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (platform, contest_id)
);

CREATE INDEX IF NOT EXISTS contests_active_start_idx
  ON contests (start_time)
  WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS contests_platform_active_idx
  ON contests (platform, is_active);

CREATE TABLE IF NOT EXISTS contest_snapshots (
  id BIGSERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  contest_id TEXT NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('added', 'updated', 'removed')),
  snapshot_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  previous JSONB,
  current JSONB
);

CREATE INDEX IF NOT EXISTS contest_snapshots_contest_idx
  ON contest_snapshots (platform, contest_id, snapshot_at DESC);

CREATE TABLE IF NOT EXISTS source_health (
  source_key TEXT PRIMARY KEY,
  last_attempt_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  last_error_at TIMESTAMPTZ,
  last_error TEXT,
  latency_ms INTEGER,
  last_contest_count INTEGER,
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO source_health (source_key)
VALUES ('codeforces'), ('leetcode'), ('codechef'), ('atcoder'), ('hackerrank')
ON CONFLICT (source_key) DO NOTHING;
