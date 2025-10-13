import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Reminder {
  id: string;
  time: string;
  message: string;
  is_active: boolean;
}

export default function SelfCareReminder() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .order("time", { ascending: true });

    if (data) {
      setReminders(data);
    }
  };

  const handleAddReminder = async () => {
    if (!time || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("reminders").insert({
      user_id: user.id,
      time,
      message,
      is_active: true
    });

    toast.success("Reminder added! 💛");
    setIsDialogOpen(false);
    setTime("");
    setMessage("");
    fetchReminders();
  };

  const handleToggle = async (id: string, currentState: boolean) => {
    await supabase
      .from("reminders")
      .update({ is_active: !currentState })
      .eq("id", id);

    fetchReminders();
    toast.success(currentState ? "Reminder paused" : "Reminder activated");
  };

  const handleDelete = async (id: string) => {
    await supabase.from("reminders").delete().eq("id", id);
    toast.success("Reminder deleted");
    fetchReminders();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-warm-cream/30">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/wellness-toolkit")}
          className="mb-6 text-warm-brown hover:bg-warm-cream"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Toolkit
        </Button>

        <Card className="rounded-3xl shadow-soft border-warm-brown/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl text-warm-brown">
                Self Care Reminders 🔔
              </CardTitle>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>
            <p className="text-muted-foreground mt-2">
              Set gentle reminders to take care of yourself
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {reminders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No reminders set yet. Add one to get started!</p>
              </div>
            ) : (
              reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="p-6 rounded-2xl border border-warm-brown/20 bg-white hover:border-warm-orange/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-warm-brown">
                          {reminder.time}
                        </span>
                        <Switch
                          checked={reminder.is_active}
                          onCheckedChange={() => handleToggle(reminder.id, reminder.is_active)}
                        />
                      </div>
                      <p className="text-muted-foreground">{reminder.message}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(reminder.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}

            {reminders.length > 0 && (
              <div className="mt-6 p-4 rounded-2xl bg-warm-peach/20 border border-warm-orange/20">
                <p className="text-sm text-warm-brown text-center">
                  Browser notifications require permission. Click "Allow" when prompted 💛
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Self Care Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Time</label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Reminder Message</label>
                <Input
                  placeholder="Time to take care of yourself 💛"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <Button onClick={handleAddReminder} className="w-full rounded-xl">
                Add Reminder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}