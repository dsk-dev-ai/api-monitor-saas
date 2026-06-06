import { notFound } from 'next/navigation';

interface StatusPageData {
  name: string;
  description?: string;
  brandColor: string;
  logo?: string;
  items: Array<{
    displayName?: string;
    monitor: {
      name: string;
      url: string;
      isActive: boolean;
      uptime: number;
      avgResponseTime: number;
      lastCheck: {
        status: string;
        responseTime: number;
        checkedAt: string;
      } | null;
    };
  }>;
}

async function getStatusPage(slug: string): Promise<StatusPageData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/status-pages/public/${slug}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function PublicStatusPage({ params }: { params: { slug: string } }) {
  const page = await getStatusPage(params.slug);

  if (!page) {
    notFound();
  }

  const overallStatus = page.items.every((item) => item.monitor.lastCheck?.status === 'up')
    ? 'All Systems Operational'
    : page.items.some((item) => item.monitor.lastCheck?.status === 'down')
    ? 'Some Systems Experiencing Issues'
    : 'Partial Outage';

  const statusColor = overallStatus === 'All Systems Operational' ? 'bg-green-500' : 'bg-amber-500';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="text-center">
          {page.logo && (
            <img src={page.logo} alt={page.name} className="mx-auto mb-4 h-16" />
          )}
          <h1 className="text-4xl font-bold">{page.name}</h1>
          {page.description && (
            <p className="mt-2 text-lg text-gray-600">{page.description}</p>
          )}
        </div>

        {/* Overall Status */}
        <div className={`mt-8 rounded-lg ${statusColor} p-6 text-center text-white shadow-lg`}>
          <h2 className="text-2xl font-semibold">{overallStatus}</h2>
          <p className="mt-1 opacity-90">Last updated: {new Date().toLocaleString()}</p>
        </div>

        {/* Monitors */}
        <div className="mt-8 space-y-4">
          {page.items.map((item) => {
            const monitor = item.monitor;
            const status = monitor.lastCheck?.status || 'unknown';
            const isUp = status === 'up';

            return (
              <div
                key={monitor.name}
                className="flex items-center justify-between rounded-lg border bg-white p-6 shadow-sm"
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.displayName || monitor.name}</h3>
                  <p className="text-sm text-gray-500">{monitor.url}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span>Uptime: {monitor.uptime.toFixed(2)}%</span>
                    <span>Response: {monitor.avgResponseTime}ms</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-4 w-4 rounded-full ${
                      isUp ? 'bg-green-500' : status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'
                    } ${!isUp && 'animate-pulse'}`}
                  />
                  <span
                    className={`font-medium capitalize ${
                      isUp ? 'text-green-600' : status === 'degraded' ? 'text-amber-600' : 'text-red-600'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-400">
          <p>Powered by API Monitor SaaS</p>
        </div>
      </div>
    </div>
  );
}
