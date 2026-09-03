# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/).

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
