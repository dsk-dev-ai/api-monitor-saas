'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserPlus, Users, X, Mail, Edit, ShieldCheck, ClipboardList, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'invited';
  createdAt: string;
  updatedAt: string;
}

interface TeamData {
  id: string;
  name: string;
  members: TeamMember[];
  owner: TeamMember;
  subscription: {
    plan: string;
    status: string;
    memberLimit: number;
    currentMemberCount: number;
  };
}

interface InviteMemberFormData {
  email: string;
  role: 'admin' | 'member';
}

interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: {
    id: string;
    name: string;
    email: string;
  };
  targetUser?: {
    id: string;
    name: string;
    email: string;
  };
  details: Record<string, any>;
  timestamp: string;
}

export default function TeamPage() {
  const { user } = useAuth();
  const [team, setTeam] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState<InviteMemberFormData>({
    email: '',
    role: 'member',
  });
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  // Fetch team data
  const fetchTeam = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get('/team');
      setTeam(response.data);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to load team data';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch audit logs
  const fetchAuditLogs = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoadingAudit(true);
      const response = await api.get('/team/audit-logs');
      setAuditLogs(response.data);
    } catch (err: any) {
      console.error('Failed to fetch audit logs:', err);
      // Don't show error to user for audit logs as it's not critical
    } finally {
      setIsLoadingAudit(false);
    }
  }, [user]);

  // Invite team member
  const handleInvite = async () => {
    if (!inviteForm.email.trim()) return;
    
    try {
      setError(null);
      
      const response = await api.post('/team/invite', {
        email: inviteForm.email,
        role: inviteForm.role,
      });
      
      // Reset form and close modal
      setInviteForm({ email: '', role: 'member' });
      setShowInviteModal(false);
      
      toast({
        title: "Success",
        description: "Invitation sent successfully!",
      });
      
      // Refetch team data and audit logs to show the new invitation
      await fetchTeam();
      await fetchAuditLogs();
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to invite team member';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  // Remove team member
  const handleRemoveMember = async (memberId: string) => {
    try {
      setError(null);
      
      await api.delete(`/team/members/${memberId}`);
      
      alert('Team member removed successfully!'); // Fallback to alert for success
      
      // Refetch team data
      await fetchTeam();
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to remove team member';
      setError(message);
      alert(message); // Fallback to alert for error
    }
  };

  // Change member role
  const handleRoleChange = async (memberId: string, role: 'owner' | 'admin' | 'member') => {
    try {
      setError(null);
      
      await api.patch(`/team/members/${memberId}/role`, {
        role,
      });
      
      alert('Member role updated successfully!'); // Fallback to alert for success
      
      // Refetch team data
      await fetchTeam();
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to update member role';
      setError(message);
      alert(message); // Fallback to alert for error
    }
  };

  // Leave team (for non-owners)
  const handleLeaveTeam = async () => {
    if (!window.confirm('Are you sure you want to leave the team?')) {
      return;
    }
    
    try {
      setError(null);
      
      await api.delete(`/team/leave`);
      
      alert('You have left the team successfully!'); // Fallback to alert for success
      
      // Redirect to dashboard or auth page
      window.location.href = '/dashboard';
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to leave team';
      setError(message);
      alert(message); // Fallback to alert for error
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchTeam();
      fetchAuditLogs();
    }
  }, [user, fetchTeam, fetchAuditLogs]);

  if (isLoading && !team) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team</h1>
            <p className="text-muted-foreground">
              Manage your team members and permissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchTeam}>
              <Users className="h-4 w-4" />
            </Button>
            <Button onClick={() => setShowInviteModal(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-md p-4 mb-6">
          {error}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team</h1>
            <p className="text-muted-foreground">
              Manage your team members and permissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchTeam}>
              <Users className="h-4 w-4" />
            </Button>
            <Button onClick={() => setShowInviteModal(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No team data available</p>
        <Button onClick={() => window.location.href = '/dashboard'}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground">
            Manage your team members and permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchTeam}>
            <Users className="h-4 w-4" />
          </Button>
          {team.subscription.currentMemberCount < team.subscription.memberLimit && (
            <Button onClick={() => setShowInviteModal(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          )}
          {team.subscription.currentMemberCount < team.subscription.memberLimit && (
            <Button variant="outline" size="icon" title="Add member">
              <Users className="h-4 w-4" />
            </Button>
          )}
          {user?.id !== team.owner.id && (
            <Button variant="destructive" onClick={handleLeaveTeam} className="gap-2">
              <X className="h-4 w-4" />
              Leave Team
            </Button>
          )}
        </div>
      </div>

      {/* Team Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Team Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            {team.owner.avatar ? (
              <Image
                src={team.owner.avatar}
                alt={`${team.owner.name || team.owner.email}'s avatar`}
                className="h-12 w-12 rounded-full object-cover border border-primary/20"
                width={120}
                height={120}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                {team.owner.name ? (
                  team.owner.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                ) : (
                  team.owner.email
                    .split('@')[0]
                    .split('')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                )}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{team.owner.name || team.owner.email}</h2>
              <p className="text-muted-foreground">Owner</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {team.members.length} team member{team.members.length !== 1 ? 's' : ''}
                <span className="text-xs ml-1">/{team.subscription.memberLimit}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              <span>
                {team.members.filter(m => m.status === 'invited').length} pending
                invitation{team.members.filter(m => m.status === 'invited').length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <span>{team.subscription.plan} plan</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {team.members.length > 0 ? (
            <div className="space-y-4">
              {team.members.map((member) => (
                <div key={member.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {member.avatar ? (
                        <Image
                          src={member.avatar}
                          alt={`${member.name || member.email}'s avatar`}
                          className="h-10 w-10 rounded-full object-cover border border-primary/20"
                          width={100}
                          height={100}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          {member.name ? (
                            member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)
                          ) : (
                            member.email
                              .split('@')[0]
                              .split('')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)
                          )}
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{member.name || member.email}</h3>
                        <p className="text-sm text-muted-foreground">
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          {member.status === 'invited' && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded bg-warning/20 text-warning">
                              Invited
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action buttons (only show for non-owners or if current user is owner) */}
                    {(member.id !== user?.id || user?.id === team.owner.id) && (
                      <div className="flex items-center gap-2">
                        {member.role !== 'owner' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1 rounded hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <>
                                <DropdownMenuItem 
                                  onClick={() => handleRoleChange(member.id, 'admin')}
                                  className={member.role === 'admin' ? 'text-muted-foreground' : undefined}
                                >
                                  Make Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleRoleChange(member.id, 'member')}
                                  className={member.role === 'member' ? 'text-muted-foreground' : undefined}
                                >
                                  Make Member
                                </DropdownMenuItem>
                              </>
                              {member.status === 'active' && (
                                <DropdownMenuItem 
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="text-destructive"
                                >
                                  Remove Member
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        {member.status === 'invited' && (
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No team members yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Invite Team Member</h2>
            <p className="text-muted-foreground mb-6">
              Enter the email address of the person you want to invite to your team.
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleInvite();
            }} className="space-y-4">
              <div>
                <label htmlFor="invite-email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="invite-email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="invite-role" className="block text-sm font-medium mb-2">
                  Role
                </label>
                <select
                  id="invite-role"
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value as 'admin' | 'member' }))}
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!inviteForm.email.trim()}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Send Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}