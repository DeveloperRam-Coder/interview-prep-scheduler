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
import { Calendar, CreditCard, Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
      console.error(error);
      toast.error("Failed to save details");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate payment
      toast.success("Payment successful! Interview confirmed.");
      navigate("/my-interviews");
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="New Request">
      <div className="mx-auto max-w-3xl space-y-8 py-8">
        {/* Step Progress */}
        <div className="relative flex items-center justify-center mb-12">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-muted -z-10 rounded-full" />
          <div
            className="absolute left-0 top-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />

          <div className="flex w-full justify-between max-w-xs">
            <div className="flex flex-col items-center gap-2 bg-background px-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                step >= 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 text-muted-foreground"
              )}>
                {step > 1 ? <Check className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
              </div>
              <span className="text-sm font-medium">Details</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-background px-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                step >= 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 text-muted-foreground"
              )}>
                <CreditCard className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Interview Details</CardTitle>
                  <CardDescription>
                    Configure your interview session.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInterviewSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-base">Interview Type</Label>
                      <Select
                        value={formData.interviewType}
                        onValueChange={(v) =>
                          setFormData({ ...formData, interviewType: v })
                        }
                        required
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical" className="py-3">
                            <div className="flex items-center justify-between w-full min-w-[200px]">
                              <span>Technical Interview</span>
                              <span className="font-bold text-primary ml-4">$50</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="behavioral" className="py-3">
                            <div className="flex items-center justify-between w-full min-w-[200px]">
                              <span>Behavioral Interview</span>
                              <span className="font-bold text-primary ml-4">$40</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="mock" className="py-3">
                            <div className="flex items-center justify-between w-full min-w-[200px]">
                              <span>Mock Interview</span>
                              <span className="font-bold text-primary ml-4">$30</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-base">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="h-12"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time" className="text-base">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                          }
                          className="h-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume" className="text-base">Resume (Optional)</Label>
                      <div className="flex items-center justify-center w-full">
                        <Label
                          htmlFor="resume"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileText className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (MAX. 5MB)</p>
                          </div>
                          <Input
                            id="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                            className="hidden"
                          />
                        </Label>
                      </div>
                      {resumeFile && (
                        <p className="text-sm text-primary flex items-center gap-2 mt-2">
                          <Check className="w-4 h-4" /> {resumeFile.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-base">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.additionalInfo}
                        onChange={(e) =>
                          setFormData({ ...formData, additionalInfo: e.target.value })
                        }
                        placeholder="Any specific topics or focus areas?"
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        size="lg"
                        className="min-w-[150px]"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {loading ? "Saving..." : "Next Step"}
                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Payment</CardTitle>
                      <CardDescription>Complete your booking securely</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">${selectedPrice}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div className="p-6 border rounded-xl bg-muted/30 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={paymentData.cardNumber}
                          onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                          required
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="Full Name"
                          value={paymentData.cardName}
                          onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                          required
                          className="bg-background"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={paymentData.expiry}
                            onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                            required
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVC</Label>
                          <Input
                            id="cvv"
                            type="password"
                            placeholder="123"
                            maxLength={3}
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                            required
                            className="bg-background"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onClick={() => setStep(1)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        className="flex-1"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {loading ? "Processing..." : `Pay $${selectedPrice}`}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default NewRequest;

function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}
