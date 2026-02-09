import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusBadgeClass } from "@/lib/status";
import { format } from "date-fns";
import {
  ArrowLeft,
  User,
  FileText,
  Video,
  CheckCircle,
  XCircle,
  Download,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useSocket } from "@/contexts/SocketContext";

export default function AdminInterviewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<any>(null);
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [possibleInterviewers, setPossibleInterviewers] = useState<any[]>([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const intRes = await api.get(`/admin/interviews/${id}`);
        let resumeRes = { data: null as any };
        try {
          resumeRes = await api.get(`/admin/interviews/${id}/resume`);
        } catch {
          // no resume
        }
        setInterview(intRes.data);
        setResume(resumeRes.data);
        setMeetingUrl(intRes.data?.meetingUrl ?? "");

        // If pending or assigned, fetch available interviewers
        if (intRes.data.status === 'PENDING' || intRes.data.status === 'INTERVIEWER_ASSIGNED') {
          const dateStr = intRes.data.date.toString().split('T')[0];
          const timeStr = intRes.data.time;
          try {
            const availRes = await api.get(`/admin/interviewers/available?date=${dateStr}&time=${timeStr}`);
            setPossibleInterviewers(availRes.data || []);
          } catch (e) {
            console.error("Failed to fetch available interviewers", e);
          }
        }

      } catch {
        toast.error("Failed to load interview");
        navigate("/admin/interviews");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchData();
  }, [id, navigate]);

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !id) return;

    // Listen for updates specific to this interview if possible, or filtered by ID
    // Since we join room "user:adminId", we receive all updates relevant to admin?
    // Actually, admins might need to join a specific "admin" room or we filter by ID here.
    // The current backend emits to user rooms. Admin should receive updates if they are assigned (which they are usually not, they are admin).
    // Wait, the backend emits to `user:${userId}`. Who is the userId?
    // In `notifyInterviewerAssignment`, it notifies interviewer and candidate.
    // It does NOT notify admin explicitly via socket unless admin is one of them.
    // But Admin might want to see updates.
    // For now, let's assume Admin refreshes or we add admin notification later.
    // Actually, let's checking `notification.service.js`.

    // For now, I'll just add the listener in case backend sends it to valid room.
    // If not, Admin manual refresh is acceptable for MVP.
    // But let's add it.

    const handleUpdate = (data: any) => {
      if (data.interviewId === id || data.id === id) {
        // Refresh
        api.get(`/admin/interviews/${id}`).then(res => {
          setInterview(res.data);
          setMeetingUrl(res.data.meetingUrl || "");
          toast.info("Interview updated");
        });
      }
    };

    socket.on('interview_updated', handleUpdate);
    socket.on('interviewer_confirmed', handleUpdate);
    socket.on('candidate_confirmed', handleUpdate);

    return () => {
      socket.off('interview_updated', handleUpdate);
      socket.off('interviewer_confirmed', handleUpdate);
      socket.off('candidate_confirmed', handleUpdate);
    };
  }, [socket, id]);

  const handleStatusUpdate = async (status: string) => {
    setSaving(true);
    try {
      const body: any = { status };
      if (rescheduleDate && rescheduleTime) {
        body.date = rescheduleDate;
        body.time = rescheduleTime;
      }
      await api.patch(`/admin/interviews/${id}`, body);
      toast.success(`Interview ${status.toLowerCase()}`);
      setInterview((p: any) => ({
        ...p,
        status,
        date: body.date ? new Date(body.date) : p.date,
        time: body.time ?? p.time,
      }));
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignInterviewer = async () => {
    if (!selectedInterviewer) return;
    setAssigning(true);
    try {
      await api.post(`/interviews/${id}/assign`, { interviewerId: selectedInterviewer });
      toast.success("Interviewer assigned successfully");
      // Refresh data
      const intRes = await api.get(`/admin/interviews/${id}`);
      setInterview(intRes.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to assign interviewer");
    } finally {
      setAssigning(false);
    }
  };

  const handleMeetingUrlSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/admin/interviews/${id}`, { meetingUrl: meetingUrl || null });
      toast.success("Meeting URL saved");
      setInterview((p: any) => ({ ...p, meetingUrl }));
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const downloadResume = async () => {
    if (!id) return;
    try {
      const { data } = await api.get(`/admin/interviews/${id}/resume/download`, { responseType: "blob" });
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = resume?.fileName || "resume";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download");
    }
  };

  if (loading || !interview) {
    return (
      <div className="flex min-h-screen items-center justify-center dashboard-page-bg">
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <DashboardLayout title="Interview Details">
      <div className="mx-auto max-w-2xl space-y-6">
        <Button variant="ghost" className="gap-2 -ml-2" onClick={() => navigate("/admin/interviews")}>
          <ArrowLeft className="h-4 w-4" />
          Back to interviews
        </Button>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="capitalize">{interview.interviewType} Interview</CardTitle>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(interview.status)}`}>
                {interview.status.replace(/_/g, ' ')}
              </span>
            </div>
            <CardDescription>
              {format(new Date(interview.date), "EEEE, MMM d, yyyy")} at {interview.time}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Candidate</span>
              </div>
              <p className="text-sm">{interview.user?.name}</p>
              <p className="text-sm text-muted-foreground">{interview.user?.email}</p>
              {interview.user?.phone && <p className="text-sm text-muted-foreground">{interview.user.phone}</p>}
            </div>

            {/* Assignment Section */}
            {(interview.status === 'PENDING' || interview.status === 'INTERVIEWER_ASSIGNED') && (
              <div className="p-4 bg-muted/30 rounded-lg border">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Assign Interviewer
                </h3>

                {interview.status === 'INTERVIEWER_ASSIGNED' && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 rounded text-sm mb-4">
                    Currently assigned to an interviewer. Re-assigning will update the assignment.
                  </div>
                )}

                <div className="flex gap-2">
                  <Select value={selectedInterviewer} onValueChange={setSelectedInterviewer}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select available interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {possibleInterviewers.length === 0 ? (
                        <SelectItem value="none" disabled>No interviewers available</SelectItem>
                      ) : (
                        possibleInterviewers.map((i) => (
                          <SelectItem key={i.id} value={i.id}>
                            {i.name} ({i._count?.assignments || 0} assignments)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleAssignInterviewer}
                    disabled={!selectedInterviewer || assigning}
                  >
                    {assigning ? "Assigning..." : "Assign"}
                  </Button>
                </div>
              </div>
            )}

            {resume && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Resume</span>
                </div>
                <Button variant="outline" size="sm" onClick={downloadResume}>
                  <Download className="h-4 w-4 mr-2" />
                  Download {resume.fileName}
                </Button>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Video className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Meeting URL</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="https://zoom.us/j/..."
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                />
                <Button onClick={handleMeetingUrlSave} disabled={saving}>
                  Save
                </Button>
              </div>
              {interview.meetingUrl && (
                <Button variant="link" className="mt-2 p-0 h-auto" asChild>
                  <a href={interview.meetingUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Join meeting
                  </a>
                </Button>
              )}
            </div>

            {interview.status === "PENDING" && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Reschedule date</Label>
                    <Input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Reschedule time</Label>
                    <Input
                      type="time"
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* PENDING status usually means waiting for Admin action, but with interviewer assignment, maybe we don't 'Accept' directly anymore? 
                      Or maybe 'Accept' means generic acceptance before assignment?
                      Let's leave existing logic but maybe Hide 'Accept' if we want to force Assignment workflow.
                      For now I'll leave it as fallback manually managed workflow.
                  */}
                  <Button
                    onClick={() => handleStatusUpdate("CONFIRMED")}
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Force Confirm
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate("REJECTED")}
                    disabled={saving}
                    className="text-destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  {rescheduleDate && rescheduleTime && (
                    <Button
                      variant="secondary"
                      onClick={() => handleStatusUpdate("CONFIRMED")}
                      disabled={saving}
                    >
                      Accept & Reschedule
                    </Button>
                  )}
                </div>
              </div>
            )}

            {interview.status === "CONFIRMED" && (
              <div className="pt-4 border-t">
                <Button
                  onClick={() => handleStatusUpdate("COMPLETED")}
                  disabled={saving}
                  variant="secondary"
                >
                  Mark as completed
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
