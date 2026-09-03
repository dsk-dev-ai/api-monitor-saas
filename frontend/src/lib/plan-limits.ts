export const PLAN_MIN_INTERVAL: Record<string, number> = {
  free: 300,
  basic: 60,
  pro: 30,
};

export function getMinInterval(plan?: string | null): number {
  return PLAN_MIN_INTERVAL[plan || 'free'] ?? PLAN_MIN_INTERVAL.free;
}
