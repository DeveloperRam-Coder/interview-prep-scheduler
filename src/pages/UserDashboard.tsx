import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { Calendar, Clock, CheckCircle, XCircle, Plus } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusBadgeClass } from "@/lib/status";

const statConfig = [
  {
    label: "Total Interviews",
    key: "total",
    icon: Calendar,
    iconClass: "bg-primary/10 text-primary",
  },
  {
    label: "Pending",
    key: "pending",
    icon: Clock,
    iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    label: "Confirmed",
    key: "confirmed",
    icon: CheckCircle,
    iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Rejected",
    key: "rejected",
    icon: XCircle,
    iconClass: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
];

const UserDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0,
  });
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/interviews");
        const list = data?.data ?? (Array.isArray(data) ? data : []);
        setInterviews(list.slice(0, 5));
        setStats({
          total: data?.meta?.total ?? list.length,
          pending: list.filter((i: any) => i.status === "PENDING").length,
          confirmed: list.filter((i: any) => i.status === "CONFIRMED").length,
          rejected: list.filter((i: any) => i.status === "REJECTED").length,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  return (
    <DashboardLayout title="Dashboard">
      <div className="dashboard-grid">
        <div className="page-header">
          <h2 className="page-title">Welcome back</h2>
          <p className="page-description">
            Here's what's happening with your interviews
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statConfig.map(({ label, key, icon: Icon, iconClass }) => (
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
                  <p className="text-2xl font-bold text-foreground">
                    {stats[key as keyof typeof stats]}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Recent interviews</CardTitle>
              <CardDescription>Your latest interview requests</CardDescription>
            </div>
            <Button size="sm" asChild>
              <Link to="/new-request">
                <Plus className="h-4 w-4 mr-2" />
                New request
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {interviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                  <Calendar className="h-7 w-7" />
                </div>
                <p className="font-medium text-foreground">No interviews yet</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Schedule your first interview to get started
                </p>
                <Button asChild>
                  <Link to="/new-request">Schedule interview</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground capitalize">
                          {interview.interviewType}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(interview.date), "MMM d, yyyy")} at{" "}
                          {interview.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                        interview.status
                      )}`}
                    >
                      {interview.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
