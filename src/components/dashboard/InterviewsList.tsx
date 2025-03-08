
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Edit, Trash, Code, Users, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Interview {
  id: string;
  type: 'technical' | 'behavioral' | 'mock';
  date: Date;
  time: string;
  company?: string;
  notes?: string;
}

const mockInterviews: Interview[] = [
  {
    id: '1',
    type: 'technical',
    date: new Date(2023, 6, 15, 10, 0),
    time: '10:00 AM',
    company: 'TechCorp',
    notes: 'Prepare for algorithms and data structures questions',
  },
  {
    id: '2',
    type: 'behavioral',
    date: new Date(2023, 6, 18, 14, 0),
    time: '2:00 PM',
    company: 'Innovate Solutions',
    notes: 'Review STAR method responses',
  },
  {
    id: '3',
    type: 'mock',
    date: new Date(2023, 6, 20, 15, 0),
    time: '3:00 PM',
  },
];

interface InterviewsListProps {
  expanded?: boolean;
}

const InterviewsList = ({ expanded = false }: InterviewsListProps) => {
  const [interviews] = useState<Interview[]>(mockInterviews);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const getInterviewIcon = (type: string) => {
    switch (type) {
      case 'technical':
        return <Code className="h-5 w-5" />;
      case 'behavioral':
        return <Users className="h-5 w-5" />;
      case 'mock':
        return <Video className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };
  
  const handleEdit = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    // In a real app, this would call an API
    toast.success('Interview cancelled successfully');
  };
  
  const displayedInterviews = expanded ? interviews : interviews.slice(0, 3);
  
  if (displayedInterviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No interviews scheduled yet</p>
        <Button asChild>
          <a href="/schedule">Schedule an Interview</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {displayedInterviews.map((interview) => (
        <div 
          key={interview.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-4"
        >
          <div className="flex items-start gap-4">
            <div className={`rounded-full p-2 
              ${interview.type === 'technical' ? 'bg-blue-100 text-blue-600' : 
                interview.type === 'behavioral' ? 'bg-purple-100 text-purple-600' : 
                'bg-green-100 text-green-600'} 
              dark:bg-background`}
            >
              {getInterviewIcon(interview.type)}
            </div>
            
            <div>
              <h3 className="font-medium">
                {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview
                {interview.company && ` • ${interview.company}`}
              </h3>
              
              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-2 sm:gap-4 mt-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(interview.date, 'MMMM d, yyyy')}
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {interview.time}
                </div>
              </div>
              
              {expanded && interview.notes && (
                <p className="text-sm mt-2 text-muted-foreground">{interview.notes}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => handleEdit(interview)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleDelete(interview.id)}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      ))}
      
      {!expanded && interviews.length > 3 && (
        <Button variant="link" asChild className="w-full">
          <a href="/dashboard?tab=interviews">View all interviews</a>
        </Button>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Interview</DialogTitle>
          </DialogHeader>
          
          {selectedInterview && (
            <div className="py-4">
              <p className="text-muted-foreground text-sm">
                This feature will be available soon.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => setIsDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterviewsList;
