import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  Dumbbell,
  Flame,
  Trophy,
  Zap,
  MessageSquare,
  Shield,
  Heart,
  Target,
  Check,
  ArrowRight,
  Loader2,
  Star
} from "lucide-react";

interface Drill {
  id: string;
  type: "boundary" | "self-talk" | "confidence" | "rejection";
  title: string;
  prompt: string;
  options?: { id: string; text: string; isHealthy?: boolean }[];
  xpReward: number;
}

const drills: Drill[] = [
  {
    id: "boundary-1",
    type: "boundary",
    title: "Boundary Practice",
    prompt: "A coworker asks you to cover their shift last minute (again). You have plans. What do you say?",
    options: [
      { id: "a", text: "Sure, I'll figure it out...", isHealthy: false },
      { id: "b", text: "I'm sorry, I can't today. I have prior commitments.", isHealthy: true },
      { id: "c", text: "Why do you always ask me?!", isHealthy: false },
      { id: "d", text: "I can help you find someone else, but I'm unavailable.", isHealthy: true }
    ],
    xpReward: 25
  },
  {
    id: "self-talk-1",
    type: "self-talk",
    title: "Self-Talk Rewrite",
    prompt: "Rewrite this negative thought into something healthier:\n\n\"I'm such a failure. I can't do anything right.\"",
    xpReward: 30
  },
  {
    id: "confidence-1",
    type: "confidence",
    title: "Confidence Rep",
    prompt: "Here's a small brave action for today:\n\n✨ Make eye contact with someone and smile first.\n\nWill you try this?",
    xpReward: 20
  },
  {
    id: "rejection-1",
    type: "rejection",
    title: "Rejection Tolerance",
    prompt: "Imagine: You asked someone to hang out and they said no.\n\nRemember: Their 'no' isn't about your worth. It's about their capacity.\n\nWhat would you tell a friend in this situation?",
    xpReward: 35
  },
  {
    id: "boundary-2",
    type: "boundary",
    title: "Boundary Practice",
    prompt: "A family member criticizes your life choices at dinner. How do you respond?",
    options: [
      { id: "a", text: "You're right, I'm a mess...", isHealthy: false },
      { id: "b", text: "I appreciate your concern, but I'm comfortable with my decisions.", isHealthy: true },
      { id: "c", text: "Can we talk about something else? I'd rather not discuss this.", isHealthy: true },
      { id: "d", text: "Mind your own business!", isHealthy: false }
    ],
    xpReward: 25
  },
  {
    id: "self-talk-2",
    type: "self-talk",
    title: "Self-Talk Rewrite",
    prompt: "Rewrite this negative thought into something healthier:\n\n\"Everyone is judging me. I'm so awkward.\"",
    xpReward: 30
  }
];

