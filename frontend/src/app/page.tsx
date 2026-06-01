import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Activity, Bell, Globe, Zap, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">API Monitor</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Monitor Your APIs
            <span className="text-primary"> Without the Hassle</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Real-time uptime monitoring, instant alerts, and beautiful dashboards.
            Keep your services running 24/7.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                <Zap className="h-4 w-4" />
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">Everything You Need</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Activity,
                title: 'Real-time Monitoring',
                desc: 'Check your endpoints every 30 seconds with detailed response metrics.',
              },
              {
                icon: Bell,
                title: 'Instant Alerts',
                desc: 'Get notified via email or Slack the moment something goes wrong.',
              },
              {
                icon: Globe,
                title: 'Status Pages',
                desc: 'Share public status pages with your customers for transparency.',
              },
              {
                icon: Zap,
                title: 'Fast Response',
                desc: 'Sub-second response time tracking with percentile analysis.',
              },
              {
                icon: Lock,
                title: 'Secure by Default',
                desc: 'SSL certificate monitoring and secure authentication out of the box.',
              },
              {
                icon: Shield,
                title: 'Uptime Reports',
                desc: 'Detailed uptime reports with historical data and trends.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <feature.icon className="h-10 w-10 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-3xl font-bold">Simple Pricing</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: ['5 monitors', '5-minute checks', 'Email alerts', 'Basic analytics'],
                cta: 'Get Started',
                popular: false,
              },
              {
                name: 'Basic',
                price: '$9',
                period: '/month',
                features: ['20 monitors', '1-minute checks', 'Status pages', 'Advanced analytics', 'Slack alerts'],
                cta: 'Start Trial',
                popular: true,
              },
              {
                name: 'Pro',
                price: '$29',
                period: '/month',
                features: ['100 monitors', '30-second checks', 'Custom domains', 'API access', 'Priority support'],
                cta: 'Start Trial',
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-6 ${
                  plan.popular
                    ? 'border-primary shadow-lg'
                    : 'shadow-sm'
                }`}
              >
                {plan.popular && (
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </span>
                )}
                <h3 className="mt-4 text-xl font-semibold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button className="mt-8 w-full" variant={plan.popular ? 'default' : 'outline'}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p> 2026 API Monitor SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
