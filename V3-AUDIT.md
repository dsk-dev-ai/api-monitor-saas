# V3 Phase 0 Audit — API Monitor SaaS

**Date:** 2026-08-18
**Branch audited:** `phase/v3-p0-audit` (HEAD `a40f856`, identical to `main`)
**Method:** Read-only static source review + safe validation commands. No build/tests/lint executed because no `node_modules` is present and installing dependencies was prohibited. No runtime credentials (Supabase, Stripe, Resend, Redis) available.

**Legend:** [FACT] = verified directly from source/git. [INFERENCE] = reasoned from source. [RECOMMENDATION] = suggested action. [UNKNOWN] = cannot be verified without runtime/build access.

---

## 1. Executive Summary

The repository contains a partially implemented, marketing-claims-ahead-of-reality SaaS called "API Monitor". The core loop (monitor CRUD → HTTP check → check history → analytics → email alert) is *implemented* and coherent in code, but a large fraction of the advertised surface is fake, broken, or unverifiable:

- **The frontend advertises and hard-codes features that do not exist** (SMS/Slack/webhook alerts, GraphQL/SOAP/WebSocket protocols, teams, SLA tracking, 30-second checks) and **three pages are stubs** (workspaces, team, settings). The dashboard billing page shows a static mock that contradicts real backend plan limits.
- **The worker does not use BullMQ or Redis** despite both being dependencies and despite the README claiming queues. Scheduling is a bare `setInterval` + in-memory map.
- **Two divergent Prisma schemas** exist (backend vs worker), and **no `prisma/migrations` directory exists** in either package — yet the deploy path runs `prisma migrate deploy`. The Supabase migration file is empty.
- **The frontend has a duplicate root route** (`app/page.tsx` and `app/(marketing)/page.tsx` both resolve to `/`), which Next.js rejects at build time. This is very likely a hard build blocker that was never caught because builds are not reproducible locally.
- **Dependencies are internally inconsistent** (zod 3 vs zod 4 across packages; `@eslint/js` required by the backend lint config but absent from lockfiles; Node 20 documented vs node 22 in Docker/CI vs Node 24 local).
- **The security posture is weak for production**: unvalidated `PATCH /status-pages` body, billing plan taken from unverified request metadata, tokens in `localStorage`, no SSRF protection on monitor URL checks, fallback fake Supabase credentials, and no Next.js middleware.
- **Existing tests are near-worthless** — they assert `true === true` in places, replicate schema locally instead of importing it, and cover only 4 files.

**Overall verdict:** This is a solid *demo/prototype* with a working core, not a production-ready system. It must be treated as a "phase 0 baseline to repair", not as a system to bolt v3 features onto. Realistic v3 scope: repair the core (build, schema, worker, deploy, security), make the marketing claims true or remove them, and add a small set of genuinely feasible features. A long list of advertised features should explicitly **not** be built.

---

## 2. Repository Inventory

[FACT] Top-level layout (from `ls`/`find`):

| Path | Contents | Status |
|---|---|---|
| `frontend/` | Next.js 14 (App Router) marketing + dashboard app | Active |
| `backend/` | Express + Prisma + Supabase auth + Stripe/Resend | Active |
| `worker/` | `setInterval`-based check loop + Prisma + node-cron | Active (but not as documented) |
| `supabase/` | `config.toml`, `migrations/20260604112734_remote_schema.sql` (EMPTY) | Broken/placeholder |
| `nginx/` | `nginx.conf` (https, rate-limit, proxy to backend) | Active; needs `ssl/` certs (absent) |
| `scripts/` | backup.sh, deploy.sh, validate-env.js, setup-ubuntu.sh, git-setup.sh, sync-github.sh | Mixed (see §12) |
| `.github/workflows/` | CI + deploy workflows | Active |
| `release-evidence/` | screenshots | Historical |
| `backup-auth-fix/` | superseded auth frontend files | Dead |
| `frontend/backups/` | one workspace page backup | Dead |
| `frontend/audit-summary.txt`, `errors-by-file.txt`, `error-summary.txt` | stale build-error logs | Historical |
| `worker/doctor-report.txt`, `worker/fix-worker.sh` | historical report + dangerous script | Historical |
| Root | README, ARCHITECTURE, DEVELOPMENT_PLAN, ROADMAP, CHANGELOG, CONTRIBUTING, UBUNTU_SETUP_GUIDE.md, ENV_GUIDE.txt, `.env.example`, `package.json`, `package.json.backup`, `docker-compose.yml`, `docker-compose.prod.yml`, `.nvmrc`, LICENSE, `.gitignore` | Mixed (see §11) |

[FACT] `package.json` root: npm workspaces (`frontend`, `backend`, `worker`), version `2.0.0`, scripts `dev/build/test/lint/db:*`.

[FACT] No `.env` is tracked or present on disk (only `.env.example`, 933 bytes). No `node_modules` exists in any workspace — nothing can be compiled/run without an install.

[FACT] Git tags: `v1.0.0`, `v1.1.0`, `v1.2.0`, `v2.0.0`, `v2.0.0-beta`, `v2.0.1-stable`, `before-v3-completion`. Local env: Node v24.18.0, npm 11.16.0.

