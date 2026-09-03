'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Reveal, MotionDiv } from '@/components/motion/motion-primitives';
import { Layers } from 'lucide-react';

export default function WorkspacesPage() {
  const features = [
    'Multiple workspaces',
    'Team collaboration',
    'Workspace switching',
    'Role management',
    'Shared monitors',
  ];

  return (
    <div className="space-y-6">
      <MotionDiv>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Workspaces</h1>
        <p className="mt-1 text-muted-foreground">
          Workspace management is currently under development.
        </p>
      </MotionDiv>

      <Reveal>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Layers className="h-4 w-4" />
              </div>
              <CardTitle>Coming Soon</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
