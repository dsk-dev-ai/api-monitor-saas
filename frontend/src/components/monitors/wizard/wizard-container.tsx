import { useState, useCallback, useEffect } from 'react';
import { WizardStep, WizardSteps, MonitorWizardFormData } from './monitor-wizard';
import styles from './wizard-container.module.css';

interface WizardContainerProps {
  onComplete: (formData: MonitorWizardFormData) => Promise<{ success?: boolean; error?: string } | void>;
  onCancel: () => void;
}

export const WizardContainer: React.FC<WizardContainerProps> = (props: WizardContainerProps) => {
  const { onComplete, onCancel } = props;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MonitorWizardFormData>({
    name: '',
    url: '',
    method: 'GET',
    interval: 60,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate form data before proceeding to next step
  const validateStep = useCallback((step: number): boolean => {
    switch (step) {
      case 1: // Basic Configuration
        return !!formData.name && !!formData.url;
      case 2: // Advanced Settings
        // Basic validation for advanced settings
        return true;
      case 3: // Review & Create
        return !!formData.name && !!formData.url;
      default:
        return true;
    }
  }, [formData]);

  const goToNextStep = useCallback(() => {
    if (currentStep < WizardSteps.length) {
      if (validateStep(currentStep)) {
        setCurrentStep(prev => prev + 1);
        setError(null);
      } else {
        setError('Please complete all required fields before proceeding');
      }
    }
  }, [currentStep, validateStep]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setError(null);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= WizardSteps.length) {
      // Allow going back to any step, but going forward requires validation
      if (step <= currentStep || validateStep(step - 1)) {
        setCurrentStep(step);
        setError(null);
      } else {
        setError('Please complete previous steps before proceeding');
      }
    }
  }, [validateStep, currentStep]);

  const updateFormData = useCallback((data: Partial<MonitorWizardFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    // Clear error when form data changes
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(WizardSteps.length)) {
      setError('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Simulate API call delay
      const result = await onComplete(formData);

      if (result && result.success === false) {
        throw new Error(result.error || 'Failed to create monitor');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create monitor');
      console.error('Error creating monitor:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onComplete, validateStep]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const currentWizardStep = WizardSteps.find(step => step.id === currentStep);

  // Reset form when wizard is cancelled or completed
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className={styles.wizardContainer}>
      <div className={styles.wizardHeader}>
        <h2 className={styles.wizardTitle}>{currentWizardStep?.title}</h2>
        <p className={styles.wizardDescription}>{currentWizardStep?.description}</p>
      </div>
      
      {error && (
        <div className={styles.wizardError}>
          {error}
        </div>
      )}
      
      <div className={styles.wizardSteps}>
        {WizardSteps.map(step => (
          <div 
            key={step.id}
            className={`${styles.wizardStep} ${step.id === currentStep ? styles.active : ''} ${step.id < currentStep ? styles.completed : ''}`}
          >
            <div className={styles.wizardStepNumber}>{step.id}</div>
            <div className={styles.wizardStepTitle}>{step.title}</div>
          </div>
        ))}
      </div>
      
      <div className={styles.wizardContent}>
        {currentWizardStep ? (
          <currentWizardStep.component 
            formData={formData} 
            onUpdate={updateFormData} 
          />
        ) : null}
      </div>
      
      <div className={styles.wizardFooter}>
        <button 
          onClick={handleCancel} 
          className={`${styles.wizardBtn} ${styles.wizardBtnSecondary}`}
          disabled={isSubmitting || currentStep === 1}
        >
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </button>
        
        {currentStep < WizardSteps.length ? (
          <button 
            onClick={goToNextStep} 
            className={`${styles.wizardBtn} ${styles.wizardBtnPrimary}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Next...' : 'Next'}
          </button>
        ) : (
          <button 
            onClick={handleSubmit} 
            className={`${styles.wizardBtn} ${styles.wizardBtnPrimary}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Monitor'}
          </button>
        )}
      </div>
    </div>
  );
};