
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const StatsOverview = () => {
  // This would come from your backend in a real app
  const stats = {
    completed: 2,
    upcoming: 3,
    cancelled: 1,
    passRate: 75,
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Interview Pass Rate</span>
          <span className="text-sm font-medium">{stats.passRate}%</span>
        </div>
        <Progress value={stats.passRate} className="h-2" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm">Completed</span>
          </div>
          <span className="font-medium">{stats.completed}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm">Upcoming</span>
          </div>
          <span className="font-medium">{stats.upcoming}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
            <span className="text-sm">Cancelled</span>
          </div>
          <span className="font-medium">{stats.cancelled}</span>
        </div>
      </div>
      
      <div className="pt-4 text-center">
        <a href="/practice" className="text-sm text-primary hover:underline">
          Practice to improve your stats
        </a>
      </div>
    </div>
  );
};

export default StatsOverview;
