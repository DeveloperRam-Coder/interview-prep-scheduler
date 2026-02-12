import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Users,
    MessageSquare,
    Shield,
    Video,
    LogOut,
    CheckCircle,
    Clock,
    Wifi,
    WifiOff,
    FileText,
    History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const InterviewRoom = () => {
    const { id: interviewId } = useParams();
    const { user } = useAuth();
    const { socket, connected } = useSocket();
    const navigate = useNavigate();

    const [interview, setInterview] = useState<any>(null);
    const [session, setSession] = useState<any>(null);
    const [participants, setParticipants] = useState<string[]>([]);
    const [sharedNotes, setSharedNotes] = useState("");
    const [interviewerNotes, setInterviewerNotes] = useState("");
    const [loading, setLoading] = useState(true);

    const isInterviewer = interview?.assignment?.interviewerId === user?.id;

    // Fetch initial data
    const fetchSessionData = useCallback(async () => {
        try {
            const [interviewRes, sessionRes] = await Promise.all([
                api.get(`/interviews/${interviewId}`),
                api.get(`/sessions/${interviewId}`)
            ]);
            setInterview(interviewRes.data);
            setSession(sessionRes.data);
            setSharedNotes(sessionRes.data.sharedNotes || "");
            setInterviewerNotes(sessionRes.data.interviewerNotes || "");
        } catch (error) {
            console.error("Failed to load session:", error);
            toast.error("Failed to load interview session");
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    }, [interviewId, navigate]);

    useEffect(() => {
        if (interviewId) {
            fetchSessionData();
        }
    }, [interviewId, fetchSessionData]);

    // Socket listeners
    useEffect(() => {
        if (!socket || !connected) return;

        socket.emit("session:join", { interviewId });

        socket.on("session:participants", (participantIds: string[]) => {
            setParticipants(participantIds);
        });

        socket.on("session:notes_updated", ({ sharedNotes: newNotes }: { sharedNotes: string }) => {
            setSharedNotes(newNotes);
        });

        socket.on("session:updated", (updatedSession: any) => {
            setSession(updatedSession);
        });

        return () => {
            socket.emit("session:leave", { interviewId });
            socket.off("session:participants");
            socket.off("session:notes_updated");
            socket.off("session:updated");
        };
    }, [socket, connected, interviewId]);

    const handleSharedNotesChange = (val: string) => {
        setSharedNotes(val);
        socket?.emit("session:update_notes", {
            interviewId,
            sharedNotes: val
        });
    };

    const handleInterviewerNotesChange = (val: string) => {
        setInterviewerNotes(val);
        socket?.emit("session:update_notes", {
            interviewId,
            interviewerNotes: val
        });
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading Workspace...</div>;
    }

    return (
        <DashboardLayout title={`Interview Workspace - ${interview?.interviewType}`}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">

                {/* Left Sidebar - Participants & Info */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                Active Participants
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground font-medium">Candidate</span>
                                    <Badge variant={participants.includes(interview?.userId) ? "default" : "secondary"} className="text-[10px]">
                                        {participants.includes(interview?.userId) ? "Online" : "Away"}
                                    </Badge>
                                </div>
                                <p className="text-sm font-bold">{interview?.user?.name}</p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground font-medium">Interviewer</span>
                                    <Badge variant={participants.includes(interview?.assignment?.interviewerId) ? "default" : "secondary"} className="text-[10px]">
                                        {participants.includes(interview?.assignment?.interviewerId) ? "Online" : "Away"}
                                    </Badge>
                                </div>
                                <p className="text-sm font-bold">{interview?.assignment?.interviewer?.name || "Pending"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-indigo-50/30 dark:bg-indigo-900/10">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {connected ? <Wifi className="h-4 w-4 text-emerald-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
                                    <span className="text-xs font-semibold uppercase tracking-wider">
                                        {connected ? "Live Connection" : "Reconnecting..."}
                                    </span>
                                </div>
                                <Badge variant="outline" className="animate-pulse bg-emerald-500/10 text-emerald-600 border-emerald-200">
                                    {session?.status === 'ACTIVE' ? 'Ongoing' : 'Waiting'}
                                </Badge>
                            </div>
                            {interview?.meetingUrl && (
                                <Button className="w-full gap-2 rounded-xl shadow-lg shadow-primary/20" onClick={() => window.open(interview.meetingUrl, '_blank')}>
                                    <Video className="h-4 w-4" />
                                    Join Video Call
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Center - Shared Workspace */}
                <div className="lg:col-span-2 space-y-4 h-full flex flex-col">
                    <Card className="flex-1 overflow-hidden border-none shadow-md flex flex-col bg-card">
                        <CardHeader className="py-3 bg-muted/30 border-b flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <CardTitle className="text-sm font-bold">Collaborative Notes</CardTitle>
                            </div>
                            <span className="text-[10px] text-muted-foreground italic">Changes sync automatically</span>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 relative mt-4">
                            <Textarea
                                className="h-full w-full border-none focus-visible:ring-0 resize-none p-6 text-lg font-mono leading-relaxed bg-transparent"
                                placeholder="Start typing shared notes, tasks, or code snippets..."
                                value={sharedNotes}
                                onChange={(e) => handleSharedNotesChange(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar - Private Notes (Interviewer Only) */}
                <div className="lg:col-span-1 space-y-4 flex flex-col">
                    {isInterviewer && (
                        <Card className="flex-1 border-none shadow-sm bg-card/50 backdrop-blur-sm flex flex-col">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-amber-500" />
                                    Confidential Notes
                                </CardTitle>
                                <CardDescription className="text-[10px]">Visible only to you</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 flex flex-col mt-4">
                                <Textarea
                                    className="flex-1 w-full border-none focus-visible:ring-0 resize-none px-4 py-2 text-sm bg-transparent"
                                    placeholder="Private observations, scores, or evaluation notes..."
                                    value={interviewerNotes}
                                    onChange={(e) => handleInterviewerNotesChange(e.target.value)}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {!isInterviewer && (
                        <Card className="flex-1 border-none shadow-sm bg-muted/10 border-dashed border-2 flex items-center justify-center p-8 text-center text-muted-foreground">
                            <div>
                                <History className="h-8 w-8 mx-auto mb-4 opacity-20" />
                                <p className="text-sm">Shared session history will appear here after the interview ends.</p>
                            </div>
                        </Card>
                    )}

                    <Button variant="outline" className="w-full gap-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100" onClick={() => navigate('/dashboard')}>
                        <LogOut className="h-4 w-4" />
                        Leave Workspace
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InterviewRoom;
