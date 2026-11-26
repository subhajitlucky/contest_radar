# ContestRadar — 50 Improvements

Ordered roughly by impact. P0 = trust or correctness, P1 = product depth, P2 = polish/scale.

## Data ownership and reliability

1. **P0** Persist normalized contests in Postgres instead of recomputing the schedule on every request.
2. **P0** Add a `contest_snapshots` table so schedule changes and cancellations are traceable.
3. **P0** Serve DB-first with live adapter refresh; fall back to the last snapshot when a source fails.
4. **P0** Add `source_health` with last success, last error, latency, and consecutive failures.
5. **P0** Add an internal source-health page or status strip visible on the site.
6. **P0** Add exponential backoff and a circuit breaker for AtCoder’s rate-limited HTML fallback.
7. **P0** Handle `Retry-After` responses instead of failing immediately.
8. **P1** Add per-adapter timeouts and jitter to avoid synchronized source bursts.
9. **P1** Show “last updated” per source and globally in the UI.
10. **P1** Add database migrations and a schema-version table; stop relying on running raw SQL files by hand.
11. **P1** Add backup/restore and disaster-recovery documentation.
12. **P0** Resolve the current npm audit findings, especially the critical advisories.

## Alerts, accounts, and security

13. **P0** Add per-IP rate limiting to auth, subscribe, Discord, and comment-writing endpoints.
14. **P0** Add explicit origin/CSRF checks to every state-changing POST route.
15. **P0** Harden webhook URL validation against SSRF and internal-network targets.
16. **P0** Add CSP, HSTS, X-Content-Type-Options, Referrer-Policy, and frame-ancestors headers.
17. **P1** Add a push unsubscribe route and UI; currently unsubscribing only affects the browser.
18. **P1** Add push subscription cleanup and “last successful push” visibility.
19. **P1** Add an alert-delivery log page for the signed-in user.
20. **P1** Add pause/snooze controls for alerts.
21. **P1** Support multiple lead times per subscription.
22. **P1** Add Telegram account linking instead of chat-only subscriptions.
23. **P1** Add a weekly digest email.
24. **P2** Add Discord slash commands or a bot instead of webhook-only delivery.
25. **P1** Improve the per-platform alert preference UI; the API supports it but the UX is basic.

## UX and accessibility

26. **P0** Add a timezone selector; the entire UI is currently hard-coded to IST.
27. **P1** Add a “local time” toggle for non-Indian users.
28. **P1** Add a mobile filter sheet instead of horizontally scrolling chips.
29. **P1** Add a focus trap and return-focus behavior to the contest drawer.
30. **P1** Add full keyboard navigation for agenda rows and the drawer.
31. **P1** Add reduced-motion handling for countdowns and status pulses.
32. **P1** Add screen-reader labels/timers for countdowns (`role="timer"`).
33. **P1** Add a skip link to the main content.
34. **P1** Add a high-contrast theme option.
35. **P1** Add proper loading, empty, stale-data, and source-failure states.
36. **P2** Add pagination or infinite scroll for long schedules.
37. **P2** Add a month/week calendar view alongside agenda/grid.

## API and distribution

38. **P1** Add API keys, quotas, and per-key usage logs.
39. **P1** Add API versioning (`/api/v1`) and deprecation policy.
40. **P1** Publish an OpenAPI specification and generated examples.
41. **P1** Add RSS/Atom feeds alongside ICS.
42. **P1** Add theme and platform parameters to the embeddable calendar.
43. **P1** Add an extension options page for platform filters and refresh cadence.
44. **P1** Publish the Chrome extension; package, icons, store copy, and privacy are ready.
45. **P2** Add a public status page for source freshness and alert delivery.

## Testing, observability, and OSS

46. **P1** Add adapter fixture tests using recorded API payloads.
47. **P1** Add API-route integration tests for contests, stats, ICS, auth, and favorites.
48. **P1** Add Playwright E2E flows for filters, drawer, login, and alerts.
49. **P1** Add mock-provider tests for email, Telegram, Discord, and push delivery.
50. **P2** Add Sentry/uptime monitoring, a launch case study, CONTRIBUTING, SECURITY, and issue templates.
