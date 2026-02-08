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
import { Calendar, Edit, Trash2, Plus, Video } from "lucide-react";
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

const MyInterviews = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      const { data } = await api.get("/interviews");
      const list = data?.data ?? data;
      setInterviews(Array.isArray(list) ? list : []);
      setFilteredInterviews(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this interview?")) return;
    try {
      await api.delete(`/interviews/${id}`);
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
    <DashboardLayout title="My Interviews">
      <div className="dashboard-grid">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="page-header mb-0">
            <h2 className="page-title">My Interviews</h2>
            <p className="page-description">
              Manage all your interview requests
            </p>
          </div>
          <Button onClick={() => navigate("/new-request")} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            New request
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
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
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                  <Calendar className="h-7 w-7" />
                </div>
                <CardTitle className="text-lg">No interviews found</CardTitle>
                <CardDescription className="mt-1 mb-4">
                  {filter === "ALL"
                    ? "Start by creating your first interview request"
                    : "No interviews match the selected filter"}
                </CardDescription>
                {filter === "ALL" && (
                  <Button onClick={() => navigate("/new-request")}>
                    Schedule interview
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex gap-4 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
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
                            {format(
                              new Date(interview.date),
                              "EEEE, MMM d, yyyy"
                            )}
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
                    <div className="flex gap-2 shrink-0">
                      {interview.status === "CONFIRMED" && interview.meetingUrl && (
                        <Button
                          size="sm"
                          asChild
                        >
                          <a href={interview.meetingUrl} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4 mr-1" />
                            Join
                          </a>
                        </Button>
                      )}
                      {interview.status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/edit-request/${interview.id}`)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
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

export default MyInterviews;
