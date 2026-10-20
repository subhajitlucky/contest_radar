CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS login_tokens (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS login_tokens_email_idx
  ON login_tokens (email);

CREATE TABLE IF NOT EXISTS sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_user_idx
  ON sessions (user_id);

CREATE TABLE IF NOT EXISTS user_favorites (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contest_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, contest_key)
);


ALTER TABLE users
  ADD COLUMN IF NOT EXISTS cf_handle TEXT;
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS cf_rating INTEGER;
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS leaderboard_opt_in BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS cf_synced_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS user_contest_history (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contest_id BIGINT NOT NULL,
  contest_name TEXT NOT NULL,
  rank INTEGER NOT NULL,
  old_rating INTEGER NOT NULL,
  new_rating INTEGER NOT NULL,
  timestamp BIGINT NOT NULL,
  PRIMARY KEY (user_id, contest_id)
);

CREATE INDEX IF NOT EXISTS user_contest_history_time_idx
  ON user_contest_history (timestamp);
