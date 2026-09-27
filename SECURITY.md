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

## SSRF in the monitoring worker

### History and current status — **fixed, see "SSRF policy" below**

This was a live vulnerability. It is now mitigated in the worker, and the
mitigation is covered by tests. The residual risks are listed under
[SSRF policy](#ssrf-policy-mitigations-and-residual-risk) and are real; read them
before exposing the product to untrusted users.

**What it was.** Monitors are user-supplied URLs that the worker fetches on the
user's behalf. The worker originally had no destination validation at all, so any
user could point a monitor at loopback, the RFC1918 ranges, the Docker host
gateway, or a cloud metadata endpoint such as `169.254.169.254`, and read the
result back through the monitor's status code and timing. On a cloud host this
included instance credentials from the metadata service. Redirects were followed
by the HTTP client with no re-validation, and there was no DNS rebinding
protection, so a first-hop allowlist alone would not have closed it.

**Fixed in** the commits that introduced `worker/src/security/` — see
[CHANGELOG.md](CHANGELOG.md).

## SSRF policy: mitigations and residual risk

The policy lives in two files, both in `worker/src/security/`, and nowhere else:

- `ip-policy.ts` — classifies a single resolved address. No DNS, no HTTP.
- `ssrf-policy.ts` — URL parsing, scheme allowlist, DNS resolution, and the
  connect-time guard.

`worker/src/services/executor.ts` is the only caller. There is no second fetch
path; see the security review note in [CHANGELOG.md](CHANGELOG.md).

### What is blocked

A destination is refused unless **every** address it resolves to is globally
routable. Blocked IPv4 ranges:

| Range | Why |
|---|---|
| `0.0.0.0/8` | this-network |
| `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` | RFC1918 private; `172.16/12` covers the Docker bridge |
| `100.64.0.0/10` | carrier-grade NAT; also Alibaba metadata `100.100.100.200` |
| `127.0.0.0/8` | loopback |
| `169.254.0.0/16` | link-local; includes AWS/Azure/GCP/DO/Oracle IMDS `169.254.169.254` |
| `192.0.0.0/24` | IETF protocol assignments |
| `192.88.99.0/24` | 6to4 relay anycast |
| `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` | documentation |
| `198.18.0.0/15` | benchmarking |
| `224.0.0.0/4` | multicast |
| `240.0.0.0/4` | reserved, includes broadcast `255.255.255.255` |

Blocked IPv6 ranges:

| Range | Why |
|---|---|
| `::/128`, `::1/128` | unspecified, loopback |
| `::ffff:0:0/96` | IPv4-mapped — the embedded IPv4 is checked too |
| `64:ff9b::/96`, `64:ff9b:1::/48` | NAT64 — embedded IPv4 checked |
| `100::/64` | discard-only |
| `2001::/32` | Teredo — embedded IPv4 checked |
| `2001:2::/48` | benchmarking |
| `2001:10::/28`, `2001:20::/28` | ORCHID |
| `2001:db8::/32`, `3fff::/20` | documentation |
| `2002::/16` | 6to4 — embedded IPv4 checked |
| `fc00::/7` | unique-local; includes AWS IPv6 metadata `fd00:ec2::254` |
| `fe80::/10` | link-local |
| `ff00::/8` | multicast |

The "embedded IPv4 checked" rows matter: `http://[::ffff:169.254.169.254]/`
reaches the metadata service through a v6 socket, so the v4 address carried in the
low bits is classified against the v4 table as well.

### Obfuscated representations

The policy does not match strings. It relies on the WHATWG `URL` parser, which
canonicalises the host before the policy sees it, so all of these are classified as
`127.0.0.1` and refused: `2130706433`, `0x7f000001`, `0177.0.0.1`, `0x7f.0.0.1`,
`127.1`, `%31%32%37.0.0.1`, and fullwidth digits. Any future encoding the parser
canonicalises is covered for free.

### Scheme policy

Only `http:` and `https:` are accepted. `file:`, `ftp:`, `gopher:`, `data:`,
`javascript:`, `ws:` and any other scheme are rejected **before** resolution, so
a rejected scheme never causes a DNS query. A redirect cannot change the scheme
either: each hop is re-validated, so a `302` to `file:///etc/passwd` is refused.

### DNS and rebinding

A name is resolved once for validation and **again at connect time**. The second
resolution happens inside a `lookup` function installed on the request's agent, so
the address that is classified is the address that is dialled. There is no window
in which a validated name can be re-resolved to something else, because there is no
second, unguarded resolution. A test drives a name that returns a public address
for validation and a loopback address for the connection and asserts the
connection is refused.

A name that resolves to *any* mix of public and private addresses is refused
outright, rather than picking the public one. Choosing for the caller would hand
the decision back to the resolver, which is the component an attacker controls.

### Redirect policy

The HTTP client is never allowed to follow a redirect. `maxRedirects: 0` puts
axios on Node's native `http`/`https` transport instead of `follow-redirects`, and
the executor walks the chain itself: request, read `Location`, resolve it relative
to the current URL, run the full policy on the new destination, and only then
continue. At most **5** hops. A `Location` that cannot be resolved safely ends the
attempt. On `303`, and on `301`/`302` for anything but `HEAD`, the follow-up
becomes a `GET` and the request body is dropped, so a `POST` body is not re-sent to
a different origin.

### Error behaviour

A refused target returns:

```
Monitor target resolves to a restricted network destination.
```

The same message is used for every member of the "restricted" family, so a monitor
cannot be used to discover which internal addresses exist. The specific reason and
the address go to the worker log, not to the user. The project already had two
error shapes for this and neither was used: this is not an API response, it is the
`error` field of a `Check` record shown in the dashboard.

### Residual risk — read before exposing this to untrusted users

1. **DNS is still resolved before use.** A hostile hostname causes one outbound DNS
   query for attacker-chosen data. That is blind exfiltration of a few bits per
   check, not a read of internal state, and application code cannot prevent it. The
   fix is an egress-restricted resolver or a network policy, not a code change.
2. **A rebinding attack on a redirect hop is not covered by an automated test.** The
   guard is installed per request and therefore applies to every hop, and redirect
   re-validation is tested, but the specific combination needs a routable public
   address or a network-level interceptor to exercise. It is argued, not proven.
3. **The policy is a denylist of special-purpose ranges, not an allowlist of
   destinations.** A range that is genuinely special-purpose but missing from
   `ip-policy.ts` would pass. The table is derived from the IANA special-purpose
   registry; additions to that registry are not tracked automatically. If you need a
   hard guarantee, run the worker in a network with no route to anything internal —
   that control is stronger than any list.
4. **The `Host` header is not pinned.** Redirects are validated, so a redirect cannot
   reach a private address, but a public server can still reflect a `Host` of its
   choosing into virtual-host routing. This is normal client behaviour and is out of
   scope.

### Testing coverage

`worker/src/security/ssrf-policy.test.ts`, `worker/src/services/executor.test.ts`
and `worker/src/services/executor.e2e.test.ts` — 134 tests, run with
`npm test -w worker`. They cover every range in the tables above, the obfuscated
encodings, the cloud metadata addresses, split-horizon names, DNS rebinding, every
redirect case in the list, scheme smuggling via `Location`, and the error text.

`executor.e2e.test.ts` runs the **real** policy against a **real** server that is
genuinely listening on loopback, and asserts the server never received a request.
Removing the guard was verified to fail these tests — with the guard disabled the
check returns `status: "up"` after a successful connection to the live server.

## Known security limitations

Disclosed rather than hidden. These are unrelated to SSRF and are all still open.

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
| SSRF | Server-side destination policy: scheme allowlist, resolved-address classification, and a guarded connect-time lookup. See above |
| Dependency licensing | All 72 direct dependencies are permissive; CI enforces it |

## Deployment recommendations

- Terminate TLS in front of the application. `nginx/nginx.conf` is a reference
  configuration.
- Read [SSRF policy](#ssrf-policy-mitigations-and-residual-risk) before exposing
  the product to untrusted users. The four residual risks there are not theoretical.
- Run the worker in a network with no route to internal services. That is a stronger
  control than the in-process destination policy and the two compose well.
- Keep `.env` out of version control and out of images.
- Rotate `SUPABASE_SERVICE_ROLE_KEY` and `JWT_SECRET` if either is ever exposed.
- Back up the database and **test the restore**. Recovery is currently manual.
