'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Shield } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground">
          Manage your team members and permissions
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center py-20">
          <Users className="h-16 w-16 text-muted-foreground/40" />

          <h2 className="mt-6 text-2xl font-semibold">
            Team Management Coming Soon
          </h2>

          <p className="mt-3 max-w-md text-center text-muted-foreground">
            Multi-user teams, invitations, roles, permissions,
            audit logs and workspace collaboration will be available
            in a future release.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-4 text-center">
              <UserPlus className="mx-auto mb-2 h-5 w-5" />
              <p className="font-medium">Invite Members</p>
            </div>

            <div className="rounded-lg border p-4 text-center">
              <Shield className="mx-auto mb-2 h-5 w-5" />
              <p className="font-medium">Role Management</p>
            </div>

            <div className="rounded-lg border p-4 text-center">
              <Users className="mx-auto mb-2 h-5 w-5" />
              <p className="font-medium">Workspace Access</p>
            </div>
          </div>

          <Button disabled className="mt-8">
            Invite Member
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
