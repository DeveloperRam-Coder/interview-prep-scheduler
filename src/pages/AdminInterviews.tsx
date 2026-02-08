import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Calendar, CheckCircle, XCircle, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusBadgeClass } from "@/lib/status";
import EmptyCalendar from "@/components/illustrations/EmptyCalendar";

const AdminInterviews = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    if (filter === "ALL") {
      setFilteredInterviews(interviews);
    } else {
      setFilteredInterviews(
        interviews.filter((i: any) => i.status === filter)
      );
    }
  }, [filter, interviews]);

  const fetchInterviews = async () => {
    try {
      const { data } = await api.get("/admin/interviews");
      const list = data?.data ?? (Array.isArray(data) ? data : []);
      setInterviews(list);
      setFilteredInterviews(list);
    } catch (error) {
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/interviews/${id}`, { status });
      toast.success(`Interview ${status.toLowerCase()}`);
      fetchInterviews();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this interview?")) return;
    try {
      await api.delete(`/admin/interviews/${id}`);
      toast.success("Interview deleted");
      fetchInterviews();
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

  return (
    <DashboardLayout title="Manage Interviews">
      <div className="dashboard-grid">
        <div className="page-header">
          <h2 className="page-title">All interviews</h2>
          <p className="page-description">
            Manage and approve interview requests
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                {filteredInterviews.length} interview
                {filteredInterviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {filteredInterviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
                <EmptyCalendar className="w-32 h-auto text-muted-foreground/60 mb-6" />
                <CardTitle className="text-lg">No interviews found</CardTitle>
                <CardDescription className="mt-1">
                  No interviews match the selected filter
                </CardDescription>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="flex gap-4 flex-1 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
                            {format(new Date(interview.date), "EEEE, MMM d, yyyy")}
                          </p>
                          <p>{interview.time}</p>
                          {interview.additionalInfo && (
                            <p className="truncate">
                              {interview.additionalInfo}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/interviews/${interview.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminInterviews;
