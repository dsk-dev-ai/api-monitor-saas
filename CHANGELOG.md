# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- SEO/discoverability on the deployed site: `sitemap.xml` + `robots.txt` (Next app router), accurate `title`/`description`/OpenGraph/Twitter metadata, canonical URLs, and a servable OG banner (`/og.svg`)
- Shared site config (`frontend/src/lib/site.ts`)

### Fixed
- Frontend API base URL normalization in `frontend/src/lib/api-url.ts`, preventing a doubled `/api/v1` prefix on the live signup route (`/api/v1/api/v1` → `/api/v1`)
- `DEPLOYMENT_STATUS.md` updated: deployment is live and email/signup confirmation resolved via Resend SMTP (previously listed as an open blocker)
- **Critical** token refresh in `frontend/src/lib/api-client.ts` now reads `session.access_token` from `POST /auth/refresh` (and rotates `refresh_token`); previously read a non-existent `data.access_token`, causing silent logouts when the JWT expired
- Removed stray markdown backtick fences (` ``` `) rendering as literal text on the login and dashboard pages
- Monitor wizard: Cancel button is no longer disabled on step 1; removed the unsupported `OPTIONS` HTTP method option; interval field aligned with backend validation (30–3600s) instead of 10–86400s
- Monitor wizard Advanced Settings trimmed to fields the backend actually supports (`timeout`, `expectedStatus`, `expectedKeyword`, `headers`, `body`) — previously-unsupported auth/alert/retry/redirect/SSL groups were silently discarded, misleading users
- Billing page degrades gracefully (disabled "Not available yet" paid plans) when Stripe/checkout is not configured, instead of offering broken Upgrade buttons
- Accurate marketing claims: removed `real-time`/`instant`/`free trial` overclaims on the landing and features pages; pricing page shows the live Free plan with Basic/Pro marked **Planned**
- Corrected stale version/status strings: sidebar `v2.0.0-enterprise` → accurate "Open source"; backend root `/` version `1.0.0` → `3.0.0`

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
