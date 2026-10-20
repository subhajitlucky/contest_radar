CREATE TABLE IF NOT EXISTS alert_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'telegram')),
  destination TEXT NOT NULL,
  platforms TEXT[] NOT NULL DEFAULT '{}',
  lead_minutes INTEGER NOT NULL DEFAULT 60,
  confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  confirm_token TEXT,
  unsubscribe_token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (channel, destination)
);

CREATE TABLE IF NOT EXISTS alert_deliveries (
  subscription_id BIGINT NOT NULL REFERENCES alert_subscriptions(id) ON DELETE CASCADE,
  contest_key TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (subscription_id, contest_key)
);

CREATE INDEX IF NOT EXISTS alert_subscriptions_confirmed_idx
  ON alert_subscriptions (confirmed);

ALTER TABLE alert_subscriptions
  DROP CONSTRAINT IF EXISTS alert_subscriptions_channel_check;
ALTER TABLE alert_subscriptions
  ADD CONSTRAINT alert_subscriptions_channel_check
  CHECK (channel IN ('email', 'telegram', 'discord'));

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  platforms TEXT[] NOT NULL DEFAULT '{}',
  lead_minutes INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_success_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS push_deliveries (
  subscription_id BIGINT NOT NULL REFERENCES push_subscriptions(id) ON DELETE CASCADE,
  contest_key TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (subscription_id, contest_key)
);


ALTER TABLE alert_subscriptions
  ADD COLUMN IF NOT EXISTS user_id BIGINT;
ALTER TABLE push_subscriptions
  ADD COLUMN IF NOT EXISTS user_id BIGINT;

CREATE INDEX IF NOT EXISTS alert_subscriptions_user_idx
  ON alert_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS push_subscriptions_user_idx
  ON push_subscriptions (user_id);
