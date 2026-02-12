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
import { Calendar, Clock, CheckCircle, ListVideo, Settings, Video, Loader2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusBadgeClass } from "@/lib/status";
import { useAuth } from "@/contexts/AuthContext";
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
        label: "Assigned Interviews",
        key: "assigned",
        icon: ListVideo,
        iconClass: "bg-primary/10 text-primary",
    },
    {
        label: "Pending Action",
        key: "pending",
        icon: Clock,
        iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
        label: "Completed",
        key: "completed",
        icon: CheckCircle,
        iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
        label: "Slots Available",
        key: "slots",
        icon: Calendar,
        iconClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
];

const InterviewerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        assigned: 0,
        pending: 0, // Pending confirmation
        completed: 0,
        slots: 0,
    });
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [joiningId, setJoiningId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const [interviewsRes, availabilityRes] = await Promise.all([
                api.get("/interviews/assigned"),
                api.get("/availability")
            ]);

            const interviewList = interviewsRes.data?.data ?? [];
            const availabilityList = availabilityRes.data ?? [];

            setInterviews(interviewList.slice(0, 5));
            setStats({
                assigned: interviewsRes.data?.meta?.total ?? interviewList.length,
                pending: interviewList.filter((i: any) => i.status === "INTERVIEWER_ASSIGNED" || i.status === "CANDIDATE_CONFIRMED").length,
                completed: interviewList.filter((i: any) => i.status === "COMPLETED").length,
                slots: availabilityList.length,
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
            <DashboardLayout title="Interviewer Dashboard">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Interviewer Dashboard">
            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-1"
                >
                    <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h2>
                    <p className="text-muted-foreground">
                        Manage your interviews and availability
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
                                            <h3 className="text-2xl font-bold mt-1 text-foreground">
                                                {stats[key as keyof typeof stats]}
                                            </h3>
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

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="md:col-span-4"
                    >
                        <Card className="h-full transition-all duration-300 hover:shadow-md border-none bg-card/50 backdrop-blur-sm shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                                <div>
                                    <CardTitle className="text-xl">Upcoming Sessions</CardTitle>
                                    <CardDescription>Your scheduled interviews</CardDescription>
                                </div>
                                <Button size="sm" asChild variant="outline" className="rounded-full">
                                    <Link to="/interviewer/interviews">
                                        View all
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {interviews.filter((i) => ['CONFIRMED', 'CANDIDATE_CONFIRMED', 'INTERVIEWER_CONFIRMED', 'INTERVIEWER_ASSIGNED'].includes(i.status)).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                                        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                            <Calendar className="h-6 w-6" />
                                        </div>
                                        <p className="font-medium">No upcoming interviews assigned</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <AnimatePresence mode="popLayout">
                                            {interviews.filter((i) => ['CONFIRMED', 'CANDIDATE_CONFIRMED', 'INTERVIEWER_CONFIRMED', 'INTERVIEWER_ASSIGNED'].includes(i.status)).slice(0, 5).map((interview, index) => (
                                                <motion.div
                                                    key={interview.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 + 0.5 }}
                                                    className="flex flex-col gap-4 p-4 border rounded-xl bg-card hover:bg-accent/50 transition-colors group sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                                                            {interview.user?.name?.[0] || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold">{interview.user?.name || 'Candidate'}</p>
                                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                                <span className="font-semibold text-primary/80">{interview.interviewType}</span>
                                                                <span className="h-1 w-1 rounded-full bg-border" />
                                                                {format(new Date(interview.date), "MMM d")} at {interview.time}
                                                            </p>
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
                                                                        Join
                                                                    </>
                                                                )}
                                                            </Button>
                                                        )}
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusBadgeClass(interview.status)}`}>
                                                            {interview.status.replace(/_/g, ' ')}
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

                    <Card className="md:col-span-3 transition-all duration-300 hover:shadow-md">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Manage your schedule</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button asChild className="w-full justify-start" variant="outline">
                                <Link to="/interviewer/availability">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Manage Availability
                                </Link>
                            </Button>
                            <Button asChild className="w-full justify-start" variant="outline">
                                <Link to="/interviewer/interviews">
                                    <ListVideo className="mr-2 h-4 w-4" />
                                    View Requests
                                </Link>
                            </Button>
                            <Button asChild className="w-full justify-start" variant="outline">
                                <Link to="/profile">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Profile Settings
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InterviewerDashboard;
