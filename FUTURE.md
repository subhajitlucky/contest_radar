# ContestRadar — The Next 10 Years

Contest schedules are a commodity. The durable product is the **trusted, portable,
agent-accessible layer** around them: owned data, identity, alerts, history, and proof.

## Durability test

Every future feature should pass at least four of these:

1. **Agent-accessible:** queryable through an API/MCP tool, not only a website.
2. **Owned data:** normalized contests, history, and user state are stored and exportable.
3. **Resilient:** works when a source is down, rate-limited, or disappears.
4. **Verifiable:** participation and skill claims can be checked by a third party.
5. **Interoperable:** ICS, RSS, JSON, webhooks, Open Badges.
6. **Private:** local-first where possible; no ad-tech dependence.
7. **Low-friction:** PWA, extension, OS notifications, no account required to browse.

## Ten bets

### 1. MCP server and agent-native API
Expose “next contests,” “remind me,” “my rating,” and “my streak” as tools for AI
assistants and calendar agents.
**Why it lasts:** agents will schedule and notify on behalf of users.
**Build now:** API v1, stable IDs, an MCP manifest, and idempotent reminder actions.

### 2. Own the normalized schedule
Persist contests, snapshots, source health, and cancellations in Postgres. Serve the last
known good schedule when a platform fails.
**Why it lasts:** third-party APIs will keep changing, rate-limiting, and disappearing.
**Build now:** `contests`, `contest_snapshots`, `source_health`, and a refresh cron.

### 3. Federated and offline feeds
Community mirrors, static snapshots, local cache, and an offline “last known schedule.”
**Why it lasts:** central dependence is a single point of failure.
**Build now:** signed snapshots and an exportable JSON/ICS bundle.

### 4. Agentic reminders
Natural-language preferences: “remind me two hours before every Div. 2 on Telegram,
unless it conflicts with a LeetCode contest.”
**Why it lasts:** manual per-contest reminders do not scale.
**Build now:** preference model, conflict rules, delivery logs.

### 5. AI contest coach and readiness model
Pre-contest plans, spoiler-safe in-contest time checks, post-contest upsolve plans, and
difficulty-fit recommendations.
**Why it lasts:** contest data alone is not coaching.
**Build now:** stored rating history and topic mastery signals.

### 6. Verified participation credentials
W3C Verifiable Credentials / Open Badges for contest participation, streaks, and
verified handles, with public verification.
**Why it lasts:** skills-based hiring needs portable proof.
**Build now:** verified handle records, signed participation events.

### 7. Integrity layer for AI-era contests
AI-use disclosure, process evidence, human-only modes, and organizer dashboards.
**Why it lasts:** AI assistance is forcing contests to rethink fairness.
**Build now:** participation metadata and an organizer API.

### 8. Unified cross-platform skill graph
One rating and skill profile across Codeforces, LeetCode, AtCoder, and CodeChef with
explainable normalization.
**Why it lasts:** programmers compete across platforms; users want one signal.
**Build now:** adapters for rating history and a normalized rating model.

### 9. Predictive, personalized schedule
Rank upcoming contests by fit, conflict, and expected improvement instead of start time.
**Why it lasts:** too many contests, too little time.
**Build now:** preferences, history, and recommendation rules.

### 10. OS, wearable, and voice notifications
Push beyond the browser tab: mobile push, watch alerts, voice assistants, calendar-native
reminders.
**Why it lasts:** the reminder layer is the product; the website is one surface.
**Build now:** notification abstraction over email, Telegram, Discord, push, and ICS.

## What not to build

- A judge or contest-hosting platform before the scheduling layer is unbreakable.
- Native mobile apps before the PWA and extension retain users.
- Scraped datasets that violate platform terms.
- Sponsored rankings or paid contest placement.
- LLM features that cannot fall back to deterministic rules.

## 90-day sequence

1. Postgres contest snapshots + source health.
2. API v1 + MCP server.
3. Push unsubscribe and delivery logs.
4. Verified handle records and credential metadata.
5. Timezone selector and agentic reminder preferences.

## Signals to watch

- MCP and tool-calling adoption by assistants.
- Platform API terms and rate-limit changes.
- Passkey and verifiable-credential adoption.
- AI-assistance policies in contests.
- PWA/OS notification capabilities.
- Calendar-agent integration standards.
