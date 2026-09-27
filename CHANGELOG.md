# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/).

## Unreleased

The Docker development environment had never worked. Six independent defects
kept `docker compose up` from reaching a usable state — CI passed because it only
builds images and never runs the stack. All are fixed and verified end to end.

### Security
- **The real `.env` was baked into the backend image.** No `.dockerignore` existed,
  so `COPY . .` copied host files into the image, including the database password,
  Supabase service-role key, and Stripe and Resend secrets. Anyone pulling that
  image could read them. Added `.dockerignore` at the repository root and in
  `backend/` and `frontend/`, and removed the `.gitignore` rule that listed
  `.dockerignore` as a build artifact — that mistake is why the gap went unnoticed.
- Dockerfiles no longer pin `registry.npmmirror.com`, which broke builds outside
  that network. The registry is now a `NPM_REGISTRY` build argument defaulting to
  the public npm registry.
- Documented the unfixed SSRF exposure in the monitoring worker in
  [SECURITY.md](SECURITY.md). User-supplied monitor URLs are fetched with no
  destination validation, so a monitor can be pointed at private ranges or cloud
  metadata endpoints.

### Fixed
- Prisma client was pinned to the `linux-musl` engine in `schema.prisma`, so every
  Debian-based image loaded an engine linking against `libssl.so.1.1` that those
  images do not provide. Now `binaryTargets = ["native"]`.
- `node:22-slim` ships neither the `openssl` binary Prisma's platform detection
  reads nor the `libssl` the query engine links against. Installed in all backend
  and worker stages. This is why the Render deployment worked while local Docker
  did not — that image already installed it.
- Compose ran `npx ts-node-dev` against production images built with `--omit=dev`,
  so `npx` fetched a ts-node incompatible with the TypeScript it resolved, and the
  process crashed on startup. Added explicit `development` targets to the backend,
  worker, and frontend Dockerfiles, keeping production the default build target.
- The frontend bind mount shadowed the image's `node_modules`, failing with
  `next: not found`. Added the missing anonymous volume.
- `DATABASE_URL` points at `localhost:5434` for host tooling and is unreachable
  from inside the compose network. Added `DATABASE_URL_DOCKER` for the containers.

### Added
- A one-shot `migrate` service applies the Prisma schema before the API and worker
  start, so a fresh clone no longer needs a manual `db:migrate` step. Wired into
  both `docker-compose.yml` and `docker-compose.prod.yml`.
- Explicit `development` build targets for backend, worker, and frontend.
- `scripts/audit-licenses.js` and `docs/THIRD_PARTY_LICENSES.md`. All 72 direct
  dependencies are permissive, with no copyleft. The script reads the lockfiles
  rather than `node_modules` so it is reproducible on a clean checkout, and exits
  non-zero on a non-permissive license.
- CI job enforcing that the license inventory is current and contains no copyleft.
- `docs/DEPLOYMENT.md` covering local, single-host, and managed-platform
  deployment, with troubleshooting and a table of known production limitations.
- `docs/COMMERCIAL_BOUNDARY.md` defining what stays MIT and what is proprietary.
- `docs/AUTH_DESIGN.md` specifying self-hosted authentication to replace Supabase.
- `docs/README.md` as a documentation index.

### Changed
- **LICENSE** was truncated to 7 lines, cut off before the warranty disclaimer, so
  GitHub classified the project as "Other" rather than MIT. Restored the full text.
- **ARCHITECTURE.md** documented a mobile app, CLI tool, webhook service, Cloudflare
  CDN, Docker Swarm, Prometheus, Grafana, Loki, Kafka, and row-level security, none
  of which exist. Rewritten to describe only shipped behavior, and to state plainly
  that row-level security is not enabled, that `bullmq` and `ioredis` are declared
  but never imported, and that the worker cannot scale past one replica.
- **ROADMAP.md** now holds everything previously documented as existing but not
  implemented, ordered by priority, with the SSRF exposure at P0.
- `DEVELOPMENT_PLAN.md`, `P1-VALIDATION.md`, and `UBUNTU_SETUP_GUIDE.md` moved to
  `docs/history/`. They are development records, not product documentation, and a
  buyer pays for shipped code rather than a plan.
- `.env.example` and `ENV_GUIDE.txt` rewritten. Both previously implied that
  `ENABLE_WORKSPACES` and `ENABLE_TEAMS` gate working features; neither flag is read
  anywhere in the code.
- `CONTRIBUTING.md` targets `main` rather than `develop`, and documents the license
  policy and the implemented-versus-planned documentation rule.
- `SECURITY.md` discloses the known SSRF exposure, the single-owner tenancy model,
  and the service-role key requirement.
- `docker-compose.prod.yml` pins the worker to one replica, since per-process
  scheduling state makes additional replicas produce duplicate checks and alerts.

