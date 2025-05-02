
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
              currentStep === step
                ? 'bg-primary text-primary-foreground'
                : currentStep > step
                ? 'bg-primary/20 text-primary'
                : 'bg-secondary text-muted-foreground'
            )}
          >
            {step}
          </div>
          <span className="text-xs mt-2 text-muted-foreground">
            {step === 1 ? 'Details' : step === 2 ? 'Type' : step === 3 ? 'Schedule' : 'Payment'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
