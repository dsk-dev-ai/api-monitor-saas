import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Monitor - Real-time API Monitoring & Alerting',
  description:
    'Monitor your APIs in real-time with instant alerts, performance analytics, and uptime tracking. Never miss an API issue again.',
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}