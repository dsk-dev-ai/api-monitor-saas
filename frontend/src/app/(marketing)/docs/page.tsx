'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Mail } from 'lucide-react';

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

export default function DocsPage() {
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

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 text-center sm:px-8 sm:pt-28 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex justify-center"
          >
            <Badge variant="outline" className="gap-2 px-3 py-1 text-sm">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Documentation
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
          >
            API Monitor <span className="text-gradient">Documentation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Everything you need to set up monitors, configure alerts, and
            understand your API health.
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="relative mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:px-12"
      >
        <div className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_50%_50%_at_50%_20%,black,transparent)]" />
        <div className="relative space-y-16">
          <motion.div variants={item}>
            <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
              Getting Started
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Welcome to API Monitor - a comprehensive SaaS platform for
                monitoring your APIs&apos; health, performance, and reliability.
                This documentation will help you get started quickly and make the
                most of our platform.
              </p>

              <h3 className="font-display text-lg font-semibold text-foreground">
                What is API Monitor?
              </h3>
              <p>
                API Monitor is a monitoring solution for developers and DevOps
                teams who need to ensure their APIs are performing optimally. Our
                platform provides insights into API availability, uptime, and
                response times.
              </p>

              <h3 className="font-display text-lg font-semibold text-foreground">
                Key Features
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">HTTP Monitoring:</strong>{' '}
                    Periodic health checks on your API endpoints
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">Email Alerting:</strong>{' '}
                    Get notified via email when a monitor changes status
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">
                      Performance Analytics:
                    </strong>{' '}
                    Uptime and response-time metrics with historical trends
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">Uptime Tracking:</strong>{' '}
                    Review uptime over time for every monitor
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong className="text-foreground">
                      Public Status Pages:
                    </strong>{' '}
                    Share a public status page per monitor with your users
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
              Setup Guide
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                  1. Creating Your First Monitor
                </h3>
                <ol className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/50 text-xs font-medium text-foreground">
                      1
                    </span>
                    <span>
                      Navigate to the <strong className="text-foreground">Monitors</strong>{' '}
                      section in your dashboard
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/50 text-xs font-medium text-foreground">
                      2
                    </span>
                    <span>
                      Click the{' '}
                      <strong className="text-foreground">+ New Monitor</strong>{' '}
                      button
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/50 text-xs font-medium text-foreground">
                      3
                    </span>
                    <span>Enter your API endpoint URL</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/50 text-xs font-medium text-foreground">
                      4
                    </span>
                    <span>
                      Select the HTTP method (GET, POST, PUT, DELETE, etc.)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/50 text-xs font-medium text-foreground">
                      5
                    </span>
                    <span>Configure monitoring frequency</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/50 text-xs font-medium text-foreground">
                      6
                    </span>
                    <span>
                      Set alert conditions (expected status code, keyword
                      validation, alert on down, degraded, or recovery)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/50 text-xs font-medium text-foreground">
                      7
                    </span>
                    <span>Choose whether to receive email alerts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/50 text-xs font-medium text-foreground">
                      8
                    </span>
                    <span>Save your monitor</span>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                  2. Understanding Monitor Types
                </h3>
                <div className="rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
                  <h4 className="mb-1 font-display font-medium text-foreground">
                    HTTP/HTTPS Monitors
                  </h4>
                  <p>
                    Monitors run HTTP checks against your API endpoint using a
                    configured method (GET, POST, PUT, DELETE, etc.) and can
                    validate the expected status code and an optional response
                    keyword.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
              Advanced Features
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                  Alert Conditions
                </h3>
                <p>Each monitor lets you define when it should alert:</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>
                      Expected status code (alert when the response does not
                      match)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>
                      Response keyword validation (check that a specific string
                      appears in the response)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>Alert on down, degraded, and recovery</span>
                  </li>
                </ul>
                <p className="mt-3">
                  When a condition is met or cleared, an email alert is sent and
                  recorded in the Alerts section of the dashboard.
                </p>
              </div>

              <div>
                <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                  Notifications
                </h3>
                <p>
                  Alerts are delivered by email (via Resend). SMS, Slack, and
                  other notification channels are planned but not yet available.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
              Troubleshooting
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                  Common Issues
                </h3>
                <div className="space-y-6">
                  <div className="rounded-xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm">
                    <h4 className="mb-2 font-display font-medium text-foreground">
                      Monitor Shows as Down But API Works
                    </h4>
                    <p className="mb-2">This can happen due to:</p>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>
                          The response returned an unexpected status code
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>
                          The expected keyword was not found in the response body
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>
                          A network or DNS issue prevented the check from
                          completing
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>A request timeout occurred</span>
                      </li>
                    </ul>
                    <p className="mt-3">
                      <strong className="text-foreground">Solution:</strong>{' '}
                      Review the alert details and adjust the monitor&apos;s
                      expected status code, keyword, or timeout settings.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm">
                    <h4 className="mb-2 font-display font-medium text-foreground">
                      Receiving Too Many Alerts
                    </h4>
                    <p className="mb-2">To reduce alert noise:</p>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>
                          Align the expected status code with what your API
                          actually returns
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Only enable the alert conditions you need</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>
                          Pause the monitor if you expect a temporary outage
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                  Getting Help
                </h3>
                <p>
                  If you need additional assistance, contact us at{' '}
                  <a
                    href="mailto:support@api-monitor.com"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    support@api-monitor.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm">
                <h3 className="mb-2 font-display font-semibold text-foreground">
                  How often can I monitor my APIs?
                </h3>
                <p className="text-muted-foreground">
                  Checks are run in the background by a worker on a schedule you
                  configure per monitor.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm">
                <h3 className="mb-2 font-display font-semibold text-foreground">
                  Where are checks run from?
                </h3>
                <p className="text-muted-foreground">
                  Checks are made from our hosted background worker, so your
                  endpoint must be reachable over the public internet.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm">
                <h3 className="mb-2 font-display font-semibold text-foreground">
                  Is my data secure and private?
                </h3>
                <p className="text-muted-foreground">
                  Data is stored in a Supabase-managed PostgreSQL database, and
                  accounts are secured with Supabase authentication.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm">
                <h3 className="mb-2 font-display font-semibold text-foreground">
                  Can I monitor internal/private APIs?
                </h3>
                <p className="text-muted-foreground">
                  Because checks run from our hosted worker, the endpoint must
                  be reachable over the public internet. For internal services,
                  expose a health check endpoint publicly or route traffic
                  through a tunnel.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
