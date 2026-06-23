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
    let checkedValue = false;
    if ('checked' in e.target) {
      checkedValue = (e.target as HTMLInputElement).checked;
    }
    onUpdate({
      [name]: type === 'checkbox' ? !!checkedValue : type === 'number' ? (value === '' ? undefined : parseInt(value)) : value
    });
  };

  const handleAuthTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({
      authType: e.target.value as MonitorWizardFormData['authType'],
      // Clear auth fields when type changes
      authUsername: '',
      authPassword: '',
      authToken: '',
      authApiKey: '',
      authApiKeyHeader: (e.target.value === 'api-key') ? 'X-API-Key' : ''
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
            min="1"
            max="300"
            onChange={handleChange}
            className="form-input"
          />
          <p className="form-help-text">Request timeout in seconds (default: 30)</p>
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
        
        <div className="form-group">
          <label htmlFor="follow-redirects">
            <input
              type="checkbox"
              id="follow-redirects"
              name="followRedirects"
              checked={(formData.followRedirects ?? true) as boolean}
              onChange={handleChange}
              className="form-checkbox"
            />
            Follow Redirects
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="ignore-ssl">
            <input
              type="checkbox"
              id="ignore-ssl"
              name="ignoreSSL"
              checked={(formData.ignoreSSL ?? false) as boolean}
              onChange={handleChange}
              className="form-checkbox"
            />
            Ignore SSL Errors
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="retry-attempts">Retry Attempts</label>
          <input
            type="number"
            id="retry-attempts"
            name="retryAttempts"
            value={formData.retryAttempts || 3}
            min="0"
            max="10"
            onChange={handleChange}
            className="form-input"
          />
          <p className="form-help-text">Number of retry attempts on failure (default: 3)</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="retry-delay">Retry Delay (seconds)</label>
          <input
            type="number"
            id="retry-delay"
            name="retryDelay"
            value={formData.retryDelay || 5}
            min="1"
            max="60"
            onChange={handleChange}
            className="form-input"
          />
          <p className="form-help-text">Delay between retry attempts in seconds (default: 5)</p>
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
      
      {/* Authentication Settings */}
      <div className="advanced-section">
        <h3>Authentication</h3>
        
        <div className="form-group">
          <label htmlFor="auth-type">Authentication Type</label>
          <select
            id="auth-type"
            name="authType"
            value={(formData.authType ?? 'none') as 'none' | 'basic' | 'bearer' | 'api-key'}
            onChange={handleAuthTypeChange}
            className="form-select"
          >
            <option value="none">None</option>
            <option value="basic">Basic Auth</option>
            <option value="bearer">Bearer Token</option>
            <option value="api-key">API Key</option>
          </select>
        </div>
        
        {(formData.authType === 'basic') && (
          <>
            <div className="form-group">
              <label htmlFor="auth-username">Username</label>
              <input
                type="text"
                id="auth-username"
                name="authUsername"
                value={formData.authUsername || ''}
                onChange={handleChange}
                className="form-input"
                placeholder="Basic auth username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="auth-password">Password</label>
              <input
                type="password"
                id="auth-password"
                name="authPassword"
                value={formData.authPassword || ''}
                onChange={handleChange}
                className="form-input"
                placeholder="Basic auth password"
              />
            </div>
          </>
        )}
        
        {(formData.authType === 'bearer') && (
          <div className="form-group">
            <label htmlFor="auth-token">Bearer Token</label>
            <input
              type="text"
              id="auth-token"
              name="authToken"
              value={formData.authToken || ''}
              onChange={handleChange}
              className="form-input"
              placeholder="Bearer token"
            />
          </div>
        )}
        
        {(formData.authType === 'api-key') && (
          <>
            <div className="form-group">
              <label htmlFor="auth-api-key">API Key</label>
              <input
                type="text"
                id="auth-api-key"
                name="authApiKey"
                value={formData.authApiKey || ''}
                onChange={handleChange}
                className="form-input"
                placeholder="API key value"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="auth-api-key-header">Header Name</label>
              <input
                type="text"
                id="auth-api-key-header"
                name="authApiKeyHeader"
                value={formData.authApiKeyHeader || 'X-API-Key'}
                onChange={handleChange}
                className="form-input"
                placeholder="Header name for API key"
              />
            </div>
          </>
        )}
      </div>
      
      {/* Alert Settings */}
      <div className="advanced-section">
        <h3>Alert Settings</h3>
        
        <div className="form-group">
          <label htmlFor="email-alerts">
            <input
              type="checkbox"
              id="email-alerts"
              name="emailAlerts"
              checked={(formData.emailAlerts ?? false) as boolean}
              onChange={handleChange}
              className="form-checkbox"
            />
            Enable Email Alerts
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="webhook-alerts">
            <input
              type="checkbox"
              id="webhook-alerts"
              name="webhookAlerts"
              checked={(formData.webhookAlerts ?? false) as boolean}
              onChange={handleChange}
              className="form-checkbox"
            />
            Enable Webhook Alerts
          </label>
        </div>
        
        {((formData.webhookAlerts ?? false) as boolean) && (
          <div className="form-group">
            <label htmlFor="webhook-url">Webhook URL</label>
            <input
              type="url"
              id="webhook-url"
              name="webhookUrl"
              value={formData.webhookUrl || ''}
              onChange={handleChange}
              className="form-input"
              placeholder="https://your-webhook-url.com/endpoint"
            />
            <p className="form-help-text">URL to send webhook alerts to</p>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="alert-on-down">
            <input
              type="checkbox"
              id="alert-on-down"
              name="alertOnDown"
              checked={(formData.alertOnDown ?? true) as boolean}
              onChange={handleChange}
              className="form-checkbox"
            />
            Alert When Down
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="alert-on-up">
            <input
              type="checkbox"
              id="alert-on-up"
              name="alertOnUp"
              checked={(formData.alertOnUp ?? false) as boolean}
              onChange={handleChange}
              className="form-checkbox"
            />
            Alert When Back Up
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="alert-on-degraded">
            <input
              type="checkbox"
              id="alert-on-degraded"
              name="alertOnDegraded"
              checked={(formData.alertOnDegraded ?? false) as boolean}
              onChange={handleChange}
              className="form-checkbox"
            />
            Alert When Degraded Performance
          </label>
        </div>
      </div>
    </div>
  );
};