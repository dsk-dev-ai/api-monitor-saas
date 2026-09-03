'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/monitors/status-badge';
import { formatDate } from '@/lib/utils';
import { Reveal, Stagger, MotionDiv } from '@/components/motion/motion-primitives';
import { Bell, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchAlerts = useCallback(async () => {
    try {
      const [alertsRes, statsRes] = await Promise.all([
        api.get(`/alerts?page=${page}&limit=50`),
        api.get('/alerts/stats?days=30'),
      ]);
      setAlerts(alertsRes.data.alerts);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch alerts', error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const acknowledgeAlert = async (id: string) => {
    try {
      await api.patch(`/alerts/${id}/acknowledge`);
      fetchAlerts();
    } catch (error) {
      console.error('Failed to acknowledge', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48 rounded-lg" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MotionDiv>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Alerts</h1>
            <p className="mt-1 text-muted-foreground">
              {stats?.total || 0} alerts in the last 30 days
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={fetchAlerts}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </MotionDiv>

      <Stagger className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Triggered</p>
                <p className="font-display text-2xl font-bold tracking-tight">{stats?.triggered || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="font-display text-2xl font-bold tracking-tight">{stats?.resolved || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-display text-2xl font-bold tracking-tight">{stats?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Stagger>

      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle>Alert History</CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                </div>
                <p className="mt-6 font-display text-lg font-semibold">No alerts</p>
                <p className="mt-1 text-muted-foreground">All systems are running smoothly</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start justify-between rounded-xl border border-border/60 bg-accent/30 p-4 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-start gap-3">
                      <StatusBadge status={alert.status} />
                      <div>
                        <p className="font-medium">{alert.monitor?.name || 'Unknown Monitor'}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(alert.sentAt)}
                        </p>
                      </div>
                    </div>
                    {alert.status === 'triggered' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
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
