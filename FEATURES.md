# Contest Radar — Feature & Improvement Roadmap

> Working backlog for Contest Radar. Every item below was verified absent from the
> current code on 2026-10-20. The repository is Codeforces-only today; the roadmap
> turns it into a free, multi-platform contest radar with real alerts.

## Positioning

Contest Radar is the **free, zero-noise contest layer** for competitive programmers:
know what is happening, get alerted in time, and know what to practice next.

**Wedge:** "The fastest, cleanest, free Codeforces radar for Indian college students —
then every other platform."

Pair with **CSCosmos** for learning: Contest Radar handles compete/practice logistics;
CSCosmos handles explanations and interview prep.

## Current state (verified)

- Next.js 16 App Router, React 19, TypeScript, Tailwind.
- Routes: `/`, `/contests`, `/practice`, `/about`, `/subscribe`.
- API routes: `/api/contests`, `/api/contests/[id]`, `/api/stats`.
- Data source: Codeforces `contest.list` only, 5-minute revalidation.
- No auth, database, filters, search, notifications, calendar export, rating history,
  or contest detail pages.
- `/subscribe` is a disabled "Coming Soon" form.
- `/practice` is a static catalog of external links.
- Two past contests are hardcoded.

### Known defects to fix before adding features

- Fake metrics on the home page: random "Active Users", hardcoded `+1500` total, and
  "99.9% Uptime".
- Footer links to `/contact`, `/privacy`, `/terms` — all 404.
- "Remind" and "Remind Me" buttons do nothing.
- "Results" on past contests is a non-clickable label.
- `NextResponse` imported but unused in `lib/contestService.ts`.
- Boilerplate README; no tests, CI, sitemap, or robots.

## Shipped (2026-10-20)

- [x] `/support` page with transparent infrastructure costs and no feature gating.
- [x] `SUPPORT.md` with the donation pledge and funding order.
- [x] `/support` added to navigation, footer, and sitemap.
- [x] Cost model split into ₹0 / free tier / paid at scale.
- [x] Horizon 2036 section added (H01–H12).
- [x] `/api/calendar.ics` export (tested: 3 upcoming events, valid VCALENDAR).
- [x] `sitemap.xml` and `robots.txt`.
- [x] GitHub Actions CI (lint + build).
- [x] Removed random "Active Users" and fake "99.9% Uptime".
- [x] Escaped unescaped entities and removed unused imports; lint passes.
- [x] Honest FAQ copy and "Remind" caveat.
- [x] **F04 live countdown**: ticking `Countdown` component on home, contests list, and tracker.
- [x] `npm ci` baseline installed; CI workflow ready.
- [x] **F01 multi-platform adapters**: Codeforces, LeetCode, CodeChef, AtCoder, HackerRank.
- [x] **F02 platform filter**: `/contests?platform=...` with URL state.
- [x] AtCoder JSON source with HTML fallback; per-adapter failure isolation.
- [x] **F08 per-contest calendar links** + per-platform `.ics` feeds.
- [x] **Alerts hub** at `/alerts` with Telegram and calendar feeds; `/subscribe` redirects there.
- [x] **Telegram webhook** at `/api/telegram/webhook` with `/upcoming`, `/platforms`, `/start`.
- [x] README rewritten with adapters, env vars, Telegram setup, and calendar feeds.
- [x] **F05 email alerts**: double opt-in, confirm/unsubscribe routes, Resend delivery.
- [x] **F07 Telegram subscriptions**: `/subscribe`, `/status`, `/unsubscribe`, per-platform filters.
- [x] Postgres schema (`db/alerts.sql`) for subscriptions and delivery deduplication.
- [x] **Scheduled sender** at `/api/alerts/cron` with `CRON_SECRET`.
- [x] GitHub Actions alert trigger every five minutes.
- [x] `/alerts` email form with platform and lead-time selection.
- [x] Graceful 503s when database or email delivery is not configured.
- [x] Remind buttons now open `/alerts`; `/subscribe` redirects there.
- [x] Verified with a local Postgres: subscribe row, token confirmation, cron auth,
      delivery claim, and rollback on failed send.
