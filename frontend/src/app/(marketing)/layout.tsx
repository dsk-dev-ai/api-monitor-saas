import type { Metadata } from 'next';

import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

const title = 'API & Website Uptime Monitoring';
const description =
  'Self-hostable API & website uptime monitoring: periodic HTTP health checks, uptime and response-time analytics, and email alerts when a service goes down or recovers.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: `${title} · ${SITE_NAME}`,
    description,
    images: [{ url: '/og.svg', width: 1280, height: 640, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} · ${SITE_NAME}`,
    description,
    images: ['/og.svg'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
