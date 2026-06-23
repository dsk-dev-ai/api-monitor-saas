import { z } from 'zod';

const envSchema = z.object({
NODE_ENV: z.enum([
'development',
'production',
'test',
]).default('development'),

PORT: z.coerce.number().int().positive().default(3001),

DATABASE_URL: z.string().min(1),

SUPABASE_URL: z.string().url(),

SUPABASE_ANON_KEY: z.string().min(1),

SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

JWT_SECRET: z.string().min(
64,
'JWT_SECRET must be at least 64 characters'
),

FRONTEND_URL: z.string().url(),

REDIS_URL: z.string().url(),

STRIPE_SECRET_KEY: z.string().optional(),
STRIPE_WEBHOOK_SECRET: z.string().optional(),
STRIPE_PRICE_BASIC: z.string().optional(),
STRIPE_PRICE_PRO: z.string().optional(),

RESEND_API_KEY: z.string().optional(),

FROM_EMAIL: z.string().email(),

ENABLE_EMAILS: z.coerce.boolean().default(false),

ENABLE_BILLING: z.coerce.boolean().default(false),

ENABLE_SIGNUPS: z.coerce.boolean().default(true),

ENABLE_WORKSPACES: z.coerce.boolean().default(true),

ENABLE_TEAMS: z.coerce.boolean().default(true),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
console.error(
'Environment validation failed'
);

console.error(
parsed.error.flatten().fieldErrors
);

process.exit(1);
}

const data = parsed.data;

if (
data.NODE_ENV === 'production'
) {
if (
data.ENABLE_EMAILS &&
!data.RESEND_API_KEY
) {
throw new Error(
'RESEND_API_KEY required in production'
);
}

if (
data.ENABLE_BILLING &&
!data.STRIPE_SECRET_KEY
) {
throw new Error(
'STRIPE_SECRET_KEY required in production'
);
}
}

export const env = {
...data,

isProduction:
data.NODE_ENV === 'production',

isDevelopment:
data.NODE_ENV === 'development',

isTest:
data.NODE_ENV === 'test',
};
