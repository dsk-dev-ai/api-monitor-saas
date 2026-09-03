'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  Shield,
  Clock,
  Zap,
  Layout,
  TrendingUp,
  Users,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const activeFeatures = [
  {
    title: 'HTTP Monitoring',
    desc: 'Monitor your HTTP API endpoints around the clock with checks run from a background worker. Get email alerts when a check fails or a monitor changes status.',
    icon: Activity,
    bullets: [
      'Configurable check intervals',
      'Expected status & keyword validation',
      'Pause or resume monitors anytime',
    ],
  },
  {
    title: 'Performance Analytics',
    desc: 'Track uptime and response-time metrics for your APIs with historical trends on the analytics dashboard.',
    icon: TrendingUp,
    bullets: [
      'Response-time tracking',
      'Uptime percentage per monitor',
      'Historical trends',
    ],
  },
  {
    title: 'Uptime Tracking',
    desc: 'See uptime for each monitor over time and review historical uptime data on the analytics dashboard.',
    icon: Clock,
    bullets: ['Per-monitor uptime percentage', 'Historical uptime data', 'Alert history'],
  },
  {
    title: 'Error Detection & Diagnosis',
    desc: 'Detect failures with expected status codes and optional response keyword validation, and review triggered alerts in the dashboard.',
    icon: Zap,
    bullets: [
      'HTTP status code checks',
      'Response keyword validation',
      'Alert on down, degraded, or recovery',
    ],
  },
  {
    title: 'Email Alerting',
    desc: 'Receive email alerts when a monitor goes down, is degraded, or recovers, and review the full alert history in the dashboard.',
    icon: ArrowUpRight,
    bullets: [
      'Alerts on down, degraded, and recovery',
      'Triggered & resolved states',
      'Acknowledge alerts from the dashboard',
    ],
  },
];

const plannedFeatures = [
  {
    title: 'Security Monitoring',
    desc: 'SSL certificate checks and security monitoring are on our roadmap.',
    icon: Shield,
  },
  {
    title: 'Customizable Dashboards',
    desc: 'Drag-and-drop customizable dashboards are on our roadmap. Today, the analytics dashboard shows uptime and response-time metrics.',
    icon: Layout,
  },
  {
    title: 'Team Collaboration',
    desc: 'Full team collaboration features are on our roadmap.',
    icon: Users,
  },
  {
    title: 'API Documentation Integration',
    desc: 'Response validation against OpenAPI schemas and API documentation integration are on our roadmap.',
    icon: Settings,
  },
];

export default function FeaturesPage() {
  return (
    <div className="relative overflow-hidden">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 text-center sm:px-8 sm:pt-28 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex justify-center"
          >
            <Badge variant="outline" className="gap-2 px-3 py-1 text-sm">
              <Activity className="h-3.5 w-3.5 text-primary" />
              Features
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
          >
            Powerful API Monitoring{' '}
            <span className="text-gradient">Features</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Comprehensive API monitoring solution designed for developers and
            teams who demand reliability and performance from their APIs.
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12"
      >
        <div className="mb-16 text-center">
          <motion.span
            variants={item}
            className="text-sm font-semibold uppercase tracking-widest text-primary"
          >
            Available Now
          </motion.span>
          <motion.h2
            variants={item}
            className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Core Capabilities
          </motion.h2>
          <motion.p
            variants={item}
            className="mx-auto mt-4 max-w-2xl text-muted-foreground"
          >
            Everything you need to monitor and analyze your APIs.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card hover:glow-soft"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-md shadow-primary/25 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {feature.desc}
              </p>
              <ul className="space-y-1.5">
                {feature.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="relative py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-16 text-center">
            <motion.span
              variants={item}
              className="text-sm font-semibold uppercase tracking-widest text-primary"
            >
              On Our Roadmap
            </motion.span>
            <motion.h2
              variants={item}
              className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Coming Soon
            </motion.h2>
            <motion.p
              variants={item}
              className="mx-auto mt-4 max-w-2xl text-muted-foreground"
            >
              Features we are actively building for future releases.
            </motion.p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {plannedFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/60"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/50 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <Badge variant="secondary">Planned</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl px-6 py-20 sm:px-8 lg:px-12"
      >
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-12 text-center glow-brand">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/30 blur-[100px]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to monitor your APIs with confidence?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Start monitoring your APIs today and gain the insights you need to
              deliver exceptional user experiences.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="group w-full sm:w-auto">
                <Link href="/pricing">
                  View Pricing
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
