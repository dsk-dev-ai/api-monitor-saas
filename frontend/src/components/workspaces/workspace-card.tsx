import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Users, Server, Edit2, Trash2, Menu } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    memberCount: number;
    monitorCount: number;
    createdAt: string;
    updatedAt: string;
  };
  isCurrent: boolean;
  onSwitch: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function WorkspaceCard({
  workspace,
  isCurrent,
  onSwitch,
  onEdit,
  onDelete,
}: WorkspaceCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {workspace.name}
            {isCurrent && (
              <span className="ml-2 h-3 w-3 rounded-full bg-green-500" />
            )}
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1 rounded hover:bg-muted">
              <Menu className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onEdit}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {workspace.description && (
          <p className="text-sm text-muted-foreground">
            {workspace.description}
          </p>
        )}
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div>
            <Server className="mr-2 h-4 w-4" />
            <span>{workspace.monitorCount} monitor{workspace.monitorCount !== 1 ? 's' : ''}</span>
          </div>
          <div>
            <Users className="mr-2 h-4 w-4" />
            <span>{workspace.memberCount} member{workspace.memberCount !== 1 ? 's' : ''}</span>
          </div>
          <div>
            <CheckCircle className={
              `mr-2 h-4 w-4 ${workspace.isActive ? 'text-green-500' : 'text-gray-400'}`
            } />
            <span>{workspace.isActive ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4">
        {!isCurrent && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSwitch}
          >
            Switch Workspace
          </Button>
        )}
        {isCurrent && (
          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Current Workspace
          </span>
        )}
      </CardFooter>
    </Card>
  );
}