const MentalGym = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progress, setProgress] = useState({
    totalXp: 0,
    streak: 0,
    level: 1,
    completedToday: [] as string[]
  });
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textResponse, setTextResponse] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const todaysDrills = drills.slice(0, 3);
  const currentDrill = todaysDrills[currentDrillIndex];

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("mental_gym_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        const today = new Date().toISOString().split("T")[0];
        const lastWorkout = data.last_workout_date;
        
        setProgress({
          totalXp: data.total_xp || 0,
          streak: lastWorkout === today ? data.current_streak || 0 : 
                  isYesterday(lastWorkout) ? data.current_streak || 0 : 0,
          level: data.level || 1,
          completedToday: lastWorkout === today ? (data.completed_drills as string[] || []) : []
        });
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isYesterday = (dateStr: string | null) => {
    if (!dateStr) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateStr === yesterday.toISOString().split("T")[0];
  };

  const handleSubmit = () => {
    if (currentDrill.type === "boundary" && selectedOption) {
      const option = currentDrill.options?.find(o => o.id === selectedOption);
      setShowResult(true);
    } else if (textResponse.trim()) {
      setShowResult(true);
    }
  };

  const proceedToNext = async () => {
    const xpGained = currentDrill.xpReward;
    const newTotalXp = progress.totalXp + xpGained;
    const newLevel = Math.floor(newTotalXp / 100) + 1;

    if (currentDrillIndex < todaysDrills.length - 1) {
      setCurrentDrillIndex(prev => prev + 1);
      setSelectedOption(null);
      setTextResponse("");
      setShowResult(false);
      setProgress(prev => ({
        ...prev,
        totalXp: newTotalXp,
        level: newLevel,
        completedToday: [...prev.completedToday, currentDrill.id]
      }));
    } else {
      setWorkoutComplete(true);
      await saveProgress(newTotalXp, newLevel);
    }
  };

  const saveProgress = async (totalXp: number, level: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];
      const newStreak = progress.streak + 1;

      const { data: existing } = await supabase
        .from("mental_gym_progress")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        await supabase
          .from("mental_gym_progress")
          .update({
            total_xp: totalXp,
            current_streak: newStreak,
            last_workout_date: today,
            level,
            completed_drills: [...progress.completedToday, currentDrill.id]
          })
          .eq("user_id", user.id);
      } else {
        await supabase.from("mental_gym_progress").insert({
          user_id: user.id,
          total_xp: totalXp,
          current_streak: 1,
          last_workout_date: today,
          level,
          completed_drills: [...progress.completedToday, currentDrill.id]
        });
      }

      setProgress(prev => ({ ...prev, streak: newStreak, totalXp, level }));
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const getDrillIcon = (type: string) => {
    switch (type) {
      case "boundary": return Shield;
      case "self-talk": return MessageSquare;
      case "confidence": return Zap;
      case "rejection": return Heart;
      default: return Target;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/espresso")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-blue-500" />
              Mental Gym
            </h1>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center">
            <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
            <p className="text-2xl font-bold">{progress.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </Card>
          <Card className="p-4 text-center">
            <Zap className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
            <p className="text-2xl font-bold">{progress.totalXp}</p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </Card>
          <Card className="p-4 text-center">
            <Trophy className="h-5 w-5 mx-auto mb-1 text-purple-500" />
            <p className="text-2xl font-bold">Lv.{progress.level}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </Card>
        </div>

        {!workoutComplete ? (
          <>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Today's Workout</span>
                <span className="font-medium">
                  {currentDrillIndex + 1}/{todaysDrills.length}
                </span>
              </div>
              <Progress
                value={((currentDrillIndex + 1) / todaysDrills.length) * 100}
              />
            </div>

            {/* Current Drill */}
            <Card className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = getDrillIcon(currentDrill.type);
                  return <Icon className="h-5 w-5 text-primary" />;
                })()}
                <div>
                  <Badge variant="secondary">{currentDrill.title}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    +{currentDrill.xpReward} XP
                  </p>
                </div>
              </div>

              <p className="text-lg whitespace-pre-line">{currentDrill.prompt}</p>

              {!showResult ? (
                <>
                  {currentDrill.options ? (
                    <div className="space-y-3">
                      {currentDrill.options.map((option) => (
                        <Button
                          key={option.id}
                          variant={selectedOption === option.id ? "default" : "outline"}
                          className="w-full justify-start h-auto py-3 text-left"
                          onClick={() => setSelectedOption(option.id)}
                        >
                          {option.text}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <Textarea
                      placeholder="Write your response..."
                      value={textResponse}
                      onChange={(e) => setTextResponse(e.target.value)}
                      className="min-h-[120px]"
                    />
                  )}

                  <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={
                      currentDrill.options
                        ? !selectedOption
                        : !textResponse.trim()
                    }
                  >
                    Submit
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  {currentDrill.options && (
                    <div className={`p-4 rounded-xl ${
                      currentDrill.options.find(o => o.id === selectedOption)?.isHealthy
                        ? "bg-success/10 border border-success/30"
                        : "bg-warning/10 border border-warning/30"
                    }`}>
                      {currentDrill.options.find(o => o.id === selectedOption)?.isHealthy ? (
                        <>
                          <Check className="h-5 w-5 text-success mb-2" />
                          <p className="font-medium">Great choice! 💪</p>
                          <p className="text-sm text-muted-foreground">
                            This response sets a healthy boundary while staying respectful.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">Consider this... 🤔</p>
                          <p className="text-sm text-muted-foreground">
                            A healthier response might be more assertive yet kind. 
                            The goal is to protect your peace without attacking others.
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {!currentDrill.options && (
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                      <Star className="h-5 w-5 text-primary mb-2" />
                      <p className="font-medium">Beautiful reflection! ✨</p>
                      <p className="text-sm text-muted-foreground">
                        Taking time to reframe thoughts is powerful. 
                        Keep practicing this skill!
                      </p>
                    </div>
                  )}

                  <Button className="w-full" onClick={proceedToNext}>
                    {currentDrillIndex < todaysDrills.length - 1
                      ? "Next Drill"
                      : "Complete Workout"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          </>
        ) : (
          /* Workout Complete */
          <Card className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-success" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Workout Complete! 🎉</h2>
              <p className="text-muted-foreground">
                You just trained your mental muscles.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted">
                <p className="text-sm text-muted-foreground">Confidence Gained</p>
                <p className="text-xl font-bold text-primary">+{todaysDrills.reduce((acc, d) => acc + d.xpReward, 0)} XP</p>
              </div>
              <div className="p-4 rounded-xl bg-muted">
                <p className="text-sm text-muted-foreground">Mood Shift</p>
                <p className="text-xl font-bold text-success">↑ Better</p>
              </div>
            </div>

            <Button className="w-full" onClick={() => navigate("/espresso")}>
              Keep Training Tomorrow
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MentalGym;
