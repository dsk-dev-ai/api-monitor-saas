'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Check, X, Plus } from 'lucide-react';

interface WorkspaceFormProps {
  workspaceId: string | null;
  initialData: {
    name: string;
    description: string;
    isActive: boolean;
  };
  onSubmit: (data: {
    name: string;
    description: string;
    isActive: boolean;
  }) => Promise<{ success: true; data: any } | { success: false; error: string }>;
  onCancel: () => void;
}

export function WorkspaceForm({
  workspaceId,
  initialData,
  onSubmit,
  onCancel,
}: WorkspaceFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name,
    description: initialData.description,
    isActive: initialData.isActive,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await onSubmit(formData);
      if (!result.success) {
        setError(result.error);
      }
      // Note: Success handling is done in the parent component
    } catch (err: any) {
      setError(err.response?.data?.error || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isEditMode = workspaceId !== null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {isEditMode ? 'Edit Workspace' : 'New Workspace'}
        </h2>
        <Button variant="outline" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-md p-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="workspace-name">Workspace Name</Label>
          <Input
            id="workspace-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter workspace name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="workspace-description">Description (optional)</Label>
          <Textarea
            id="workspace-description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the purpose of this workspace..."
            rows={4}
          />
        </div>
        
        <div className="flex items-center">
          <Switch
            id="workspace-active"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            aria-label="Active workspace"
          />
          <Label htmlFor="workspace-active" className="ml-3 text-sm font-medium">
            Active workspace
          </Label>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          {isEditMode ? 'Close' : 'Cancel'}
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !formData.name.trim()}
          className="gap-2"
        >
          {isLoading && (
            <>
              <span className="mr-2">Saving...</span>
              {/* Simple loading indicator */}
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </>
          )}
          {!isLoading && (
            <>
              {isEditMode ? (
                <>
                  <Check className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Workspace
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}