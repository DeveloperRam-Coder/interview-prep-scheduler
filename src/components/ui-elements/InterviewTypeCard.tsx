
import { cn } from '@/lib/utils';

interface InterviewTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const InterviewTypeCard = ({
  title,
  description,
  icon,
  isSelected,
  onClick,
}: InterviewTypeCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative p-6 rounded-xl transition-all duration-300 cursor-pointer hover-lift',
        isSelected 
          ? 'bg-primary/5 border-2 border-primary shadow-soft' 
          : 'bg-card border border-border shadow-soft hover:border-primary/20'
      )}
    >
      <div className="flex flex-col gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
            isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
          )}
        >
          {icon}
        </div>
        
        <div>
          <h3 className={cn('text-lg font-medium mb-2', isSelected ? 'text-primary' : 'text-foreground')}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        {isSelected && (
          <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary animate-pulse-slow" />
        )}
      </div>
    </div>
  );
};

export default InterviewTypeCard;
