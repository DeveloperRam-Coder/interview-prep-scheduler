import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { ChartContainer } from '../components/ui/chart';
import { Button } from '../components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Search } from 'lucide-react';

interface Interview {
  id: number;
  name: string;
  email: string;
  interviewType: string;
  date: string;
  time: string;
  additionalInfo: string;
}

const mockFetchScheduledInterviews = () => {
  // Simulate an API call with more data
  const types = ['Technical', 'Behavioral', 'Mock'];
  const data: Interview[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Candidate ${i + 1}`,
    email: `candidate${i + 1}@example.com`,
    interviewType: types[i % 3],
    date: `2024-07-${(i % 28) + 1}`,
    time: `${9 + (i % 8)}:00 AM`,
    additionalInfo: i % 5 === 0 ? 'Special request' : '',
  }));
  return Promise.resolve(data);
};

const PAGE_SIZE = 10;

const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    mockFetchScheduledInterviews().then((data) => {
      setInterviews(data);
      setLoading(false);
    });
  }, []);

  // Filter and sort
  const filtered = useMemo(() => {
    let data = interviews;
    if (search) {
      data = data.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.email.toLowerCase().includes(search.toLowerCase()) ||
        i.interviewType.toLowerCase().includes(search.toLowerCase())
      );
    }
    data = [...data].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = a.date.localeCompare(b.date);
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      if (sortBy === 'type') cmp = a.interviewType.localeCompare(b.interviewType);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [interviews, search, sortBy, sortDir]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Stats
  const total = interviews.length;
  const upcoming = interviews.filter(i => new Date(i.date) >= new Date()).length;
  const typeCounts = useMemo(() => {
    return interviews.reduce((acc, i) => {
      acc[i.interviewType] = (acc[i.interviewType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [interviews]);

  // Chart config
  const chartConfig = useMemo(() => {
    return Object.keys(typeCounts).reduce((acc, type) => {
      acc[type] = { label: type, color: type === 'Technical' ? '#3b82f6' : type === 'Behavioral' ? '#f59e42' : '#10b981' };
      return acc;
    }, {} as any);
  }, [typeCounts]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center justify-start py-8 bg-background">
        <div className="container w-full max-w-6xl">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center py-6">
              <CardTitle className="text-4xl font-bold">{total}</CardTitle>
              <p className="text-muted-foreground mt-2">Total Interviews</p>
            </Card>
            <Card className="text-center py-6">
              <CardTitle className="text-4xl font-bold">{upcoming}</CardTitle>
              <p className="text-muted-foreground mt-2">Upcoming Interviews</p>
            </Card>
            <Card className="text-center py-6">
              <CardTitle className="text-4xl font-bold">{Object.keys(typeCounts).length}</CardTitle>
              <p className="text-muted-foreground mt-2">Interview Types</p>
            </Card>
          </div>

          {/* Chart */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Interview Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64">
                  <ChartContainer config={chartConfig}>
                    {/* Example: Pie chart using recharts */}
                    {/* You can replace with BarChart, LineChart, etc. */}
                    <></>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or type..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-64"
              />
            </div>
            <div className="flex gap-2">
              <Button variant={sortBy === 'date' ? 'default' : 'outline'} onClick={() => setSortBy('date')}>Date</Button>
              <Button variant={sortBy === 'name' ? 'default' : 'outline'} onClick={() => setSortBy('name')}>Name</Button>
              <Button variant={sortBy === 'type' ? 'default' : 'outline'} onClick={() => setSortBy('type')}>Type</Button>
              <Button variant="ghost" onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>
                {sortDir === 'asc' ? 'Asc' : 'Desc'}
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>All scheduled interviews</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Additional Info</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                      </TableRow>
                    ) : paged.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">No interviews found.</TableCell>
                      </TableRow>
                    ) : (
                      paged.map((interview) => (
                        <TableRow key={interview.id}>
                          <TableCell>{interview.name}</TableCell>
                          <TableCell>{interview.email}</TableCell>
                          <TableCell>{interview.interviewType}</TableCell>
                          <TableCell>{interview.date}</TableCell>
                          <TableCell>{interview.time}</TableCell>
                          <TableCell>{interview.additionalInfo}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination */}
              <div className="flex justify-end mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} size={undefined} />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="px-3 py-1 rounded bg-muted text-muted-foreground">Page {page} of {Math.ceil(filtered.length / PAGE_SIZE)}</span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / PAGE_SIZE), p + 1))} size={undefined} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard; 