---

## 3. Architecture Reality

[FACT] Documented architecture (README/ARCHITECTURE.md): Next.js frontend + Express backend + BullMQ/Redis worker + Supabase (Postgres/auth) + NGINX + Docker. Cloudflare, mobile app, CLI, and "microservices" are described as part of the platform.

[FACT] Actual architecture:

```
frontend (Next 14, App Router, client-side auth guard only)
   │  fetch → backend
backend (Express 4, Prisma 5.22, Supabase auth, Resend, Stripe)
   │  http check  (executed INSIDE worker process)
worker (setInterval loop, in-memory lastStatusMap, axios, Prisma, node-cron cleanup)
   │
DB: Supabase Postgres (Prisma schema, no migrations)
```

- [FACT] The worker executes checks with `setInterval` + an in-memory `lastStatusMap` (`worker/src/index.ts`). BullMQ and `ioredis` are installed but **never imported** — verified by reading source; Redis is a dependency in the Docker stack and `REDIS_URL` is required by backend env, but no code path uses it.
- [FACT] Status/analytics: `analytics.ts` aggregates `Check` rows on read; there is no pre-aggregation.
- [FACT] Alerts: `alert-service.ts` compares current status to in-memory previous status; email sent via Resend when keys present, otherwise skipped.
- [FACT] No queues, no distributed workers, no retries, no per-monitor concurrency control.
- [INFERENCE] With one instance, the architecture is a single monolith + scheduler. Any claimed "microservice" or "multi-node" behavior does not exist.

---

## 4. Feature Matrix

Legend: IMPLEMENTED / PARTIALLY IMPLEMENTED / NOT IMPLEMENTED / BROKEN / UNKNOWN.

| Feature | Status | Evidence |
|---|---|---|
| Authentication (Supabase) | PARTIALLY IMPLEMENTED | `backend/src/routes/auth.ts` upserts Supabase user + subscription row; email verification not enforced |
| Signup | PARTIALLY IMPLEMENTED | same; creates placeholder Stripe customer id `cust_${userId}`; no e-mail confirmation gating |
| Signin | PARTIALLY IMPLEMENTED | Supabase signIn; JWT issued; session in `localStorage` (frontend) |
| Logout | IMPLEMENTED | auth-store clears session |
| Authorization / role model | NOT IMPLEMENTED | no roles/tenants; only ownership checks on some routes |
| Monitor CRUD | IMPLEMENTED | `backend/src/routes/monitors.ts`; zod-validated create/update, pause/resume, ownership-scoped list/get |
| Monitor scheduling | PARTIALLY IMPLEMENTED | `setInterval` in worker, cycle every `CHECK_INTERVAL_SECONDS`; not per-monitor scheduling |
| HTTP checks | IMPLEMENTED | `worker/src/services/executor.ts` (axios); method/body/headers support |
| Timeout handling | IMPLEMENTED | `timeout` from monitor config; `degraded` when `responseTime > timeout*0.8` |
| Retry handling | NOT IMPLEMENTED | no retry logic in executor; README claims retries (see §11) |
| Check history | IMPLEMENTED | `Check` rows written per run; `CLEANUP_DAYS` cron deletes old rows |
| Analytics | PARTIALLY IMPLEMENTED | overview aggregates (uptime %, avg response, status counts); per-monitor trend chart in frontend |
| Alerts | PARTIALLY IMPLEMENTED | email via Resend (only when keys set); no SMS/Slack/webhook (advertised in frontend) |
| Email notifications | PARTIALLY IMPLEMENTED | `alert-service.ts`; no retry, no queue, inline send |
| Recovery notifications | PARTIALLY IMPLEMENTED | status-change on/off via in-memory map; re-alert risk on restart (§10) |
| Incident handling | NOT IMPLEMENTED | `Incident` model exists; no route/UI/creation flow |
| Status pages | PARTIALLY IMPLEMENTED | CRUD + public `status/[slug]` route; `PATCH` unvalidated body (see §7); design token absent in UI config |
| Teams | NOT IMPLEMENTED | `team/page.tsx` is a stub; no backend |
| Workspaces | NOT IMPLEMENTED | `workspaces/page.tsx` is a stub; dead components exist |
| Billing | PARTIALLY IMPLEMENTED | static mock page in `main`; real Stripe page only in `origin/develop`; backend has checkout/portal/webhook |
| Stripe integration | PARTIALLY IMPLEMENTED | `backend/src/routes/billing.ts`; `STRIPE_SECRET_KEY` optional (client null when absent); plan comes from unverified request metadata; `develop` has a fuller UI |
| Worker service | PARTIALLY IMPLEMENTED | see §10; not as documented (no queue) |
| Redis / queue | NOT IMPLEMENTED | dependencies present, code absent; Redis never used |
| Database | PARTIALLY IMPLEMENTED | Prisma schema; no migrations; two divergent schemas (§8) |
| API | PARTIALLY IMPLEMENTED | no OpenAPI docs; versioned under `/api/v1`; some endpoints validated, some not |
| Frontend dashboard | PARTIALLY IMPLEMENTED | real pages for monitors/alerts/analytics; stubs for workspaces/team/settings; `dashboard/page.tsx` contains literal backticks in JSX (renders "```"); `monitors/create` uses invalid navigation target |
| Settings | NOT IMPLEMENTED | decorative page, no handlers |
| Public pages | PARTIALLY IMPLEMENTED | landing/pricing/docs/blog/features pages advertise false capabilities; status page public route works for existing slugs |
| SSL certificate monitoring | NOT IMPLEMENTED | advertised, no code |
| SLA tracking | NOT IMPLEMENTED | advertised, no code |
| Uptime reports | PARTIALLY IMPLEMENTED | overview aggregates only |
| Custom domains | NOT IMPLEMENTED | advertised in pricing, absent |

