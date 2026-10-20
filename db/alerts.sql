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
