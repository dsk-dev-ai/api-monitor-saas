# Deployment Status

This document describes the project's deployment readiness **as actually configured right now**. It deliberately does **not** point at live demo URLs that don't exist — instead it states exactly what is missing and what is blocked, so nothing is over-sold.

Status: **Self-hostable with Docker locally; production (free-tier) live deploy is BLOCKED on missing external credentials.**

## What is ready

- **Docker Compose** development + production paths exist:
  - `docker-compose.yml` (dev: backend + worker + frontend + postgres + redis)
  - `docker-compose.prod.yml` (production image build)
  - `docker-compose.prod.yml` Dockerfiles use lockfile-based `npm ci` (Node 22)
- **Local stack verified working** end-to-end:
  - Supabase Auth (local) — signup / signin / me / monitors all return 200
  - Backend `/health` → 200 on port 3001
  - Worker performs real HTTP checks against local Postgres (port 5434)
  - Frontend renders and logs in against the local API
- **CI** (`.github/workflows/ci.yml`) builds, lints, typechecks, and tests all three workspaces on Node 22.

## What is blocked (live production deploy)

A public, always-on free-tier deployment (Vercel + Render + hosted Supabase) is **not** enabled because the following external credentials/accounts are **not configured** in this environment:

| Blocker | Detail | Needed |
|---------|--------|--------|
| Hosted Supabase project | Only a **local** Supabase stack exists (127.0.0.1). No hosted `SUPABASE_URL` / anon / service-role keys. | A `[project-ref].supabase.co` project or a permanent local tunnel |
| Stripe | `.env` holds placeholder / test-style values only; no verified Stripe account wired. | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` |
| Resend (email) | Placeholder `RESEND_API_KEY`; no verified domain. | `RESEND_API_KEY`, verified `FROM_EMAIL` domain |
| Vercel (frontend) | No Vercel project/team linked; no team-scoped deploy token; no `vercel.json`. | Vercel account + project + deploy token |
| Render (backend + worker) | No Render account/service; no `render.yaml`; no deploy hook URL. | Render account + blueprint or deploy hook |
| GitHub Actions secrets | The SSH/Docker production deploy (`deploy.yml` + `scripts/deploy.sh`) has **zero** secrets configured (`gh secret list` is empty). | `SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`, `ENV_FILE`, `SLACK_WEBHOOK_URL` |

## Recommended path to go live (free-tier, once credentials exist)

1. Provision a hosted **Supabase** project; set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and the `database` connection string.
2. Deploy **frontend** to Vercel via its REST/GitHub integration; set `NEXT_PUBLIC_*` env vars.
3. Deploy **backend + worker** to Render free tier (add a `render.yaml` blueprint); wire the hosted Postgres/Supabase and Redis (free-tier managed or external).
4. Configure Stripe + Resend with real keys.
5. Add a release workflow that deploys on `v*` tags and smoke-tests `/health` **after** posting it.

> Follow the same free-tier-only pattern used successfully on the companion `GenomeAI` project.
