import { useEffect, useState, useCallback } from "react";
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
import { Calendar, Clock, CheckCircle, XCircle, Plus, Video, Loader2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusBadgeClass } from "@/lib/status";
import { motion, AnimatePresence } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

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
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleJoinMeeting = (id: string, url: string) => {
    setJoiningId(id);
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      setJoiningId(null);
    }, 800);
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-1"
        >
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your interviews
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {statConfig.map(({ label, key, icon: Icon, iconClass }) => (
            <motion.div variants={item} key={label}>
              <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{label}</p>
                      <h3 className="text-2xl font-bold mt-1">{stats[key as keyof typeof stats]}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${iconClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle className="text-xl">Recent Interviews</CardTitle>
                <CardDescription>Your latest interview requests</CardDescription>
              </div>
              <Button size="sm" asChild className="rounded-full">
                <Link to="/new-request" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New request
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {interviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 text-muted-foreground mb-4">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <p className="font-semibold text-lg">No interviews yet</p>
                  <p className="text-sm text-muted-foreground mt-1 mb-6">
                    Schedule your first interview to get started
                  </p>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/new-request">Schedule interview</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {interviews.map((interview, index) => (
                      <motion.div
                        key={interview.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 hover:bg-accent/50 transition-colors sm:flex-row sm:items-center sm:justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground capitalize">
                              {interview.interviewType}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <Clock className="h-3.5 w-3.5" />
                              {format(new Date(interview.date), "MMM d, yyyy")} at {interview.time}
                            </p>
                            {interview.assignment?.interviewer && (
                              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1.5 flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                With {interview.assignment.interviewer.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 gap-2 shadow-sm rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/50"
                            asChild
                          >
                            <Link to={`/interview-room/${interview.id}`}>
                              <MessageSquare className="h-4 w-4" />
                              Workspace
                            </Link>
                          </Button>
                          {interview.meetingUrl && interview.status === 'CONFIRMED' && (
                            <Button
                              size="sm"
                              variant="default"
                              className="h-9 gap-2 shadow-sm rounded-full"
                              disabled={joiningId === interview.id}
                              onClick={() => handleJoinMeeting(interview.id, interview.meetingUrl)}
                            >
                              {joiningId === interview.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Joining...
                                </>
                              ) : (
                                <>
                                  <Video className="h-4 w-4" />
                                  Join Meeting
                                </>
                              )}
                            </Button>
                          )}
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(
                              interview.status
                            )}`}
                          >
                            {interview.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
