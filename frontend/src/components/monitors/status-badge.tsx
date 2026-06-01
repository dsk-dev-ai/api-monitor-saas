'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<string, string> = {
    up: 'bg-green-100 text-green-800 border-green-200',
    down: 'bg-red-100 text-red-800 border-red-200',
    degraded: 'bg-amber-100 text-amber-800 border-amber-200',
    paused: 'bg-gray-100 text-gray-800 border-gray-200',
    triggered: 'bg-red-100 text-red-800 border-red-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    acknowledged: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const labels: Record<string, string> = {
    up: 'Up',
    down: 'Down',
    degraded: 'Degraded',
    paused: 'Paused',
    triggered: 'Triggered',
    resolved: 'Resolved',
    acknowledged: 'Acknowledged',
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium capitalize',
        variants[status] || 'bg-gray-100 text-gray-800',
        className
      )}
    >
      <span
        className={cn(
          'mr-1.5 inline-block h-2 w-2 rounded-full',
          status === 'up' && 'bg-green-500',
          status === 'down' && 'bg-red-500 animate-pulse',
          status === 'degraded' && 'bg-amber-500',
          status === 'paused' && 'bg-gray-400',
          status === 'triggered' && 'bg-red-500 animate-pulse',
          status === 'resolved' && 'bg-green-500',
          status === 'acknowledged' && 'bg-blue-500'
        )}
      />
      {labels[status] || status}
    </Badge>
  );
}
