'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMonitors } from '@/hooks/use-monitors';
import { WizardContainer, MonitorWizardFormData } from '@/components/monitors/wizard';
import { MotionDiv } from '@/components/motion/motion-primitives';

export default function CreateMonitorPage() {
  const router = useRouter();
  const { createMonitor, isLoading: isCreating } = useMonitors();
  const [isWizardOpen, setIsWizardOpen] = useState(true);

  const handleWizardComplete = async (formData: MonitorWizardFormData) => {
    try {
      const result = await createMonitor(formData);
      if (result.success) {
        setIsWizardOpen(false);
        router.push('/monitors');
      } else {
        throw new Error(result.error || 'Failed to create monitor');
      }
    } catch (error) {
      console.error('Error creating monitor:', error);
      throw error;
    }
  };

  const handleWizardCancel = () => {
    setIsWizardOpen(false);
    router.push('/monitors');
  };

  if (!isWizardOpen) {
    router.push('/monitors');
    return null;
  }

  return (
    <MotionDiv className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-sm">
          <WizardContainer
            onComplete={handleWizardComplete}
            onCancel={handleWizardCancel}
          />
        </div>
      </div>
    </MotionDiv>
  );
}
