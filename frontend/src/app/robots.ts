import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/settings', '/team', '/workspaces', '/billing'],
    },
    sitemap: 'https://api-monitor-saas-frontend.vercel.app/sitemap.xml',
  };
}
