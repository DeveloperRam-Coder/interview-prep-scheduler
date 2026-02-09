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
import { Calendar, Clock, CheckCircle, ListVideo, Settings } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusBadgeClass } from "@/lib/status";
import { useAuth } from "@/contexts/AuthContext";

const statConfig = [
    {
        label: "Assigned Interviews",
        key: "assigned",
        icon: ListVideo,
        iconClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
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
        label: "Availability Slots",
        key: "slots",
        icon: Calendar,
        iconClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
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

    useEffect(() => {
        const fetchData = async () => {
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
        <DashboardLayout title="Interviewer Dashboard">
            <div className="dashboard-grid">
                <div className="page-header">
                    <h2 className="page-title">Welcome back, {user?.name}</h2>
                    <p className="page-description">
                        Manage your interviews and availability
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statConfig.map(({ label, key, icon: Icon, iconClass }) => (
                        <Card key={label} className="stat-card">
                            <CardContent className="p-0">
                                <div className="flex items-start justify-between p-5 sm:p-6">
                                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
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

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="md:col-span-4 transition-all duration-300 hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div>
                                <CardTitle>Upcoming Interviews</CardTitle>
                                <CardDescription>Your scheduled sessions</CardDescription>
                            </div>
                            <Button size="sm" asChild variant="outline">
                                <Link to="/interviewer/interviews">
                                    View all
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {interviews.filter((i) => ['CONFIRMED', 'CANDIDATE_CONFIRMED', 'INTERVIEWER_CONFIRMED', 'INTERVIEWER_ASSIGNED'].includes(i.status)).length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                    <p>No upcoming interviews assigned</p>
                                </div>
                            ) : (
                                <div className="space-y-4 pt-4">
                                    {interviews.filter((i) => ['CONFIRMED', 'CANDIDATE_CONFIRMED', 'INTERVIEWER_CONFIRMED', 'INTERVIEWER_ASSIGNED'].includes(i.status)).slice(0, 5).map((interview) => (
                                        <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {interview.user?.name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{interview.user?.name || 'Candidate'}</p>
                                                    <p className="text-xs text-muted-foreground">{interview.interviewType} • {format(new Date(interview.date), "MMM d")} at {interview.time}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(interview.status)}`}>
                                                {interview.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

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