**Broken items (detail):**
- `frontend/src/app/(dashboard)/monitors/create/page.tsx:111` — `router.push('/(dashboard)/monitors')` — invalid URL segment; navigation lands nowhere. [FACT]
- `frontend/src/app/(dashboard)/dashboard/page.tsx` — contains literal backtick characters inside JSX text; renders "```" to users. [FACT]
- Frontend root route conflict: `app/page.tsx` and `app/(marketing)/page.tsx` both resolve to `/` — Next.js build-time "parallel pages" error. [FACT] — build impact [UNKNOWN until built].

---

## 5. Build Audit

[FACT] Root `package.json`:
- Node engines: not declared; `.nvmrc` = `20`. Dockerfiles + CI use `node:22-alpine`/`node:22`. Local machine Node `v24.18.0`. **Three different Node lines — undetermined which is correct.**
- Scripts: `dev` (workspaces), `build`, `test`, `lint`, `db:*`.

[FACT] Backend (`backend/package.json`):
- TypeScript, `strict: false`, `noImplicitAny: false`; `tsconfig.json` excludes `**/*.test.ts` from `build`.
- Two lint configs coexist: `.eslintrc.json` (legacy) and `eslint.config.js` (flat config, ESLint 10). The flat config `imports` `@eslint/js` (`import js from '@eslint/js'`), which is **not in devDependencies** and **absent from the backend lockfile** (`grep -c '"@eslint/js"' backend/package-lock.json` → 0; root lockfile count = 1, i.e. only the root/frontend tree). `npm run lint --workspace=backend` would fail to resolve `@eslint/js`. [FACT]
- Dependencies include `zod ^3.22.4`; frontend uses `zod ^4.4.3`. **Cross-package schema library divergence.** [FACT]
- `db:seed` script points to `src/utils/seed.ts`, which does **not exist** (`backend/src/utils/` contains only `logger.ts`). [FACT]

[FACT] Frontend (`frontend/package.json`): Next `^14.0.4` (devDependency `eslint-config-next 14.2.35`), React 18, `next.config.js` sets `output: 'standalone'` and inlines `NEXT_PUBLIC_*` from env; `NEXT_PUBLIC_API_URL`/`NEXT_PUBLIC_SUPABASE_*` have hard-coded fallbacks. No engine/typecheck scripts. [FACT]

[FACT] Worker (`worker/package.json`): deps `bullmq`, `ioredis`, `node-cron`, `resend`, `winston`, `prisma 5.22.0`. **No `test`, `lint`, or `typecheck` scripts.** [FACT]

[FACT] Worker tsconfig: `strict: false`. Backend uses `@prisma/client 5.22.0`. [FACT]

[INFERENCE] Frontend `next build` is likely to fail immediately on the duplicate `/` route (`app/page.tsx` + `app/(marketing)/page.tsx`). [UNKNOWN — must be verified by an actual build]

[UNKNOWN] Whether each workspace currently compiles. Historical `doctor-report.txt` and `frontend/audit-summary.txt` show prior failures (a `monitors.ts(375)` syntax error, worker Prisma client generation, frontend type errors) that appear partially fixed in the current source; the reports are stale (they reference the path `api-monitor-saas-v1`) and cannot confirm current state.

[FACT] Lint configuration: backend `eslint ^10.5.0` + `@typescript-eslint ^8.62.0` (flat config, broken import); frontend `next lint` with `eslint-config-next` (legacy `.eslintrc.json`). Root `lint` runs frontend then backend — the backend step is broken as noted.

[FACT] Test configuration: backend `jest` + `ts-jest`; root `test` script delegates.

**Validations run:** `docker compose config --quiet` and `docker compose -f docker-compose.prod.yml config --quiet` both exit 0 (syntax valid; several env vars warn as unset, expected). No builds/tests/lint executed — deps absent, installs prohibited.

---

## 6. Test Audit

[FACT] Tests found (backend only; `frontend` and `worker` have none):
- `backend/src/routes/monitors.test.ts` — CRUD-ish; **re-creates its own Prisma schema locally** instead of importing the real one → can drift from the actual schema.
- `backend/src/services/check.test.ts` — **two tests assert `expect(true).toBe(true)`** (placeholders).
- `backend/src/services/alert.test.ts` — mocks Prisma; shallow assertions.
- `backend/src/services/monitor.test.ts` — mocks Prisma; shallow.

