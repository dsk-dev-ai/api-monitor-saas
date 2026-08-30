# Deployment Status

**Current status: LIVE.** The app is deployed on free tiers and reachable by visitors.

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | https://api-monitor-saas-frontend.vercel.app | Next.js 14 on Vercel (auto-deploys from `main`) |
| API + worker | https://api-monitor-api.onrender.com | Combined single service on Render free tier (port 10000); `/health` → 200 |
| Docs | `/docs` on the frontend | In-app docs |

## How it's deployed

- **Render** imports the root `Dockerfile` (combined API + background worker image) via `render.yaml`. Free instance auto-restarts and is kept awake by `.github/workflows/keep-alive.yml` pinging `/health` every 5 minutes.
- **Vercel** builds the `frontend/` workspace; `NEXT_PUBLIC_*` env vars are set in the Vercel project. Repo homepage points at the live frontend.
- **Supabase** (hosted) provides Auth + the database; account confirmation by email is enabled.

## Environment / credentials

- `NEXT_PUBLIC_API_URL` must be the **backend root** (e.g. `https://api-monitor-api.onrender.com`) — the frontend appends `/api/v1` itself. `frontend/src/lib/api-url.ts` is resilient to a stray `/api/v1` suffix being included.
- The following are intentionally **not** configured (deliberate, not blockers):
  - **Stripe** — billing is disabled by design while there are no paying customers. `ENABLE_BILLING=true` but a missing `STRIPE_SECRET_KEY` logs a warning and disables checkout; the UI degrades gracefully. Add Stripe keys only when there is a real need (see below).
  - **Redis** — `REDIS_URL` is unused/optional; the worker runs in-process on an interval.

## Still needed before welcoming paying customers

1. **Email sending (signup confirmation)** — hosted Supabase confirms accounts by email, which requires a verified SMTP sender (e.g. Resend). Without it, new visitors cannot complete signup. This is the highest-priority item for real traffic.
2. **Stripe (only when ready to charge)** — add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_BASIC/PRO`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to Render, and point the webhook at `/api/v1/billing/webhook`.

Everything else — signup, signin, monitor management, background checks, analytics, alerts, public status pages — is verified working on the live deployment.
