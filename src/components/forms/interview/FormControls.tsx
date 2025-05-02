
import { Button } from '@/components/ui/button';

interface FormControlsProps {
  currentStep: number;
  handleBack: () => void;
  handleNext: () => void;
}

const FormControls = ({ currentStep, handleBack, handleNext }: FormControlsProps) => {
  return (
    <div className="flex justify-between mt-8 pt-4 border-t border-border">
      {currentStep > 1 ? (
        <Button
          variant="outline"
          onClick={handleBack}
          className="transition-all duration-300"
        >
          Back
        </Button>
      ) : (
        <div></div>
      )}
      
      <Button onClick={handleNext} className="transition-all duration-300">
        {currentStep < 3 ? 'Next' : currentStep === 3 ? 'Continue to Payment' : 'Complete Payment'}
      </Button>
    </div>
  );
};

export default FormControls;