- [x] Verified runtime: 15 contests across 5 platforms; ICS per platform; alerts form renders.
- [x] **UX redesign**: persistent desktop sidebar, mobile bottom navigation, top command bar.
- [x] Overview is now a command center: next contest, next 24h, seven-day agenda, platform pulse.
- [x] Schedule is agenda-first with platform filters, search, grid toggle, and a detail drawer.
- [x] Alerts is a channel console (Telegram / Email / Calendar) instead of stacked cards.
- [x] Practice is a tabbed catalog (paths / structures / algorithms / platforms).
- [x] All visible times normalized to IST with a clear label.
- [x] Removed decorative gradients, glows, radar rings, and glass effects in favor of a flat,
      typographic system designed to age well.
- [x] **F10 favorites**: local saved contests, star actions, and a Saved filter.
- [x] **F15 detail pages**: `/contests/[platform]/[id]` with canonical metadata and Event JSON-LD.
- [x] **F18 API docs**: `/developers` with endpoints, examples, cache and attribution rules.
- [x] **F20 extension scaffold**: `extension/` Manifest V3 popup for the next five contests.
- [x] Removed unused legacy tracker components.

## Principles

1. Free forever for contest discovery, alerts, and practice tracking.
2. Official APIs only; no scraping of competitor datasets.
3. Reliable alerts over feature count. A missed reminder is a product failure.
4. Multi-platform from one normalized schema.
5. Local-first for favorites/settings; accounts only for sync and alerts.
6. No fake numbers anywhere in the UI.

## Priority legend

| Priority | Meaning |
| :--- | :--- |
| **P0** | Required before promoting the product |
| **P1** | Next 30–60 days |
| **P2** | Later; needs accounts or scale |

Effort: **S** = 1–2 days, **M** = 3–5 days, **L** = 1–2 weeks.

---

## Feature backlog

### F01 — Multi-platform aggregation
- **Priority:** P0 · **Effort:** L · **Depends on:** normalized adapter layer
- **Source:** CLIST, Kontests
- **Scope:** Codeforces, LeetCode, CodeChef, AtCoder, HackerRank, Kaggle.
- **Acceptance:** all platforms appear in one list with correct local times.
- [ ] `Platform` union + normalized `Contest` schema
- [ ] Adapter per platform with timeout + fallback
- [ ] Merge/dedupe by platform + id
- [ ] Per-platform health status
- [ ] Fallback cache when a source fails

### F02 — Advanced filters
- **Priority:** P0 · **Effort:** M · **Depends on:** F01
- **Source:** CLIST, CP Calendar
- **Scope:** platform, contest type/division, duration, rating range, timezone.
- **Acceptance:** filter state lives in the URL and survives refresh/share.
- [ ] Filter model + URL sync
- [ ] Platform + type chips
- [ ] Rating/duration range
- [ ] Timezone selector
- [ ] Empty state + clear filters

### F03 — Search
- **Priority:** P0 · **Effort:** S · **Depends on:** F01
- **Source:** CLIST
- **Scope:** search contest names, platforms, types; keyboard shortcut.
- **Acceptance:** typing filters the list instantly.
- [ ] Client search input
- [ ] Debounced matching
- [ ] `⌘K` / `/` shortcut
- [ ] No-results state

### F04 — Live ticking countdown
- **Priority:** P0 · **Effort:** S · **Depends on:** none
- **Source:** NextContest, ErithX
- **Scope:** per-second countdown on cards and next-contest hero.
- **Acceptance:** countdown reaches zero and flips to LIVE without refresh.
- [ ] Client countdown component
- [ ] LIVE state + auto-refresh
- [ ] Hydration-safe rendering

