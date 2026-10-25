# ContestRadar

Free, multi-platform contest tracking for competitive programmers. Codeforces,
LeetCode, CodeChef, AtCoder, and HackerRank in one live schedule — with calendar
feeds, a Telegram bot, and no paywalls.

- Live: https://contestradar.vercel.app
- Architecture: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- Roadmap: [FEATURES.md](./FEATURES.md)
- Support: [SUPPORT.md](./SUPPORT.md)

## Features

- One normalized schedule across five platforms.
- Platform filters on `/contests` and a live ticking countdown.
- Google Calendar links per contest and `.ics` feeds for all or one platform.
- Telegram bot: `/upcoming`, `/platforms`, `/subscribe`, `/status`, `/unsubscribe`.
- Contest detail data via `/api/contests/[id]`, stats via `/api/stats`.
- Source health at `/status` with last success, latency, failures, and last refresh.
- Aggregate `/api/health` check plus a 30-minute GitHub Actions health workflow.
- Light/dark styling, sitemap, robots, and a responsive layout.

## Public site and dashboard

- **Public** — `/` (homepage), `/contests`, `/practice`, `/alerts`,
  `/leaderboard`, `/about`, `/developers`, `/status`, `/support`, `/privacy`,
  `/login`. These use the public header and footer.
- **Signed in** — `/dashboard` and `/profile` require an account and use the app
  shell (sidebar, top bar, mobile navigation).

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS.
- Server components + route handlers; Postgres is required for persisted schedules, accounts, and alerts.
- Data adapters in `lib/contestService.ts`; schedule storage in `lib/contestStore.ts`.

## Data sources

| Platform | Source | Notes |
| :--- | :--- | :--- |
| Codeforces | Official `contest.list` API | Upcoming and live contests |
| LeetCode | Public GraphQL `upcomingContests` | Weekly and biweekly |
| CodeChef | Public contests list endpoint | Starters and other rounds |
| AtCoder | kenkoooo resource JSON, HTML fallback | Prefers JSON; scrapes the contests page when no future rows exist |
| HackerRank | Public upcoming contests endpoint | Rated and hiring contests |

Each adapter runs independently with `Promise.allSettled`; a failed source does not
take down the schedule. If every source fails, a small fallback schedule is shown.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run lint
npm run build
```

## Environment

Copy `.env.example` to `.env.local` and fill only what you need.

| Variable | Purpose |
| :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `TELEGRAM_BOT_TOKEN` | Bot token from BotFather |
| `TELEGRAM_WEBHOOK_SECRET` | Secret sent by Telegram with each update |
| `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` | Public bot link on `/alerts` |
| `DATABASE_URL` | Postgres connection string for alert subscriptions |
| `DATABASE_SSL` | Set `disable` for a local Postgres without SSL |
| `RESEND_API_KEY` | Resend API key for email alerts |
| `ALERT_FROM_EMAIL` | Verified sender, e.g. `ContestRadar <alerts@example.com>` |
| `CRON_SECRET` | Bearer token for `/api/alerts/cron` |
| `NEXT_PUBLIC_GITHUB_SPONSORS` | Support link |
| `NEXT_PUBLIC_SUPPORT_UPI` | UPI support link |

## Alert storage and delivery

Alerts need a Postgres database and an email provider. Both have free tiers.

1. Create a Postgres database (Neon or Supabase free tier) and set `DATABASE_URL`.
2. Run the schema in [`db/alerts.sql`](./db/alerts.sql) against it.
3. Create a [Resend](https://resend.com) API key, verify a sending domain, and set
   `RESEND_API_KEY` and `ALERT_FROM_EMAIL`.
4. Set a long random `CRON_SECRET`.
5. The scheduled workflow in `.github/workflows/alerts.yml` calls
   `/api/alerts/cron` every five minutes. Add `CRON_SECRET` as a GitHub Actions
   secret. GitHub may delay scheduled runs under load.
6. Email subscriptions use double opt-in: subscribe, click the confirmation link,
   then reminders start.

If these variables are missing, Telegram and calendar feeds still work; email
subscription returns an honest `503` instead of failing silently.

## Contest schedule storage

The schedule works live without a database. To persist contests, snapshots, and
source health, apply the migrations:

```bash
DATABASE_URL="postgres://..." npm run db:migrate
```

The script applies every `db/*.sql` file once and records it in
`schema_migrations`. Manual `psql -f db/contests.sql` still works, but the script is
the supported path.

When `DATABASE_URL` is set:

- `/api/cron/refresh-contests` fetches every adapter, upserts normalized contests,
  records snapshot changes, and updates source health.
- Pages read the stored schedule first and fall back to live adapters if the database
  is empty or unavailable.
- If the stored schedule is older than 15 minutes, the next request schedules a
  background refresh; a Postgres advisory lock prevents duplicate refreshes.
- `/api/source-health` returns per-source last success, last error, latency, and
  consecutive failures.
- `.github/workflows/contests.yml` triggers the refresh every 15 minutes.

`CRON_SECRET` protects both the alert sender and the contest refresh endpoint.

## Rate limits

Run `db/rate_limits.sql` once. The app applies per-IP limits to auth requests,
alert and push subscriptions, Discord setup, favorites sync, Codeforces linking,
and leaderboard settings. Old counters are cleaned up by the contest refresh cron.

## Browser push and Discord

Generate VAPID keys with `npx web-push generate-vapid-keys`, then set
`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, and the same public key as
`NEXT_PUBLIC_VAPID_PUBLIC_KEY`. The service worker is served from `/sw.js`.

Discord uses channel webhooks. Create one in Discord under Server Settings →
Integrations → Webhooks, then paste it into the Discord tab on `/alerts`. The server
stores the webhook and posts contest reminders through the existing cron sender.

Re-run `db/alerts.sql` after upgrading; it adds push tables and the Discord channel
constraint.

## Accounts

Accounts are passwordless email magic links. Run [`db/auth.sql`](./db/auth.sql) to create
`users`, `login_tokens`, `sessions`, and `user_favorites`. Reuse the existing Postgres
and Resend configuration.

- `/login` requests a one-time link.
- `/api/auth/verify` creates an HttpOnly session cookie.
- `/api/user/favorites` syncs the local Saved list when signed in.
- Sessions expire after 30 days; sign out from `/profile`.
- Link a Codeforces handle from `/profile` to store rating history, weekly streaks, and
  optionally join `/leaderboard`.
- `/api/ratings/refresh` refreshes linked handles; run it from the ratings GitHub Action
  every six hours.

## Embeds and virtual contests

- Embed the compact calendar at `/embed/calendar` (query: `platform`, `theme`).
- Run a timed virtual contest over a past Codeforces round at `/virtual`. Sessions are
  stored locally; ContestRadar does not judge submissions.

## Telegram setup

1. Create a bot with [BotFather](https://t.me/BotFather) and set `TELEGRAM_BOT_TOKEN`.
2. Deploy the app, then register the webhook:

```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -d "url=https://contestradar.vercel.app/api/telegram/webhook" \
  -d "secret_token=$TELEGRAM_WEBHOOK_SECRET"
```

3. Set `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` so `/alerts` shows the invite link.

The webhook is stateless and answers commands on demand. Scheduled reminders need a
cron trigger and a subscription store; they are the next alerts milestone.

## Calendar feeds

- All platforms: `/api/calendar.ics`
- One platform: `/api/calendar.ics?platform=leetcode`
- Per contest: the `Calendar` action on `/contests`

## Free pledge

Contest discovery, alerts, and calendar feeds stay free. Donations cover
infrastructure only — never feature access. Details: [SUPPORT.md](./SUPPORT.md).
