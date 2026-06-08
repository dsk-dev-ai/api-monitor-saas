import React from 'react';
import { WizardContainer } from './index';

const MonitorWizardUsageExample: React.FC = () => {
  const handleCreateMonitor = (formData: any) => {
    console.log('Creating monitor with data:', formData);
    // Here you would typically send the data to your API
    alert('Monitor created successfully!');
  };

  const handleCancel = () => {
    console.log('Wizard cancelled');
    // Handle cancellation (e.g., navigate back)
  };

  return (
    <div className="monitor-wizard-wrapper">
      <WizardContainer 
        onComplete={handleCreateMonitor}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default MonitorWizardUsageExample;