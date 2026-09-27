# Security Policy

## Reporting a Vulnerability

If you discover a security issue in **API Monitor SaaS**, **please do not** open a public issue.

Report it privately by emailing **darshan.kachare.dev@gmail.com**, or by opening a
[private security advisory](https://github.com/dsk-dev-ai/api-monitor-saas/security/advisories/new).

Please include as much of the following as possible:

- The type of issue (e.g. SSRF, auth bypass, token leak, SQL injection, XSS).
- Full paths of the source file(s) related to the issue.
- The location of the affected source code (tag, branch, or commit).
- Any special configuration required to reproduce.
- Step-by-step instructions to reproduce.
- Proof-of-concept or exploit code, if any.
- Impact of the issue, including what an attacker could achieve.

You can expect an acknowledgement within a few days. Fixes for confirmed issues
are prioritised by severity; the maintainer is a single developer, so complex
reports may take longer to resolve than you would like.

## Supported versions

Only the latest tagged release on `main` receives security fixes.

## Known security limitations

These are disclosed rather than hidden. If you deploy this software, you should
understand them.

### SSRF in the monitoring worker — **unfixed, tracked as P0**

Monitors are user-supplied URLs that the worker fetches on the user's behalf.
There is **no destination validation**. A user can point a monitor at:

- Loopback and private ranges — `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
- The Docker host gateway
- Cloud instance metadata endpoints — `169.254.169.254`

Anyone who can create a monitor can therefore use the worker as a proxy to probe
internal infrastructure, and on a cloud host may be able to retrieve instance
credentials from the metadata service.

Redirects are followed without re-validating the destination, and there is no
DNS rebinding protection, so an allowlist alone would not be sufficient.

Mitigations pending a fix: restrict who may create monitors, and do not expose
the API to untrusted users on a network containing sensitive internal services.

The fix is specified in [ROADMAP.md](ROADMAP.md) (P0) — resolve the hostname and
reject reserved ranges, re-check at connect time, and validate every redirect hop.

### Single-owner tenancy, no RBAC

Authorization is owner-scoped: each handler compares the record's `userId` to the
authenticated user. There are no roles, permissions, or membership tables.
PostgreSQL row-level security is **not** enabled, so the application layer is the
only enforcement point and a query bug in any handler would expose cross-tenant
data. Tracked in [ROADMAP.md](ROADMAP.md) (P3).

### The backend requires a Supabase service-role key

The backend holds a service-role key to verify tokens. Anyone with access to that
key has full administrative control of the Supabase auth schema. Treat it as a
production secret: set it in the environment only, never in a committed file, and
rotate it if it is exposed.

`.dockerignore` files exclude `.env` from the build context specifically so this
key is not baked into image layers. Verify that exclusion still holds after any
Dockerfile change — see [ENV_GUIDE.txt](ENV_GUIDE.txt).

### No audit log

Security-relevant actions are not recorded. There is no way to answer "who
changed this, and when" after the fact. Tracked in [ROADMAP.md](ROADMAP.md) (P3).

## Hardening already in place

| Control | Implementation |
|---|---|
| SQL injection | Prisma parameterizes all queries; no raw SQL in application code |
| Secrets in images | `.dockerignore` excludes `.env` at the root, `backend/`, and `frontend/` |
| Secrets in git | `.env` is gitignored; `.env.example` contains placeholders only |
| Security headers | `helmet` with explicit CSP and HSTS |
| CORS | Explicit origin allowlist, not a wildcard |
| Rate limiting | Global limiter plus a stricter limiter on `/api` |
| Webhook integrity | Stripe signatures verified against the raw request body |
| Input validation | Zod schemas on environment and request payloads |
| Dependency licensing | All 72 direct dependencies are permissive; CI enforces it |

## Deployment recommendations

- Terminate TLS in front of the application. `nginx/nginx.conf` is a reference
  configuration.
- Do not expose the API to untrusted users until the SSRF fix lands.
- Restrict who can create monitors in the meantime.
- Keep `.env` out of version control and out of images.
- Rotate `SUPABASE_SERVICE_ROLE_KEY` and `JWT_SECRET` if either is ever exposed.
- Back up the database and **test the restore**. Recovery is currently manual.
