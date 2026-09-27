import { z } from 'zod';

/**
 * Request schemas for the monitor routes.
 *
 * These live apart from `routes/monitors.ts` so a test can import the real schema without
 * importing the route module. Importing the router pulls in the Prisma client, the Supabase
 * client and `config/env`, and `config/env` calls `process.exit(1)` when required variables
 * are absent — which is the normal case in CI. A test that reaches the router through that
 * chain cannot run there.
 *
 * That is not a hypothetical: it is what happened when the test was pointed at the router,
 * and it failed in CI while passing locally, where a populated `.env` hid it.
 */

/**
 * Shape check only. This rejects the obvious mistakes early so the user gets a useful
 * message at creation time instead of a failed check later.
 *
 * It is *not* the security boundary. A syntactically valid URL can still name a loopback
 * or metadata address, and a monitor row can be written by anything that can reach the
 * database, so the destination policy in the worker (`worker/src/security/`) is what
 * actually enforces where requests may go. The scheme allowlist below is duplicated from
 * that policy on purpose: failing fast is better than failing silently, but only the
 * runtime check counts as enforcement.
 */
export const monitorUrlSchema = z
  .string()
  .url('Invalid URL')
  .refine((value) => /^https?:\/\//i.test(value), {
    message: 'URL must use http or https',
  });

export const createMonitorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  url: monitorUrlSchema,
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']).default('GET'),
  headers: z.record(z.string()).optional().default({}),
  body: z.string().optional(),
  interval: z.number().int().min(30).max(3600).default(300),
  timeout: z.number().int().min(5).max(120).default(30),
  expectedStatus: z.number().int().min(100).max(599).nullish(),
  expectedKeyword: z.string().optional(),
  region: z.string().default('global'),
});

export const updateMonitorSchema = createMonitorSchema.partial();
