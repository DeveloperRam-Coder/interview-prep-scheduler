
import { ReactNode } from 'react';
import InterviewTypeCard from '@/components/ui-elements/InterviewTypeCard';

interface InterviewType {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

interface InterviewTypeSelectionProps {
  interviewTypes: InterviewType[];
  selectedType: string;
  updateField: (field: string, value: any) => void;
}

const InterviewTypeSelection = ({ 
  interviewTypes, 
  selectedType, 
  updateField 
}: InterviewTypeSelectionProps) => {
  return (
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
            isSelected={selectedType === type.id}
            onClick={() => updateField('interviewType', type.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default InterviewTypeSelection;
