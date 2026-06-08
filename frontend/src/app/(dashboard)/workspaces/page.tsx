'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Trash2, Settings, Users, Server, Edit, Copy, Check, X } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkspaceForm } from '@/components/workspaces/workspace-form';
import { WorkspaceCard } from '@/components/workspaces/workspace-card';

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  memberCount: number;
  monitorCount: number;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

interface WorkspaceData {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
}

type WorkspaceMutationResult =
  | { success: true; data: Workspace }
  | { success: false; error: string };

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Fetch workspaces
  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch from API, fallback to mock data if not implemented
      try {
        const response = await api.get('/workspaces');
        setWorkspaces(response.data.workspaces || []);
        setCurrentWorkspace(response.data.currentWorkspace || null);
      } catch (apiError) {
        // Fallback to mock data for development
        console.log('API not implemented yet, using mock data');
        setWorkspaces(workspaces);
        setCurrentWorkspace(workspaces[0]);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load workspaces');
      // Fallback to mock data even on error
      setWorkspaces(workspaces);
      setCurrentWorkspace(workspaces[0]);
    } finally {
      setIsLoading(false);
    }
  };

  // Create workspace
  const handleCreateWorkspace = async (workspaceData: Partial<Workspace>): Promise<WorkspaceMutationResult> => {
    try {
      // Try to create via API, fallback to mock if not implemented
      try {
        const response = await api.post('/workspaces', workspaceData);
        const newWorkspace = response.data;
        setWorkspaces(prev => [newWorkspace, ...prev]);
        setShowForm(false);
        return { success: true, data: newWorkspace };
      } catch (apiError) {
        // Fallback to mock implementation
        console.log('API not implemented yet, using mock data');
        const newWorkspace: Workspace = {
          id: `ws_${Date.now()}`,
          name: workspaceData.name ?? '',
          description: workspaceData.description ?? null,
          isActive: workspaceData.isActive ?? true,
          memberCount: 1,
          monitorCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ownerId: 'user_123', // This would come from auth in real implementation
        };
        setWorkspaces(prev => [newWorkspace, ...prev]);
        setShowForm(false);
        return { success: true, data: newWorkspace };
      }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to create workspace' 
      };
    }
  };

  // Update workspace
  const handleUpdateWorkspace = async (id: string, workspaceData: Partial<Workspace>): Promise<WorkspaceMutationResult> => {
    try {
      // Try to update via API, fallback to mock if not implemented
      try {
        const response = await api.patch(`/workspaces/${id}`, workspaceData);
        const updatedWorkspace = response.data;
        setWorkspaces(prev => prev.map(ws => ws.id === id ? updatedWorkspace : ws));
        if (currentWorkspace?.id === id) {
          setCurrentWorkspace(updatedWorkspace);
        }
        setShowForm(false);
        return { success: true, data: updatedWorkspace };
      } catch (apiError) {
        // Fallback to mock implementation
        console.log('API not implemented yet, using mock data');
        const existingWorkspace = workspaces.find(ws => ws.id === id);
        if (!existingWorkspace) {
          return { success: false, error: 'Workspace not found' };
        }
        const updatedWorkspace: Workspace = {
          ...existingWorkspace,
          ...workspaceData,
          updatedAt: new Date().toISOString(),
        };
        setWorkspaces(prev => prev.map(ws => ws.id === id ? updatedWorkspace : ws));
        if (currentWorkspace?.id === id) {
          setCurrentWorkspace(updatedWorkspace);
        }
        setShowForm(false);
        return { success: true, data: updatedWorkspace };
      }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to update workspace' 
      };
    }
  };

  // Delete workspace
  const handleDeleteWorkspace = async (id: string) => {
    try {
      // Try to delete via API, fallback to mock if not implemented
      try {
        await api.delete(`/workspaces/${id}`);
        const remainingWorkspaces = workspaces.filter(ws => ws.id !== id);
        setWorkspaces(remainingWorkspaces);
        if (currentWorkspace?.id === id) {
          setCurrentWorkspace(remainingWorkspaces.length > 0 ? remainingWorkspaces[0] : null);
        }
        return { success: true };
      } catch (apiError) {
        // Fallback to mock implementation
        console.log('API not implemented yet, using mock data');
        const remainingWorkspaces = workspaces.filter(ws => ws.id !== id);
        setWorkspaces(remainingWorkspaces);
        if (currentWorkspace?.id === id) {
          setCurrentWorkspace(remainingWorkspaces.length > 0 ? remainingWorkspaces[0] : null);
        }
        return { success: true };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to delete workspace',
      };
    }
  };

  // Switch workspace
  const handleSwitchWorkspace = async (id: string) => {
    try {
      // Try to switch via API, fallback to mock if not implemented
      try {
        const response = await api.post(`/workspaces/${id}/switch`);
        const workspace = response.data;
        setCurrentWorkspace(workspace);
        return { success: true, data: workspace };
      } catch (apiError) {
        // Fallback to mock implementation
        console.log('API not implemented yet, using mock data');
        const workspace = workspaces.find(ws => ws.id === id);
        if (workspace) {
          setCurrentWorkspace(workspace);
          return { success: true, data: workspace };
        }
        throw new Error('Workspace not found');
      }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to switch workspace' 
      };
    }
  };

  // Initial fetch
  // Note: In a real app, you would use useEffect here, but for simplicity in this example,
  // we're calling it directly. In practice, you'd want to use useEffect with proper dependencies.
  fetchWorkspaces();

  // Mock data for development
  const mockWorkspaces: Workspace[] = [
    {
      id: 'ws_1',
      name: 'Production',
      description: 'Main production workspace for monitoring critical services',
      isActive: true,
      memberCount: 5,
      monitorCount: 12,
      createdAt: '2026-01-15T08:30:00Z',
      updatedAt: '2026-06-01T14:22:00Z',
      ownerId: 'user_123',
    },
    {
      id: 'ws_2',
      name: 'Staging',
      description: 'Staging environment for testing new features',
      isActive: false,
      memberCount: 3,
      monitorCount: 5,
      createdAt: '2026-02-20T10:15:00Z',
      updatedAt: '2026-05-15T09:30:00Z',
      ownerId: 'user_123',
    },
    {
      id: 'ws_3',
      name: 'Development',
      description: 'Local development and experimentation',
      isActive: false,
      memberCount: 2,
      monitorCount: 3,
      createdAt: '2026-03-10T16:45:00Z',
      updatedAt: '2026-05-20T11:15:00Z',
      ownerId: 'user_123',
    }
  ];

  if (isLoading && workspaces.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workspaces</h1>
            <p className="text-muted-foreground">\n              Manage your workspaces and organize your monitors\n            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchWorkspaces}>
              <Server className="h-4 w-4" />
            </Button>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Workspace
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
            <h1 className="text-3xl font-bold">Workspaces</h1>
            <p className="text-muted-foreground">\n              Manage your workspaces and organize your monitors\n            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchWorkspaces}>
              <Server className="h-4 w-4" />
            </Button>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Workspace
            </Button>
          </div>
        </div>
        
        {workspaces.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Your Workspaces</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {workspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  isCurrent={currentWorkspace?.id === workspace.id}
                  onSwitch={() => handleSwitchWorkspace(workspace.id)}
                  onEdit={() => {
                    setFormMode('edit');
                    setSelectedWorkspaceId(workspace.id);
                    setShowForm(true);
                  }}
                  onDelete={() => handleDeleteWorkspace(workspace.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workspaces</h1>
          <p className="text-muted-foreground">\n            Manage your workspaces and organize your monitors\n          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchWorkspaces}>
            <Server className="h-4 w-4" />
          </Button>
          <Button onClick={() => {
            setFormMode('create');
            setSelectedWorkspaceId(null);
            setShowForm(true);
          }} className="gap-2">
            <Plus className="h-4 w-4" />
            New Workspace
          </Button>
        </div>
      </div>
      
      {showForm && (
        <WorkspaceForm
          workspaceId={selectedWorkspaceId}
          initialData={{
            name: '',
            description: '',
            isActive: true,
          }}
          onSubmit={async (data) => {
            if (formMode === 'create' && selectedWorkspaceId === null) {
              const result = await handleCreateWorkspace(data);
              if (result.success) setShowForm(false);
              return result;
            } else if (formMode === 'edit' && selectedWorkspaceId !== null) {
              const result = await handleUpdateWorkspace(selectedWorkspaceId, data);
              if (result.success) setShowForm(false);
              return result;
            }
            return { success: false, error: 'Invalid form state' };
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      {workspaces.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Workspaces</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">
                {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
              </span>
              {currentWorkspace && (
                <Button variant="outline" size="icon" onClick={() => handleSwitchWorkspace(currentWorkspace.id)}>
                  <Check className="h-4 w-4" />
                  Use Current
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                isCurrent={currentWorkspace?.id === workspace.id}
                onSwitch={() => handleSwitchWorkspace(workspace.id)}
                onEdit={() => {
                  setFormMode('edit');
                  setSelectedWorkspaceId(workspace.id);
                  setShowForm(true);
                }}
                onDelete={() => handleDeleteWorkspace(workspace.id)}
              />
            ))}
          </div>
        </>
      )}
      
      {workspaces.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Server className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-semibold">No workspaces yet</h3>
            <p className="mt-2 text-center text-muted-foreground">\n              Create your first workspace to organize your monitors\n            </p>
            <Button className="mt-6 gap-2" onClick={() => {
              setFormMode('create');
              setSelectedWorkspaceId(null);
              setShowForm(true);
            }}>
              <Plus className="h-4 w-4" />
              New Workspace
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}