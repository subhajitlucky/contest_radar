# ContestRadar Architecture

ContestRadar is a multi-platform contest schedule, alerting, and profile layer for
competitive programmers. It is a Next.js app with server-rendered pages, route handlers,
Postgres-backed accounts, and scheduled ingestion.

## System overview

```text
Codeforces API ─┐
LeetCode GQL  ─┤
CodeChef API  ─┼─> adapters ─> normalize ─> merged schedule
AtCoder JSON/HTML ┘                         │
HackerRank API ─┘                           ├─> server components / pages
                                            ├─> /api/contests, /api/stats
                                            ├─> /api/calendar.ics
                                            └─> alerts (email, Telegram, Discord, push)

Postgres
  ├─ contests / contest_snapshots / source_health
  ├─ alert_subscriptions / alert_deliveries
  ├─ push_subscriptions / push_deliveries
  ├─ users / login_tokens / sessions / user_favorites
  └─ user_contest_history

GitHub Actions
  ├─ /api/cron/refresh-contests  every 15 minutes
  ├─ /api/alerts/cron           every 5 minutes
  └─ /api/ratings/refresh       every 6 hours
```

## Data adapters

All adapters live in `lib/contestService.ts` and return the same `Contest` shape.

| Platform | Source | Fallback |
| :--- | :--- | :--- |
| Codeforces | Official `contest.list` | Per-adapter isolation |
| LeetCode | Public GraphQL `upcomingContests` | Per-adapter isolation |
| CodeChef | Public contests list endpoint | Per-adapter isolation |
| AtCoder | kenkoooo JSON | AtCoder contests HTML scrape |
| HackerRank | Public upcoming contests endpoint | Per-adapter isolation |

Each adapter runs inside `Promise.allSettled`. A failed source degrades the schedule
instead of failing the page. AtCoder can rate-limit the HTML fallback; the adapter
currently logs the failure and returns an empty list for that source.

## Pages and rendering

The site uses two route groups with different shells:

- **Public** (`app/(public)`) — public header and footer, no sidebar. Routes:
  `/`, `/contests`, `/contests/[platform]/[id]`, `/practice`, `/alerts`,
  `/leaderboard`, `/about`, `/developers`, `/status`, `/support`, `/privacy`,
  and `/login`.
- **App** (`app/(app)`) — sidebar, top bar, mobile navigation, and an auth gate.
  Routes: `/dashboard` (the command center) and `/profile`.

`/` is the public homepage: live next contest, platform coverage, product overview,
and FAQ. `/dashboard` is the signed-in command center with the next contest, next 24h,
seven-day agenda, and platform pulse.

`/embed/calendar` renders outside both groups with no site shell.

## Database

Schema files: `db/contests.sql`, `db/alerts.sql`, `db/auth.sql`, `db/rate_limits.sql`.

| Table | Purpose |
| :--- | :--- |
| `contests` | Last-known normalized schedule per platform |
| `contest_snapshots` | Added, updated, and removed contest changes |
| `source_health` | Last attempt/success/error, latency, and consecutive failures |
| `alert_subscriptions` | Email, Telegram, and Discord destinations plus platform/lead filters |
| `alert_deliveries` | Per-subscription/contest delivery deduplication |
| `push_subscriptions` | Web push endpoint and keys, optionally linked to a user |
| `push_deliveries` | Push delivery deduplication |
| `users` | Email account, linked Codeforces handle, rating, leaderboard opt-in |
| `login_tokens` | One-time hashed magic-link tokens |
| `sessions` | Hashed HttpOnly session tokens |
| `user_favorites` | Account-synced saved contests |
| `user_contest_history` | Stored Codeforces rating changes for streaks and leaderboards |
| `rate_limits` | Per-IP request counters for browser-facing mutation routes |

## Contest schedule storage

`/api/cron/refresh-contests` runs every adapter independently, records each source's
latency and failures, and upserts the normalized schedule. Snapshot rows capture
added contests, field changes, and future contests that disappear from a source
(removals). An empty source response never deactivates the last-known schedule.

Page and API reads go through `getUpcomingContests()`:

1. Read active, non-ended contests from Postgres.
2. If the database is unconfigured, empty, or unavailable, read live adapters.
3. If every live adapter fails and no stored schedule exists, use the small fallback
   schedule.

`/api/source-health` exposes `source_health` for dashboards and status pages.

## Authentication

Passwordless email magic links:

1. `POST /api/auth/request` stores a SHA-256 hash of a random token and emails the raw link.
2. `GET /api/auth/verify` consumes the token, upserts the user, creates a session, and sets
   an HttpOnly, SameSite=Lax cookie.
3. `getSessionUser()` resolves the cookie against `sessions` and `users`.
4. Sessions expire after 30 days; `POST /api/auth/logout` deletes the session.

Tokens are single-use, expire in 15 minutes, and are rate-limited per email.

## Alerts

`/api/alerts/cron` is the single scheduled sender:

- Requires `Authorization: Bearer CRON_SECRET`.
- Loads confirmed subscriptions.
- Finds contests starting inside each subscription's lead window.
- Claims a delivery row before sending, so retries cannot duplicate alerts.
- Sends email (Resend), Telegram, Discord webhooks, or web push.
- Rolls back the delivery claim when sending fails; removes dead push endpoints.

GitHub Actions triggers the route every five minutes.

## Reliability

- Adapter failures are isolated.
- Adapter fetches use timeouts, bounded retries, `Retry-After`, and exponential backoff.
- Five consecutive failures open a 15-minute circuit for that source.
- A stale schedule triggers one background refresh after the next request; an advisory lock prevents duplicate refreshes.
- Snapshots older than 180 days and inactive contests older than 90 days are removed by the refresh cron.
- `/api/health` fails when any source is stale beyond one hour or has three consecutive failures; a 30-minute GitHub Actions check watches it.
- Alert delivery is idempotent.
- Push endpoints returning 404/410 are removed.
- Auth lookups fail closed.
- The schedule cache uses five-minute revalidation.
- Source health is persisted; an empty refresh does not wipe the last-known schedule.
- Known gap: AtCoder HTML backoff, circuit breaking, and `Retry-After` handling.

## Security

- Production CSP plus `nosniff`, referrer, and permissions headers.
- Same-origin checks on browser-facing POST routes.
- Per-IP rate limits for auth, alert, push, favorites, and profile mutations.
- Discord webhooks are restricted to Discord hosts.
- Push subscriptions require public HTTPS endpoints; loopback and private hosts are rejected.

## Deployment

- **Hosting:** Vercel (Next.js App Router).
- **Database:** Neon/Supabase Postgres free tier.
- **Email:** Resend.
- **Telegram:** BotFather token plus webhook secret.
- **Push:** VAPID keys.
- **Scheduling:** GitHub Actions using `CRON_SECRET`.

Environment variables are documented in `.env.example` and `README.md`.

## Testing

- Vitest covers formatting, IST dates, favorites, streaks, alert normalization, and ICS.
- CI runs lint, tests, and production build.
- Auth, favorites, Codeforces linking, streaks, and leaderboard were tested end-to-end
  against a local Postgres instance.

## Tradeoffs

- **Serverless + cron instead of a long-running worker:** cheap and simple, but
  coarse scheduling granularity and no long-lived in-process circuit state.
- **Link out for contests and judging:** avoids becoming a judge and keeps costs near zero.
- **Postgres for identity and alerts:** adds operational surface, but enables sync,
  deduplication, streaks, and leaderboards.
- **Official/public APIs over scraping:** safer legally, but source availability varies.
