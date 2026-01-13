import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  MessageCircle,
  Target,
  Shield,
  Zap,
  Check,
  ArrowRight,
  Loader2,
  Trophy,
  Heart,
  Star,
  Sparkles
} from "lucide-react";

interface Mission {
  id: string;
  level: "easy" | "medium" | "hard";
  title: string;
  description: string;
  script: string;
  backupScript: string;
  exitLine: string;
  confidenceGain: number;
}

const missions: Mission[] = [
  {
    id: "easy-1",
    level: "easy",
    title: "The Smile Exchange",
    description: "Make eye contact with a stranger and smile.",
    script: "Just look, smile gently, and continue walking. No words needed.",
    backupScript: "If nervous: A small nod works too.",
    exitLine: "Just look away naturally and continue your day.",
    confidenceGain: 5
  },
  {
    id: "easy-2",
    level: "easy",
    title: "The Thank You",
    description: "Thank a cashier or service worker with genuine warmth.",
    script: "\"Thank you so much, have a great day!\"",
    backupScript: "If nervous: \"Thanks!\" with a smile is enough.",
    exitLine: "Walk away with a smile.",
    confidenceGain: 5
  },
  {
    id: "medium-1",
    level: "medium",
    title: "The Compliment",
    description: "Give a genuine compliment to someone you encounter.",
    script: "\"I love your [jacket/shoes/bag]! Where did you get it?\"",
    backupScript: "If nervous: \"Nice [item]!\" and walk away.",
    exitLine: "\"Anyway, have a good one!\"",
    confidenceGain: 10
  },
  {
    id: "medium-2",
    level: "medium",
    title: "The Question",
    description: "Ask someone for a simple recommendation.",
    script: "\"Excuse me, do you know a good coffee place around here?\"",
    backupScript: "If nervous: \"Any food recommendations nearby?\"",
    exitLine: "\"Thanks so much! I'll check it out.\"",
    confidenceGain: 10
  },
  {
    id: "hard-1",
    level: "hard",
    title: "The Conversation Starter",
    description: "Start a brief conversation with someone waiting in line.",
    script: "Comment on something shared: \"This line is wild today, huh?\"",
    backupScript: "If nervous: \"Been waiting long?\"",
    exitLine: "\"Well, nice chatting with you!\"",
    confidenceGain: 20
  },
  {
    id: "hard-2",
    level: "hard",
    title: "The Invite",
    description: "Invite an acquaintance to hang out sometime.",
    script: "\"Hey, we should grab coffee sometime! Are you free this week?\"",
    backupScript: "If nervous: \"Let me know if you ever want to hang out.\"",
    exitLine: "\"No worries either way, just thought I'd ask!\"",
    confidenceGain: 25
  }
];

const SocialTrainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"select" | "mission" | "reflection" | "complete">("select");
  const [selectedLevel, setSelectedLevel] = useState<"easy" | "medium" | "hard">("easy");
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [completed, setCompleted] = useState(false);
  const [anxietyBefore, setAnxietyBefore] = useState([5]);
  const [anxietyAfter, setAnxietyAfter] = useState([5]);
  const [reflection, setReflection] = useState("");
  const [progress, setProgress] = useState({
    confidenceScore: 0,
    completedMissions: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("anxiety_trainer_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setProgress({
          confidenceScore: data.confidence_score || 0,
          completedMissions: (data.completed_missions as string[]) || []
        });
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startMission = () => {
    const availableMissions = missions.filter(
      (m) => m.level === selectedLevel && !progress.completedMissions.includes(m.id)
    );
    
    if (availableMissions.length === 0) {
      // Reset completed for this level if all done
      const allLevelMissions = missions.filter(m => m.level === selectedLevel);
      setCurrentMission(allLevelMissions[Math.floor(Math.random() * allLevelMissions.length)]);
    } else {
      setCurrentMission(availableMissions[Math.floor(Math.random() * availableMissions.length)]);
    }
    setStep("mission");
  };

  const handleMissionComplete = (didComplete: boolean) => {
    setCompleted(didComplete);
    setStep("reflection");
  };

  const submitReflection = async () => {
    if (!currentMission) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newConfidence = completed
        ? progress.confidenceScore + currentMission.confidenceGain
        : progress.confidenceScore + 2; // Small gain for trying

      const newCompleted = completed
        ? [...progress.completedMissions, currentMission.id]
        : progress.completedMissions;

      const { data: existing } = await supabase
        .from("anxiety_trainer_progress")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        await supabase
          .from("anxiety_trainer_progress")
          .update({
            confidence_score: newConfidence,
            completed_missions: newCompleted,
            current_level: selectedLevel
          })
          .eq("user_id", user.id);
      } else {
        await supabase.from("anxiety_trainer_progress").insert({
          user_id: user.id,
          confidence_score: newConfidence,
          completed_missions: newCompleted,
          current_level: selectedLevel
        });
      }

      setProgress({
        confidenceScore: newConfidence,
        completedMissions: newCompleted
      });

      setStep("complete");
    } catch (error) {
      console.error("Error saving progress:", error);
      toast({ title: "Couldn't save progress", variant: "destructive" });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "easy": return "bg-green-500/20 text-green-600 border-green-500/30";
      case "medium": return "bg-amber-500/20 text-amber-600 border-amber-500/30";
      case "hard": return "bg-red-500/20 text-red-600 border-red-500/30";
      default: return "";
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
              <MessageCircle className="h-6 w-6 text-purple-500" />
              Social Anxiety Trainer
            </h1>
          </div>
        </div>

        {/* Confidence Score */}
        <Card className="p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confidence Score</p>
              <p className="text-2xl font-bold">{progress.confidenceScore}</p>
            </div>
          </div>
          <Badge variant="secondary">
            {progress.completedMissions.length} missions done
          </Badge>
        </Card>

        {/* Level Selection */}
        {step === "select" && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Choose Your Level</h2>
              <p className="text-muted-foreground text-sm">
                Start small and build up. Every step counts.
              </p>
            </div>

            <div className="grid gap-3">
              {(["easy", "medium", "hard"] as const).map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  className="justify-start h-auto py-4"
                  onClick={() => setSelectedLevel(level)}
                >
                  <Badge className={`mr-3 ${getLevelColor(level)}`}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Badge>
                  <span className="text-left">
                    {level === "easy" && "Quick interactions, no words needed"}
                    {level === "medium" && "Brief exchanges with strangers"}
                    {level === "hard" && "Initiating real conversations"}
                  </span>
                </Button>
              ))}
            </div>

            <Button className="w-full" onClick={startMission}>
              <Target className="h-4 w-4 mr-2" />
              Get Today's Mission
            </Button>
          </Card>
        )}

        {/* Mission */}
        {step === "mission" && currentMission && (
          <Card className="p-6 space-y-6">
            <div className="text-center">
              <Badge className={`mb-3 ${getLevelColor(currentMission.level)}`}>
                {currentMission.level.toUpperCase()} MISSION
              </Badge>
              <h2 className="text-xl font-bold mb-2">{currentMission.title}</h2>
              <p className="text-muted-foreground">{currentMission.description}</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">What to Say</span>
                </div>
                <p className="text-sm">{currentMission.script}</p>
              </div>

              <div className="p-4 rounded-xl bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm text-muted-foreground">
                    Backup Script
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentMission.backupScript}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm text-muted-foreground">
                    Exit Line
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentMission.exitLine}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-center text-sm font-medium">
                Did you complete the mission?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleMissionComplete(false)}
                  className="h-12"
                >
                  Not this time
                </Button>
                <Button
                  onClick={() => handleMissionComplete(true)}
                  className="h-12"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Yes, I did it!
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Reflection */}
        {step === "reflection" && currentMission && (
          <Card className="p-6 space-y-6">
            <div className="text-center">
              {completed ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-success" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Amazing! 🎉</h2>
                  <p className="text-muted-foreground">
                    You stepped outside your comfort zone.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">That's okay 💙</h2>
                  <p className="text-muted-foreground">
                    Just considering it is progress.
                  </p>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Anxiety Level Before (1 = calm, 10 = very anxious)
                </label>
                <Slider
                  value={anxietyBefore}
                  onValueChange={setAnxietyBefore}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Calm</span>
                  <span>{anxietyBefore[0]}</span>
                  <span>Very Anxious</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Anxiety Level After
                </label>
                <Slider
                  value={anxietyAfter}
                  onValueChange={setAnxietyAfter}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Calm</span>
                  <span>{anxietyAfter[0]}</span>
                  <span>Very Anxious</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Any thoughts to capture?
                </label>
                <Textarea
                  placeholder="How did it feel? What did you notice?"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <Button className="w-full" onClick={submitReflection}>
              Save Reflection
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Card>
        )}

        {/* Complete */}
        {step === "complete" && currentMission && (
          <Card className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-primary" />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">
                {completed ? "Mission Complete!" : "Progress Made!"}
              </h2>
              <p className="text-muted-foreground">
                {completed
                  ? "Your confidence is growing with every step."
                  : "Every attempt makes the next one easier."}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted">
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  +{completed ? currentMission.confidenceGain : 2} Confidence
                </span>
              </div>
            </div>

            {anxietyAfter[0] < anxietyBefore[0] && (
              <div className="p-4 rounded-xl bg-success/10 border border-success/30">
                <Star className="h-5 w-5 text-success mx-auto mb-2" />
                <p className="text-sm">
                  Your anxiety dropped from {anxietyBefore[0]} to {anxietyAfter[0]}!
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/espresso")}
              >
                Done for today
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setStep("select");
                  setCurrentMission(null);
                  setCompleted(false);
                  setReflection("");
                  setAnxietyBefore([5]);
                  setAnxietyAfter([5]);
                }}
              >
                Another mission
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SocialTrainer;
