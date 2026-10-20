# Supporting ContestRadar

ContestRadar is free forever. Donations cover infrastructure — never feature access.

## The pledge

- Contest discovery, alerts, and calendar export stay free.
- Donations never unlock a feature or hide one from non-donors.
- No sponsored rankings, fake urgency, or sold user data.
- Surplus funds new platform adapters and alert channels.

## Current cost model

| Item | Current | Notes |
| :--- | :--- | :--- |
| Hosting | ₹0/month | Vercel free tier while traffic is low |
| Domain | ~₹85/month | ₹1,000/year; the first real bill |
| Email alerts | ₹0/month | Free tier for the first few thousand sends |
| Database | ₹0/month | Free tier; only needed once accounts ship |
| Push + bots | ₹0/month | Web push, Telegram, and Discord are free |
| **Total** | **₹0–85/month** | |

Update this table whenever a real bill appears.

## Where money goes, in order

1. Domain renewal.
2. Email delivery for alerts.
3. Database free-tier overages, only if accounts outgrow it.
4. New platform adapters and alert channels.

## Donation channels

Configure these in the deployment environment:

| Variable | Purpose |
| :--- | :--- |
| `NEXT_PUBLIC_GITHUB_SPONSORS` | GitHub Sponsors profile URL |
| `NEXT_PUBLIC_SUPPORT_UPI` | UPI ID for direct transfers |

The `/support` page renders GitHub Sponsors by default and shows the UPI option
only when `NEXT_PUBLIC_SUPPORT_UPI` is set.

## Transparency rules

- Publish the actual monthly cost when it changes.
- Never claim a cost that is not real.
- Never gate a feature behind a funding milestone.
- If a cost cannot be covered, reduce scope — do not add a paywall.

## What we will not do

- Paywall contest alerts, calendar feeds, or practice tracking.
- Charge for favorites, history, or reminders.
- Sell or share user data.
- Accept sponsorships that change contest rankings or recommendations.
