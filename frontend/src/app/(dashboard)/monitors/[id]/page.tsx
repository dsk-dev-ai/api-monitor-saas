'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/monitors/status-badge';
import { UptimeChart } from '@/components/charts/uptime-chart';
import { ResponseTimeChart } from '@/components/charts/response-time-chart';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function MonitorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [monitor, setMonitor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMonitor = async () => {
      try {
        const { data } = await api.get(`/monitors/${id}`);
        setMonitor(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load monitor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonitor();
    const interval = setInterval(fetchMonitor, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (isLoading) return <MonitorDetailSkeleton />;
  if (error) return <div className="text-destructive">{error}</div>;
  if (!monitor) return null;

  const latestCheck =
    Array.isArray(monitor.checks) && monitor.checks.length > 0
      ? monitor.checks[0]
      : null;

  const status =
    monitor.isPaused
      ? 'paused'
      : latestCheck?.status || 'unknown';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/monitors">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{monitor.name}</h1>
            <StatusBadge status={status} />
          </div>
          <p className="text-muted-foreground">{monitor.url}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-50 p-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold">{monitor.stats?.uptime?.toFixed(2) || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-50 p-3">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{monitor.stats?.avgResponseTime || 0}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-50 p-3">
                <Activity className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Checks</p>
                <p className="text-2xl font-bold">{monitor.stats?.totalChecks?.toLocaleString() || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-50 p-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Down Events</p>
                <p className="text-2xl font-bold">{monitor.stats?.downChecks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            {monitor.dailyStats?.length > 0 ? (
              <UptimeChart
                data={monitor.dailyStats.map((d: any) => ({
                  date: d.date,
                  uptime: d.total > 0 ? (d.up_count / d.total) * 100 : 100,
                  total: d.total,
                  up_count: d.up_count,
                }))}
              />
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No data available yet
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            {monitor.dailyStats?.length > 0 ? (
              <ResponseTimeChart
                data={monitor.dailyStats.map((d: any) => ({
                  date: d.date,
                  avg_response_time: d.avg_response_time || 0,
                  max_response_time: d.max_response_time || 0,
                  min_response_time: d.min_response_time || 0,
                }))}
              />
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No data available yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Checks</CardTitle>
        </CardHeader>
        <CardContent>
          {monitor.checks?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No checks recorded yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Code</th>
                    <th className="pb-3 font-medium">Response Time</th>
                    <th className="pb-3 font-medium">Checked At</th>
                    <th className="pb-3 font-medium">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {monitor.checks.slice(0, 20).map((check: any) => (
                    <tr key={check.id} className="border-b last:border-0">
                      <td className="py-3">
                        <StatusBadge status={check.status} />
                      </td>
                      <td className="py-3">{check.statusCode || '-'}</td>
                      <td className="py-3">{check.responseTime}ms</td>
                      <td className="py-3">{formatDate(check.checkedAt)}</td>
                      <td className="py-3 text-red-500 max-w-xs truncate">{check.error || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alert History</CardTitle>
        </CardHeader>
        <CardContent>
          {monitor.alerts?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No alerts yet</p>
          ) : (
            <div className="space-y-3">
              {monitor.alerts.map((alert: any) => (
                <div key={alert.id} className="flex items-start gap-3 rounded-lg border p-3">
                  <StatusBadge status={alert.status} />
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(alert.sentAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MonitorDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[350px]" />
        <Skeleton className="h-[350px]" />
      </div>
    </div>
  );
}
