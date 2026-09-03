import React from 'react';
import { MonitorWizardFormData } from './monitor-wizard';

interface ReviewStepProps {
  formData: MonitorWizardFormData;
  onUpdate: (data: Partial<MonitorWizardFormData>) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ formData, onUpdate }) => {
  const getExpectedStatusDisplay = (status?: number): string => {
    if (!status) return 'Any 2xx';
    return `${status}`;
  };

  const showBody = !!formData.body;
  const showHeaders = !!formData.headers && Object.keys(formData.headers).length > 0;

  const renderRow = (label: string, value: string) => (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-2.5 last:border-0">
      <span className="shrink-0 text-sm font-medium text-muted-foreground">
        {label}
      </span>
      <span className="text-right text-sm text-foreground">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-card/40 p-4">
        <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Basic Configuration
        </h3>
        <div>
          {renderRow('Monitor Name', formData.name || 'Not set')}
          {renderRow('URL', formData.url || 'Not set')}
          {renderRow('Method', formData.method || 'GET')}
          {renderRow(
            'Check Interval',
            `${formData.interval || 60} seconds`
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/40 p-4">
        <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Advanced Settings
        </h3>
        <div>
          {renderRow(
            'Timeout',
            `${formData.timeout !== undefined ? formData.timeout : 30} seconds`
          )}
          {renderRow(
            'Expected Status',
            getExpectedStatusDisplay(formData.expectedStatus)
          )}
          {renderRow('Expected Keyword', formData.expectedKeyword || 'None')}
          {showBody && (
            <div className="border-b border-border/60 py-2.5">
              <span className="text-sm font-medium text-muted-foreground">
                Request Body
              </span>
              <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-muted/50 p-3 font-mono text-xs text-foreground">
                {formData.body}
              </pre>
            </div>
          )}
          {showHeaders && (
            <div className="border-b border-border/60 py-2.5">
              <span className="text-sm font-medium text-muted-foreground">
                Headers
              </span>
              <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-muted/50 p-3 font-mono text-xs text-foreground">
                {JSON.stringify(formData.headers, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
