import { useEffect, useState } from "react";
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
import { Calendar, Users, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusBadgeClass } from "@/lib/status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalUsers: 0,
    pending: 0,
    confirmed: 0,
  });
  const [interviews, setInterviews] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, interviewsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/interviews"),
        api.get("/admin/users"),
      ]);
      setStats(statsRes.data);
      setInterviews(interviewsRes.data?.data ?? interviewsRes.data ?? []);
      setUsers(usersRes.data?.data ?? usersRes.data ?? []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/interviews/${id}`, { status });
      toast.success(`Interview ${status.toLowerCase()}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update");
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
      <div className="flex min-h-screen items-center justify-center dashboard-page-bg">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-6 w-48 rounded-md" />
        </div>
      </div>
    );
  }

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
      <div className="dashboard-grid">
        <div className="page-header">
          <h2 className="page-title">Admin Dashboard</h2>
          <p className="page-description">
            Manage interviews and users
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon, iconClass }) => (
            <Card key={label} className="stat-card">
              <CardContent className="p-0">
                <div className="flex items-start justify-between p-5 sm:p-6">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Interviews and users at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full max-w-[200px] grid-cols-2">
                <TabsTrigger value="overview">Interviews</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                {interviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No interviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="flex gap-4 flex-1 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-medium text-foreground capitalize">
                                {interview.interviewType}
                              </span>
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                                  interview.status
                                )}`}
                              >
                                {interview.status}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-0.5">
                              <p>
                                {interview.user?.name} ({interview.user?.email})
                              </p>
                              <p>
                                {format(new Date(interview.date), "MMM d, yyyy")} at{" "}
                                {interview.time}
                              </p>
                              {interview.additionalInfo && (
                                <p className="truncate">{interview.additionalInfo}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                          {interview.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(interview.id, "CONFIRMED")
                                }
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleStatusUpdate(interview.id, "REJECTED")
                                }
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(interview.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="users" className="mt-4">
                {users.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    No users yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {user.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                            {user.phone && (
                              <p className="text-sm text-muted-foreground">
                                {user.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.role === "ADMIN"
                                ? "badge-admin"
                                : "badge-user"
                            }`}
                          >
                            {user.role}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {user._count?.interviews ?? 0} interviews
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
