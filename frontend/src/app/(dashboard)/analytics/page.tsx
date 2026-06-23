'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalytics } from '@/hooks/use-analytics';
import { StatusDistributionChart } from '@/components/charts/status-distribution';

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
      <Skeleton className="h-8 w-48" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-28"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[350px]" />
        <Skeleton className="h-[350px]" />
      </div>

      <Skeleton className="h-[400px]" />
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
  bg,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-3 ${bg}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold">
              {value}
            </p>
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
return ( <div className="flex h-[400px] items-center justify-center"> <div className="text-center"> <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-destructive" /> <p className="text-destructive">{error}</p> </div> </div>
);
}

if (!stats) {
return ( <div className="flex h-[400px] items-center justify-center"> <p className="text-muted-foreground">
Analytics data unavailable </p> </div>
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
          (monitor.up_count / monitor.total) *
            10000
        ) / 100
      : 0,

  checks: monitor?.total ?? 0,

  responseTime: Math.round(
    monitor?.avg_response_time ?? 0
  ),
}));

return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Detailed performance metrics and trends
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <AnalyticsCard
      title="Avg Uptime"
      value={`${(
        stats.uptimePercentage ?? 0
      ).toFixed(2)}%`}
      icon={<Activity className="h-5 w-5 text-blue-500" />}
      bg="bg-blue-50"
    />

    <AnalyticsCard
      title="Avg Response"
      value={`${stats.avgResponseTime ?? 0}ms`}
      icon={<Clock className="h-5 w-5 text-green-500" />}
      bg="bg-green-50"
    />

    <AnalyticsCard
      title="Total Checks"
      value={(
        stats.totalChecks ?? 0
      ).toLocaleString()}
      icon={<TrendingUp className="h-5 w-5 text-amber-500" />}
      bg="bg-amber-50"
    />

    <AnalyticsCard
      title="Incidents"
      value={`${stats.alertsTriggered ?? 0}`}
      icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
      bg="bg-red-50"
    />
  </div>

  <div className="grid gap-6 lg:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>
          Status Distribution
        </CardTitle>
      </CardHeader>

      <CardContent>
        <StatusDistributionChart
          data={statusDistribution}
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>
          Avg Response Time by Monitor
        </CardTitle>
      </CardHeader>

      <CardContent>
        {alertData.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={alertData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="responseTime"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>
        Uptime by Monitor
      </CardTitle>
    </CardHeader>

    <CardContent>
      {alertData.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="h-[400px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={alertData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
              />

              <YAxis domain={[0, 100]} />

              <Tooltip />

              <Bar
                dataKey="uptime"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </CardContent>
  </Card>
</div>

);
}

