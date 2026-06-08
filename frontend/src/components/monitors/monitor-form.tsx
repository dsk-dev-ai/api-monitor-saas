'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';

interface MonitorFormProps {
  onSubmit: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export function MonitorForm({ onSubmit }: MonitorFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    method: 'GET',
    interval: 300,
    timeout: 30,
    expectedStatus: 200,
    expectedKeyword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await onSubmit(formData);

    if (result.success) {
      setIsOpen(false);
      setFormData({
        name: '',
        url: '',
        method: 'GET',
        interval: 300,
        timeout: 30,
        expectedStatus: 200,
        expectedKeyword: '',
      });
    } else {
      setError(result.error || 'Failed to create monitor');
    }

    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Monitor
      </Button>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create New Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="My API"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://api.example.com/health"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <select
                id="method"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>PATCH</option>
                <option>DELETE</option>
                <option>HEAD</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval">Interval (seconds)</Label>
              <Input
                id="interval"
                type="number"
                min={30}
                value={formData.interval}
                onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                min={5}
                max={120}
                value={formData.timeout}
                onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedStatus">Expected Status Code</Label>
              <Input
                id="expectedStatus"
                type="number"
                placeholder="200"
                value={formData.expectedStatus}
                onChange={(e) => {
                  const status = parseInt(e.target.value, 10);
                  setFormData({
                    ...formData,
                    expectedStatus: Number.isNaN(status) ? 0 : status,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedKeyword">Expected Keyword (optional)</Label>
              <Input
                id="expectedKeyword"
                placeholder="success"
                value={formData.expectedKeyword}
                onChange={(e) => setFormData({ ...formData, expectedKeyword: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Monitor
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
