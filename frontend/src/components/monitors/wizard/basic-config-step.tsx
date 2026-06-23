import React from 'react';
import { MonitorWizardFormData } from './monitor-wizard';
import styles from './wizard-container.module.css';

interface BasicConfigStepProps {
  formData: MonitorWizardFormData;
  onUpdate: (data: Partial<MonitorWizardFormData>) => void;
}

export const BasicConfigStep: React.FC<BasicConfigStepProps> = ({ 
  formData, 
  onUpdate 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    onUpdate({
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  return (
    <div className="wizard-step-content">
      <div className="form-group">
        <label htmlFor="monitor-name">Monitor Name</label>
        <input
          type="text"
          id="monitor-name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="Enter a name for your monitor"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="monitor-url">URL to Monitor</label>
        <input
          type="url"
          id="monitor-url"
          name="url"
          value={formData.url || ''}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="https://example.com/api/endpoint"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="monitor-method">HTTP Method</label>
        <select
          id="monitor-method"
          name="method"
          value={formData.method || 'GET'}
          onChange={handleChange}
          className="form-select"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
          <option value="HEAD">HEAD</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="monitor-interval">Check Interval (seconds)</label>
        <input
          type="number"
          id="monitor-interval"
          name="interval"
          value={formData.interval || 60}
          min="10"
          max="86400"
          onChange={handleChange}
          className="form-input"
        />
        <p className="form-help-text">How often to check the endpoint (minimum 10 seconds)</p>
      </div>
    </div>
  );
};