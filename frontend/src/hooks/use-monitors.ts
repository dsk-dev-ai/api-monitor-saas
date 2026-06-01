'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';

export interface Monitor {
  id: string;
  name: string;
  url: string;
  method: string;
  interval: number;
  timeout: number;
  isActive: boolean;
  isPaused: boolean;
  expectedStatus?: number;
  expectedKeyword?: string;
  createdAt: string;
  uptime24h: number;
  lastCheck: {
    status: string;
    responseTime: number;
    checkedAt: string;
  } | null;
  totalChecks: number;
  history: Array<{
    status: string;
    responseTime: number;
    checkedAt: string;
  }>;
}

export function useMonitors() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonitors = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/monitors');
      setMonitors(data.monitors || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch monitors');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitors();
    const interval = setInterval(fetchMonitors, 30000);
    return () => clearInterval(interval);
  }, [fetchMonitors]);

  const createMonitor = async (monitorData: Partial<Monitor>) => {
    try {
      const { data } = await api.post('/monitors', monitorData);
      setMonitors((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to create monitor' };
    }
  };

  const deleteMonitor = async (id: string) => {
    try {
      await api.delete(`/monitors/${id}`);
      setMonitors((prev) => prev.filter((m) => m.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete monitor' };
    }
  };

  const pauseMonitor = async (id: string) => {
    try {
      const { data } = await api.post(`/monitors/${id}/pause`);
      setMonitors((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error };
    }
  };

  const resumeMonitor = async (id: string) => {
    try {
      const { data } = await api.post(`/monitors/${id}/resume`);
      setMonitors((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error };
    }
  };

  return {
    monitors,
    isLoading,
    error,
    createMonitor,
    deleteMonitor,
    pauseMonitor,
    resumeMonitor,
    refetch: fetchMonitors,
  };
}