### F05 — Email alerts
- **Priority:** P0 · **Effort:** M · **Depends on:** F09 accounts, email provider
- **Source:** ContestClocker
- **Scope:** choose platforms, lead time, and email; double opt-in.
- **Acceptance:** a test contest email arrives at the selected lead time.
- [ ] Email provider + templates
- [ ] Preference model
- [ ] Double opt-in + unsubscribe
- [ ] Scheduled sender (cron)
- [ ] Delivery logs

### F06 — Web push alerts
- **Priority:** P1 · **Effort:** M · **Depends on:** F05
- **Source:** ContestClocker
- **Scope:** browser push with per-platform preferences.
- **Acceptance:** push fires on desktop and Android.
- [ ] Manifest + service worker
- [ ] Push subscription storage
- [ ] Permission UX
- [ ] Scheduled sender

### F07 — Telegram / Discord alerts
- **Priority:** P1 · **Effort:** M · **Depends on:** F05
- **Source:** Contest Hive, community channels
- **Scope:** Telegram bot commands + Discord webhook/bot.
- **Acceptance:** `/upcoming codeforces` returns the next 5 contests; channel gets alerts.
- [ ] Telegram bot + commands
- [ ] Discord webhook
- [ ] Per-channel filters
- [ ] Rate-limit and abuse handling

### F08 — ICS export + Google Calendar sync
- **Priority:** P0 · **Effort:** S · **Depends on:** F01
- **Source:** ContestSync, Sync2Cal
- **Scope:** download `.ics` for one contest, a platform, or all; subscribe URL.
- **Acceptance:** Google Calendar imports events with correct timezone and links.
- [ ] `/api/calendar.ics` route
- [ ] Per-platform and filtered feeds
- [ ] "Add to Google Calendar" link
- [ ] Timezone-correct DTSTART/DTEND

### F09 — Accounts + cross-device sync
- **Priority:** P0 · **Effort:** M · **Depends on:** auth provider + DB
- **Source:** CLIST, StopStalk
- **Scope:** email/OAuth sign-in, synced favorites, preferences, handles.
- **Acceptance:** favorites and alert settings match on two devices.
- [ ] Auth provider + session
- [ ] User profile + preferences
- [ ] Favorites/preferences sync
- [ ] Account deletion

### F10 — Favorites / bookmarks
- **Priority:** P0 · **Effort:** S · **Depends on:** none (local first)
- **Source:** Coder's Calendar
- **Scope:** star contests; local first, sync after F09.
- **Acceptance:** starred contest appears on a favorites section.
- [ ] Local favorite store
- [ ] Star button on cards/details
- [ ] Favorites filter/section

### F11 — Contest history + rating graph
- **Priority:** P1 · **Effort:** L · **Depends on:** F09, handle verification
- **Source:** CLIST, StopStalk
- **Scope:** link Codeforces/LeetCode handles; show contests attended, rank, rating delta.
- **Acceptance:** rating graph renders from official API history.
- [ ] Handle linking + verification
- [ ] History ingestion
- [ ] Rating chart
- [ ] Attendance stats

### F12 — Participation streaks
- **Priority:** P1 · **Effort:** S · **Depends on:** F11
- **Source:** StopStalk
- **Scope:** weekly contest streak, longest streak, calendar heatmap.
- **Acceptance:** streak updates after an attended contest.
- [ ] Streak calculation
- [ ] Heatmap UI
- [ ] Streak reminders

### F13 — Post-contest analysis
- **Priority:** P1 · **Effort:** M · **Depends on:** F11
- **Source:** CLIST, ErithX
- **Scope:** results, rating delta, editorial link, solution videos, upsolve list.
- **Acceptance:** a finished contest page shows all of the above.
- [ ] Results adapter
- [ ] Editorial/solution links
- [ ] Upsolve checklist
- [ ] "Results" becomes a real link

