'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  features: string[];
  popular: boolean;
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
      features: ['uptime_monitoring', 'email_alerts', '5_min_checks', 'basic_analytics'],
      popular: false,
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'For small teams and startups',
      price: 9,
      priceLabel: '$9/month',
      features: ['uptime_monitoring', 'email_alerts', '1_min_checks', 'status_pages', 'response_time_tracking', 'advanced_analytics'],
      popular: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For growing businesses',
      price: 29,
      priceLabel: '$29/month',
      features: ['all_features', 'webhook_alerts', 'slack_alerts', '30_sec_checks', 'advanced_analytics', 'api_access', 'custom_domains'],
      popular: false,
    },
  ];

  const visible = plans.length ? plans : fallbackPlans;

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-3 gap-8">
        {visible.map((plan) => (
          <div
            key={plan.name}
            className={`border rounded-xl p-6 hover:shadow-lg transition-shadow
              ${plan.popular ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}
          >
            <div className="flex items-start space-x-3 mb-4">
              {plan.popular && (
                <span className="bg-primary text-white text-xs font-medium px-2.5 py-0.5 rounded">
                  Most Popular
                </span>
              )}
              <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
            </div>

            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900">${plan.price}</p>
              <p className="text-sm text-gray-500">/month</p>
            </div>

            <ul className="space-y-4 text-gray-600">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{featureLabels[feature] || feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="/signup"
              className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm
                ${plan.popular ? 'bg-primary text-white hover:opacity-90' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {plan.id === 'free' ? 'Get Started Free' : 'Start Free, Upgrade Later'}
            </a>
          </div>
        ))}
      </div>

      <div className="text-center text-gray-500">
        <p>All prices are in USD. Free plan included with every account.</p>
      </div>
    </div>
  );
}