[FACT] No tests for: auth, billing/Stripe webhook, status pages, analytics, worker loop, executor, cleanup, frontend (none at all), e2e, integration against a real DB.

[FACT] `jest.config.js`: `ts-jest`, `roots: ['src']`, coverage excludes only `server.ts`.

[INFERENCE] Tests are not meaningful coverage; they cannot catch regressions in the core loop. Deterministic (no external services), but also nearly content-free.

[RECOMMENDATION] Treat the existing tests as scaffolding to be replaced, not extended.

**Coverage gap list:** auth flows, authorization/ownership, monitor scheduling, executor (timeout, degraded, redirects, methods), alert transitions (down→up, restart re-alert), billing/Stripe webhook signature + plan changes, status-page PATCH validation, analytics aggregates, worker graceful shutdown, cleanup job.

---

## 7. Docker Audit

[FACT] `docker-compose.yml` (dev):
- Services: `postgres` (postgres:16-alpine, healthcheck), `redis` (redis:7-alpine), `backend`, `worker`, `frontend`.
- Backend + worker mount source with **anonymous `node_modules` volumes**; frontend mounts `./frontend:/app` **without** a `node_modules` exclusion → the container's `/app/node_modules` is shadowed by the host dir (which has no node_modules), so `npm run dev` for frontend cannot resolve Next.js in the container. [INFERENCE]
- `DATABASE_URL` is passed from host `.env` (Supabase remote), so the local `postgres` service is effectively unused by the app; its purpose is ambiguous.
- Backend env requires `FROM_EMAIL`, `REDIS_URL`, `JWT_SECRET`(≥64 chars), Supabase keys, etc. — all must be present in host `.env` or the backend exits (`env.ts`).

[FACT] `docker-compose.prod.yml`:
- Uses `deploy.replicas: 2` — **swarm-only**; the documented/`deploy.sh` path is plain `docker compose up`, which ignores replicas. [FACT]
- No `postgres`/`redis` services (uses external Supabase); Redis is declared as a dependency? No — it is absent; backend env still requires `REDIS_URL`. If the host `.env` has `REDIS_URL=redis://localhost:6379`, containers would try to reach Redis on their own localhost — unreachable. [INFERENCE]
- NGINX requires `./nginx/ssl/cert.pem` and `key.pem`; the `nginx/ssl/` directory is absent from the repo → the proxy cannot start as configured without manually supplied certs. [FACT]
- Migration step (`npx prisma migrate deploy`) cannot succeed — no `backend/prisma/migrations` directory. [FACT]

[FACT] Backend `Dockerfile`: multi-stage `node:22-alpine`, builder `npm install` using only `package.json` (lockfile not copied) → **non-reproducible dependency resolution**; runner `npm install --omit=dev` then `npx prisma generate` (Prisma CLI not installed in runner — relies on `npx` fetching). npmmirror registry used for builder. [FACT]

[FACT] Frontend `Dockerfile`: `node:22-alpine`, `next build` then copies `.next/standalone` + `.next/static`; `output: 'standalone'` is configured so this is consistent. [FACT]

[FACT] Worker `Dockerfile`: single-stage `node:22-alpine`; `npm ci` (lockfile present), `npm run build`; relies on `@prisma/client` postinstall to generate the client (worker schema at default location). [FACT]

[FACT] `nginx/nginx.conf`: HTTP→HTTPS redirect; 443 with `cert.pem`/`key.pem`; `/api/` → backend with `limit_req zone=api_limit` (rate limit); separate `/api/v1/billing/webhook` location; proxy headers set. [FACT]

[RECOMMENDATION] Production deploy path (compose + nginx + prisma migrate) is internally inconsistent and will not boot out-of-the-box. Docker config validation (`docker compose config`) passes syntactically, but runtime startup is [UNKNOWN] without the missing certs/env/migrations.

---

## 8. Database Audit

[FACT] `backend/prisma/schema.prisma` models: `User` (with `username`, `isActive`, `lastLoginAt`), `Monitor`, `Check`, `Alert`, `Subscription`, `StatusPage`, `StatusPageItem`, `Incident`. [FACT]

[FACT] `worker/prisma/schema.prisma` **differs**: its `User` model lacks `username`, `isActive`, `lastLoginAt`. The two packages will generate different clients against the same database → drift/confusion; worker queries on missing columns would fail at runtime. [FACT]

[FACT] **No `prisma/migrations/` directory exists in either package** (only `schema.prisma`). [FACT]

[FACT] `supabase/migrations/20260604112734_remote_schema.sql` is **empty** (0 meaningful bytes). `supabase/config.toml`: `db.major_version = 17` (README claims PostgreSQL 16); `enable_confirmations = false`; references `seed.sql` which is absent. [FACT]

[INFERENCE] Ownership/tenancy: models carry `userId` FK; no multi-tenant abstractions, no composite indexes beyond defaults, no cascading documented. Schema has no `OnDelete` behaviors specified → orphans possible (e.g., deleting a user leaves monitors/checks). [FACT/INFERENCE]

