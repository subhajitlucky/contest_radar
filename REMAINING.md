# Contest Radar — What Remains

Status snapshot (2026-10-25): **production-ready core**. The public site, private
dashboard, alerts, DB-first schedule, health checks, rate limits, migrations,
timezone selection, and browser E2E suite are shipped. Remaining work is mostly
external credentials and optional depth; historical notes are retained below.

## Current open items (2026-10-25)

- **Blocked:** email login and email alerts need `RESEND_API_KEY` and
  `ALERT_FROM_EMAIL`.
- **Blocked:** Telegram, Discord, and push delivery need provider credentials.
- **Open:** isolate Preview/Development with Neon branches or a separate database.
- **Open:** strict CSP with nonces; production still needs `unsafe-inline` for Next
  hydration.
- **Open:** dynamic OG images, performance budget, PWA/offline, and legal attribution.
- **Open:** Chrome Web Store publication for the extension.

## Shipped

- Multi-platform adapters: Codeforces, LeetCode, CodeChef, AtCoder, HackerRank.
- Platform filters, search, agenda/grid views, and live counts.
- Detail drawer and shareable `/contests/[platform]/[id]` pages.
- Live countdowns, per-contest calendar links, and per-platform `.ics` feeds.
- Email alerts with double opt-in, Telegram subscriptions, cron sender, delivery deduplication.
- Local favorites and a Saved filter.
- Developer API docs and extension scaffold (publication pending).
- App-shell UX redesign with light/dark themes and IST normalization.
- Telegram and Discord alerts.
- Browser push subscriptions with a service worker and cron delivery.
- Passwordless email accounts, HttpOnly sessions, and favorites sync at `/login` and `/profile`.
- Account-linked alert subscriptions for email, Discord, and push.
- Codeforces handle linking, stored rating history, and six-hour rating refresh cron.
- Weekly contest streaks and an opt-in rating/streak leaderboard at `/leaderboard`.
- Codeforces rating profile at `/profile` with rating chart and recent results.
- Post-contest results/standings links.
- Rating-based practice recommendations into CSCosmos.

## Feature backlog

| ID | Feature | Priority | Depends on | Notes |
| :--- | :--- | :--- | :--- | :--- |

## Platform improvements

- **Tests:** [x] 49 unit tests across adapters, date/time helpers, ICS, alerts, rate
  limits, and circuit breaking; [x] 15 Playwright browser/API E2E tests in CI.
- **Reliability:** [x] source health, retry/backoff, circuit breaker, last-known
  snapshots, self-healing stale refreshes, advisory lock, and retention cleanup.
- **SEO:** [x] JSON-LD and sitemap; [ ] dynamic OG images.
- **Observability:** [x] `/api/health`, `/status`, and a 30-minute health workflow;
  external error monitoring remains optional.
- **Accessibility:** [x] WCAG 2.2 AA audit with 0 axe violations on public and
  signed-in pages, including drawer and timezone controls.
- **Performance:** [ ] Lighthouse budget and route-level bundle review.
- **PWA/offline:** [ ] manifest, offline last-known schedule, and install prompts.
- **Legal/attribution:** [ ] review every platform's API terms and publish
  attribution/privacy copy.

## Critical path

1. Add `RESEND_API_KEY` and `ALERT_FROM_EMAIL`, redeploy, and verify magic-link login.
2. Add Telegram, Discord, and VAPID credentials if those channels are launching.
3. Create a Neon preview branch and point the Preview environment at it.
4. **Extension publish** (F20) needs icons, store assets, privacy copy, and a Chrome
   Web Store account.

## Next batch

Finish the credential-backed paths, isolate preview data, then publish the extension.
After that, focus on dynamic OG images, a performance budget, and offline support rather
than adding surface area.
