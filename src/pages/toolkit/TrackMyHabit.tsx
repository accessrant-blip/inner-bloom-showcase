import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Flame, Target, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

interface Habit {
  id: string;
  habit_name: string;
  current_streak: number;
  target_days: number;
  completed_dates: Json;
}

export default function TrackMyHabit() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [targetDays, setTargetDays] = useState(30);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setHabits(data);
    }
  };

  const handleAddHabit = async () => {
    if (!habitName.trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("habits").insert({
      user_id: user.id,
      habit_name: habitName,
      target_days: targetDays,
      current_streak: 0,
      completed_dates: []
    });

    toast.success("Habit added! 🌱");
    setIsDialogOpen(false);
    setHabitName("");
    setTargetDays(30);
    fetchHabits();
  };

  const handleCheckIn = async (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const completedDates = Array.isArray(habit.completed_dates) ? (habit.completed_dates as string[]) : [];
    
    if (completedDates.includes(today)) {
      toast.info("Already checked in today!");
      return;
    }

    const newCompletedDates = [...completedDates, today];
    const newStreak = habit.current_streak + 1;

    await supabase
      .from("habits")
      .update({
        completed_dates: newCompletedDates,
        current_streak: newStreak
      })
      .eq("id", habit.id);

    if (newStreak === 3 || newStreak === 7 || newStreak === 14 || newStreak === 30) {
      toast.success(`${newStreak} days streak! Amazing progress!`);
    } else {
      toast.success("Checked in! Keep going!");
    }

    fetchHabits();
  };

  const getProgress = (habit: Habit) => {
    return Math.min((habit.current_streak / habit.target_days) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-warm-cream/30">
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
                Track My Habits 📈
              </CardTitle>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </div>
            <p className="text-muted-foreground mt-2">
              Build healthy habits one day at a time
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {habits.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No habits tracked yet. Start building better habits today!</p>
              </div>
            ) : (
              habits.map((habit) => (
                <div
                  key={habit.id}
                  className="p-6 rounded-2xl border border-warm-brown/20 bg-white hover:border-warm-orange/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-xl text-warm-brown mb-1">
                        {habit.habit_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          {habit.current_streak} day streak
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          Goal: {habit.target_days} days
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCheckIn(habit)}
                      className="rounded-xl"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Check In
                    </Button>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${getProgress(habit)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    {Math.round(getProgress(habit))}% complete
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Habit Name</label>
                <Input
                  placeholder="e.g., Drink 8 glasses of water"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Target Days</label>
                <Input
                  type="number"
                  min="1"
                  value={targetDays}
                  onChange={(e) => setTargetDays(parseInt(e.target.value))}
                  className="rounded-xl"
                />
              </div>
              <Button onClick={handleAddHabit} className="w-full rounded-xl">
                Add Habit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}