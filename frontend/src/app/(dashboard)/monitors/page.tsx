'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MonitorCard } from '@/components/monitors/monitor-card';
import { WizardContainer } from '@/components/monitors/wizard/wizard-container';
import { useMonitors } from '@/hooks/use-monitors';
import { Skeleton } from '@/components/ui/skeleton';
import { Stagger, MotionDiv } from '@/components/motion/motion-primitives';
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
      <MotionDiv>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Monitors</h1>
            <p className="mt-1 text-muted-foreground">
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
      </MotionDiv>

      {showForm && (
        <WizardContainer
          onComplete={async (data) => {
            const result = await createMonitor(data);
            if (result.success) setShowForm(false);
            return result;
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {monitors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/50">
              <Monitor className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold">No monitors yet</h3>
            <p className="mt-2 max-w-sm text-center text-muted-foreground">
              Add your first monitor to start tracking uptime and performance
            </p>
            <Button className="mt-6 gap-2" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              Add Monitor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Stagger className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {monitors.map((monitor) => (
            <MonitorCard
              key={monitor.id}
              monitor={monitor}
              onPause={pauseMonitor}
              onResume={resumeMonitor}
              onDelete={deleteMonitor}
            />
          ))}
        </Stagger>
      )}
    </div>
  );
}

function MonitorsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
