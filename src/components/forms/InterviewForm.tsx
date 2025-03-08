
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Users, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import InterviewTypeCard from '@/components/ui-elements/InterviewTypeCard';
import ScheduleCalendar from '@/components/ui-elements/ScheduleCalendar';

const interviewTypes = [
  {
    id: 'technical',
    title: 'Technical Interview',
    description: 'Coding challenges and technical questions to assess your skills.',
    icon: <Code className="h-6 w-6" />,
  },
  {
    id: 'behavioral',
    title: 'Behavioral Interview',
    description: 'Questions about your experiences, teamwork, and soft skills.',
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: 'mock',
    title: 'Mock Interview',
    description: 'Practice interview with feedback to help you improve.',
    icon: <Video className="h-6 w-6" />,
  },
];

const InterviewForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interviewType: '',
    date: undefined as Date | undefined,
    time: undefined as string | undefined,
    additionalInfo: '',
  });
  
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
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((step) => (
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
              {step === 1 ? 'Details' : step === 2 ? 'Type' : 'Schedule'}
            </span>
          </div>
        ))}
      </div>
      
      {/* Step 1: Personal Details */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-medium text-foreground mb-2">Personal Details</h2>
            <p className="text-muted-foreground">Tell us about yourself so we can contact you.</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone Number
              </label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Step 2: Interview Type */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-medium text-foreground mb-2">Interview Type</h2>
            <p className="text-muted-foreground">Select the type of interview you'd like to schedule.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {interviewTypes.map((type) => (
              <InterviewTypeCard
                key={type.id}
                title={type.title}
                description={type.description}
                icon={type.icon}
                isSelected={formData.interviewType === type.id}
                onClick={() => updateField('interviewType', type.id)}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Step 3: Schedule */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-medium text-foreground mb-2">Schedule Interview</h2>
            <p className="text-muted-foreground">Pick a date and time that works for you.</p>
          </div>
          
          <ScheduleCalendar
            selectedDate={formData.date}
            onDateChange={(date) => updateField('date', date)}
            selectedTime={formData.time}
            onTimeChange={(time) => updateField('time', time)}
          />
          
          <div className="space-y-2">
            <label htmlFor="additionalInfo" className="text-sm font-medium text-foreground">
              Additional Information
            </label>
            <Textarea
              id="additionalInfo"
              placeholder="Add any additional details or requests"
              value={formData.additionalInfo}
              onChange={(e) => updateField('additionalInfo', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
      )}
      
      {/* Form controls */}
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
          {currentStep < 3 ? 'Next' : 'Schedule Interview'}
        </Button>
      </div>
    </div>
  );
};

export default InterviewForm;

const cn = (...args: any) => args.filter(Boolean).join(' ');
