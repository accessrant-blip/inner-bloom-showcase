import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
  Check,
  Minus,
  Plus
} from "lucide-react";

const quickGoals = [
  { id: "project", label: "Finish project", emoji: "💼" },
  { id: "study", label: "Study / class", emoji: "📚" },
  { id: "workout", label: "Workout", emoji: "🏃" },
  { id: "social", label: "Go out / movie", emoji: "🎬" },
  { id: "meet", label: "Meet someone", emoji: "👋" },
  { id: "survive", label: "Just survive today", emoji: "🌱" }
];

const moods = [
  { id: "depressed", label: "Depressed", emoji: "😔" },
  { id: "anxious", label: "Anxious", emoji: "😰" },
  { id: "stressed", label: "Stressed", emoji: "😫" },
  { id: "lonely", label: "Lonely", emoji: "😢" },
  { id: "neutral", label: "Neutral", emoji: "😐" }
];

interface ScheduleItem {
  time: string;
  task: string;
  completed?: boolean;
}

const DayBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [customGoal, setCustomGoal] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [energyLevel, setEnergyLevel] = useState([3]);
  const [easyMode, setEasyMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((g) => g !== goalId)
        : [...prev, goalId]
    );
  };

  const addCustomGoal = () => {
    if (customGoal.trim()) {
      setSelectedGoals((prev) => [...prev, customGoal.trim()]);
      setCustomGoal("");
    }
  };

  const generateSchedule = async () => {
    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Please sign in", variant: "destructive" });
        return;
      }

      const goals = selectedGoals.map(g => {
        const found = quickGoals.find(qg => qg.id === g);
        return found ? found.label : g;
      });

      const response = await supabase.functions.invoke("generate-day-plan", {
        body: {
          goals,
          mood: selectedMood,
          energyLevel: energyLevel[0],
          easyMode
        }
      });

      if (response.error) throw response.error;
      
      setSchedule(response.data.schedule || []);
      setStep(3);
    } catch (error) {
      console.error("Error generating schedule:", error);
      toast({
        title: "Couldn't generate schedule",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const adjustSchedule = async (adjustment: "easier" | "productive") => {
    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke("generate-day-plan", {
        body: {
          goals: selectedGoals.map(g => {
            const found = quickGoals.find(qg => qg.id === g);
            return found ? found.label : g;
          }),
          mood: selectedMood,
          energyLevel: energyLevel[0],
          easyMode: adjustment === "easier",
          adjustment
        }
      });

      if (response.error) throw response.error;
      setSchedule(response.data.schedule || []);
    } catch (error) {
      toast({
        title: "Couldn't adjust schedule",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTaskComplete = (index: number) => {
    setSchedule((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const savePlan = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Please sign in", variant: "destructive" });
        return;
      }

      const { error } = await supabase.from("day_plans").insert([{
        user_id: user.id,
        goals: selectedGoals,
        mood: selectedMood,
        energy_level: energyLevel[0],
        easy_mode: easyMode,
        schedule: schedule as any,
        completed_tasks: schedule.filter(s => s.completed).map(s => s.task)
      }]);

      if (error) throw error;

      toast({
        title: "Plan saved! 🎉",
        description: "You can view your plans in history"
      });
    } catch (error) {
      toast({
        title: "Couldn't save plan",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const completedCount = schedule.filter((s) => s.completed).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/espresso")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-6 w-6 text-amber-500" />
              Day Builder
            </h1>
            <p className="text-muted-foreground">
              Create a day plan that works for you
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Goals */}
        {step === 1 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                What do you want to achieve today?
              </h2>
              <p className="text-muted-foreground text-sm">
                Select or add your goals
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickGoals.map((goal) => (
                <Button
                  key={goal.id}
                  variant={selectedGoals.includes(goal.id) ? "default" : "outline"}
                  className="justify-start h-auto py-3"
                  onClick={() => toggleGoal(goal.id)}
                >
                  <span className="mr-2">{goal.emoji}</span>
                  {goal.label}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add custom goal..."
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomGoal()}
              />
              <Button onClick={addCustomGoal} disabled={!customGoal.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {selectedGoals.filter(g => !quickGoals.find(qg => qg.id === g)).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedGoals
                  .filter(g => !quickGoals.find(qg => qg.id === g))
                  .map((goal) => (
                    <Badge
                      key={goal}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => toggleGoal(goal)}
                    >
                      {goal} ✕
                    </Badge>
                  ))}
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => setStep(2)}
              disabled={selectedGoals.length === 0}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Card>
        )}

        {/* Step 2: Mood & Energy */}
        {step === 2 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">How do you feel?</h2>
              <p className="text-muted-foreground text-sm">
                This helps create a realistic plan
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  onClick={() => setSelectedMood(mood.id)}
                  className="flex-1 min-w-[120px]"
                >
                  <span className="mr-2">{mood.emoji}</span>
                  {mood.label}
                </Button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Energy Level</span>
                <span className="text-sm text-muted-foreground">
                  {energyLevel[0]}/5
                </span>
              </div>
              <Slider
                value={energyLevel}
                onValueChange={setEnergyLevel}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Very low</span>
                <span>High</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div>
                <p className="font-medium">Make this day extra easy</p>
                <p className="text-sm text-muted-foreground">
                  Smaller steps, more breaks
                </p>
              </div>
              <Switch checked={easyMode} onCheckedChange={setEasyMode} />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={generateSchedule}
                disabled={!selectedMood || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate My Day
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Your Day Plan</h2>
                <Badge variant="secondary">
                  {completedCount}/{schedule.length} done
                </Badge>
              </div>

              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      item.completed
                        ? "bg-success/10 border-success/30"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleTaskComplete(index)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          item.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {item.task}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => adjustSchedule("easier")}
                disabled={isGenerating}
              >
                <Minus className="h-4 w-4 mr-2" />
                Make it easier
              </Button>
              <Button
                variant="outline"
                onClick={() => adjustSchedule("productive")}
                disabled={isGenerating}
              >
                <Plus className="h-4 w-4 mr-2" />
                More productive
              </Button>
              <Button
                variant="outline"
                onClick={generateSchedule}
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>

            <Button
              className="w-full"
              onClick={savePlan}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Today's Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayBuilder;
