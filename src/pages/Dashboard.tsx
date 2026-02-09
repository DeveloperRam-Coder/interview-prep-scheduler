import { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ChartComponent } from '@/components/dashboard/ChartComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api'; // Assuming generic API utility exist

interface Interview {
  id: string;
  interviewType: string;
  date: string;
  time: string;
  status: string;
  meetingUrl?: string;
  additionalInfo?: string;
}

const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call or fetch real data
    const fetchInterviews = async () => {
      try {
        // In a real app, use: const { data } = await api.get('/interviews');
        // Simulating delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        const mockData: Interview[] = [
          { id: '1', interviewType: 'technical', date: '2024-05-15', time: '10:00', status: 'CONFIRMED', meetingUrl: 'https://meet.google.com/abc-defg-hij' },
          { id: '2', interviewType: 'behavioral', date: '2024-05-18', time: '14:00', status: 'PENDING' },
          { id: '3', interviewType: 'mock', date: '2024-05-10', time: '11:00', status: 'COMPLETED' },
          { id: '4', interviewType: 'technical', date: '2024-05-20', time: '09:00', status: 'CONFIRMED' },
          { id: '5', interviewType: 'behavioral', date: '2024-05-22', time: '16:00', status: 'CANCELLED' },
        ];
        setInterviews(mockData);
      } catch (error) {
        console.error('Failed to fetch interviews', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: interviews.length,
      upcoming: interviews.filter(i => new Date(`${i.date}T${i.time}`) > new Date() && i.status !== 'CANCELLED').length,
      completed: interviews.filter(i => i.status === 'COMPLETED').length,
      cancelled: interviews.filter(i => i.status === 'CANCELLED').length,
    };
  }, [interviews]);

  // Chart data
  const chartData = useMemo(() => {
    const types = interviews.reduce((acc, curr) => {
      acc[curr.interviewType] = (acc[curr.interviewType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Technical', total: types['technical'] || 0 },
      { name: 'Behavioral', total: types['behavioral'] || 0 },
      { name: 'Mock', total: types['mock'] || 0 },
    ];
  }, [interviews]);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <StatsCards {...stats} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <ChartComponent data={chartData} />

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {loading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  interviews.slice(0, 5).map((interview) => (
                    <div key={interview.id} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none capitalize">
                          {interview.interviewType} Interview
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(interview.date), 'PPP')} at {interview.time}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        <Badge variant={
                          interview.status === 'CONFIRMED' ? 'default' :
                            interview.status === 'PENDING' ? 'secondary' :
                              interview.status === 'COMPLETED' ? 'outline' : 'destructive'
                        }>
                          {interview.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : interviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No interviews found.
                    </TableCell>
                  </TableRow>
                ) : (
                  interviews.slice(0, 5).map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell className="capitalize font-medium">{interview.interviewType}</TableCell>
                      <TableCell>{format(new Date(interview.date), 'PP')} - {interview.time}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{interview.status.toLowerCase()}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {interview.meetingUrl ? (
                          <Button size="sm" variant="link" asChild>
                            <a href={interview.meetingUrl} target="_blank" rel="noopener noreferrer">Join Link</a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">--</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 