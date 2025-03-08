
import { Textarea } from '@/components/ui/textarea';
import ScheduleCalendar from '@/components/ui-elements/ScheduleCalendar';

interface InterviewSchedulingProps {
  date: Date | undefined;
  time: string | undefined;
  additionalInfo: string;
  updateField: (field: string, value: any) => void;
}

const InterviewScheduling = ({ 
  date, 
  time, 
  additionalInfo, 
  updateField 
}: InterviewSchedulingProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-medium text-foreground mb-2">Schedule Interview</h2>
        <p className="text-muted-foreground">Pick a date and time that works for you.</p>
      </div>
      
      <ScheduleCalendar
        selectedDate={date}
        onDateChange={(date) => updateField('date', date)}
        selectedTime={time}
        onTimeChange={(time) => updateField('time', time)}
      />
      
      <div className="space-y-2">
        <label htmlFor="additionalInfo" className="text-sm font-medium text-foreground">
          Additional Information
        </label>
        <Textarea
          id="additionalInfo"
          placeholder="Add any additional details or requests"
          value={additionalInfo}
          onChange={(e) => updateField('additionalInfo', e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default InterviewScheduling;