[INFERENCE] `Checks` table grows unbounded until the worker cron cleanup runs (`CLEANUP_DAYS`); no index guarantee on `(monitorId, createdAt)` — `analytics.ts` queries by these; check the schema: no explicit index defined → Prisma default indexes only on `@id`/`@unique`. [FACT]

---

## 9. Security Audit

| # | Severity | File | Evidence | Impact | Recommended fix |
|---|---|---|---|---|---|
| S1 | HIGH | `backend/src/routes/statusPages.ts` | `PATCH` handler applies `req.body` with no zod validation | IDOR/overwrite: caller can set `userId`, arbitrary fields, even reassign ownership | Add zod schema; forbid `userId`; scope to `userId` from token |
| S2 | HIGH | `backend/src/routes/billing.ts` | Plan derived from unverified request metadata (subscription update body) | Users could claim `pro`/`basic` without payment | Derive plan from Stripe customer/subscription server-side only |
| S3 | MEDIUM | frontend `auth-store.ts` | Tokens/session in `localStorage` | XSS → account takeover | HttpOnly cookie / server session |
| S4 | HIGH | `worker/src/services/executor.ts` | Fetches arbitrary monitor URLs with axios, no SSRF guard (private IP checks absent) | SSRF into internal network if monitor creation is attacker-reachable | Block private/loopback/link-local targets; validate scheme |
| S5 | MEDIUM | `backend/src/routes/auth.ts` | Signup allows unverified emails; no email-confirmation gate; logs with `console.log` | Unverified accounts; info leakage in logs | Enforce confirmation, structured logging without secrets |
| S6 | MEDIUM | `frontend/src/lib/supabase-client.ts` | Hard-coded fake fallback `https://test.supabase.co` / `test-key` | If env missing, app silently targets a fake endpoint | Fail fast when env missing |
| S7 | MEDIUM | `backend/src/config/env.ts` vs `.env.example` vs `scripts/validate-env.js` | `JWT_SECRET` requires ≥64 chars but `.env.example` example is 59 chars; `validate-env.js` requires a different variable set (`NEXT_PUBLIC_*`, `STRIPE_*`, `RESEND_API_KEY`) than `env.ts` | Boot failures / false "valid" checks | Single source of truth for env schema |
| S8 | LOW/MEDIUM | `backend/src/server.ts` / index | `helmet` used; CORS configured; rate-limit on some routes only (refresh endpoint unratelimited) | Brute force on refresh/token endpoint | Apply rate limit globally + stricter on auth |
| S9 | MEDIUM | frontend | No Next.js `middleware.ts`; dashboard guard is client-side only | Direct navigation shows dashboard shell; unauth API 401s but UI not server-protected | Add middleware / server component auth |
| S10 | MEDIUM | `docker-compose.prod.yml` + `nginx` | Secrets via env only; no secret manager; nginx certs absent | Operational risk | Use secrets; document cert provisioning |

[FACT] Webhook validation: Stripe webhook signature is verified (`billing.ts`) — good. [FACT]

[RECOMMENDATION] Full dependency-audit (`npm audit`) is [UNKNOWN] — not runnable without install. Dependency concerns: bullmq/ioredis unused but shipped; zod major mismatch across packages.

---

## 10. Worker / Reliability Audit

Trace: `Monitor` → `setInterval` cycle (`worker/src/index.ts`) → for each due monitor → `executor.runCheck` → write `Check` → `alert-service` → email (if keys) → cleanup cron.

| Concern | Evidence | Severity |
|---|---|---|
| No queue | `setInterval` + in-memory `lastStatusMap`; BullMQ/ioredis unused | HIGH (design mismatch vs docs) |
| No reentrancy guard | if a cycle takes longer than `CHECK_INTERVAL_SECONDS`, the next `setInterval` tick overlaps | HIGH |
| Duplicate execution | no unique constraint on checks; overlapping ticks could double-write | MEDIUM |
| No retries | executor does a single attempt; README claims retries | MEDIUM |
| Restart re-alert | `lastStatusMap` resets on restart → monitors that stayed down re-trigger alerts | MEDIUM |
| No idempotency | status-change keys on in-memory state only | MEDIUM |
| Graceful shutdown | SIGTERM only disconnects Prisma; in-flight checks not awaited | MEDIUM |
| Email inline | `alert-service` sends synchronously; failure aborts check/alert cycle | MEDIUM |
| Timeout | per-monitor timeout respected; `degraded` when `responseTime > timeout*0.8` | OK |
| Data loss | if worker crashes mid-cycle, pending checks skipped (no queue to resume) | HIGH |
| Cleanup | node-cron deletes old checks (`CLEANUP_DAYS`) | OK |

[FACT] `executor.ts`: hard-coded `maxRedirects: 5`, `validateStatus` accepts all status codes, `httpsAgent` recreated per request (no keep-alive pooling benefit). [FACT]

[RECOMMENDATION] If v3 keeps a single-node scheduler, at minimum add: cycle reentrancy lock, restart-safe state (read latest status from DB), and awaited shutdown. A real queue (BullMQ+Redis) is only justified if multi-node scale is required — which, per §14, is not recommended in v3.

