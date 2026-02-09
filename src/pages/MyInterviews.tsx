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
import { Calendar, Edit, Trash2, Plus, Video, Clock, MoreVertical, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusBadgeClass } from "@/lib/status";
import EmptyCalendar from "@/components/illustrations/EmptyCalendar";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/contexts/SocketContext";

const MyInterviews = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { socket } = useSocket();

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      fetchInterviews();
      toast.info("Interview status updated");
    };

    socket.on('interview_updated', handleUpdate);
    socket.on('meeting_link_generated', handleUpdate);
    socket.on('interviewer_assigned', handleUpdate);

    return () => {
      socket.off('interview_updated', handleUpdate);
      socket.off('meeting_link_generated', handleUpdate);
      socket.off('interviewer_assigned', handleUpdate);
    };
  }, [socket]);

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
      const list = data?.data ?? (Array.isArray(data) ? data : []);
      setInterviews(list);
      setFilteredInterviews(list);
    } catch (error) {
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this interview? This action cannot be undone.")) return;
    try {
      await api.delete(`/interviews/${id}`);
      setInterviews(prev => prev.filter(i => i.id !== id));
      toast.success("Interview deleted successfully");
    } catch (error) {
      toast.error("Failed to delete interview");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Interviews">
        <div className="space-y-4 p-8">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Interviews">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Interviews</h2>
            <p className="text-muted-foreground">
              Manage and track your interview schedule
            </p>
          </div>
          <Button onClick={() => navigate("/new-request")} size="lg" className="shrink-0 shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5 mr-2" />
            New Request
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground ml-auto">
            Showing {filteredInterviews.length} interview{filteredInterviews.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredInterviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-muted/10"
              >
                <div className="bg-muted/50 p-4 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No interviews found</h3>
                <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                  {filter === "ALL"
                    ? "You haven't scheduled any interviews yet. Start your preparation journey today!"
                    : "No interviews match this filter."}
                </p>
                {filter === "ALL" && (
                  <Button onClick={() => navigate("/new-request")}>
                    Schedule Interview
                  </Button>
                )}
              </motion.div>
            ) : (
              filteredInterviews.map((interview) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  layout
                  className="group relative flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Calendar className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg capitalize">
                          {interview.interviewType} Interview
                        </h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${getStatusBadgeClass(interview.status)}`}>
                          {interview.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(interview.date), "MMMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {interview.time}
                        </span>
                      </div>
                      {interview.additionalInfo && (
                        <p className="text-sm text-muted-foreground/80 mt-2 line-clamp-1">
                          Note: {interview.additionalInfo}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {(interview.status === "INTERVIEWER_ASSIGNED" || interview.status === "INTERVIEWER_CONFIRMED") && !interview.candidateConfirmedAt && (
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={async () => {
                        try {
                          await api.post(`/interviews/${interview.id}/confirm/candidate`);
                          toast.success("Interview confirmed!");
                          // Refresh list
                          fetchInterviews();
                        } catch (error: any) {
                          toast.error(error.response?.data?.error || "Failed to confirm");
                        }
                      }}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Time
                      </Button>
                    )}

                    {interview.status === "CONFIRMED" && interview.meetingUrl && (
                      <Button size="sm" className="gap-2" asChild>
                        <a href={interview.meetingUrl} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4" />
                          Join Meeting
                        </a>
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {interview.status === "PENDING" && (
                          <DropdownMenuItem onClick={() => navigate(`/edit-request/${interview.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDelete(interview.id)} className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancel Interview
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyInterviews;
