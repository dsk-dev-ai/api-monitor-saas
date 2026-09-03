import React from 'react';
import { MonitorWizardFormData } from './monitor-wizard';

interface BasicConfigStepProps {
  formData: MonitorWizardFormData;
  onUpdate: (data: Partial<MonitorWizardFormData>) => void;
}

const inputBase =
  'flex h-11 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-primary/50';

export const BasicConfigStep: React.FC<BasicConfigStepProps> = ({
  formData,
  onUpdate,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    onUpdate({
      [name]: type === 'number' ? parseInt(value) : value,
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="monitor-name"
          className="text-sm font-medium text-foreground"
        >
          Monitor Name
        </label>
        <input
          type="text"
          id="monitor-name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
          className={inputBase}
          placeholder="Enter a name for your monitor"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="monitor-url"
          className="text-sm font-medium text-foreground"
        >
          URL to Monitor
        </label>
        <input
          type="url"
          id="monitor-url"
          name="url"
          value={formData.url || ''}
          onChange={handleChange}
          required
          className={inputBase}
          placeholder="https://example.com/api/endpoint"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="monitor-method"
          className="text-sm font-medium text-foreground"
        >
          HTTP Method
        </label>
        <select
          id="monitor-method"
          name="method"
          value={formData.method || 'GET'}
          onChange={handleChange}
          className={`${inputBase} cursor-pointer`}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
          <option value="HEAD">HEAD</option>
        </select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="monitor-interval"
          className="text-sm font-medium text-foreground"
        >
          Check Interval (seconds)
        </label>
        <input
          type="number"
          id="monitor-interval"
          name="interval"
          value={formData.interval || 60}
          min="30"
          max="3600"
          onChange={handleChange}
          className={inputBase}
        />
        <p className="text-xs text-muted-foreground">
          How often to check the endpoint (30–3600 seconds)
        </p>
      </div>
    </div>
  );
};
