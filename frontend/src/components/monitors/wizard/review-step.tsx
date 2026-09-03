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
      </div>
    </div>
  );
};