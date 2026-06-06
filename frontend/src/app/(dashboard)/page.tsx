'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusDistributionChart } from '@/components/charts/status-distribution';
import { StatusBadge } from '@/components/monitors/status-badge';
import { formatDate } from '@/lib/utils';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  TrendingUp,
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
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Monitors',
      value: stats.totalMonitors,
      icon: Globe,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      title: 'Active Monitors',
      value: stats.activeMonitors,
      icon: Zap,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      title: 'Uptime',
      value: `${stats.uptimePercentage.toFixed(2)}%`,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Avg Response',
      value: `${stats.avgResponseTime}ms`,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      title: 'Total Checks',
      value: stats.totalChecks.toLocaleString(),
      icon: Activity,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      title: 'Alerts',
      value: stats.alertsTriggered,
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your monitoring infrastructure</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="mt-2 text-3xl font-bold">{card.value}</p>
                </div>
                <div className={`rounded-full p-3 ${card.bg}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusDistributionChart data={stats.statusDistribution} />
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentIncidents.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                No incidents in the last 30 days
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentIncidents.slice(0, 5).map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{incident.monitor.name}</p>
                      <p className="text-sm text-muted-foreground">{incident.message}</p>
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
      </div>

      {/* Monitors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monitor Uptime Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.uptimeByMonitor.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No monitors configured yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Monitor</th>
                    <th className="pb-3 font-medium">Uptime</th>
                    <th className="pb-3 font-medium">Checks</th>
                    <th className="pb-3 font-medium">Avg Response</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.uptimeByMonitor.map((monitor) => (
                    <tr key={monitor.id} className="border-b last:border-0">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{monitor.name}</p>
                          <p className="text-xs text-muted-foreground">{monitor.url}</p>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-bold ${
                            (monitor.up_count / monitor.total) * 100 >= 99
                              ? 'text-green-600'
                              : (monitor.up_count / monitor.total) * 100 >= 95
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        >
                          {monitor.total > 0
                            ? `${((monitor.up_count / monitor.total) * 100).toFixed(2)}%`
                            : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3">{monitor.total}</td>
                      <td className="py-3">
                        {monitor.avg_response_time
                          ? `${Math.round(monitor.avg_response_time)}ms`
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[350px]" />
        <Skeleton className="h-[350px]" />
      </div>
    </div>
  );
}