### F14 — "Practice next" recommendations
- **Priority:** P1 · **Effort:** M · **Depends on:** F13 + CSCosmos topics
- **Source:** ErithX, CSCosmos
- **Scope:** weak-topic → attempt → topic deep link into CSCosmos.
- **Acceptance:** after a contest, user gets 3 recommended CSCosmos topics.
- [ ] Topic mapping per contest/problem tag
- [ ] Recommendation rule set
- [ ] Deep links with UTM
- [ ] Feedback (helpful / not)

### F15 — Contest detail pages
- **Priority:** P1 · **Effort:** S · **Depends on:** F01
- **Source:** Official platforms, CLIST
- **Scope:** `/contests/[platform]/[id]` with schedule, duration, links, related contests.
- **Acceptance:** every listed contest has a shareable detail page with SEO metadata.
- [ ] Route + data fetch
- [ ] Metadata + JSON-LD Event
- [ ] Add-to-calendar + remind
- [ ] 404 handling

### F16 — Mock / virtual contests
- **Priority:** P2 · **Effort:** L · **Depends on:** F01, judge
- **Source:** Codeforces Gym, LeetCode
- **Scope:** pick a past contest, run a timer, submit externally or via judge, score.
- **Acceptance:** complete a timed virtual contest and see a scorecard.
- [ ] Contest pool
- [ ] Timer/runner UI
- [ ] Scoring + results
- [ ] History of mocks

### F17 — Leaderboards + college leaderboards
- **Priority:** P2 · **Effort:** L · **Depends on:** F09, F11
- **Source:** CLIST, college platforms
- [ ] Opt-in profile
- [ ] Weekly/college aggregation
- [ ] Public leaderboard page
- [ ] Anti-gaming rules

### F18 — Public developer API + docs
- **Priority:** P2 · **Effort:** M · **Depends on:** F01
- **Source:** CLIST, Kontests
- **Scope:** documented v1 API with keys, rate limits, JSON/ICS, webhooks.
- **Acceptance:** an external developer can build a widget from the docs.
- [ ] `/api/v1/contests`, `/api/v1/platforms`
- [ ] API key + rate limits
- [ ] Docs page + examples
- [ ] Webhook for new contests

### F19 — Embeddable contest calendar widget
- **Priority:** P1 · **Effort:** M · **Depends on:** F18
- **Source:** Coder's Calendar, CLIST
- **Scope:** iframe widget with platform/theme filters; college sites can embed it.
- **Acceptance:** paste a snippet and see upcoming contests.
- [ ] `/embed/calendar` route
- [ ] Theme + filter query params
- [ ] Copy snippet generator
- [ ] Attribution backlink

### F20 — Browser extension
- **Priority:** P1 · **Effort:** M · **Depends on:** F01, F03
- **Source:** Kontests, CP Calendar, Coder's Calendar
- **Scope:** popup with next contests, favorites, and alert toggle.
- **Acceptance:** extension loads in Chrome and shows live upcoming contests.
- [ ] Manifest V3 extension
- [ ] Popup UI using the API
- [ ] Badge for next contest
- [ ] Store listing assets

---

## Platform improvements

### I01 — Remove fake metrics
- **Priority:** P0 · **Effort:** S
- [ ] Remove random "Active Users"
- [ ] Replace hardcoded `+1500` total with real count
- [ ] Remove fake "99.9% Uptime" or compute it
- [ ] Show "last updated" timestamp from the API

### I02 — Fix broken links and dead buttons
- **Priority:** P0 · **Effort:** S
- [ ] Add `/contact`, `/privacy`, `/terms` or remove footer links
- [ ] Wire "Remind" to F05, or label it "Coming soon" honestly
- [ ] Make past contests real or remove them
- [ ] Remove unused `NextResponse` import

### I03 — Tests + CI
- **Priority:** P0 · **Effort:** S
- [ ] Unit tests for `transformContest`, stats, formatting
- [ ] GitHub Actions: lint, typecheck, build, test
- [ ] API route contract tests
- [ ] Cover adapter fallbacks

### I04 — SEO + sharing
- **Priority:** P1 · **Effort:** M
- [ ] `sitemap.ts` + `robots.ts`
- [ ] Dynamic OG images for contests
- [ ] JSON-LD `Event` on detail pages
- [ ] Canonical URLs + metadata per route
- [ ] Share cards for upcoming contests

