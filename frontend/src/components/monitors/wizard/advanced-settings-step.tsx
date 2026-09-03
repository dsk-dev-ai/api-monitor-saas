import React from 'react';
import { MonitorWizardFormData } from './monitor-wizard';

interface AdvancedSettingsStepProps {
  formData: MonitorWizardFormData;
  onUpdate: (data: Partial<MonitorWizardFormData>) => void;
}

export const AdvancedSettingsStep: React.FC<AdvancedSettingsStepProps> = ({ 
  formData, 
  onUpdate 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    onUpdate({
      [name]: type === 'number' ? (value === '' ? undefined : parseInt(value)) : value
    });
  };

  return (
    <div className="wizard-step-content">
      {/* Request Settings */}
      <div className="advanced-section">
        <h3>Request Settings</h3>
        
        <div className="form-group">
          <label htmlFor="timeout">Timeout (seconds)</label>
          <input
            type="number"
            id="timeout"
            name="timeout"
            value={formData.timeout || 30}
            min="5"
            max="120"
            onChange={handleChange}
            className="form-input"
          />
          <p className="form-help-text">Request timeout in seconds (5–120, default: 30)</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="expected-status">Expected Status Code</label>
          <input
            type="number"
            id="expected-status"
            name="expectedStatus"
            value={formData.expectedStatus || ''}
            min="100"
            max="599"
            onChange={handleChange}
            className="form-input"
          />
          <p className="form-help-text">Expected HTTP status code (leave blank for any 2xx)</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="expected-keyword">Expected Keyword</label>
          <input
            type="text"
            id="expected-keyword"
            name="expectedKeyword"
            value={formData.expectedKeyword || ''}
            onChange={handleChange}
            className="form-input"
          />
          <p className="form-help-text">Keyword that should be present in response body</p>
        </div>
      </div>
      
      {/* Request Body & Headers */}
      <div className="advanced-section">
        <h3>Request Body & Headers</h3>
        
        <div className="form-group">
          <label htmlFor="request-body">Request Body</label>
          <textarea
            id="request-body"
            name="body"
            value={formData.body || ''}
            onChange={handleChange}
            className="form-textarea"
            rows={4}
            placeholder="JSON, XML, or form data for POST/PUT/PATCH requests"
          />
          <p className="form-help-text">Request body content (for POST, PUT, PATCH requests)</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="custom-headers">Custom Headers (JSON)</label>
          <textarea
            id="custom-headers"
            name="headers"
            value={formData.headers ? JSON.stringify(formData.headers, null, 2) : ''}
            onChange={(e) => {
              try {
                const parsed = e.target.value ? JSON.parse(e.target.value) : {};
                onUpdate({ headers: parsed });
              } catch (error) {
                // Invalid JSON, don't update
              }
            }}
            className="form-textarea"
            rows={3}
            placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
          />
          <p className="form-help-text">Custom headers in JSON format</p>
        </div>
      </div>
    </div>
  );
};
