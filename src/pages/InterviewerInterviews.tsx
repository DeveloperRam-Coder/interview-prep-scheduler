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
import { Calendar, Clock, Loader2, Video, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { getStatusBadgeClass } from "@/lib/status";
import { useSocket } from "@/contexts/SocketContext";
import { toast } from "sonner";

const InterviewerInterviews = () => {
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/interviews/assigned");
            setInterviews(data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load interviews");
        } finally {
            setLoading(false);
        }
    };

    const { socket } = useSocket();

    useEffect(() => {
        fetchInterviews();
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleUpdate = () => {
            fetchInterviews();
            toast.info("Interview list updated");
        };

        socket.on('interviewer_assigned', handleUpdate);
        socket.on('interview_updated', handleUpdate);
        socket.on('confirmation_request', handleUpdate);
        socket.on('meeting_link_generated', handleUpdate);

        return () => {
            socket.off('interviewer_assigned', handleUpdate);
            socket.off('interview_updated', handleUpdate);
            socket.off('confirmation_request', handleUpdate);
            socket.off('meeting_link_generated', handleUpdate);
        };
    }, [socket]);

    const handleConfirm = async (id: string, currentlyConfirmed: boolean) => {
        if (currentlyConfirmed) return;
        try {
            setProcessingId(id);
            await api.post(`/interviews/${id}/confirm/interviewer`);
            toast.success("Interview confirmed");
            fetchInterviews();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to confirm interview");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="My Interviews">
                <div className="flex items-center justify-center h-[50vh]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="My Interviews">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Assigned Interviews</h2>
                    <p className="text-muted-foreground">
                        Manage your upcoming interview sessions.
                    </p>
                </div>

                {interviews.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Calendar className="h-12 w-12 mb-4 opacity-20" />
                            <p>No interviews assigned yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {interviews.map((interview) => (
                            <Card key={interview.id} className="transition-all hover:shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg">
                                                    {interview.interviewType} Interview
                                                </h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass(interview.status)}`}>
                                                    {interview.status.replace(/_/g, " ")}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Candidate: <span className="font-medium text-foreground">{interview.user?.name}</span>
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {format(new Date(interview.date), "MMMM d, yyyy")}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {interview.time}
                                                </div>
                                            </div>
                                            {interview.additionalInfo && (
                                                <p className="text-sm text-muted-foreground mt-2 bg-muted p-2 rounded-md">
                                                    Note: {interview.additionalInfo}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 min-w-[150px]">
                                            {/* Actions based on status */}
                                            {interview.status === 'INTERVIEWER_ASSIGNED' && (
                                                <Button
                                                    onClick={() => handleConfirm(interview.id, false)}
                                                    disabled={!!processingId}
                                                >
                                                    {processingId === interview.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Availability"}
                                                </Button>
                                            )}

                                            {interview.status === 'CANDIDATE_CONFIRMED' && !interview.interviewerConfirmedAt && (
                                                <Button
                                                    onClick={() => handleConfirm(interview.id, false)}
                                                    disabled={!!processingId}
                                                >
                                                    {processingId === interview.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Availability"}
                                                </Button>
                                            )}

                                            {(interview.status === 'CONFIRMED' || interview.status === 'COMPLETED') && (
                                                <Button variant="outline" className="gap-2">
                                                    <Video className="h-4 w-4" />
                                                    Join Meeting
                                                </Button>
                                            )}

                                            {interview.interviewerConfirmedAt && interview.status !== 'CONFIRMED' && interview.status !== 'COMPLETED' && (
                                                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium justify-center p-2 bg-emerald-50 rounded-md">
                                                    <CheckCircle className="h-4 w-4" />
                                                    You Confirmed
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default InterviewerInterviews;
