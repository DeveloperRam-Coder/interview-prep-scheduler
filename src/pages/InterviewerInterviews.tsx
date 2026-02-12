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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Loader2, Video, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { getStatusBadgeClass } from "@/lib/status";
import { useSocket } from "@/contexts/SocketContext";
import { toast } from "sonner";

const InterviewerInterviews = () => {
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [feedbackInterview, setFeedbackInterview] = useState<any | null>(null);
    const [feedbackData, setFeedbackData] = useState({
        rating: 5,
        comments: "",
        technicalScore: 5,
        culturalFit: 5
    });

    const fetchInterviews = useCallback(async () => {
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
    }, []);

    const { socket } = useSocket();

    useEffect(() => {
        fetchInterviews();
    }, [fetchInterviews]);

    useEffect(() => {
        if (!socket) return;

        const handleUpdate = () => {
            fetchInterviews();
            process.env.NODE_ENV === 'development' && console.log("Interview list updated via socket");
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
    }, [socket, fetchInterviews]);

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

    const handleDecline = async (id: string) => {
        if (!confirm("Are you sure you want to decline this assignment? The interview will be returned to the waitlist.")) return;
        try {
            setProcessingId(id);
            await api.post(`/interviews/${id}/decline`);
            toast.success("Assignment declined");
            fetchInterviews();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to decline assignment");
        } finally {
            setProcessingId(null);
        }
    };

    const handleFeedbackSubmit = async () => {
        if (!feedbackInterview) return;
        try {
            setProcessingId(feedbackInterview.id);
            await api.post(`/interviews/${feedbackInterview.id}/feedback`, feedbackData);
            toast.success("Feedback submitted successfully");
            setFeedbackInterview(null);
            fetchInterviews();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to submit feedback");
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
                        Manage your upcoming interview sessions and provide feedback.
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

                                        <div className="flex flex-col gap-2 min-w-[170px]">
                                            {interview.status === 'INTERVIEWER_ASSIGNED' && (
                                                <>
                                                    <Button
                                                        onClick={() => handleConfirm(interview.id, false)}
                                                        disabled={!!processingId}
                                                        className="w-full"
                                                    >
                                                        {processingId === interview.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Availability"}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => handleDecline(interview.id)}
                                                        disabled={!!processingId}
                                                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Decline
                                                    </Button>
                                                </>
                                            )}

                                            {(interview.status === 'CONFIRMED' || interview.status === 'COMPLETED') && (
                                                <>
                                                    {interview.status === 'CONFIRMED' && (
                                                        <Button variant="outline" className="gap-2 w-full" asChild>
                                                            <a href={interview.meetingUrl || '#'} target="_blank" rel="noopener noreferrer">
                                                                <Video className="h-4 w-4" />
                                                                Join Meeting
                                                            </a>
                                                        </Button>
                                                    )}
                                                    {interview.status === 'CONFIRMED' && (
                                                        <Dialog open={feedbackInterview?.id === interview.id} onOpenChange={(open) => setFeedbackInterview(open ? interview : null)}>
                                                            <DialogTrigger asChild>
                                                                <Button variant="default" className="gap-2 w-full">
                                                                    <MessageSquare className="h-4 w-4" />
                                                                    Submit Feedback
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px]">
                                                                <DialogHeader>
                                                                    <DialogTitle>Interview Feedback</DialogTitle>
                                                                    <DialogDescription>
                                                                        Rate the candidate: {interview.user?.name}
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="grid gap-4 py-4">
                                                                    <div className="grid gap-2">
                                                                        <Label htmlFor="rating">Overall Rating (1-5)</Label>
                                                                        <Input id="rating" type="number" min="1" max="5" value={feedbackData.rating} onChange={(e) => setFeedbackData({ ...feedbackData, rating: parseInt(e.target.value) })} />
                                                                    </div>
                                                                    <div className="grid gap-2">
                                                                        <Label htmlFor="technical">Technical Score (1-10)</Label>
                                                                        <Input id="technical" type="number" min="1" max="10" value={feedbackData.technicalScore} onChange={(e) => setFeedbackData({ ...feedbackData, technicalScore: parseInt(e.target.value) })} />
                                                                    </div>
                                                                    <div className="grid gap-2">
                                                                        <Label htmlFor="comments">Comments</Label>
                                                                        <Textarea id="comments" value={feedbackData.comments} onChange={(e) => setFeedbackData({ ...feedbackData, comments: e.target.value })} placeholder="Shared detailed thoughts..." />
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button onClick={handleFeedbackSubmit} disabled={!!processingId}>
                                                                        {processingId === interview.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                        Submit & Complete
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}
                                                </>
                                            )}

                                            {interview.interviewerConfirmedAt && interview.status === 'INTERVIEWER_CONFIRMED' && (
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium justify-center p-2 bg-emerald-50 rounded-md">
                                                        <CheckCircle className="h-4 w-4" />
                                                        You Confirmed
                                                    </div>
                                                    <p className="text-[10px] text-center text-muted-foreground italic">Waiting for candidate confirmation</p>
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
