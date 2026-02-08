import { useState } from "react";
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
import { Calendar, CreditCard, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const NewRequest = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    interviewType: "",
    date: "",
    time: "",
    additionalInfo: "",
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const navigate = useNavigate();

  const prices: Record<string, number> = {
    technical: 50,
    behavioral: 40,
    mock: 30,
  };
  const selectedPrice = prices[formData.interviewType] ?? 0;

  const handleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/interviews", formData);
      if (resumeFile && data?.id) {
        const fd = new FormData();
        fd.append("resume", resumeFile);
        await api.post(`/interviews/${data.id}/resume`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      toast.success("Interview details saved");
      setStep(2);
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Payment successful! Interview request submitted");
      navigate("/my-interviews");
    } catch (error) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="New interview request">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              step >= 1
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/30 text-muted-foreground"
            )}
          >
            {step > 1 ? <Check className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
          </div>
          <div
            className={cn(
              "h-1 w-16 rounded-full transition-colors sm:w-24",
              step >= 2 ? "bg-primary" : "bg-muted"
            )}
          />
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              step >= 2
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/30 text-muted-foreground"
            )}
          >
            <CreditCard className="h-5 w-5" />
          </div>
        </div>
        <p className="text-center text-sm font-medium text-muted-foreground">
          {step === 1 ? "Step 1: Interview details" : "Step 2: Payment"}
        </p>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Interview details</CardTitle>
              <CardDescription>
                Choose type, date, and time for your interview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInterviewSubmit} className="space-y-5">
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
                      <SelectItem value="technical">
                        <span className="flex justify-between w-full gap-4">
                          Technical Interview
                          <span className="font-medium text-primary">$50</span>
                        </span>
                      </SelectItem>
                      <SelectItem value="behavioral">
                        <span className="flex justify-between w-full gap-4">
                          Behavioral Interview
                          <span className="font-medium text-primary">$40</span>
                        </span>
                      </SelectItem>
                      <SelectItem value="mock">
                        <span className="flex justify-between w-full gap-4">
                          Mock Interview
                          <span className="font-medium text-primary">$30</span>
                        </span>
                      </SelectItem>
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
                  <Label htmlFor="resume">Resume (optional, PDF or Word)</Label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                    className="h-10"
                  />
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
                {selectedPrice > 0 && (
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Total amount
                      </span>
                      <span className="text-xl font-bold text-primary">
                        ${selectedPrice}
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-10"
                  disabled={loading}
                >
                  {loading ? "Saving…" : "Continue to payment"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Payment details</CardTitle>
                  <CardDescription>Secure payment</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        cardNumber: e.target.value,
                      })
                    }
                    className="h-10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={paymentData.cardName}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, cardName: e.target.value })
                    }
                    className="h-10"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={paymentData.expiry}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          expiry: e.target.value,
                        })
                      }
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      value={paymentData.cvv}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, cvv: e.target.value })
                      }
                      className="h-10"
                      required
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Interview type</span>
                    <span className="font-medium capitalize">
                      {formData.interviewType}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-semibold">Amount</span>
                    <span className="text-xl font-bold text-primary">
                      ${selectedPrice}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-10"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-10"
                    disabled={loading}
                  >
                    {loading ? "Processing…" : `Pay $${selectedPrice}`}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NewRequest;