### I05 — Reliability
- **Priority:** P0 · **Effort:** M
- [ ] Per-platform timeouts and retries
- [ ] Circuit breaker + stale cache per source
- [ ] Source health dashboard
- [ ] Rate-limit handling
- [ ] Alert on data-source failure

### I06 — Observability
- **Priority:** P1 · **Effort:** S
- [ ] Error monitoring
- [ ] Analytics events: view, favorite, remind, calendar click
- [ ] Alert delivery logs
- [ ] Uptime checks

### I07 — Accessibility (WCAG 2.2 AA)
- **Priority:** P1 · **Effort:** M
- [ ] Keyboard navigation
- [ ] Focus states
- [ ] Reduced motion for countdowns/animations
- [ ] Contrast audit in both themes
- [ ] Screen-reader labels for icon buttons

### I08 — Performance
- **Priority:** P1 · **Effort:** S
- [ ] Lighthouse budget
- [ ] Cache/revalidate tuning
- [ ] Avoid client hydration for static lists
- [ ] Image/icon optimization

### I09 — PWA / offline
- **Priority:** P2 · **Effort:** M
- [ ] Web manifest
- [ ] Service worker for the contest list
- [ ] Offline last-known schedule

### I10 — Legal + attribution
- **Priority:** P0 · **Effort:** S
- [ ] Review each platform's API terms
- [ ] Attribute data sources
- [ ] Add privacy policy covering alert emails
- [ ] Document rate-limit compliance

### I11 — README + docs
- **Priority:** P0 · **Effort:** S
- [ ] Replace boilerplate README
- [ ] Document architecture and adapters
- [ ] Document env vars and deployment
- [ ] Add screenshots

---

## Build sequence

### Phase 0 — Trust fixes (week 1)
- [ ] I01 fake metrics, I02 broken links/buttons, I03 CI, I11 README
- [ ] F04 countdown, F08 ICS export
- [ ] I05 reliability baseline

### Phase 1 — Multi-platform + discovery (weeks 2–4)
- [ ] F01 adapters
- [ ] F02 filters
- [ ] F03 search
- [ ] F15 detail pages
- [ ] F10 local favorites
- [ ] I04 SEO

### Phase 2 — Alerts + accounts (weeks 5–8)
- [ ] F09 accounts
- [ ] F05 email alerts
- [ ] F07 Telegram
- [ ] F11 history + rating graph
- [ ] F12 streaks
- [ ] F13 post-contest analysis

### Phase 3 — Distribution (weeks 9–12)
- [ ] F06 web push
- [ ] F14 practice-next
- [ ] F19 embed widget
- [ ] F20 browser extension
- [ ] F18 API docs

### Phase 4 — Community + scale (later)
- [ ] F16 mock contests
- [ ] F17 leaderboards
- [ ] I09 PWA

## Cost model — what runs for ₹0

Nothing below is blocked on donations. Build in this order so the free tiers last.

| Tier | Features | What it needs |
| :--- | :--- | :--- |
| **₹0 — no server** | F02, F03, F04, F08, F10, F15, F19, F20, I01–I08, I10–I11 | Static/ISR pages, `localStorage`, client components |
| **Free tier** | F01, F05, F06, F07, F09, F11, F12, F13, F14, F18 | Vercel functions, Resend/Brevo free tier, Supabase/Neon free tier, Telegram/Discord free |
| **Paid only at scale** | Email volume, DB overages, push service, judge compute, API bandwidth | Trigger only when free limits are exceeded |

Rules:
- Aggregation can be server-rendered/ISR; no always-on server.
- Alerts run on GitHub Actions cron or serverless cron, not a VPS.
- Email and bots stay in free tiers until list size demands otherwise.
- No server-side AI; recommendations are rules + BYO-key assistants.
- Track actual spend in `SUPPORT.md`; publish it on `/support`.

