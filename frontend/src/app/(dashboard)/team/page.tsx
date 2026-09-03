'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reveal, MotionDiv } from '@/components/motion/motion-primitives';
import { Users, UserPlus, Shield } from 'lucide-react';

export default function TeamPage() {
  const features = [
    { icon: UserPlus, title: 'Invite Members' },
    { icon: Shield, title: 'Role Management' },
    { icon: Users, title: 'Workspace Access' },
  ];

  return (
    <div className="space-y-6">
      <MotionDiv>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Team</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your team members and permissions
        </p>
      </MotionDiv>

      <Reveal>
        <Card>
          <CardContent className="flex flex-col items-center py-20">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/50">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>

            <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight">
              Team Management Coming Soon
            </h2>

            <p className="mt-3 max-w-md text-center text-muted-foreground">
              Multi-user teams, invitations, roles, permissions,
              audit logs and workspace collaboration will be available
              in a future release.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="rounded-xl border border-border/60 bg-accent/30 p-4 text-center transition-colors hover:bg-accent/50">
                  <f.icon className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">{f.title}</p>
                </div>
              ))}
            </div>

            <Button disabled className="mt-8">
              Invite Member
            </Button>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
