# Contest Radar — What Remains

Status snapshot: **19 of 20 planned features implemented**, with extension publication
(P20) remaining.

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
| F20 | Extension polish and publish | P2 | Chrome Web Store account | Icons, store assets, privacy text, publishing. |

## Platform improvements

- **Tests:** add unit tests for adapters, date/time helpers, ICS generation, and alert delivery.
- **Reliability:** AtCoder HTML can return 429; add source health, backoff, and circuit-breaker
  behavior. Serve last-known snapshots when a source fails.
- **SEO:** dynamic OG images; keep JSON-LD and sitemap in sync with detail pages.
- **Observability:** error monitoring and alert-delivery failure reporting.
- **Accessibility:** WCAG 2.2 AA audit, drawer focus trap, reduced-motion checks.
- **Performance:** Lighthouse budget and route-level bundle review.
- **PWA/offline:** manifest, service worker, and offline last-known schedule.
- **Legal/attribution:** review every platform's API terms and publish attribution/privacy copy.

## Critical path

1. **Extension publish** (F20) needs icons, store assets, privacy copy, and a Chrome Web
   Store account.
2. Optional depth: judged mock contests, college leaderboards, server-side contest history.

## Next batch

F20 publish.