## Horizon 2036 — build the primitives early

These are bets, not commitments. The normalized contest schema, accounts, and
progress graph are the primitives that make all of them cheap later.

### H01 — MCP server for AI assistants
- **Why now:** assistants will call tools directly instead of browsing sites.
- **Scope:** "next Div. 2 contests," "remind me," "my rating history" as MCP tools.
- **Primitive needed:** F18 public API + a thin MCP wrapper.

### H02 — Natural-language reminder agent
- **Why now:** agentic calendar and notification management is becoming normal.
- **Scope:** "Remind me 2 hours before every Codeforces Div. 2 on Telegram."
- **Primitive needed:** F05/F07 preferences + a parser + delivery logs.

### H03 — AI contest coach
- **Why now:** LLMs are good at planning and post-mortems, weaker at hard reasoning.
- **Scope:** pre-contest plan, time allocation, spoiler-safe hints, post-contest upsolve plan.
- **Primitive needed:** F11 history + F14 topic mapping.

### H04 — Readiness + difficulty fit
- **Why now:** personalized practice is the highest-value use of contest history.
- **Scope:** recommend contests by expected learning value, not just start time.
- **Primitive needed:** rating history + topic mastery from CSCosmos.

### H05 — Verifiable participation credentials
- **Why now:** skills-based hiring needs portable proof, not screenshots.
- **Scope:** free W3C Verifiable Credentials for contest participation and streaks.
- **Primitive needed:** verified handles + signed event records.

### H06 — Integrity layer for AI-era contests
- **Why now:** AI assistance is forcing contests to rethink fairness and assessment.
- **Scope:** AI-use disclosure, process evidence, and organizer dashboards.
- **Primitive needed:** participation metadata and an organizer API.

### H07 — Unified multi-platform skill profile
- **Why now:** programmers compete across CF, LC, AtCoder, and CodeChef.
- **Scope:** one rating/skill graph across platforms with explainable normalization.
- **Primitive needed:** F11 adapters + a normalized rating model.

### H08 — Predictive, personalized schedule
- **Why now:** too many contests, too little time; calendars need prioritization.
- **Scope:** rank upcoming contests by fit, conflict, and improvement value.
- **Primitive needed:** F02 preferences + F11 history + F14 recommendations.

### H09 — Federated, offline-first feeds
- **Why now:** platform APIs fail, rate-limit, or disappear; resilience matters.
- **Scope:** community mirrors, local cache, and an offline "last known schedule."
- **Primitive needed:** adapter health (I05) + a static snapshot pipeline.

### H10 — OS, wearable, and voice notifications
- **Why now:** alerts are moving beyond browser tabs and email.
- **Scope:** push to phone, watch, and voice assistants; calendar-native reminders.
- **Primitive needed:** F06/F07 + a notification abstraction.

### H11 — Open contest data commons
- **Why now:** an open, normalized schedule benefits every learner and tool.
- **Scope:** public dataset and API with provenance, versioning, and community corrections.
- **Primitive needed:** F18 API + correction workflow.

### H12 — Live contest companion
- **Why now:** real-time coaching can improve contest learning without spoilers.
- **Scope:** time checks, problem triage, and "stop and upsolve" nudges.
- **Primitive needed:** F04 live state + F15 detail pages + explicit anti-cheat rules.

## Non-goals

- Paid tiers, ads disguised as contests, or sponsored rankings.
- Scraping CLIST/Kontests datasets instead of using official APIs.
- Native iOS/Android apps before the web product retains users.
- Hosting live contests or becoming a judge.
- Competing with CLIST on coverage breadth in year one.

## Definition of done

- `npm run lint`, typecheck, and build pass.
- No fake or placeholder metrics shipped.
- Every alert path has a delivery log and a failure state.
- Every contest has a working outbound link and calendar action.
- Both themes work; keyboard + screen-reader paths verified.
- Adapter failures degrade gracefully with a visible "last updated" time.
