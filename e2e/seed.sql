-- Deterministic data for the Playwright suite.
-- Run after `npm run db:migrate`.

INSERT INTO source_health (
  source_key,
  last_attempt_at,
  last_success_at,
  last_error_at,
  last_error,
  latency_ms,
  last_contest_count,
  consecutive_failures,
  updated_at
)
VALUES
  ('atcoder', NOW(), NOW(), NULL, NULL, 120, 1, 0, NOW()),
  ('codechef', NOW(), NOW(), NULL, NULL, 90, 1, 0, NOW()),
  ('codeforces', NOW(), NOW(), NULL, NULL, 150, 1, 0, NOW()),
  ('hackerrank', NOW(), NOW(), NULL, NULL, 80, 1, 0, NOW()),
  ('leetcode', NOW(), NOW(), NULL, NULL, 110, 1, 0, NOW())
ON CONFLICT (source_key) DO UPDATE SET
  last_attempt_at = EXCLUDED.last_attempt_at,
  last_success_at = EXCLUDED.last_success_at,
  last_error_at = NULL,
  last_error = NULL,
  latency_ms = EXCLUDED.latency_ms,
  last_contest_count = EXCLUDED.last_contest_count,
  consecutive_failures = 0,
  updated_at = NOW();

INSERT INTO contests (
  platform,
  contest_id,
  name,
  url,
  start_time,
  end_time,
  duration_minutes,
  type,
  is_active
)
VALUES (
  'codeforces',
  'e2e-practice-round',
  'E2E Practice Round',
  'https://codeforces.com/contest/e2e',
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '2 days 2 hours',
  120,
  'Div. 2',
  TRUE
)
ON CONFLICT (platform, contest_id) DO UPDATE SET
  name = EXCLUDED.name,
  url = EXCLUDED.url,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  duration_minutes = EXCLUDED.duration_minutes,
  type = EXCLUDED.type,
  is_active = TRUE,
  last_seen_at = NOW(),
  updated_at = NOW();
