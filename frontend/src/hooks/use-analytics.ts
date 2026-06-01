'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';

export interface OverviewStats {
  totalMonitors: number;
  activeMonitors: number;
  pausedMonitors: number;
  totalChecks: number;
  uptimePercentage: number;
  avgResponseTime: number;
  alertsTriggered: number;
  alertsResolved: number;
  recentIncidents: Array<{
    id: string;
    message: string;
    sentAt: string;
    monitor: { name: string; url: string };
  }>;
  statusDistribution: { up: number; down: number; degraded: number };
  uptimeByMonitor: Array<{
    id: string;
    name: string;
    url: string;
    total: number;
    up_count: number;
    avg_response_time: number;
  }>;
}

export function useAnalytics(days = 30) {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/analytics/overview?days=${days}`);
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [days]);

  return { stats, isLoading, error };
}
