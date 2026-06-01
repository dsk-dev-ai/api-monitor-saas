'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonitorCard } from '@/components/monitors/monitor-card';
import { MonitorForm } from '@/components/monitors/monitor-form';
import { useMonitors } from '@/hooks/use-monitors';
import { Skeleton } from '@/components/ui/skeleton';
import { Monitor, Plus, RefreshCw } from 'lucide-react';

export default function MonitorsPage() {
  const { monitors, isLoading, error, createMonitor, deleteMonitor, pauseMonitor, resumeMonitor, refetch } = useMonitors();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return <MonitorsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" className="mt-4 gap-2" onClick={refetch}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitors</h1>
          <p className="text-muted-foreground">
            {monitors.length} monitor{monitors.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={refetch}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Monitor
          </Button>
        </div>
      </div>

      {showForm && (
        <MonitorForm
          onSubmit={async (data) => {
            const result = await createMonitor(data);
            if (result.success) setShowForm(false);
            return result;
          }}
        />
      )}

      {monitors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Monitor className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-semibold">No monitors yet</h3>
            <p className="mt-2 text-center text-muted-foreground">
              Add your first monitor to start tracking uptime and performance
            </p>
            <Button className="mt-6 gap-2" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              Add Monitor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {monitors.map((monitor) => (
            <MonitorCard
              key={monitor.id}
              monitor={monitor}
              onPause={pauseMonitor}
              onResume={resumeMonitor}
              onDelete={deleteMonitor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MonitorsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  );
}
