# Contest Radar — What Remains

Status snapshot: **14 of 20 planned features complete**, plus an unpublished extension
scaffold.

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
- Codeforces rating profile at `/profile` with rating chart and recent results.
- Post-contest results/standings links.
- Rating-based practice recommendations into CSCosmos.

## Feature backlog

| ID | Feature | Priority | Depends on | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F09 | Accounts + cross-device sync | P0 for retention | Auth + Postgres | Sync favorites, preferences, and alert settings. |
| F12 | Participation streaks | P2 | F11 | Weekly contest streak and calendar heatmap. |
| F17 | Leaderboards + college boards | P2 | F09, F11 | Opt-in aggregation and anti-gaming rules. |
| F16 | Mock / virtual contests | P2 | Judge or external submission | Timer, scoring, history; highest-cost feature. |
| F19 | Embeddable calendar widget | P1 | Standalone embed layout | Needs a shell bypass or route-group split. |
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

1. **Auth + Postgres** (F09) unlocks sync, leaderboards, and durable user profiles.
2. **Streaks** (F12) become trivial once rating history is stored server-side.
3. **Embed layout** (F19) and **mock contests** (F16) are separate tracks; do not block core alerts.

## Next batch

F09 → F12 → F17, then F19, then F16.
