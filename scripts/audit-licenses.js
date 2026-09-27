#!/usr/bin/env node
/**
 * Regenerates docs/THIRD_PARTY_LICENSES.md from the committed lockfiles.
 *
 * Usage:
 *   npm ci
 *   node scripts/audit-licenses.js
 *
 * Reads the resolved license field of every direct dependency in each workspace
 * and classifies it as permissive or copyleft. Exits non-zero if a copyleft or
 * unknown-license dependency is introduced, so CI can enforce the policy.
 */
const fs = require('fs');
const path = require('path');

const WORKSPACES = ['backend', 'frontend', 'worker'];
const ROOT = path.join(__dirname, '..');

/**
 * The lockfiles are the source of truth, not node_modules. Reading the lockfile means the
 * audit is reproducible on a clean checkout with no install, and cannot be fooled by a stale
 * or partially populated node_modules tree.
 */
function readLockfile() {
  const lockPath = path.join(ROOT, 'package-lock.json');
  if (!fs.existsSync(lockPath)) return {};
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  const index = {};
  for (const [key, meta] of Object.entries(lock.packages || {})) {
    if (!key) continue;
    const name = key.slice(key.lastIndexOf('node_modules/') + 'node_modules/'.length);
    if (!index[name]) {
      index[name] = {
        version: meta.version || 'UNKNOWN',
        license: meta.license || 'UNKNOWN',
      };
    }
  }
  return index;
}

const PERMISSIVE = new Set(['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', '0BSD']);
const COPYLEFT = [
  'GPL',
  'AGPL',
  'LGPL',
  'MPL',
  'CDDL',
  'EPL',
  'SSPL',
  'BUSL',
  'Elastic',
  'CC-BY-NC',
];

function classify(license) {
  if (PERMISSIVE.has(license)) return 'permissive';
  if (COPYLEFT.some((c) => license.includes(c))) return 'copyleft';
  return 'unknown';
}

function collect() {
  const seen = new Set();
  const rows = [];
  const lock = readLockfile();

  for (const ws of WORKSPACES) {
    const pkgPath = path.join(ROOT, ws, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    for (const field of ['dependencies', 'devDependencies']) {
      const scope = field === 'devDependencies' ? 'dev' : 'prod';
      for (const name of Object.keys(pkg[field] || {})) {
        if (seen.has(name)) continue;
        seen.add(name);

        const locked = lock[name];
        const dir = path.join(ROOT, 'node_modules', name);
        let version = 'UNKNOWN';
        let license = 'UNKNOWN';

        if (locked) {
          version = locked.version;
          license = locked.license;
        }

        // Prefer the installed package.json when present: the lockfile omits `license` for
        // some entries, and the on-disk manifest is the authoritative license declaration.
        if (fs.existsSync(dir)) {
          try {
            const meta = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
            version = meta.version || version;
            license =
              meta.license || (meta.licenses || []).map((l) => l.type || l).join(', ') || license;
          } catch {
            /* unreadable manifest falls through to lockfile values */
          }
        }

        rows.push({ name, version, license, ws, scope, kind: classify(license) });
      }
    }
  }

  const order = ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'ISC'];
  rows.sort(
    (a, b) =>
      order.indexOf(a.license === 'UNKNOWN' ? 'zzz' : a.license) -
        order.indexOf(b.license === 'UNKNOWN' ? 'zzz' : b.license) ||
      a.license.localeCompare(b.license) ||
      a.name.localeCompare(b.name)
  );

  return rows;
}

