
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import StepIndicator from './interview/StepIndicator';
import InterviewPersonalDetails from './interview/InterviewPersonalDetails';
import InterviewTypeSelection from './interview/InterviewTypeSelection';
import InterviewScheduling from './interview/InterviewScheduling';
import FormControls from './interview/FormControls';
import { interviewTypes, initialFormData, InterviewFormData } from './interview/formData';

const InterviewForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InterviewFormData>(initialFormData);
  
  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email) {
        toast.error('Please fill in all required fields');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.interviewType) {
        toast.error('Please select an interview type');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!formData.date || !formData.time) {
        toast.error('Please select both date and time');
        return;
      }
      // Submit the form
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleSubmit = () => {
    // In a real app, you would send this data to your backend
    console.log('Submitting form data:', formData);
    
    // Show success toast
    toast.success('Interview scheduled successfully!');
    
    // Navigate to success page with form data
    navigate('/success', { state: { formData } });
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto glass rounded-2xl p-6 md:p-8 shadow-medium animate-scale-in">
      {/* Step indicator */}
      <StepIndicator currentStep={currentStep} />
      
      {/* Step 1: Personal Details */}
      {currentStep === 1 && (
        <InterviewPersonalDetails 
          name={formData.name}
          email={formData.email}
          phone={formData.phone}
          updateField={updateField}
        />
      )}
      
      {/* Step 2: Interview Type */}
      {currentStep === 2 && (
        <InterviewTypeSelection 
          interviewTypes={interviewTypes}
          selectedType={formData.interviewType}
          updateField={updateField}
        />
      )}
      
      {/* Step 3: Schedule */}
      {currentStep === 3 && (
        <InterviewScheduling 
          date={formData.date}
          time={formData.time}
          additionalInfo={formData.additionalInfo}
          updateField={updateField}
        />
      )}
      
      {/* Form controls */}
      <FormControls 
        currentStep={currentStep}
        handleBack={handleBack}
        handleNext={handleNext}
      />
    </div>
  );
};

export default InterviewForm;
