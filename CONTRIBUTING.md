# Contributing

Thanks for your interest in contributing to **API Monitor SaaS**! Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## Get started

1. **Fork** the repository and create a branch off `develop` (or the latest feature branch):

   ```bash
   git checkout -b feature/my-change
   ```

2. Make your changes following our conventions.

3. **Verify** your work locally before opening a pull request:

   ```bash
   npm install
   npm run build
   npm run lint
   npm run typecheck
   npm test
   ```

4. Commit with a clear conventional message (see below).

5. Push the branch and open a pull request against `develop`, using the [pull request template](.github/pull_request_template.md).

## Commit conventions

Use conventional commit prefixes so history stays readable:

```
feat: add multi-region checks
fix: resolve monitor timeout handling
docs: update API documentation
refactor: simplify check logic
test: add monitor unit tests
chore: update dependencies
```

## Reporting issues

Use the [bug report](.github/ISSUE_TEMPLATE/bug_report.md) or [feature request](.github/ISSUE_TEMPLATE/feature_request.md) templates. For security issues, see [SECURITY.md](SECURITY.md) and report privately.

## Code style

- TypeScript everywhere (no plain JS in `src`).
- Follow the existing ESLint (`npm run lint`) and TypeScript (`npm run typecheck`) rules — both must pass with zero errors.
- This is an **npm workspaces** monorepo. Do not use pnpm/yarn — it can corrupt `node_modules`.

## Project structure

- `frontend/` — Next.js 14 dashboard + marketing site
- `backend/` — Express API (routes, services, Prisma schema)
- `worker/` — background monitoring worker

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full picture.
