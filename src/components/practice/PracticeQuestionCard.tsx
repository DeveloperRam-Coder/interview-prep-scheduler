
import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuestionType {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  description: string;
}

interface PracticeQuestionCardProps {
  question: QuestionType;
  type: 'technical' | 'behavioral';
}

const PracticeQuestionCard = ({ question, type }: PracticeQuestionCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">{question.title}</CardTitle>
          <Badge 
            variant="outline" 
            className={cn("ml-2 capitalize", getDifficultyColor(question.difficulty))}
          >
            {question.difficulty}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">{question.category}</div>
      </CardHeader>
      
      <CardContent>
        <div className={cn(
          "text-sm transition-all duration-300 overflow-hidden",
          expanded ? "max-h-96" : "max-h-20"
        )}>
          <p>{question.description}</p>
          
          {expanded && type === 'technical' && (
            <div className="mt-4 space-y-2">
              <p className="font-medium">Tips:</p>
              <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                <li>Consider time and space complexity</li>
                <li>Handle edge cases (empty input, etc.)</li>
                <li>Test your solution with examples</li>
              </ul>
            </div>
          )}
          
          {expanded && type === 'behavioral' && (
            <div className="mt-4 space-y-2">
              <p className="font-medium">Tips:</p>
              <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                <li>Use the STAR method (Situation, Task, Action, Result)</li>
                <li>Be specific and provide concrete examples</li>
                <li>Focus on your individual contribution</li>
              </ul>
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2 h-8 text-xs font-normal text-muted-foreground hover:text-foreground"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show More
            </>
          )}
        </Button>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button size="sm" className="w-full">
          {type === 'technical' ? 'Solve Challenge' : 'Practice Response'}
          <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PracticeQuestionCard;