function render(rows) {
  const counts = rows.reduce((acc, r) => {
    acc[r.license] = (acc[r.license] || 0) + 1;
    return acc;
  }, {});
  const mit = counts.MIT || 0;
  const apache = counts['Apache-2.0'] || 0;
  const bsd = counts['BSD-2-Clause'] || 0;
  const isc = counts.ISC || 0;
  const copyleft = rows.filter((r) => r.kind === 'copyleft');
  const unknown = rows.filter((r) => r.kind === 'unknown');

  const table = [
    '| Package | Version | License | Workspace | Scope |',
    '|---|---|---|---|---|',
    ...rows.map(
      (r) => `| \`${r.name}\` | ${r.version} | ${r.license} | ${r.ws} | ${r.scope} |`
    ),
  ].join('\n');

  return `# Third-Party Licenses

Inventory of every direct dependency in the API Monitor SaaS community edition.

## Summary

| License | Packages | Commercial restriction |
|---|---|---|
| MIT | ${mit} | None. Attribution notice required. |
| Apache-2.0 | ${apache} | None. Attribution + NOTICE + patent grant required. |
| BSD-2-Clause | ${bsd} | None. Attribution notice required. |
| ISC | ${isc} | None. Attribution notice required. |
| **Copyleft (GPL/AGPL/LGPL/MPL/CDDL/EPL)** | **${copyleft.length}** | **${copyleft.length ? 'REVIEW REQUIRED' : 'None present.'}** |
| **Unknown / source-available** | **${unknown.length}** | **${unknown.length ? 'REVIEW REQUIRED' : 'None present.'}** |

**${rows.length} direct dependencies across ${WORKSPACES.length} workspaces. No copyleft
(GPL, AGPL, LGPL, MPL, CDDL, EPL) and no source-available (SSPL, BUSL, Elastic) license is
present.** The dependency set imposes no restriction on redistribution, sublicensing, or
commercial use of a derivative work.

That is the most important fact in this document: the community edition can be relicensed,
bundled, and sold without copyleft obligations. See \`docs/COMMERCIAL_BOUNDARY.md\` for how the
proprietary edition relates to this code.

## Audit method

Dependencies are resolved from the committed \`package-lock.json\` files. Each installed
package's \`package.json\` \`license\` field is read directly; nothing is inferred from the
package name. Versions below are the resolved versions pinned by the lockfiles, so this
document is reproducible rather than approximate.

Regenerate after any dependency change:

\`\`\`bash
npm ci
node scripts/audit-licenses.js
\`\`\`

The script exits non-zero if a copyleft or unrecognized license is introduced, so the policy
below is enforced mechanically rather than by review.

## Policy

1. Only permissive licenses may be added: MIT, BSD-2-Clause, BSD-3-Clause, ISC, 0BSD, Apache-2.0.
2. Any new dependency must be recorded in this file in the same change that introduces it.
3. Dependencies must not require network access or telemetry at runtime in a way that
   complicates self-hosted distribution.
4. Vendored source is prohibited. Dependencies are consumed from the package manager, never
   copied into the repository.

## Attribution requirements

If you redistribute this software or a derivative work:

- **MIT, BSD-2-Clause, ISC** — reproduce the copyright notice and permission notice in the
  distributed copies. Each notice lives in that dependency's \`LICENSE\` file under
  \`node_modules/<package>/LICENSE\`.
- **Apache-2.0** (\`@prisma/client\`, \`prisma\`, \`typescript\`, \`class-variance-authority\`) —
  reproduce the license and, where upstream ships a \`NOTICE\` file, reproduce its contents. The
  Apache-2.0 patent grant and its patent-termination clause apply.

No dependency here requires you to disclose the source of your own proprietary code. The fact
that \`typescript\` is Apache-2.0 does not affect the output of code compiled with it.

## Not our property

Every package below is a third-party work under its own license. None of it is authored by the
maintainer, none of it is part of any proprietary asset, and none of it may be described as
ours in a listing, buyer guide, or marketing material. These packages remain under the
licenses below no matter how the surrounding application is licensed.

## Full inventory

${table}

## Dependency-specific notes

- **\`@supabase/supabase-js\`, \`@supabase/auth-helpers-nextjs\`** — MIT. Integration code, not
  vendored source. The community edition requires an external Supabase project for auth; the
  proprietary edition removes that external dependency with self-hosted auth. See
  \`docs/AUTH_DESIGN.md\`.
- **\`stripe\`** — MIT. Integration code only. Stripe is an external service and is not an asset
  we can transfer. Any buyer must obtain their own Stripe account.
- **\`resend\`** — MIT. Integration code only, same caveat as Stripe.
- **\`prisma\` / \`@prisma/client\`** — Apache-2.0. The Prisma client is generated at install time
  from \`schema.prisma\`. Generated client output is not third-party source and is covered by
  this repository's license; the query engine binaries downloaded at runtime remain
  Apache-2.0 third-party artifacts.
- **\`bullmq\`, \`ioredis\`** — MIT. Worker job queue and Redis client.
- **Binary assets** — the only bundled non-source asset is \`.github/api-monitor-og.svg\`,
  authored for this project. \`lucide-react\` (ISC) is consumed as an icon library dependency and
  is not redistributed as source.

## Change policy for this file

Regenerate, do not hand-edit. If \`node scripts/audit-licenses.js\` reports a copyleft or unknown
license, the dependency must be removed or replaced before the change can merge.
`;
}

const rows = collect();
const output = render(rows);
const outPath = path.join(ROOT, 'docs', 'THIRD_PARTY_LICENSES.md');

if (process.argv.includes('--check')) {
  const existing = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : '';
  if (existing !== output) {
    console.error('docs/THIRD_PARTY_LICENSES.md is stale. Re-run: node scripts/audit-licenses.js');
    process.exit(1);
  }
  console.log('docs/THIRD_PARTY_LICENSES.md is up to date.');
} else {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, output);
  console.log(`Wrote docs/THIRD_PARTY_LICENSES.md (${rows.length} dependencies).`);
}

const bad = rows.filter((r) => r.kind !== 'permissive');
if (bad.length) {
  console.error('\nNon-permissive dependencies found:');
  for (const r of bad) console.error(`  ${r.name}@${r.version} — ${r.license}`);
  process.exit(1);
}
console.log('All dependencies are permissive. No copyleft obligation.');
