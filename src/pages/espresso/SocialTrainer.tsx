import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  MessageCircle,
  Shield,
  Check,
  ArrowRight,
  Loader2,
  Heart,
  X
} from "lucide-react";

interface Mission {
  id: string;
  level: "easy" | "medium" | "hard";
  title: string;
  description: string;
  script: string;
  backupScript: string;
  exitLine: string;
}

const missions: Mission[] = [
  {
    id: "easy-1",
    level: "easy",
    title: "The Smile Exchange",
    description: "Make eye contact with a stranger and smile.",
    script: "Just look, smile gently, and continue walking. No words needed.",
    backupScript: "If nervous: A small nod works too.",
    exitLine: "Just look away naturally and continue your day."
  },
  {
    id: "easy-2",
    level: "easy",
    title: "The Thank You",
    description: "Thank a cashier or service worker with genuine warmth.",
    script: "\"Thank you so much, have a great day!\"",
    backupScript: "If nervous: \"Thanks!\" with a smile is enough.",
    exitLine: "Walk away with a smile."
  },
  {
    id: "easy-3",
    level: "easy",
    title: "The Wave",
    description: "Wave at a neighbor or someone you recognize.",
    script: "A simple wave from where you are. No need to walk over.",
    backupScript: "If nervous: A head nod from a distance works.",
    exitLine: "Keep walking. That was enough."
  },
  {
    id: "easy-4",
    level: "easy",
    title: "The Hold",
    description: "Hold a door open for someone behind you.",
    script: "Just hold it, maybe a small nod. No words required.",
    backupScript: "If nervous: You can let go before they reach it — still counts.",
    exitLine: "Walk on. You did a kind thing."
  },
  {
    id: "medium-1",
    level: "medium",
    title: "The Compliment",
    description: "Give a genuine compliment to someone you encounter.",
    script: "\"I love your [jacket/shoes/bag]! Where did you get it?\"",
    backupScript: "If nervous: \"Nice [item]!\" and walk away.",
    exitLine: "\"Anyway, have a good one!\""
  },
  {
    id: "medium-2",
    level: "medium",
    title: "The Question",
    description: "Ask someone for a simple recommendation.",
    script: "\"Excuse me, do you know a good coffee place around here?\"",
    backupScript: "If nervous: \"Any food recommendations nearby?\"",
    exitLine: "\"Thanks so much! I'll check it out.\""
  },
  {
    id: "medium-3",
    level: "medium",
    title: "The Comment",
    description: "Make a small comment to someone nearby about something shared.",
    script: "\"That smells amazing\" (at a bakery) or \"Great weather today.\"",
    backupScript: "If nervous: Say it quietly, even if they don't hear. You still said it.",
    exitLine: "Smile and move on. That's it."
  },
  {
    id: "medium-4",
    level: "medium",
    title: "The Order Extra",
    description: "Add a small personal touch when ordering food or coffee.",
    script: "\"Can I get that with oat milk? Also — love this place.\"",
    backupScript: "If nervous: Just the order is fine. You showed up.",
    exitLine: "\"Thanks!\" and step aside."
  },
  {
    id: "hard-1",
    level: "hard",
    title: "The Conversation Starter",
    description: "Start a brief conversation with someone waiting in line.",
    script: "Comment on something shared: \"This line is wild today, huh?\"",
    backupScript: "If nervous: \"Been waiting long?\"",
    exitLine: "\"Well, nice chatting with you!\""
  },
  {
    id: "hard-2",
    level: "hard",
    title: "The Invite",
    description: "Invite an acquaintance to hang out sometime.",
    script: "\"Hey, we should grab coffee sometime! Are you free this week?\"",
    backupScript: "If nervous: \"Let me know if you ever want to hang out.\"",
    exitLine: "\"No worries either way, just thought I'd ask!\""
  },
  {
    id: "hard-3",
    level: "hard",
    title: "The Follow-Up",
    description: "Ask a follow-up question in a conversation instead of letting it end.",
    script: "\"Oh really? What was that like?\" or \"How did that go?\"",
    backupScript: "If nervous: \"That's cool\" with a nod keeps it going gently.",
    exitLine: "\"Thanks for sharing that. Talk soon!\""
  },
  {
    id: "hard-4",
    level: "hard",
    title: "The Reconnect",
    description: "Text or message someone you haven't talked to in a while.",
    script: "\"Hey! Thought of you today. How've you been?\"",
    backupScript: "If nervous: A reaction to their story or post counts too.",
    exitLine: "Send it and put your phone down. You reached out."
  }
];

