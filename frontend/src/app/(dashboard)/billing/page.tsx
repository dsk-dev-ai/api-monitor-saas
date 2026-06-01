'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Loader2, CreditCard, Zap, Crown } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  features: string[];
  popular: boolean;
  limits: {
    maxMonitors: number;
    minInterval: number;
  };
}

interface Subscription {
  plan: string;
  status: string;
  currentPeriodEnd?: string;
}

export default function BillingPage() {
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setMessage('Payment successful! Your subscription has been updated.');
    } else if (searchParams.get('canceled') === 'true') {
      setMessage('Payment canceled. Your subscription remains unchanged.');
    }

    const fetchData = async () => {
      try {
        const [plansRes, subRes] = await Promise.all([
          api.get('/billing/plans'),
          api.get('/billing/subscription'),
        ]);
        setPlans(plansRes.data.plans);
        setSubscription(subRes.data);
      } catch (error) {
        console.error('Failed to fetch billing data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleCheckout = async (planId: string, priceId?: string) => {
    if (!priceId) return;
    setCheckoutLoading(planId);

    try {
      const { data } = await api.post('/billing/checkout', {
        priceId,
        plan: planId,
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout failed', error);
      setCheckoutLoading(null);
    }
  };

  const handlePortal = async () => {
    try {
      const { data } = await api.post('/billing/portal');
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal failed', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  const currentPlan = subscription?.plan || 'free';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      {message && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
          {message}
        </div>
      )}

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold capitalize">{currentPlan}</h3>
                <Badge variant={subscription?.status === 'active' ? 'default' : 'secondary'}>
                  {subscription?.status || 'free'}
                </Badge>
              </div>
              {subscription?.currentPeriodEnd && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            {currentPlan !== 'free' && (
              <Button variant="outline" onClick={handlePortal}>
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Billing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const Icon = plan.id === 'pro' ? Crown : plan.id === 'basic' ? Zap : CreditCard;

          return (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? 'border-primary shadow-lg' : ''
              } ${isCurrent ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              {isCurrent && (
                <Badge variant="outline" className="absolute right-4 top-4">
                  Current Plan
                </Badge>
              )}
              <CardHeader className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">{plan.priceLabel.replace('$' + plan.price, '')}</span>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="capitalize">{feature.replace(/_/g, ' ')}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 text-xs text-muted-foreground">
                  <p>Up to {plan.limits.maxMonitors} monitors</p>
                  <p>Minimum {plan.limits.minInterval}s check interval</p>
                </div>

                <Button
                  className="mt-6 w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  disabled={isCurrent || !!checkoutLoading}
                  onClick={() => handleCheckout(plan.id, process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC)}
                >
                  {checkoutLoading === plan.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : currentPlan !== 'free' && plan.id === 'free' ? (
                    'Downgrade'
                  ) : (
                    'Upgrade'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