---

## 11. Documentation Drift

[FACT] README claims: "Production-Ready", BullMQ queues, worker on port 3002, PostgreSQL 16 (Supabase config says PG 17), retries. All contradicted by source.

[FACT] ARCHITECTURE.md describes Cloudflare, NGINX, microservices, mobile app, and CLI as if built. None exist.

[FACT] CHANGELOG v2.0 claims "Prisma schema synchronization issues fixed" — contradicted by two divergent schemas and no migrations.

[FACT] ROADMAP places Status Pages, Stripe billing, and Teams in "v2.1" — yet Status Pages and Stripe backend exist in v2.0 (status page PATCH is broken; Teams absent). Roadmap is out of sync with reality.

[FACT] UBUNTU_SETUP_GUIDE documents PM2/systemd deployment — the project actually uses Docker Compose. Conflicting instructions.

[FACT] DEVELOPMENT_PLAN.md is a tutorial narrative, not an implementation plan; doesn't match the repo.

[FACT] ENV_GUIDE.txt and `.env.example` document a variable set that diverges from `backend/src/config/env.ts` requirements (JWT ≥64 chars; `validate-env.js` differs again).

[FACT] Frontend marketing/docs/blog/pricing pages advertise: SMS, Slack, webhook alerts; REST/GraphQL/SOAP/WebSocket protocols; SLA tracking; team collaboration; 30-second checks; custom domains; SSL monitoring; uptime reports. None of these are implemented (see §4).

---

## 12. Backup / Dead-Code Audit

| Item | Nature | Recommendation |
|---|---|---|
| `backup-auth-fix/` | Superseded older auth frontend files | Candidate for later removal |
| `frontend/backups/workspaces-page-v2.0-backup.tsx` | Fuller workspaces page replaced by a stub | Salvage ideas if workspaces ever built; else remove |
| `frontend/audit-summary.txt`, `errors-by-file.txt`, `error-summary.txt` | Stale build-error logs from `api-monitor-saas-v1` | Historical; remove later |
| `worker/doctor-report.txt` | Historical diagnosis; issues appear fixed in current source | Historical; remove later |
| `worker/fix-worker.sh` | Hard-codes `$HOME/Downloads/api-monitor-saas-v1`, deletes `package-lock.json` and `node_modules` | **DANGEROUS**; do not run; remove later |
| `scripts/sync-github.sh` | Force-push overwrite of remote | **DANGEROUS**; do not run; remove/rework later |
| `scripts/git-setup.sh` | References old `api-monitor-saas-v1` path | Obsolete |
| `package.json.backup` | v1.0.0 config | Historical |
| `scripts/backup.sh`, `deploy.sh`, `setup-ubuntu.sh` | Deploy/backup tooling (deploy.sh runs the broken migration step) | Rework with compose fix |
| `release-evidence/` | screenshots | Historical |

[RECOMMENDATION] None deleted in this phase. Cleanup should happen as an explicit, deliberate v3 housekeeping step.

---

## 13. Branch Audit

[FACT] `origin/develop` — **8 commits ahead** of `main`; real tree diffs in ~16 files: `ci.yml`, Dockerfiles, `tsconfig`, `billing/page.tsx` (REAL Stripe billing page vs static mock in main), `use-auth.ts`, `api-client.ts`, `supabase-client.ts`, `auth-store.ts`, layouts. **Contains the most valuable unmerged work (real billing UI).**
[FACT] `feature/backend-core`, `feature/frontend-dashboard`, `feature/worker-service`, `feature/integration-testing`, `feature/stripe-billing` — 0 ahead / ~40 behind `main` (stale/merged).
[FACT] `enhancement/stability-improvements` — 0/28 behind. `fix/docker-supabase-build` — 1/2 (supabase-client fallback keys). `fix/frontend-ci-build` — 1/3. `stable/v2.0.0` — 0/8.

[RECOMMENDATION] Before v3 work, reconcile `origin/develop`'s billing/CI/Docker changes into `main` (via review, not blind merge). Nothing else appears to carry unmerged value. [INFERENCE]

---

## 14. Production Readiness Scores

