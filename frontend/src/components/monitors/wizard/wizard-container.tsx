import { useState, useCallback } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { WizardStep, WizardSteps, MonitorWizardFormData } from './monitor-wizard';
import { cn } from '@/lib/utils';

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

  const validateStep = useCallback((step: number): boolean => {
    switch (step) {
      case 1: // Basic Configuration
        return !!formData.name && !!formData.url;
      case 2: // Advanced Settings
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
        setCurrentStep((prev) => prev + 1);
        setError(null);
      } else {
        setError('Please complete all required fields before proceeding');
      }
    }
  }, [currentStep, validateStep]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setError(null);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= WizardSteps.length) {
        if (step <= currentStep || validateStep(step - 1)) {
          setCurrentStep(step);
          setError(null);
        } else {
          setError('Please complete previous steps before proceeding');
        }
      }
    },
    [validateStep, currentStep]
  );

  const updateFormData = useCallback((data: Partial<MonitorWizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
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
      const result = await onComplete(formData);
      if (result && result.success === false) {
        throw new Error(result.error || 'Failed to create monitor');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create monitor');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onComplete, validateStep]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const currentWizardStep = WizardSteps.find((step) => step.id === currentStep);

  return (
    <div className="space-y-6 p-6 sm:p-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {currentWizardStep?.title}
        </h2>
        <p className="mt-1.5 text-muted-foreground">{currentWizardStep?.description}</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <div className="relative">
        <div
          className="absolute left-0 right-0 top-[18px] h-0.5 rounded-full bg-border"
          aria-hidden
        />
        <ol className="relative flex justify-between">
          {WizardSteps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <li key={step.id} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToStep(step.id)}
                  className={cn(
                    'z-10 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                    isActive &&
                      'border-transparent bg-gradient-brand text-white shadow-md shadow-primary/30',
                    isCompleted &&
                      'border-transparent bg-emerald-500/90 text-white',
                    !isActive &&
                      !isCompleted &&
                      'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </button>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:block',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="min-h-[280px]">
        {currentWizardStep ? (
          <currentWizardStep.component formData={formData} onUpdate={updateFormData} />
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-6">
        <button
          type="button"
          onClick={currentStep === 1 ? handleCancel : goToPrevStep}
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
        >
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </button>

        {currentStep < WizardSteps.length ? (
          <button
            type="button"
            onClick={goToNextStep}
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-brand px-6 text-sm font-medium text-white shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? 'Next...' : 'Next'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-brand px-6 text-sm font-medium text-white shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Monitor'
            )}
          </button>
        )}
      </div>
    </div>
  );
};
