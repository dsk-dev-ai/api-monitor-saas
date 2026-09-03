'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  features: string[];
  popular: boolean;
  planned?: boolean;
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

export function PricingPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/billing/plans');
        setPlans(data.plans?.length ? data.plans : null);
      } catch {
        setPlans([]);
      }
    };
    load();
  }, []);

  const fallbackPlans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for personal projects',
      price: 0,
      priceLabel: 'Free forever',
      features: ['uptime_monitoring', 'email_alerts', '5_min_checks', 'basic_analytics', 'status_pages'],
      popular: true,
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'For small teams and startups',
      price: 9,
      priceLabel: '$9/month (planned)',
      features: ['uptime_monitoring', 'email_alerts', '1_min_checks', 'response_time_tracking', 'advanced_analytics'],
      popular: false,
      planned: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For growing businesses',
      price: 29,
      priceLabel: '$29/month (planned)',
      features: ['uptime_monitoring', 'email_alerts', '30_sec_checks', 'advanced_analytics', 'webhook_alerts', 'slack_alerts', 'custom_domains'],
      popular: false,
      planned: true,
    },
  ];

  const visible = plans.length ? plans : fallbackPlans;

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-3 gap-8">
        {visible.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
              plan.popular
                ? 'border-primary/40 bg-gradient-to-b from-primary/10 to-card/70 glow-soft'
                : 'border-border/60 bg-card/70'
            )}
          >
            <div className="mb-4 flex items-center gap-3">
              {plan.planned && <Badge variant="warning">Planned</Badge>}
              {plan.popular && !plan.planned && (
                <Badge>Most Popular</Badge>
              )}
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                {plan.name}
              </h2>
            </div>

            <div className="mb-6">
              <p className="font-display text-4xl font-bold text-foreground">
                <span className="align-top text-2xl text-muted-foreground">$</span>
                {plan.price}
              </p>
              <p className="text-sm text-muted-foreground">
                {plan.planned ? 'planned / month' : '/month'}
              </p>
            </div>

            <ul className="space-y-3 text-muted-foreground">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500 dark:text-emerald-400" />
                  <span>{featureLabels[feature] || feature}</span>
                </li>
              ))}
            </ul>

            {plan.planned ? (
              <span className="mt-6 inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg border border-border bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground">
                Coming soon
              </span>
            ) : (
              <a
                href="/signup"
                className={cn(
                  'mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                  plan.popular
                    ? 'bg-gradient-brand text-white hover:opacity-90 hover:-translate-y-0.5'
                    : 'border border-border text-foreground hover:bg-accent'
                )}
              >
                Get Started Free
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Pricing plans are available on the free tier today; paid tiers are planned. All prices in USD.</p>
      </div>
    </div>
  );
}