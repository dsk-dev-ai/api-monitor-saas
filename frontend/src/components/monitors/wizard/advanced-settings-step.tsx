import React from 'react';
import { MonitorWizardFormData } from './monitor-wizard';

interface AdvancedSettingsStepProps {
  formData: MonitorWizardFormData;
  onUpdate: (data: Partial<MonitorWizardFormData>) => void;
}

const inputBase =
  'flex h-11 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-primary/50';

const textareaBase =
  'flex w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-primary/50';

export const AdvancedSettingsStep: React.FC<AdvancedSettingsStepProps> = ({
  formData,
  onUpdate,
}) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    onUpdate({
      [name]:
        type === 'number' ? (value === '' ? undefined : parseInt(value)) : value,
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Request Settings
        </h3>

        <div className="space-y-2">
          <label htmlFor="timeout" className="text-sm font-medium text-foreground">
            Timeout (seconds)
          </label>
          <input
            type="number"
            id="timeout"
            name="timeout"
            value={formData.timeout || 30}
            min="5"
            max="120"
            onChange={handleChange}
            className={inputBase}
          />
          <p className="text-xs text-muted-foreground">
            Request timeout in seconds (5–120, default: 30)
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="expected-status"
            className="text-sm font-medium text-foreground"
          >
            Expected Status Code
          </label>
          <input
            type="number"
            id="expected-status"
            name="expectedStatus"
            value={formData.expectedStatus || ''}
            min="100"
            max="599"
            onChange={handleChange}
            className={inputBase}
          />
          <p className="text-xs text-muted-foreground">
            Expected HTTP status code (leave blank for any 2xx)
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="expected-keyword"
            className="text-sm font-medium text-foreground"
          >
            Expected Keyword
          </label>
          <input
            type="text"
            id="expected-keyword"
            name="expectedKeyword"
            value={formData.expectedKeyword || ''}
            onChange={handleChange}
            className={inputBase}
          />
          <p className="text-xs text-muted-foreground">
            Keyword that should be present in response body
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-border/60 bg-card/40 p-4">
        <h3 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Request Body &amp; Headers
        </h3>

        <div className="space-y-2">
          <label
            htmlFor="request-body"
            className="text-sm font-medium text-foreground"
          >
            Request Body
          </label>
          <textarea
            id="request-body"
            name="body"
            value={formData.body || ''}
            onChange={handleChange}
            className={textareaBase}
            rows={4}
            placeholder="JSON, XML, or form data for POST/PUT/PATCH requests"
          />
          <p className="text-xs text-muted-foreground">
            Request body content (for POST, PUT, PATCH requests)
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="custom-headers"
            className="text-sm font-medium text-foreground"
          >
            Custom Headers (JSON)
          </label>
          <textarea
            id="custom-headers"
            name="headers"
            value={
              formData.headers
                ? JSON.stringify(formData.headers, null, 2)
                : ''
            }
            onChange={(e) => {
              try {
                const parsed = e.target.value ? JSON.parse(e.target.value) : {};
                onUpdate({ headers: parsed });
              } catch (error) {
                // Invalid JSON, don't update
              }
            }}
            className={`${textareaBase} font-mono`}
            rows={3}
            placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
          />
          <p className="text-xs text-muted-foreground">
            Custom headers in JSON format
          </p>
        </div>
      </div>
    </div>
  );
};
