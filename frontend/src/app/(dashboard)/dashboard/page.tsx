'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusDistributionChart } from '@/components/charts/status-distribution';
import { StatusBadge } from '@/components/monitors/status-badge';
import { formatDate } from '@/lib/utils';
import { Reveal, Stagger, MotionDiv } from '@/components/motion/motion-primitives';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Zap,
} from 'lucide-react';

export default function DashboardPage() {
  const { stats, isLoading, error } = useAnalytics(30);

  if (isLoading) {
    return <DashboardSkeleton />;
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
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  const uptimeByMonitor = stats.uptimeByMonitor ?? [];
  const recentIncidents = stats.recentIncidents ?? [];
  const statusDistribution = stats.statusDistribution ?? {
    up: 0,
    down: 0,
    degraded: 0,
  };

  const statCards = [
    {
      title: 'Total Monitors',
      value: stats.totalMonitors ?? 0,
      icon: Globe,
      accent: 'bg-primary/15 text-primary',
    },
    {
      title: 'Active Monitors',
      value: stats.activeMonitors ?? 0,
      icon: Zap,
      accent: 'bg-emerald-500/15 text-emerald-400',
    },
    {
      title: 'Uptime',
      value: `${(stats.uptimePercentage ?? 0).toFixed(2)}%`,
      icon: CheckCircle,
      accent: 'bg-emerald-500/15 text-emerald-400',
    },
    {
      title: 'Avg Response',
      value: `${stats.avgResponseTime ?? 0}ms`,
      icon: Clock,
      accent: 'bg-amber-500/15 text-amber-400',
    },
    {
      title: 'Total Checks',
      value: (stats.totalChecks ?? 0).toLocaleString(),
      icon: Activity,
      accent: 'bg-primary/15 text-primary',
    },
    {
      title: 'Alerts',
      value: stats.alertsTriggered ?? 0,
      icon: AlertTriangle,
      accent: 'bg-destructive/15 text-destructive',
    },
  ];

  return (
    <div className="space-y-6">
      <MotionDiv>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your monitoring infrastructure
        </p>
      </MotionDiv>

      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="mt-2 font-display text-3xl font-bold tracking-tight">
                    {card.value}
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.accent}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </Stagger>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution (30 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusDistributionChart data={statusDistribution} />
            </CardContent>
          </Card>
        </Reveal>

        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              {recentIncidents.length === 0 ? (
                <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                  <CheckCircle className="mr-2 h-5 w-5 text-emerald-400" />
                  No incidents in the last 30 days
                </div>
              ) : (
                <div className="space-y-3">
                  {recentIncidents.slice(0, 5).map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-start gap-3 rounded-xl border border-border/60 bg-accent/30 p-3 transition-colors hover:bg-accent/50"
                    >
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">
                          {incident.monitor?.name ?? 'Unknown Monitor'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {incident.message}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(incident.sentAt)}
                        </p>
                      </div>
                      <StatusBadge status="triggered" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Reveal>
      </div>

      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle>Monitor Uptime Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {uptimeByMonitor.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No monitors configured yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Monitor</th>
                      <th className="pb-3 font-medium text-muted-foreground">Uptime</th>
                      <th className="pb-3 font-medium text-muted-foreground">Checks</th>
                      <th className="pb-3 font-medium text-muted-foreground">Avg Response</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {uptimeByMonitor.map((monitor) => {
                      const uptime =
                        monitor.total > 0
                          ? (monitor.up_count / monitor.total) * 100
                          : 0;

                      return (
                        <tr
                          key={monitor.id}
                          className="transition-colors hover:bg-accent/30"
                        >
                          <td className="py-3">
                            <p className="font-medium">{monitor.name}</p>
                            <p className="text-xs text-muted-foreground">{monitor.url}</p>
                          </td>
                          <td className="py-3">
                            {monitor.total > 0 ? (
                              <Badge
                                variant={uptime >= 99 ? 'success' : uptime >= 95 ? 'warning' : 'error'}
                                dot
                              >
                                {uptime.toFixed(2)}%
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </td>
                          <td className="py-3">{monitor.total}</td>
                          <td className="py-3">
                            {monitor.avg_response_time
                              ? `${Math.round(monitor.avg_response_time)}ms`
                              : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48 rounded-lg" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[350px] rounded-2xl" />
        <Skeleton className="h-[350px] rounded-2xl" />
      </div>
    </div>
  );
}
