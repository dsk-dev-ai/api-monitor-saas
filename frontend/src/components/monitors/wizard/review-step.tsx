import React from 'react';
import { MonitorWizardFormData } from './monitor-wizard';
import styles from './wizard-container.module.css';

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
    <div className={styles.wizardStepContent}>
      <div className={styles.reviewSection}>
        <h3>Basic Configuration</h3>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Monitor Name:</span>
          <span className={styles.reviewValue}>{formData.name || 'Not set'}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>URL:</span>
          <span className={styles.reviewValue}>{formData.url || 'Not set'}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Method:</span>
          <span className={styles.reviewValue}>{formData.method || 'GET'}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Check Interval:</span>
          <span className={styles.reviewValue}>{formData.interval || 60} seconds</span>
        </div>
      </div>
      
      <div className={styles.reviewSection}>
        <h3>Advanced Settings</h3>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Timeout:</span>
          <span className={styles.reviewValue}>{formData.timeout !== undefined ? formData.timeout : 30} seconds</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Expected Status:</span>
          <span className={styles.reviewValue}>{getExpectedStatusDisplay(formData.expectedStatus)}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Expected Keyword:</span>
          <span className={styles.reviewValue}>{formData.expectedKeyword || 'None'}</span>
        </div>
      </div>
    </div>
  );
};