### Verified
Clean build of all images, five services healthy, `/health` reporting a connected
database, frontend serving HTTP 200, auth guard and public routes behaving
correctly, and 12/12 tests passing against a live database.

## v3.5.0 - 2026-09-03

### Added
- Full premium redesign of marketing (landing/features/pricing/blog/docs) and dashboard (shell/sidebar/header, all pages, monitor wizard) using the design-system token set and framer-motion animations
- **Light/dark theme toggle** (sun/moon button) on marketing header and dashboard header, with light mode as the default
- Theme persistence across refresh via lazy state init and a pre-hydration `<head>` script (no flash back to light on reload)
- SEO/discoverability on the deployed site: `sitemap.xml` + `robots.txt` (Next app router), accurate `title`/`description`/OpenGraph/Twitter metadata, canonical URLs, and a servable OG banner (`/og.svg`)
- Shared site config (`frontend/src/lib/site.ts`)

### Fixed
- Monitor creation wizard now shows a proper styled glass-card UI with a 3-step stepper and visible input boxes
- **Critical** backend status check: leaving "Expected Status Code" blank now means "any 2xx" everywhere. Removed the `@default(200)` from the Prisma schema (backend + worker) and zod `.nullish()`, and fixed the worker executor so a blank expected status requires a 2xx response (previously a 500/404 was reported as UP)
- Monitor creation wizard is now **plan-aware**: the check interval defaults to and enforces the user's plan minimum (free=300s, basic=60s, pro=30s) instead of defaulting to 60s and failing with "Minimum check interval for free plan is 300 seconds"
- Removed misleading dead-code `?? 300` fallback in the backend monitor update service
- Wired wizard step styles to the design system; removed the unused CSS module and a stray `test.txt`
- Frontend API base URL normalization in `frontend/src/lib/api-url.ts`, preventing a doubled `/api/v1` prefix on the live signup route (`/api/v1/api/v1` → `/api/v1`)
- `DEPLOYMENT_STATUS.md` updated: deployment is live and email/signup confirmation resolved via Resend SMTP (previously listed as an open blocker)
- **Critical** token refresh in `frontend/src/lib/api-client.ts` now reads `session.access_token` from `POST /auth/refresh` (and rotates `refresh_token`); previously read a non-existent `data.access_token`, causing silent logouts when the JWT expired
- Removed stray markdown backtick fences (` ``` `) rendering as literal text on the login and dashboard pages
- Monitor wizard: Cancel button is no longer disabled on step 1; removed the unsupported `OPTIONS` HTTP method option; interval field aligned with backend validation (30–3600s) instead of 10–86400s
- Monitor wizard Advanced Settings trimmed to fields the backend actually supports (`timeout`, `expectedStatus`, `expectedKeyword`, `headers`, `body`) — previously-unsupported auth/alert/retry/redirect/SSL groups were silently discarded, misleading users
- Billing page degrades gracefully (disabled "Not available yet" paid plans) when Stripe/checkout is not configured, instead of offering broken Upgrade buttons
- Accurate marketing claims: removed `real-time`/`instant`/`free trial` overclaims on the landing and features pages; pricing page shows the live Free plan with Basic/Pro marked **Planned**
- Corrected stale version/status strings: sidebar `v2.0.0-enterprise` → accurate "Open source"; backend root `/` version `1.0.0` → `3.5.0`

### Removed
- Old release assets: `release-evidence/` screenshots, stale `package.json.backup`, diagnostic audit/error text files, `worker/doctor-report.txt`, empty `supabase/snippets/`

### Security
- `robots.txt` disallows private routes (`/dashboard`, `/settings`, `/team`, `/workspaces`, `/billing`)

## v3.0.0 - 2026-08-30

### Added
- Repo OG banner (`.github/api-monitor-og.svg`)
- Community files: `SECURITY.md`, `CODE_OF_CONDUCT.md`, `FUNDING.yml`, issue templates, PR template
- `DEPLOYMENT_STATUS.md` documenting free-tier deployment blockers

### Changed
- Standardize on Node.js 22 LTS (`.nvmrc`, `engines`, Dockerfiles, CI) — previously 20 in docs/scripts
- Frontend API client now targets the versioned `/api/v1` backend prefix (fixes login flow 404)
- Rewrote README with an accurate "What works vs Coming next" table and working badges
- Corrected root package description (no longer "v1 MVP")
- Removed unverified marketing claims and dead links across landing/features/docs/blog

### Fixed
- Frontend login flow: API calls now resolve against the `/api/v1` mount
- Remove all `no-explicit-any` lint warnings across backend and worker
- Monitor-create navigation used literal route-group paths (now `/monitors`)
- `/auth/refresh` now sends `refresh_token` (matches backend), enabling session self-heal

## v2.0.0

### Added
- Authentication
- Dashboard
- Monitor Management
- Analytics
- Alerts
- Worker Service

### Fixed
- Dashboard authentication loading issue
- Prisma schema synchronization issues
