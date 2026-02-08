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
      } catch {
        toast.error("Failed to load interview");
        navigate("/admin/interviews");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

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
                {interview.status}
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
                  <Button
                    onClick={() => handleStatusUpdate("CONFIRMED")}
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
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
