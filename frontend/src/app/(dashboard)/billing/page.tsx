'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function BillingPage() {
  const router = useRouter();

  const handleUpgrade = async () => {
    // In a real app, you would redirect to your billing portal
    // For now, we'll just show a message
    if (typeof window !== 'undefined') {
      window.location.href = '/pricing';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
          <p className="text-muted-foreground">
            Choose the perfect plan for your API monitoring needs
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Free Plan */}
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Free</h3>
          <p className="text-sm text-muted-foreground mb-4">
            $0/month
          </p>
          <ul className="space-y-2 text-sm">
            <li>10 monitors</li>
            <li>Basic email alerts</li>
            <li>Response time tracking</li>
            <li>7-day data retention</li>
          </ul>
          <Button 
            variant="outline"
            onClick={handleUpgrade}
            className="w-full"
          >
            Upgrade
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Pro</h3>
          <p className="text-sm text-muted-foreground mb-4">
            $29/month
          </p>
          <ul className="space-y-2 text-sm">
            <li>Unlimited monitors</li>
            <li>Advanced alerting (SMS, webhook, Slack)</li>
            <li>Performance analytics & trends</li>
            <li>90-day data retention</li>
            <li>API access</li>
            <li>Team collaboration</li>
          </ul>
          <Button 
            onClick={handleUpgrade}
            className="w-full"
          >
            Choose Plan
          </Button>
        </div>

        {/* Enterprise Plan */}
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Enterprise</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Custom pricing
          </p>
          <ul className="space-y-2 text-sm">
            <li>Everything in Pro</li>
            <li>SSO & SCIM provisioning</li>
            <li>Custom SLAs</li>
            <li>Dedicated account manager</li>
            <li>On-premise deployment options</li>
            <li>Priority support</li>
          </ul>
          <Button 
            variant="outline"
            onClick={handleUpgrade}
            className="w-full"
          >
            Contact Sales
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}