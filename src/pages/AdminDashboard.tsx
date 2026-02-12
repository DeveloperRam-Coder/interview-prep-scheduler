import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, CheckCircle, XCircle, Trash2, UserPlus, FileText, Search, Filter, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusBadgeClass } from "@/lib/status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalUsers: 0,
    pending: 0,
    confirmed: 0,
  });
  const [interviews, setInterviews] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [interviewers, setInterviewers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [assigningInterview, setAssigningInterview] = useState<any | null>(null);
  const [selectedInterviewer, setSelectedInterviewer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, interviewsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/interviews"),
        api.get("/admin/users"),
      ]);
      setStats(statsRes.data);
      const allInterviews = interviewsRes.data?.data ?? interviewsRes.data ?? [];
      setInterviews(allInterviews);

      const allUsers = usersRes.data?.data ?? usersRes.data ?? [];
      setUsers(allUsers);
      setInterviewers(allUsers.filter((u: any) => u.role === "INTERVIEWER"));
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/interviews/${id}`, { status });
      toast.success(`Interview ${status.toLowerCase()}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleAssign = async () => {
    if (!assigningInterview || !selectedInterviewer) return;
    try {
      setSubmitting(true);
      await api.post(`/interviews/${assigningInterview.id}/assign`, {
        interviewerId: selectedInterviewer
      });
      toast.success("Interviewer assigned successfully");
      setAssigningInterview(null);
      setSelectedInterviewer("");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to assign interviewer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this interview?")) return;
    try {
      await api.delete(`/admin/interviews/${id}`);
      toast.success("Interview deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Skeleton className="h-12 w-12 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const filteredInterviews = interviews.filter(i => {
    const matchesStatus = filterStatus === "ALL" || i.status === filterStatus;
    const matchesSearch = i.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.interviewType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statCards = [
    {
      label: "Total Interviews",
      value: stats.totalInterviews,
      icon: Calendar,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      iconClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Calendar,
      iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle,
      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            <p className="text-muted-foreground">
              System-wide interview and user management.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={fetchData}>Refresh Data</Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon, iconClass }) => (
            <Card key={label} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Management Console</CardTitle>
                <CardDescription>Filtering through {interviews.length} sessions</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidate..."
                    className="pl-8 w-full sm:w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="INTERVIEWER_ASSIGNED">Assigned</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="interviews" className="w-full">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-4">
                <TabsTrigger value="interviews" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Interviews
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
              </TabsList>
              <TabsContent value="interviews" className="space-y-4">
                {filteredInterviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
                    <div className="p-4 bg-muted rounded-full mb-4">
                      <Calendar className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground font-medium">No interviews found matches your criteria</p>
                    <Button variant="link" onClick={() => { setFilterStatus("ALL"); setSearchQuery(""); }}>Clear filters</Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredInterviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-all sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="flex gap-4 flex-1 min-w-0">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted`}>
                            <FileText className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-bold text-lg capitalize">
                                {interview.interviewType}
                              </span>
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(
                                  interview.status
                                )}`}
                              >
                                {interview.status.replace(/_/g, " ")}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p className="flex items-center gap-1.5 font-medium text-foreground">
                                <Users className="h-3.5 w-3.5" />
                                {interview.user?.name}
                                <span className="text-muted-foreground font-normal">({interview.user?.email})</span>
                              </p>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                <p className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {format(new Date(interview.date), "MMM d, yyyy")}
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" />
                                  {interview.time}
                                </p>
                              </div>
                              {interview.assignment?.interviewer && (
                                <p className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1.5">
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Interviewer: {interview.assignment.interviewer.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0 pt-2 sm:pt-0">
                          {interview.status === "PENDING" && (
                            <Dialog open={assigningInterview?.id === interview.id} onOpenChange={(open) => setAssigningInterview(open ? interview : null)}>
                              <DialogTrigger asChild>
                                <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                                  <UserPlus className="h-4 w-4" />
                                  Assign
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Assign Interviewer</DialogTitle>
                                  <DialogDescription>
                                    Select an interviewer for {interview.user?.name}'s {interview.interviewType} session.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                  <div className="space-y-2">
                                    <Label>Available Interviewers</Label>
                                    <Select value={selectedInterviewer} onValueChange={setSelectedInterviewer}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choose an interviewer..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {interviewers.map(interviewer => (
                                          <SelectItem key={interviewer.id} value={interviewer.id}>
                                            {interviewer.name} ({interviewer.email})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="ghost" onClick={() => setAssigningInterview(null)}>Cancel</Button>
                                  <Button onClick={handleAssign} disabled={!selectedInterviewer || submitting}>
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                                    Confirm Assignment
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(interview.id)}
                            className="text-destructive hover:bg-destructive/10 border-destructive/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="users" className="space-y-4">
                <div className="grid gap-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-foreground leading-tight">
                            {user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${user.role === "ADMIN"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : user.role === "INTERVIEWER"
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            }`}
                        >
                          {user.role}
                        </span>
                        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md font-medium">
                          {user._count?.interviews ?? 0} interviews
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