| Component | Score | Rationale |
|---|---|---|
| Architecture | 35 | Single-node monolith+setInterval despite claims of queues/workers/microservices; coherent core but documented architecture is fiction |
| Build | 20 | Not reproducible locally (no deps installed to verify); duplicate `/` route build blocker suspected; broken backend lint import; node version tri-conflict; seed script target missing |
| Testing | 10 | 4 files, placeholder assertions, no auth/billing/worker/e2e coverage |
| Security | 35 | S1/S2/S4 high-severity; S6 fallback creds; no middleware; some good signs (webhook signature, helmet, rate limit) |
| Monitoring engine | 55 | Executor is real and handles timeout/degraded; but no retries, no reentrancy, restart re-alert, data-loss on crash |
| Worker | 30 | setInterval only; no queue; crashes lose pending work; no graceful drain |
| Database | 40 | Coherent schema but no migrations, two divergent schemas, empty Supabase migration, no indexes on hot query path, no cascade behavior |
| Frontend | 40 | Real pages for core; but stubs (workspaces/team/settings), fake billing mock, broken navigation, literal backticks, duplicate `/` route, false marketing copy |
| Backend | 55 | Real Express API with zod on most routes; but env/validation fragmentation, unvalidated PATCH, plan trust issue |
| Billing | 35 | Backend + webhook exist and verify signatures; frontend mock in main; real page stranded in `develop`; plan trust issue |
| Status pages | 35 | Model + public route exist; PATCH broken; no incident flow; design token absent |
| Teams / Workspaces | 5 | Stubs only; no backend |
| Deployment | 25 | Compose syntax valid but prod path broken (no migrations, no swarm for replicas, missing ssl certs, redis localhost, non-reproducible images) |
| Documentation | 20 | Extensively claims nonexistent features and contradicts implementation |
| Observability | 25 | winston logging exists but no request logging of monitor checks; no metrics, no tracing, no health endpoints beyond startup DB check |
| Recovery | 25 | No queue persistence, no idempotency, restart re-alert, no backup automation verified |

Overall weighted ≈ **30/100** — clearly not production-ready; a coherent prototype core.

---

## 15. Prioritized Findings

### P0 — BLOCKERS (must fix before meaningful work)

- **P0-1** Severity: Blocker — Component: Build — `frontend/src/app/page.tsx` + `frontend/src/app/(marketing)/page.tsx` — Duplicate root route resolves both to `/`; Next.js fails build. Evidence: both files exist and resolve to `/`. Recommended: remove one (landing should live in `(marketing)`; make root `page.tsx` redirect). Dependency: none. [FACT]
- **P0-2** Severity: Blocker — Component: Database/Deploy — No `backend/prisma/migrations`; `deploy.sh`/prod compose run `prisma migrate deploy` and will fail; worker schema diverges from backend. Evidence: `ls backend/prisma` shows only `schema.prisma`; `worker/prisma/schema.prisma` User differs. Recommended: single source-of-truth schema, generate real migrations, use same schema in worker. Dependency: none.
- **P0-3** Severity: Blocker — Component: Environment — `backend/src/config/env.ts` requires JWT ≥64 chars + vars; `.env.example`/`ENV_GUIDE.txt`/`validate-env.js` disagree (59-char example; different var set). Evidence: files compared. Recommended: one shared env schema/validator. Dependency: none.
- **P0-4** Severity: Blocker — Component: Deploy — Prod path cannot start: missing `nginx/ssl` certs, swarm-only `deploy.replicas` under compose, Redis localhost env mismatch, non-reproducible image builds (lockfile not copied). Evidence: §7. Recommended: reproducible builds, cert provisioning docs/step, compose-compatible scaling, correct REDIS_URL. Dependency: P0-2 (migrations) for a working first deploy.

### P1 — CRITICAL (required for a reliable release)

- **P1-1** Severity: High — Component: Security — `backend/src/routes/statusPages.ts` unvalidated PATCH → IDOR. Recommended: zod schema, forbid `userId`, ownership scope.
- **P1-2** Severity: High — Component: Security/Billing — `billing.ts` trusts request metadata for plan. Recommended: derive plan from Stripe.
- **P1-3** Severity: High — Component: Security/Worker — SSRF risk in `executor.ts` (arbitrary URL fetch). Recommended: block private/loopback/link-local.
- **P1-4** Severity: High — Component: Worker — setInterval overlap + restart re-alert + crash data-loss. Recommended: reentrancy lock, DB-backed last-status, awaited graceful shutdown; or adopt a real queue if scale demands.
- **P1-5** Severity: High — Component: Build/Lint — backend `eslint.config.js` imports missing `@eslint/js`; worker has no lint/test. Recommended: fix deps/config; add worker scripts.
- **P1-6** Severity: High — Component: Frontend — Broken navigation in `monitors/create`; literal backticks in dashboard; fake billing mock. Recommended: fix nav, render real billing (port from `develop`), clean dashboard.
- **P1-7** Severity: High — Component: Docs — Marketing/docs/pricing advertise nonexistent features. Recommended: either implement or (recommended) correct copy to match reality.

### P2 — IMPORTANT

- **P2-1** Severity: Medium — Component: Security — tokens in `localStorage`. Recommended: HttpOnly cookie session.
- **P2-2** Severity: Medium — Component: Security — no Next.js middleware; client-only guard. Recommended: add middleware/server-side auth.
- **P2-3** Severity: Medium — Component: Worker — no retries, no idempotency. Recommended: bounded retry + unique check constraint.
- **P2-4** Severity: Medium — Component: Tests — replace placeholder tests; add coverage for auth/billing/worker/status pages.
- **P2-5** Severity: Medium — Component: Database — no indexes on `(monitorId, createdAt)`; no cascade behavior. Recommended: index + explicit `onDelete`.
- **P2-6** Severity: Medium — Component: Frontend — stubs (workspaces/team/settings) either implemented or clearly marked disabled; dead components removed later.
- **P2-7** Severity: Medium — Component: Observability — add health endpoints, per-check logging/metrics, structured logs.
- **P2-8** Severity: Medium — Component: Branch — reconcile `origin/develop` (real billing UI, CI/Docker fixes) via reviewed merge.

