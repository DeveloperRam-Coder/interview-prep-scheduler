
import { BookOpen, ExternalLink, FileText, Star, Video, Book, Lock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide';
  category: string;
  author: string;
  imageUrl: string;
  popularity: number;
  premium: boolean;
}

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'guide':
        return <Book className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };
  
  const getResourceClass = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300';
      case 'video':
        return 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300';
      case 'guide':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={resource.imageUrl} 
          alt={resource.title}
          className="w-full h-full object-cover"
        />
        <Badge 
          variant="secondary"
          className={`absolute top-2 left-2 capitalize gap-1 ${getResourceClass(resource.type)}`}
        >
          {getResourceIcon(resource.type)}
          {resource.type}
        </Badge>
        
        {resource.premium && (
          <Badge 
            variant="secondary"
            className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-300 text-black gap-1"
          >
            <Lock className="h-3 w-3" />
            Premium
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="font-medium leading-tight">{resource.title}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{resource.author}</span>
          <span>•</span>
          <div className="flex items-center">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-0.5" />
            {resource.popularity}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="py-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {resource.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-4 pb-4">
        <Button className="w-full gap-1" variant={resource.premium ? "default" : "outline"}>
          {resource.premium ? 'Unlock Premium' : 'View Resource'}
          <ExternalLink className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
