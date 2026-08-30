'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  priceId: string | null;
  features: string[];
  limits: { maxMonitors: number; minInterval: number };
  popular: boolean;
}

interface Subscription {
  plan: string;
  status: string;
  usage: { monitors: number; monitorsRemaining: number };
  limits: { maxMonitors: number; minInterval: number; maxTeamMembers: number };
}

export default function BillingPage() {
  const user = useAuthStore((s) => s.user);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingEnabled, setBillingEnabled] = useState(false);
  const [checkoutEnabled, setCheckoutEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [action, setAction] = useState<'checkout' | 'portal' | null>(null);
  const [error, setError] = useState('');

  const currentPlan = user?.subscription?.plan || subscription?.plan || 'free';

  useEffect(() => {
    const load = async () => {
      try {
        const [plansRes, subRes] = await Promise.all([
          api.get('/billing/plans'),
          api.get('/billing/subscription'),
        ]);
        setPlans(plansRes.data.plans);
        setBillingEnabled(plansRes.data.billingEnabled);
        setCheckoutEnabled(plansRes.data.checkoutEnabled);
        setSubscription(subRes.data);
      } catch {
        setError('Failed to load billing information.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const upgrade = async (plan: Plan) => {
    if (plan.id === currentPlan || plan.id === 'free') return;
    if (!plan.priceId) {
      setError('This plan is not ready to purchase yet.');
      return;
    }
    setError('');
    setAction('checkout');
    try {
      const { data } = await api.post('/billing/checkout', { priceId: plan.priceId, plan: plan.id });
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Failed to start checkout.');
        setAction(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to start checkout.');
      setAction(null);
    }
  };

  const manageBilling = async () => {
    setError('');
    setAction('portal');
    try {
      const { data } = await api.post('/billing/portal');
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('No active subscription to manage.');
        setAction(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to open billing portal.');
      setAction(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const featureLabels: Record<string, string> = {
    uptime_monitoring: 'Uptime monitoring',
    email_alerts: 'Email alerts',
    webhook_alerts: 'Webhook alerts',
    slack_alerts: 'Slack alerts',
    status_pages: 'Public status pages',
    response_time_tracking: 'Response time tracking',
    advanced_analytics: 'Advanced analytics',
    api_access: 'API access',
    custom_domains: 'Custom domains',
    all_features: 'All features',
    '5_min_checks': '5-minute check intervals',
    '1_min_checks': '1-minute check intervals',
    '30_sec_checks': '30-second check intervals',
    basic_analytics: 'Basic analytics',
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Billing</h2>
        <p className="text-muted-foreground">
          Your current plan, usage, and upgrade options.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {subscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentPlan === 'free' ? 'Free' : `${currentPlan[0].toUpperCase()}${currentPlan.slice(1)}`}
                  Plan
                  <Badge variant={currentPlan === 'free' ? 'secondary' : 'default'}>
                    {currentPlan === 'free' ? 'Free' : subscription.status}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {subscription.limits.maxMonitors} monitors max · {subscription.limits.minInterval}s minimum interval ·{' '}
                  {subscription.limits.maxTeamMembers} team member{subscription.limits.maxTeamMembers === 1 ? '' : 's'}
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {subscription.usage.monitors}/{subscription.limits.maxMonitors}
                </p>
                <p className="text-sm text-muted-foreground">monitors used</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{
                  width: `${Math.min(100, (subscription.usage.monitors / Math.max(1, subscription.limits.maxMonitors)) * 100)}%`,
                }}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {currentPlan !== 'free' && (
                <Button variant="outline" onClick={manageBilling} disabled={action === 'portal'}>
                  {action === 'portal' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Manage Subscription
                </Button>
              )}
              <Button asChild variant="ghost">
                <Link href="/pricing">Compare Plans</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="mb-4 text-lg font-semibold">Available Plans</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            return (
              <Card
                key={plan.id}
                className={plan.popular ? 'border-primary ring-2 ring-primary/20' : ''}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {plan.name}
                      {plan.popular && <Badge>Popular</Badge>}
                    </CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature) => (
                      <p key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-green-500">✓</span>
                        {featureLabels[feature] || feature}
                      </p>
                    ))}
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-green-500">✓</span>
                      {plan.limits.maxMonitors} monitors
                    </p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-green-500">✓</span>
                      {plan.limits.minInterval}s check interval
                    </p>
                  </div>
                  {isCurrent ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : plan.id === 'free' ? (
                    <Button variant="outline" disabled className="w-full">
                      Downgrade via Stripe
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={action === 'checkout'}
                      onClick={() => upgrade(plan)}
                    >
                      {action === 'checkout' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Upgrade
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        {!billingEnabled && (
          <p className="mt-4 text-sm text-muted-foreground">
            Billing is not configured on this deployment yet.
          </p>
        )}
      </div>

      <div className="border-t pt-6">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}