
import { Input } from '@/components/ui/input';

interface InterviewPersonalDetailsProps {
  name: string;
  email: string;
  phone: string;
  updateField: (field: string, value: any) => void;
}

const InterviewPersonalDetails = ({ name, email, phone, updateField }: InterviewPersonalDetailsProps) => {
  return (
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
            value={name}
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
            value={email}
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
            value={phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewPersonalDetails;
