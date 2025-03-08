
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  FileText, 
  BookOpen, 
  Code, 
  Users, 
  Plus, 
  BarChart,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InterviewsList from '@/components/dashboard/InterviewsList';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecentResources from '@/components/dashboard/RecentResources';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const quickActions = [
    {
      icon: <Calendar className="h-5 w-5" />,
      title: 'Schedule Interview',
      description: 'Book a new interview session',
      link: '/schedule',
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: 'Practice Coding',
      description: 'Solve technical problems',
      link: '/practice',
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Mock Interview',
      description: 'Simulate real interviews',
      link: '/practice',
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: 'Resources',
      description: 'Interview prep materials',
      link: '/resources',
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-1 pt-24 pb-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage your interviews and track your progress
              </p>
            </div>
            
            <Link to="/schedule">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Schedule New Interview
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-primary/10 text-primary">
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 md:w-[400px] h-11">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Upcoming Interviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <InterviewsList />
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5" />
                        Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StatsOverview />
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Recent Job Matches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">No job matches yet. Complete your profile to get matched with job opportunities.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Latest Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentResources />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="interviews">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Interviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <InterviewsList expanded />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">Complete practice sessions to track your progress</p>
                    <Link to="/practice">
                      <Button>Start Practice</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