### P3 — POLISH

- **P3-1** Severity: Low — Component: Docs — align README/ARCHITECTURE/CHANGELOG/ROADMAP/UBUNTU_SETUP_GUIDE with reality.
- **P3-2** Severity: Low — Component: Housekeeping — remove/rework dangerous scripts (`fix-worker.sh`, `sync-github.sh`, `git-setup.sh`), `package.json.backup`, `backup-auth-fix/`, `frontend/backups/`, stale `*.txt` logs, `release-evidence/`.
- **P3-3** Severity: Low — Component: Env — unify Node version (document one; align Docker/CI/.nvmrc).
- **P3-4** Severity: Low — Component: Frontend — resolve zod major mismatch; unify shared types.

---

## 16. Recommended V3 Phase Order

1. **Phase 1 — Make it build.** Fix duplicate `/` route, backend lint config, env schema single-source, Node version decision. Verify `npm ci && npm run build` passes in all workspaces (CI parity).
2. **Phase 2 — Make the data model honest.** Single Prisma schema; generate real migrations; align Supabase config; add indexes/cascades; port `develop` billing UI.
3. **Phase 3 — Make it run reliably.** Worker reentrancy/restart-safety/idempotency/graceful shutdown; SSRF guard; status-page PATCH validation; plan-from-Stripe.
4. **Phase 4 — Make it testable.** Meaningful unit + integration tests (auth, executor, alerts, billing webhook, status pages); worker scripts for lint/test/typecheck.
5. **Phase 5 — Make it deployable.** Reproducible Docker builds (copy lockfiles), cert provisioning, compose-compatible prod config, migration step, health checks.
6. **Phase 6 — Make it honest.** Correct marketing/docs/pricing copy; implement or stub-lock settings; real billing page; observability (metrics, structured logs).
7. **Phase 7 — v3 features (only the realistic set, see §18).** Hardening features such as retries + unique check constraint, email retry, and a simple public incident timeline for existing status pages.

---

## 17. Definition of Done (v3)

- All three workspaces build cleanly on a fresh `npm ci` with a single documented Node version; CI green.
- Single Prisma schema; `prisma migrate deploy` succeeds against a fresh Supabase DB; worker uses the same schema.
- Worker: no overlapping cycles, no restart re-alerts, awaited shutdown, no duplicate checks; SSRF-safe executor.
- Backend: all mutating routes zod-validated and ownership-scoped; billing plan derived from Stripe; webhook verified.
- Frontend: no build-time route conflicts; no stub/dummy pages shipped as real; billing page functional against real backend; no false marketing claims.
- Tests: unit + integration for the core loop, auth, billing, and status pages; CI runs them.
- Prod compose + nginx bring the stack up on a fresh VM with documented env/certs; health checks pass.
- Documentation (README, ARCHITECTURE, ENV_GUIDE, CHANGELOG, ROADMAP, UBUNTU_SETUP_GUIDE) matches implementation.
- Dangerous/obsolete scripts and dead backups removed (as a deliberate, reviewed step).

---

## 18. Explicit "What We Should NOT Build" (for v3)

Given resource constraints and the state of the repo, v3 should **not** build:

- SMS / Slack / webhook alert channels — no provider integrations, no webhook delivery infra; advertise only email until then.
- GraphQL / SOAP / WebSocket protocol monitoring — executor only supports HTTP(S); keep HTTP-only.
- Multi-node / distributed queue scale-out (BullMQ on multiple workers) — single-node scheduler is sufficient; a queue is only justified for scale that doesn't exist. (Revisit after observability proves need.)
- Teams, roles, permissions — no backend for multi-tenancy; keep single-owner model.
- Workspaces as a full feature — implement only if there is a product need; otherwise remove the stub and dead components.
- Custom domains / SSL certificate monitoring / SLA tracking / uptime reports / API access tier — all currently unbacked by any implementation; defer until core is stable.
- Mobile app and CLI — described in docs only; zero code; out of scope.
- Cloudflare integration and "microservices" — fiction; ignore.

Keep: Express core API, monitor CRUD, executor, analytics aggregates, Supabase auth, Stripe backend + webhook, status-page public route, Next.js frontend, Docker skeleton, Supabase as DB/auth. Repair per P0–P3. Remove later: dead backups, dangerous scripts, obsolete logs, false-docs.

---

## AUDIT STATUS

- Repository modified: **NO**
- Application code modified: **NO** (must be NO)
- Dependencies changed: **NO** (must be NO)
- Configuration changed: **NO** (must be NO)
- Tests changed: **NO** (must be NO)
- Commit created: **NO** (must be NO)

Only artifact created: `V3-AUDIT.md`. Working tree otherwise untouched. Items marked `[UNKNOWN / REQUIRES RUNTIME VERIFICATION]` (notably whether any workspace currently compiles, frontend build failure on the duplicate route, Stripe/Resend/Supabase runtime flows, and deploy startup) must be verified in a follow-up phase with dependencies installed and credentials available.