const levelMicroCopy: Record<string, string> = {
  easy: "No pressure. These are small, quiet moments.",
  medium: "A little stretch. You can always fall back.",
  hard: "Only when you're ready. There's no rush."
};

const reflectionOptions = [
  "I did it and it felt okay",
  "I tried but froze up",
  "I almost did it",
  "I skipped it — not today",
  "Something unexpected happened"
];

const reassuranceMessages: Record<string, string> = {
  "I did it and it felt okay": "That's real progress. Quietly powerful.",
  "I tried but froze up": "Freezing is your body protecting you. That still counts.",
  "I almost did it": "Almost is not failure. It's the edge of growth.",
  "I skipped it — not today": "Knowing your limit is a skill, not a weakness.",
  "Something unexpected happened": "Life doesn't follow scripts. You handled it your way."
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const SocialTrainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"select" | "mission" | "reflection">("select");
  const [selectedLevel, setSelectedLevel] = useState<"easy" | "medium" | "hard">("easy");
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [selectedReflection, setSelectedReflection] = useState<string | null>(null);
  const [recentMissions, setRecentMissions] = useState<{ id: string; date: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("anxiety_trainer_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        const saved = (data.completed_missions as { id: string; date: number }[] | null) || [];
        // Filter to only missions from the last 7 days
        const recent = saved.filter((m) => Date.now() - m.date < SEVEN_DAYS_MS);
        setRecentMissions(recent);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickMission = () => {
    const recentIds = recentMissions.map((m) => m.id);
    const available = missions.filter(
      (m) => m.level === selectedLevel && !recentIds.includes(m.id)
    );

    const pool = available.length > 0
      ? available
      : missions.filter((m) => m.level === selectedLevel);

    setCurrentMission(pool[Math.floor(Math.random() * pool.length)]);
    setSelectedReflection(null);
    setStep("mission");
  };

  const handleReflection = async (reflection: string) => {
    setSelectedReflection(reflection);

    if (!currentMission) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updatedRecent = [
        ...recentMissions.filter((m) => Date.now() - m.date < SEVEN_DAYS_MS),
        { id: currentMission.id, date: Date.now() }
      ];

      const { data: existing } = await supabase
        .from("anxiety_trainer_progress")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        await supabase
          .from("anxiety_trainer_progress")
          .update({
            completed_missions: updatedRecent,
            current_level: selectedLevel
          })
          .eq("user_id", user.id);
      } else {
        await supabase.from("anxiety_trainer_progress").insert({
          user_id: user.id,
          completed_missions: updatedRecent,
          current_level: selectedLevel
        });
      }

      setRecentMissions(updatedRecent);
    } catch (error) {
      console.error("Error saving progress:", error);
      toast({ title: "Couldn't save — but your effort still matters.", variant: "destructive" });
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

            <p className="text-sm text-muted-foreground text-center italic">
              {levelMicroCopy[selectedLevel]}
            </p>

            <Button className="w-full" onClick={pickMission}>
              Get Today's Mission
            </Button>

            <button
              onClick={() => navigate("/espresso")}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Too much today? You can skip. Progress isn't lost.
            </button>
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
                When you're back, tell us what happened.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("reflection")}
                  className="h-12"
                >
                  <Check className="h-4 w-4 mr-2" />
                  I'm back
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleReflection("I skipped it — not today");
                    setStep("reflection");
                  }}
                  className="h-12 text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-2" />
                  Skip this one
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Reflection */}
        {step === "reflection" && currentMission && (
          <Card className="p-6 space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-lg font-semibold mb-1">What actually happened?</h2>
              <p className="text-sm text-muted-foreground">
                No wrong answers. Just pick the closest one.
              </p>
            </div>

            <div className="space-y-2">
              {reflectionOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleReflection(option)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                    selectedReflection === option
                      ? "bg-primary/10 border-primary/30 text-foreground"
                      : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {selectedReflection && (
              <div className="p-4 rounded-xl bg-muted/50 text-center animate-in fade-in-0 duration-300">
                <p className="text-sm text-foreground">
                  {reassuranceMessages[selectedReflection]}
                </p>
              </div>
            )}

            {selectedReflection && (
              <div className="flex gap-3 animate-in fade-in-0 duration-300">
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
                    setSelectedReflection(null);
                  }}
                >
                  Another mission
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default SocialTrainer;
