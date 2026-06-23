import React from 'react';
import { MonitorWizardFormData } from './monitor-wizard';

interface ReviewStepProps {
  formData: MonitorWizardFormData;
  onUpdate: (data: Partial<MonitorWizardFormData>) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ 
  formData, 
  onUpdate 
}) => {
  // Format expected status for display
  const getExpectedStatusDisplay = (status?: number): string => {
    if (!status) return 'Any 2xx';
    if (status >= 200 && status < 300) return `${status}`;
    return `${status}`;
  };

  return (
    <div className="wizard-step-content">
      <div className="review-section">
        <h3>Basic Configuration</h3>
        <div className="review-item">
          <span className="review-label">Monitor Name:</span>
          <span className="review-value">{formData.name || 'Not set'}</span>
        </div>
        <div className="review-item">
          <span className="review-label">URL:</span>
          <span className="review-value">{formData.url || 'Not set'}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Method:</span>
          <span className="review-value">{formData.method || 'GET'}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Check Interval:</span>
          <span className="review-value">{formData.interval || 60} seconds</span>
        </div>
      </div>
      
      <div className="review-section">
        <h3>Advanced Settings</h3>
        <div className="review-item">
          <span className="review-label">Timeout:</span>
          <span className="review-value">{formData.timeout !== undefined ? formData.timeout : 30} seconds</span>
        </div>
        <div className="review-item">
          <span className="review-label">Expected Status:</span>
          <span className="review-value">{getExpectedStatusDisplay(formData.expectedStatus)}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Expected Keyword:</span>
          <span className="review-value">{formData.expectedKeyword || 'None'}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Follow Redirects:</span>
          <span className="review-value">{formData.followRedirects ?? true ? 'Yes' : 'No'}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Ignore SSL Errors:</span>
          <span className="review-value">{formData.ignoreSSL ?? false ? 'Yes' : 'No'}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Retry Attempts:</span>
          <span className="review-value">{formData.retryAttempts !== undefined ? formData.retryAttempts : 3}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Retry Delay:</span>
          <span className="review-value">{formData.retryDelay !== undefined ? formData.retryDelay : 5} seconds</span>
        </div>
      </div>
      
      {(formData.authType && formData.authType !== 'none') && (
        <div className="review-section">
          <h3>Authentication</h3>
          <div className="review-item">
            <span className="review-label">Auth Type:</span>
            <span className="review-value">
              {formData.authType === 'basic' ? 'Basic Auth' :
               formData.authType === 'bearer' ? 'Bearer Token' :
               formData.authType === 'api-key' ? 'API Key' :
               formData.authType}
            </span>
          </div>
          {(formData.authType === 'basic') && (
            <>
              <div className="review-item">
                <span className="review-label">Username:</span>
                <span className="review-value">{formData.authUsername || 'Not set'}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Password:</span>
                <span className="review-value">••••••••</span>
              </div>
            </>
          )}
          {(formData.authType === 'bearer') && (
            <div className="review-item">
              <span className="review-label">Token:</span>
              <span className="review-value">••••••••</span>
            </div>
          )}
          {(formData.authType === 'api-key') && (
            <>
              <div className="review-item">
                <span className="review-label">API Key:</span>
                <span className="review-value">••••••••</span>
              </div>
              <div className="review-item">
                <span className="review-label">Header Name:</span>
                <span className="review-value">{formData.authApiKeyHeader || 'X-API-Key'}</span>
              </div>
            </>
          )}
        </div>
      )}
      
      {(formData.emailAlerts || formData.webhookAlerts) && (
        <div className="review-section">
          <h3>Alert Settings</h3>
          <div className="review-item">
            <span className="review-label">Email Alerts:</span>
            <span className="review-value">{formData.emailAlerts ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Webhook Alerts:</span>
            <span className="review-value">{formData.webhookAlerts ? 'Enabled' : 'Disabled'}</span>
          </div>
          {formData.webhookAlerts && formData.webhookUrl && (
            <div className="review-item">
              <span className="review-label">Webhook URL:</span>
              <span className="review-value">{formData.webhookUrl}</span>
            </div>
          )}
          <div className="review-item">
            <span className="review-label">Alert Conditions:</span>
            <span className="review-value">
              {[
                ((formData.alertOnDown ?? true) as boolean) && 'Down',
                ((formData.alertOnUp ?? false) as boolean) && 'Up',
                ((formData.alertOnDegraded ?? false) as boolean) && 'Degraded'
              ]
                .filter(Boolean)
                .join(', ') || 'None'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};