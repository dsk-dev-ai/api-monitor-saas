'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMonitors } from '@/hooks/use-monitors';
import { WizardContainer, MonitorWizardFormData } from '@/components/monitors/wizard';

export default function CreateMonitorPage() {
  const router = useRouter();
  const { createMonitor, isLoading: isCreating } = useMonitors();
  const [isWizardOpen, setIsWizardOpen] = useState(true);

  const handleWizardComplete = async (formData: MonitorWizardFormData) => {
    try {
      const result = await createMonitor(formData);
      if (result.success) {
        // Close wizard and redirect to monitors list
        setIsWizardOpen(false);
        router.push('/(dashboard)/monitors');
      } else {
        throw new Error(result.error || 'Failed to create monitor');
      }
    } catch (error) {
      console.error('Error creating monitor:', error);
      // Error will be handled by the wizard container
      throw error;
    }
  };

  const handleWizardCancel = () => {
    setIsWizardOpen(false);
    router.push('/(dashboard)/monitors');
  };

  if (!isWizardOpen) {
    // Redirect to monitors list if wizard is closed
    router.push('/(dashboard)/monitors');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md">
          <WizardContainer
            onComplete={handleWizardComplete}
            onCancel={handleWizardCancel}
          />
        </div>
      </div>
    </div>
  );
}