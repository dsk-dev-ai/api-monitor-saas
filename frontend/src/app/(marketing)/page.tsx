'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BellRing,
  Gauge,
  LineChart,
  RadioTower,
  ShieldCheck,
  Share2,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const featureGroups = [
  {
    title: 'HTTP Monitoring',
    desc: 'Regular HTTP health checks on your API endpoints, with email alerts when issues are detected.',
    icon: RadioTower,
  },
  {
    title: 'Intelligent Alerting',
    desc: 'Email alerts whenever a monitor changes status, so your team learns about outages as they happen.',
    icon: BellRing,
  },
  {
    title: 'Performance Analytics',
    desc: 'Uptime and response-time analytics with historical trends on your dashboard.',
    icon: Gauge,
  },
  {
    title: 'Uptime Tracking',
    desc: 'Track uptime over time and see historical uptime data for every monitor.',
    icon: LineChart,
  },
  {
    title: 'Flexible HTTP Checks',
    desc: 'Configure each check with its HTTP method, expected status, and optional response keyword validation.',
    icon: Zap,
  },
  {
    title: 'Public Status Pages',
    desc: 'Share a public status page per monitor so your users can see uptime and response-time history.',
    icon: Share2,
  },
];

const steps = [
  {
    num: '01',
    title: 'Add Your Endpoints',
    desc: 'Add your API endpoints with URL, method, headers, and expected responses.',
  },
  {
    num: '02',
    title: 'Set Monitoring Rules',
    desc: 'Configure the check interval and which email addresses to notify on status changes.',
  },
  {
    num: '03',
    title: 'Get Alerts & Insights',
    desc: 'Receive email alerts and access detailed analytics when issues are detected.',
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function MarketingHomePage() {
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
              API &amp; Website Uptime Monitoring
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
          >
            Monitor Your APIs{' '}
            <span className="text-gradient">Around the Clock</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Get email alerts when your APIs go down or return unexpected
            responses. Track uptime and response times with a beautiful
            analytics dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="group w-full sm:w-auto">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link href="/features">See Features</Link>
            </Button>
          </motion.div>
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
            Features
          </motion.span>
          <motion.h2
            variants={item}
            className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Powerful Features for API Excellence
          </motion.h2>
          <motion.p variants={item} className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Everything you need to monitor and analyze your APIs.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureGroups.map((feature) => (
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
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.desc}
              </p>
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
              How It Works
            </motion.span>
            <motion.h2
              variants={item}
              className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Simple setup, powerful monitoring
            </motion.h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={item}
                className="relative text-center"
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 font-display text-lg font-bold text-primary">
                  {step.num}
                </div>
                <h3 className="mb-3 font-display text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mx-auto max-w-xs text-sm text-muted-foreground">
                  {step.desc}
                </p>
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
            <ShieldCheck className="mx-auto mb-6 h-10 w-10 text-primary" />
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Monitor Your APIs?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Get started free and never miss an API issue again.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="xl">
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
