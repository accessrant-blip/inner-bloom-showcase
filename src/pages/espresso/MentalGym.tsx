import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  Dumbbell,
  Eye,
  Waves,
  Mountain,
  Check,
  Loader2
} from "lucide-react";

interface Drill {
  id: string;
  prompt: string;
  hint?: string;
}

interface Level {
  id: number;
  name: string;
  purpose: string;
  tone: string;
  icon: React.ElementType;
  drills: Drill[];
}

const levels: Level[] = [
  {
    id: 1,
    name: "Awareness",
    purpose: "Noticing emotions without judging them",
    tone: "Just notice. No fixing.",
    icon: Eye,
    drills: [
      { id: "a1", prompt: "Name what you're feeling right now." },
      { id: "a2", prompt: "Notice one thought that keeps repeating." },
      { id: "a3", prompt: "Where do you feel tension in your body?" },
      { id: "a4", prompt: "What emotion have you been avoiding today?" },
      { id: "a5", prompt: "Notice your breathing. Is it shallow or deep?" },
      { id: "a6", prompt: "What's the first feeling you remember from this morning?" }
    ]
  },
  {
    id: 2,
    name: "Regulation",
    purpose: "Learning to calm and steady emotions",
    tone: "You're learning to steady yourself.",
    icon: Waves,
    drills: [
      { id: "r1", prompt: "Slow your breath for 30 seconds.", hint: "Breathe in for 4, out for 6." },
      { id: "r2", prompt: "Relax your shoulders and jaw.", hint: "Let them drop. Unclench." },
      { id: "r3", prompt: "Ground yourself by naming 3 things you can see." },
      { id: "r4", prompt: "Place a hand on your chest. Breathe until you feel calmer." },
      { id: "r5", prompt: "Name one thing you can control right now." },
      { id: "r6", prompt: "Take 5 slow breaths. Count each exhale." }
    ]
  },
  {
    id: 3,
    name: "Resilience",
    purpose: "Building inner strength and emotional flexibility",
    tone: "You're building emotional strength.",
    icon: Mountain,
    drills: [
      { id: "s1", prompt: "Reframe one harsh thought into a neutral one." },
      { id: "s2", prompt: "Sit with discomfort for 30 seconds.", hint: "Don't fix. Just observe." },
      { id: "s3", prompt: "Remind yourself: this feeling will pass." },
      { id: "s4", prompt: "Think of one difficult thing you've already survived." },
      { id: "s5", prompt: "What would you tell a friend feeling this way?" },
      { id: "s6", prompt: "Name one small thing you're proud of today." }
    ]
  }
];

const DRILLS_TO_UNLOCK_LEVEL_2 = 4;
const DRILLS_TO_UNLOCK_LEVEL_3 = 4;

