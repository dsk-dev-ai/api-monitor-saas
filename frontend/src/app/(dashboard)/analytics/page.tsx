'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalytics } from '@/hooks/use-analytics';
import { StatusDistributionChart } from '@/components/charts/status-distribution';
import { Reveal, Stagger, MotionDiv } from '@/components/motion/motion-primitives';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import {
  Activity,
  TrendingUp,
  AlertTriangle,
  Clock,
} from 'lucide-react';

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48 rounded-lg" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[350px] rounded-2xl" />
        <Skeleton className="h-[350px] rounded-2xl" />
      </div>
      <Skeleton className="h-[400px] rounded-2xl" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[250px] items-center justify-center text-muted-foreground">
      No analytics data available
    </div>
  );
}

function AnalyticsCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="font-display text-2xl font-bold tracking-tight">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { stats, isLoading, error } = useAnalytics(30);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Analytics data unavailable</p>
      </div>
    );
  }

  const uptimeByMonitor = Array.isArray(stats.uptimeByMonitor)
    ? stats.uptimeByMonitor
    : [];

  const statusDistribution = stats.statusDistribution ?? {
    up: 0,
    down: 0,
    degraded: 0,
  };

  const alertData = uptimeByMonitor.map((monitor) => ({
    name:
      monitor?.name?.length > 20
        ? monitor.name.substring(0, 20) + '...'
        : monitor?.name ?? 'Unknown',
    uptime:
      monitor?.total > 0
        ? Math.round(
            (monitor.up_count / monitor.total) * 10000
          ) / 100
        : 0,
    checks: monitor?.total ?? 0,
    responseTime: Math.round(
      monitor?.avg_response_time ?? 0
    ),
  }));

  return (
    <div className="space-y-6">
      <MotionDiv>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          Detailed performance metrics and trends
        </p>
      </MotionDiv>

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Avg Uptime"
          value={`${(stats.uptimePercentage ?? 0).toFixed(2)}%`}
          icon={<Activity className="h-5 w-5 text-primary" />}
          accent="bg-primary/15 text-primary"
        />
        <AnalyticsCard
          title="Avg Response"
          value={`${stats.avgResponseTime ?? 0}ms`}
          icon={<Clock className="h-5 w-5 text-emerald-400" />}
          accent="bg-emerald-500/15 text-emerald-400"
        />
        <AnalyticsCard
          title="Total Checks"
          value={(stats.totalChecks ?? 0).toLocaleString()}
          icon={<TrendingUp className="h-5 w-5 text-amber-400" />}
          accent="bg-amber-500/15 text-amber-400"
        />
        <AnalyticsCard
          title="Incidents"
          value={`${stats.alertsTriggered ?? 0}`}
          icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
          accent="bg-destructive/15 text-destructive"
        />
      </Stagger>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusDistributionChart data={statusDistribution} />
            </CardContent>
          </Card>
        </Reveal>

        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle>Avg Response Time by Monitor</CardTitle>
            </CardHeader>
            <CardContent>
              {alertData.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={alertData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.4)" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        stroke="hsl(var(--muted-foreground) / 0.6)"
                      />
                      <YAxis stroke="hsl(var(--muted-foreground) / 0.6)" />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.75rem',
                          boxShadow: '0 8px 30px -8px rgba(0,0,0,0.4)',
                        }}
                      />
                      <Bar dataKey="responseTime" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </Reveal>
      </div>

      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle>Uptime by Monitor</CardTitle>
          </CardHeader>
          <CardContent>
            {alertData.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alertData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.4)" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      stroke="hsl(var(--muted-foreground) / 0.6)"
                    />
                    <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground) / 0.6)" />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.75rem',
                        boxShadow: '0 8px 30px -8px rgba(0,0,0,0.4)',
                      }}
                    />
                    <Bar dataKey="uptime" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
