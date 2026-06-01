'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from './status-badge';
import { Button } from '@/components/ui/button';
import { Pause, Play, Trash2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

interface MonitorCardProps {
  monitor: {
    id: string;
    name: string;
    url: string;
    method: string;
    interval: number;
    isActive: boolean;
    isPaused: boolean;
    uptime24h: number;
    lastCheck: {
      status: string;
      responseTime: number;
      checkedAt: string;
    } | null;
    totalChecks: number;
    history: Array<{ status: string; checkedAt: string }>;
  };
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MonitorCard({ monitor, onPause, onResume, onDelete }: MonitorCardProps) {
  const status = monitor.isPaused ? 'paused' : monitor.lastCheck?.status || 'unknown';

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-semibold">{monitor.name}</h3>
              <StatusBadge status={status} />
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">{monitor.url}</p>
          </div>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {monitor.isPaused ? (
              <Button variant="ghost" size="icon" onClick={() => onResume(monitor.id)}>
                <Play className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => onPause(monitor.id)}>
                <Pause className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(monitor.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Status History Bar */}
        <div className="mb-4 flex h-8 gap-[2px] rounded-md overflow-hidden">
          {monitor.history.slice(-30).map((check, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 transition-all',
                check.status === 'up' && 'bg-green-500',
                check.status === 'down' && 'bg-red-500',
                check.status === 'degraded' && 'bg-amber-500'
              )}
              title={`${check.status} - ${formatDate(check.checkedAt)}`}
            />
          ))}
          {monitor.history.length === 0 && (
            <div className="flex-1 bg-gray-200" />
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Uptime</p>
            <p className={cn(
              'text-lg font-bold',
              monitor.uptime24h >= 99 ? 'text-green-600' :
              monitor.uptime24h >= 95 ? 'text-amber-600' : 'text-red-600'
            )}>
              {monitor.uptime24h.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Response</p>
            <p className="text-lg font-bold">
              {monitor.lastCheck?.responseTime || 0}ms
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Checks</p>
            <p className="text-lg font-bold">{monitor.totalChecks}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="uppercase">{monitor.method}</span>
            <span>•</span>
            <span>Every {monitor.interval}s</span>
          </div>
          <Link href={`/monitors/${monitor.id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              Details <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