const MentalGym = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [currentDrill, setCurrentDrill] = useState<Drill | null>(null);
  const [response, setResponse] = useState("");
  const [drillStarted, setDrillStarted] = useState(false);
  const [drillComplete, setDrillComplete] = useState(false);
  const [completedDrillsPerLevel, setCompletedDrillsPerLevel] = useState<Record<number, string[]>>({
    1: [],
    2: [],
    3: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [justUnlockedLevel, setJustUnlockedLevel] = useState<number | null>(null);

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
        .from("mental_gym_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        const completed = (data.completed_drills as Record<string, string[]>) || { 1: [], 2: [], 3: [] };
        // Ensure all levels have arrays
        const normalizedCompleted: Record<number, string[]> = {
          1: Array.isArray(completed[1]) ? completed[1] : [],
          2: Array.isArray(completed[2]) ? completed[2] : [],
          3: Array.isArray(completed[3]) ? completed[3] : []
        };
        setCompletedDrillsPerLevel(normalizedCompleted);

        // Determine unlocked levels
        const unlocked = [1];
        if (normalizedCompleted[1].length >= DRILLS_TO_UNLOCK_LEVEL_2) {
          unlocked.push(2);
        }
        if (normalizedCompleted[2].length >= DRILLS_TO_UNLOCK_LEVEL_3) {
          unlocked.push(3);
        }
        setUnlockedLevels(unlocked);
        setCurrentLevel(data.level || 1);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (updatedCompleted: Record<number, string[]>, newLevel: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from("mental_gym_progress")
        .select("id")
        .eq("user_id", user.id)
        .single();

      const today = new Date().toISOString().split("T")[0];

      if (existing) {
        await supabase
          .from("mental_gym_progress")
          .update({
            completed_drills: updatedCompleted,
            level: newLevel,
            last_workout_date: today,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", user.id);
      } else {
        await supabase.from("mental_gym_progress").insert({
          user_id: user.id,
          completed_drills: updatedCompleted,
          level: newLevel,
          last_workout_date: today,
          total_xp: 0,
          current_streak: 1
        });
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const selectLevel = (levelId: number) => {
    if (!unlockedLevels.includes(levelId)) return;
    setCurrentLevel(levelId);
    setShowLevelSelect(false);
    pickRandomDrill(levelId);
  };

  const pickRandomDrill = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) return;

    const completed = completedDrillsPerLevel[levelId] || [];
    const available = level.drills.filter(d => !completed.includes(d.id));
    
    // If all drills completed, allow repeats
    const pool = available.length > 0 ? available : level.drills;
    const randomDrill = pool[Math.floor(Math.random() * pool.length)];
    setCurrentDrill(randomDrill);
  };

  const startDrill = () => {
    setDrillStarted(true);
    setDrillComplete(false);
    setResponse("");
  };

  const completeDrill = async () => {
    if (!currentDrill) return;

    setDrillComplete(true);

    // Update completed drills
    const updatedCompleted = { ...completedDrillsPerLevel };
    if (!updatedCompleted[currentLevel].includes(currentDrill.id)) {
      updatedCompleted[currentLevel] = [...updatedCompleted[currentLevel], currentDrill.id];
    }
    setCompletedDrillsPerLevel(updatedCompleted);

    // Check for level unlock
    let newUnlockedLevel: number | null = null;
    const newUnlocked = [...unlockedLevels];
    
    if (currentLevel === 1 && updatedCompleted[1].length >= DRILLS_TO_UNLOCK_LEVEL_2 && !unlockedLevels.includes(2)) {
      newUnlocked.push(2);
      newUnlockedLevel = 2;
    }
    if (currentLevel === 2 && updatedCompleted[2].length >= DRILLS_TO_UNLOCK_LEVEL_3 && !unlockedLevels.includes(3)) {
      newUnlocked.push(3);
      newUnlockedLevel = 3;
    }
    
    setUnlockedLevels(newUnlocked);
    setJustUnlockedLevel(newUnlockedLevel);

    await saveProgress(updatedCompleted, currentLevel);
  };

  const finishSession = () => {
    setDrillStarted(false);
    setDrillComplete(false);
    setCurrentDrill(null);
    setResponse("");
    setShowLevelSelect(true);
    setJustUnlockedLevel(null);
  };

  const doAnotherDrill = () => {
    setDrillComplete(false);
    setResponse("");
    setJustUnlockedLevel(null);
    pickRandomDrill(currentLevel);
  };

  const currentLevelData = levels.find(l => l.id === currentLevel);

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
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => showLevelSelect ? navigate("/espresso") : finishSession()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              <Dumbbell className="h-6 w-6 text-primary" />
              Mental Gym
              {!showLevelSelect && currentLevelData && (
                <span className="text-muted-foreground font-normal text-lg">
                  — Level {currentLevel}: {currentLevelData.name}
                </span>
              )}
            </h1>
          </div>
        </div>

        {showLevelSelect ? (
          /* Level Selection */
          <div className="space-y-6">
            <p className="text-muted-foreground text-center mb-8">
              Short emotional drills. No pressure. Train at your pace.
            </p>

            <div className="space-y-4">
              {levels.map((level) => {
                const isUnlocked = unlockedLevels.includes(level.id);
                const completedCount = completedDrillsPerLevel[level.id]?.length || 0;
                const Icon = level.icon;

                return (
                  <Card
                    key={level.id}
                    className={`p-6 transition-all ${
                      isUnlocked
                        ? "cursor-pointer hover:shadow-md hover:border-primary/30"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => isUnlocked && selectLevel(level.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${isUnlocked ? "bg-primary/10" : "bg-muted"}`}>
                        <Icon className={`h-6 w-6 ${isUnlocked ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium">
                            Level {level.id}: {level.name}
                          </h3>
                          {!isUnlocked && (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              Locked
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          {level.purpose}
                        </p>
                        {isUnlocked && completedCount > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {completedCount} drill{completedCount !== 1 ? "s" : ""} completed
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8 italic">
              "Small efforts build lasting strength."
            </p>
          </div>
        ) : !drillStarted ? (
          /* Ready to Start Drill */
          <Card className="p-8 text-center space-y-6">
            {currentLevelData && (
              <>
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <currentLevelData.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-medium mb-2">
                    {currentLevelData.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {currentLevelData.purpose}
                  </p>
                </div>
                <p className="text-sm italic text-muted-foreground">
                  {currentLevelData.tone}
                </p>
                <Button className="w-full" size="lg" onClick={startDrill}>
                  Start
                </Button>
              </>
            )}
          </Card>
        ) : !drillComplete ? (
          /* Active Drill */
          <Card className="p-8 space-y-6">
            {currentDrill && (
              <>
                <div className="text-center">
                  <p className="text-xl leading-relaxed">
                    {currentDrill.prompt}
                  </p>
                  {currentDrill.hint && (
                    <p className="text-sm text-muted-foreground mt-3 italic">
                      {currentDrill.hint}
                    </p>
                  )}
                </div>

                {/* Optional response area */}
                <div className="pt-4">
                  <Textarea
                    placeholder="Write your thoughts (optional)..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <Button className="w-full" size="lg" onClick={completeDrill}>
                  Done
                </Button>
              </>
            )}
          </Card>
        ) : (
          /* Drill Complete */
          <Card className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-8 w-8 text-primary" />
            </div>

            <div>
              <h2 className="text-xl font-medium mb-2">
                That's enough for now.
              </h2>
              {currentLevelData && (
                <p className="text-muted-foreground">
                  {currentLevelData.tone}
                </p>
              )}
            </div>

            {justUnlockedLevel && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-primary font-medium">
                  Level {justUnlockedLevel} unlocked
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {levels.find(l => l.id === justUnlockedLevel)?.name} — ready when you are.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={doAnotherDrill}>
                Do another drill
              </Button>
              <Button onClick={finishSession}>
                Finish for now
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MentalGym;
