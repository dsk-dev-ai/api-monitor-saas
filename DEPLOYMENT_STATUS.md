# Deployment Status

This document describes the project's deployment readiness **as actually configured right now**. It deliberately does **not** point at live demo URLs that don't exist — instead it states exactly what is missing and what is blocked, so nothing is over-sold.

Status: **Self-hostable with Docker locally; combined single-service image built & verified; production (free-tier) live deploy is BLOCKED on missing external credentials.**

## What is ready

- **Combined API + worker image** (`Dockerfile` at repo root) — builds backend + worker into **one** container so a single free platform service (e.g. Render free web service) serves both:
  - Image builds cleanly (Node 22 slim, Prisma engine verified working with glibc).
  - Verified live in Docker: `/health` → 200 `healthy`, worker scheduler runs real checks, signup → 201.
  - `docker/start-combined.sh` runs API (port 3001) + worker together, auto-restarts either if it exits.
  - Requires `--add-host=host.docker.internal:host-gateway` only when running against local Postgres for tests; on a real host the DB URL is remote.
- **Render blueprint** (`render.yaml`) — imports the root `Dockerfile`, health check on `/health`. Free-tier keep-awake via `.github/workflows/keep-alive.yml` (pings `/health` every 5 min so the free instance never sleeps and background checks keep running).
- **Frontend** — Vercel auto-detects Next.js in `frontend/`; `frontend/vercel.json` pins the prod API URL + Supabase env (REPLACE_ME placeholders). Billing page now wired to the real API (plans, subscription, usage, checkout, portal); pricing page reads real plans.
- **Docker Compose** development + production paths exist (`docker-compose.yml`, `docker-compose.prod.yml`).
- **Local stack verified working** end-to-end: signup / signin / me / monitors / analytics all 200, worker performs real HTTP checks, billing plans + subscription return real limits.
- **CI** (`.github/workflows/ci.yml`) builds, lints, typechecks, and tests all three workspaces on Node 22.
- **Production hardening** (this release): backend env booleans fixed (string `"false"` was wrongly parsed as `true`), Zod validation → HTTP 400 instead of 500, leaked-password protection + password requirements enabled, SECURITY DEFINER hardening migration, frontend surfaces real backend error messages.

## What is blocked (live production deploy)

A public, always-on free-tier deployment (Vercel + Render + hosted Supabase) is **not** enabled because the following external credentials/accounts are **not configured** in this environment:

| Blocker | Detail | Needed |
|---------|--------|--------|
| Hosted Supabase project | Only a **local** Supabase stack exists (127.0.0.1). No hosted `SUPABASE_URL` / anon / service-role keys. | A `[project-ref].supabase.co` project (free) — also enable email verification + SMTP via Resend there |
| Stripe | `.env` holds placeholder / test-style values only; no verified Stripe account wired. | Test-mode first: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_BASIC`, `STRIPE_PRICE_PRO`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| Resend (email) | Placeholder `RESEND_API_KEY`; no verified domain. | `RESEND_API_KEY`, verified `FROM_EMAIL` domain |
| Vercel (frontend) | No Vercel project/team linked; no deploy token. | Vercel account + `frontend/vercel.json` env values |
| Render (backend + worker) | No Render service; `render.yaml` needs importing and secrets filling. | Import blueprint in Render; set `sync: false` env vars; set `BACKEND_URL` Actions secret for keep-alive |
| Redis (free) | Local Redis only. | Free Upstash instance URL for `REDIS_URL` |
| GitHub Actions secrets | Keep-alive + deploy workflows need `BACKEND_URL` (and the SSH/Docker secrets if using `deploy.yml`). | `BACKEND_URL` (and optionally `SERVER_HOST`/`SERVER_USER`/`SSH_PRIVATE_KEY`/`ENV_FILE`) |

## Recommended path to go live (free-tier, once credentials exist)

1. Provision a hosted **Supabase** project; set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and the `database` connection string. Enable email confirmations + SMTP (Resend).
2. Deploy **backend + worker** to Render via `render.yaml` (one combined free web service), fill `sync: false` env vars, add the keep-alive secret.
3. Deploy **frontend** to Vercel; set `NEXT_PUBLIC_*` env vars (see `frontend/vercel.json`).
4. Configure Stripe (test mode first) + Resend with real keys; point `STRIPE_WEBHOOK_SECRET` at the webhook URL.
5. Add a release workflow that deploys on `v*` tags and smoke-tests `/health` **after** posting it.

> Follow the same free-tier-only pattern used successfully on the companion `GenomeAI` project.