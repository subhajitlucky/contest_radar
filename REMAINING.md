# Contest Radar — What Remains

Status snapshot: **11 of 20 planned features shipped**, plus a working browser-extension
scaffold. Remaining work is grouped by dependency and cost.

## Shipped

- Multi-platform adapters: Codeforces, LeetCode, CodeChef, AtCoder, HackerRank.
- Platform filters, search, agenda/grid views, and live counts.
- Detail drawer and shareable `/contests/[platform]/[id]` pages.
- Live countdowns, per-contest calendar links, and per-platform `.ics` feeds.
- Email alerts with double opt-in, Telegram subscriptions, cron sender, delivery deduplication.
- Local favorites and a Saved filter.
- Developer API docs and extension scaffold.
- App-shell UX redesign with light/dark themes and IST normalization.

## Feature backlog

| ID | Feature | Priority | Depends on | Notes |
| :--- | :--- | :--- | :--- | :--- |
| F11 | Contest history + rating graph | P1 | Official profile APIs | Link Codeforces/LeetCode handles; show rating and attendance history. |
| F13 | Post-contest analysis | P1 | F11 | Results, rating delta, editorial/solution links, upsolve list. |
| F14 | Practice-next recommendations | P1 | F13 + CSCosmos topic map | Recommend 3 topics after a contest. |
| F06 | Web push alerts | P1 | VAPID keys + subscription storage | Reuse existing Postgres; service worker and permission UX. |
| F07 | Discord alerts | P1 | Existing alert sender | Discord webhook/bot; Telegram is already done. |
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

1. **Rating history** (F11) unlocks post-contest analysis, streaks, and recommendations.
2. **Auth + Postgres** (F09) unlocks sync, leaderboards, and reliable push subscriptions.
3. **Web push/Discord** (F06/F07) can ship before accounts by storing subscriptions by channel.
4. **Embed layout** (F19) and **mock contests** (F16) are separate tracks; do not block core alerts.

## Next batch

F11 → F13 → F14, then F06 → F07, then F09 → F12 → F17.
