
import { Book, FileText, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'guide' | 'video';
  url: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Top 10 Algorithm Problems for Technical Interviews',
    type: 'article',
    url: '/resources/technical',
  },
  {
    id: '2',
    title: 'STAR Method Response Guide',
    type: 'guide',
    url: '/resources/behavioral',
  },
  {
    id: '3',
    title: 'Mock Interview Best Practices',
    type: 'video',
    url: '/resources/mock',
  },
];

const RecentResources = () => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'guide':
        return <Book className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const getResourceClass = (type: string) => {
    switch (type) {
      case 'article':
        return 'text-blue-600 bg-blue-100';
      case 'guide':
        return 'text-amber-600 bg-amber-100';
      case 'video':
        return 'text-rose-600 bg-rose-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <div className="space-y-3">
      {resources.map((resource) => (
        <a 
          key={resource.id} 
          href={resource.url}
          className="flex items-start gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors"
        >
          <div className={cn(
            'rounded-full p-1.5 flex-shrink-0 mt-0.5', 
            getResourceClass(resource.type),
            'dark:bg-background'
          )}>
            {getResourceIcon(resource.type)}
          </div>
          
          <div>
            <p className="text-sm font-medium">{resource.title}</p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">
              {resource.type}
            </p>
          </div>
        </a>
      ))}
      
      <div className="pt-2">
        <a href="/resources" className="text-sm text-primary hover:underline">
          View all resources
        </a>
      </div>
    </div>
  );
};

export default RecentResources;
