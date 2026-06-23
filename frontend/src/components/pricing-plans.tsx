import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export function PricingPlans() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'per month',
      features: [
        '100 API calls per day',
        'Basic monitoring',
        'Email alerts',
        '7-day data retention',
        'Single user',
        'Community support'
      ],
      isPopular: false,
      ctaText: 'Get Started Free',
      href: '/signup?plan=free'
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      features: [
        '10,000 API calls per day',
        'Advanced monitoring',
        'Email & SMS alerts',
        '30-day data retention',
        'Up to 5 users',
        'Priority support',
        'Custom dashboards',
        'API access'
      ],
      isPopular: true,
      ctaText: 'Start Free Trial',
      href: '/signup?plan=pro'
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      features: [
        '100,000 API calls per day',
        'Enterprise monitoring',
        'Email, SMS & Webhook alerts',
        '90-day data retention',
        'Unlimited users',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'On-premise deployment'
      ],
      isPopular: false,
      ctaText: 'Contact Sales',
      href: '/contact'
    }
  ];

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`border rounded-xl p-6 hover:shadow-lg transition-shadow 
              ${plan.isPopular ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'}`}
          >
            <div className="flex items-start space-x-3 mb-4">
              {plan.isPopular && (
                <span className="bg-primary-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                  Most Popular
                </span>
              )}
              <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900">
                {plan.price}
              </p>
              <p className="text-sm text-gray-500">{plan.period}</p>
            </div>
            
            <ul className="space-y-4 text-gray-600">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <a 
              href={plan.href} 
              className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm 
                ${plan.isPopular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {plan.ctaText}
            </a>
          </div>
        ))}
      </div>
      
      <div className="text-center text-gray-500">
        <p>All prices are in USD. Annual billing available with 20% discount.</p>
      </div>
    </div>
  );
}