'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/monitors/status-badge';
import { formatDate } from '@/lib/utils';
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
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alerts</h1>
          <p className="text-muted-foreground">
            {stats?.total || 0} alerts in the last 30 days
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchAlerts}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Alert Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Triggered</p>
                <p className="text-2xl font-bold">{stats?.triggered || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{stats?.resolved || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Alert History</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="mt-4 text-lg font-medium">No alerts</p>
              <p className="text-muted-foreground">All systems are running smoothly</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between rounded-lg border p-4"
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
    </div>
  );
}
