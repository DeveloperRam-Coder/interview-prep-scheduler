import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const EditRequest = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    interviewType: "",
    date: "",
    time: "",
    additionalInfo: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/my-interviews");
      return;
    }
    const fetchInterview = async () => {
      try {
        const { data } = await api.get(`/interviews/${id}`);
        const dateStr = data.date
          ? format(new Date(data.date), "yyyy-MM-dd")
          : "";
        setFormData({
          interviewType: data.interviewType || "",
          date: dateStr,
          time: data.time || "",
          additionalInfo: data.additionalInfo || "",
        });
      } catch (error: unknown) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 404) {
          toast.error("Interview not found");
        } else {
          toast.error("Failed to load interview");
        }
        navigate("/my-interviews");
      } finally {
        setFetching(false);
      }
    };
    fetchInterview();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    try {
      await api.patch(`/interviews/${id}`, formData);
      toast.success("Interview updated");
      navigate("/my-interviews");
    } catch (error) {
      toast.error("Failed to update interview");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
    <DashboardLayout title="Edit interview request">
      <div className="mx-auto max-w-2xl space-y-6">
        <Button
          variant="ghost"
          className="gap-2 -ml-2"
          onClick={() => navigate("/my-interviews")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my interviews
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Edit interview details</CardTitle>
                <CardDescription>
                  Update type, date, time, and notes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Interview type</Label>
                <Select
                  value={formData.interviewType}
                  onValueChange={(v) =>
                    setFormData({ ...formData, interviewType: v })
                  }
                  required
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Interview</SelectItem>
                    <SelectItem value="behavioral">
                      Behavioral Interview
                    </SelectItem>
                    <SelectItem value="mock">Mock Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="h-10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="h-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, additionalInfo: e.target.value })
                  }
                  placeholder="Special requirements or preferences…"
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/my-interviews")}
                  className="flex-1 h-10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-10"
                  disabled={loading}
                >
                  {loading ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditRequest;
