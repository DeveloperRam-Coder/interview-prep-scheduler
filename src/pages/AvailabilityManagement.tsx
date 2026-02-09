import { useState, useEffect } from "react";
import api from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2, Calendar, Clock, Repeat, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";

interface Availability {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
    specificDate?: string;
}

const DAYS_OF_WEEK = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const AvailabilityManagement = () => {
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        dayOfWeek: 1,
        startTime: "09:00",
        endTime: "17:00",
        isRecurring: true,
        specificDate: "",
    });

    const fetchAvailability = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/availability");
            setAvailabilities(data);
        } catch (error) {
            toast.error("Failed to fetch availability");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailability();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            const payload: any = {
                startTime: formData.startTime,
                endTime: formData.endTime,
                isRecurring: formData.isRecurring,
            };

            if (formData.isRecurring) {
                payload.dayOfWeek = parseInt(formData.dayOfWeek.toString());
            } else {
                if (!formData.specificDate) {
                    toast.error("Please select a date for one-time availability");
                    return;
                }
                payload.specificDate = new Date(formData.specificDate).toISOString();
                payload.dayOfWeek = new Date(formData.specificDate).getDay();
            }

            await api.post("/availability", payload);
            toast.success("Availability added successfully");
            setIsDialogOpen(false);
            fetchAvailability();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to add availability");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/availability/${id}`);
            toast.success("Availability removed");
            setAvailabilities(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            toast.error("Failed to remove availability");
        }
    };

    const recurringSlots = availabilities.filter(a => a.isRecurring);
    const oneTimeSlots = availabilities.filter(a => !a.isRecurring);

    return (
        <DashboardLayout title="Availability Management">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Availability</h2>
                        <p className="text-muted-foreground">
                            Manage your recurring and specific availability slots for interviews.
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Availability
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Availability Slot</DialogTitle>
                                <DialogDescription>
                                    Set a recurring weekly slot or a specific date availability.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="recurring"
                                        checked={formData.isRecurring}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, isRecurring: checked })
                                        }
                                    />
                                    <Label htmlFor="recurring">Recurring Weekly</Label>
                                </div>

                                {formData.isRecurring ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="day">Day of Week</Label>
                                        <select
                                            id="day"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={formData.dayOfWeek}
                                            onChange={(e) =>
                                                setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })
                                            }
                                        >
                                            {DAYS_OF_WEEK.map((day, index) => (
                                                <option key={day} value={index}>
                                                    {day}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={formData.specificDate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, specificDate: e.target.value })
                                            }
                                            min={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="startTime">Start Time</Label>
                                        <Input
                                            id="startTime"
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) =>
                                                setFormData({ ...formData, startTime: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endTime">End Time</Label>
                                        <Input
                                            id="endTime"
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) =>
                                                setFormData({ ...formData, endTime: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="submit" disabled={submitting}>
                                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Slot
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Tabs defaultValue="recurring" className="w-full">
                    <TabsList>
                        <TabsTrigger value="recurring">Recurring Slots</TabsTrigger>
                        <TabsTrigger value="specific">Specific Dates</TabsTrigger>
                    </TabsList>

                    <TabsContent value="recurring" className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                        ) : recurringSlots.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                    <Repeat className="h-10 w-10 mb-2 opacity-20" />
                                    <p>No recurring availability slots set.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {recurringSlots.map((slot) => (
                                    <Card key={slot.id}>
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg">{DAYS_OF_WEEK[slot.dayOfWeek]}</CardTitle>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(slot.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {slot.startTime} - {slot.endTime}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="specific" className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                        ) : oneTimeSlots.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                    <Calendar className="h-10 w-10 mb-2 opacity-20" />
                                    <p>No specific date availability slots set.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {oneTimeSlots.map((slot) => (
                                    <Card key={slot.id}>
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg">
                                                    {slot.specificDate ? format(parseISO(slot.specificDate), "MMM d, yyyy") : "N/A"}
                                                </CardTitle>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(slot.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center text-sm text-muted-foreground mb-1">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {DAYS_OF_WEEK[slot.dayOfWeek]}
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {slot.startTime} - {slot.endTime}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default AvailabilityManagement;
