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
import { Reveal, Stagger, MotionDiv } from '@/components/motion/motion-primitives';
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
      <MotionDiv>
        <div className="flex items-center gap-4">
          <Link href="/monitors">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-semibold tracking-tight">{monitor.name}</h1>
              <StatusBadge status={status} />
            </div>
            <p className="mt-1 text-muted-foreground">{monitor.url}</p>
          </div>
        </div>
      </MotionDiv>

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="font-display text-2xl font-bold tracking-tight">{monitor.stats?.uptime?.toFixed(2) || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="font-display text-2xl font-bold tracking-tight">{monitor.stats?.avgResponseTime || 0}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Checks</p>
                <p className="font-display text-2xl font-bold tracking-tight">{monitor.stats?.totalChecks?.toLocaleString() || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Down Events</p>
                <p className="font-display text-2xl font-bold tracking-tight">{monitor.stats?.downChecks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Stagger>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
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
        </Reveal>
        <Reveal>
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
        </Reveal>
      </div>

      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle>Recent Checks</CardTitle>
          </CardHeader>
          <CardContent>
            {monitor.checks?.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No checks recorded yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 font-medium text-muted-foreground">Code</th>
                      <th className="pb-3 font-medium text-muted-foreground">Response Time</th>
                      <th className="pb-3 font-medium text-muted-foreground">Checked At</th>
                      <th className="pb-3 font-medium text-muted-foreground">Error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {monitor.checks.slice(0, 20).map((check: any) => (
                      <tr key={check.id} className="transition-colors hover:bg-accent/30">
                        <td className="py-3">
                          <StatusBadge status={check.status} />
                        </td>
                        <td className="py-3">{check.statusCode || '-'}</td>
                        <td className="py-3">{check.responseTime}ms</td>
                        <td className="py-3">{formatDate(check.checkedAt)}</td>
                        <td className="max-w-xs truncate py-3 text-destructive">{check.error || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </Reveal>

      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle>Alert History</CardTitle>
          </CardHeader>
          <CardContent>
            {monitor.alerts?.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No alerts yet</p>
            ) : (
              <div className="space-y-3">
                {monitor.alerts.map((alert: any) => (
                  <div key={alert.id} className="flex items-start gap-3 rounded-xl border border-border/60 bg-accent/30 p-3 transition-colors hover:bg-accent/50">
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
      </Reveal>
    </div>
  );
}

function MonitorDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64 rounded-lg" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[350px] rounded-2xl" />
        <Skeleton className="h-[350px] rounded-2xl" />
      </div>
    </div>
  );
}
