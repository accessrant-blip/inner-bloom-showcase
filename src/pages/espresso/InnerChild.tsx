import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Shield,
  Sparkles,
  Moon,
  Hand,
  Loader2,
  X
} from "lucide-react";

const reassuranceMessages = [
  "You are worthy of love, even on your hardest days. 💗",
  "It's okay to rest. You don't have to earn your peace.",
  "Your feelings are valid. All of them.",
  "You've survived every bad day so far. You're stronger than you know.",
  "You don't have to be perfect to be loved.",
  "It's okay to need help. Asking is brave.",
  "You are not too much. You are enough.",
  "Your past does not define your future.",
  "You deserve gentle words, especially from yourself.",
  "The child in you deserves compassion. Give it freely."
];

const safeScripts = [
  {
    id: "rejection",
    title: "When Facing Rejection",
    emoji: "💔",
    script: "This hurts, and that's okay. Their no doesn't mean I'm not worthy. I am still lovable. I am still valuable. This one door closing doesn't define my story."
  },
  {
    id: "loneliness",
    title: "When Feeling Lonely",
    emoji: "🥺",
    script: "I feel alone right now, but I am not forgotten. Connection takes time to build. I can reach out when I'm ready. For now, I will be gentle company to myself."
  },
  {
    id: "shame",
    title: "When Feeling Shame",
    emoji: "😣",
    script: "I made a mistake, but I am not the mistake. I am learning and growing. Everyone messes up. I deserve forgiveness, including from myself."
  },
  {
    id: "overwhelm",
    title: "When Overwhelmed",
    emoji: "😵",
    script: "It's okay to feel this way. I don't have to figure everything out right now. One small thing at a time. I am doing the best I can, and that is enough."
  },
  {
    id: "anxiety",
    title: "When Anxiety Rises",
    emoji: "😰",
    script: "This feeling will pass. I am safe in this moment. I've handled hard things before. My body is trying to protect me. I can breathe through this."
  }
];

const reparentingPrompts = [
  "What did you need to hear as a child that you never did?",
  "If you could comfort your younger self right now, what would you say?",
  "What's one way you can show yourself the care you once needed?",
  "Picture yourself at 7 years old. What does that child need right now?",
  "What's a boundary your younger self wishes someone set for you?"
];

const InnerChild = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<"home" | "reassurance" | "scripts" | "visualization" | "reparenting" | "hold">("home");
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedScript, setSelectedScript] = useState<typeof safeScripts[0] | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  const getRandomMessage = () => {
    const msg = reassuranceMessages[Math.floor(Math.random() * reassuranceMessages.length)];
    setCurrentMessage(msg);
    setCurrentView("reassurance");
  };

  const getRandomPrompt = () => {
    const prompt = reparentingPrompts[Math.floor(Math.random() * reparentingPrompts.length)];
    setCurrentPrompt(prompt);
    setCurrentView("reparenting");
  };

  const startHold = () => {
    setCurrentView("hold");
    setIsHolding(true);
    setHoldProgress(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHolding && holdProgress < 100) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            setIsHolding(false);
            return 100;
          }
          return prev + (100 / 60); // 60 seconds
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isHolding, holdProgress]);

  const logSession = async (type: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("inner_child_sessions").insert({
        user_id: user.id,
        session_type: type
      });
    } catch (error) {
      console.error("Error logging session:", error);
    }
  };

  const tools = [
    {
      id: "reassurance",
      title: "Reassurance Message",
      description: "Receive a gentle reminder you need to hear",
      icon: MessageCircle,
      color: "text-pink-500",
      action: () => {
        getRandomMessage();
        logSession("reassurance");
      }
    },
    {
      id: "scripts",
      title: "Safe Scripts",
      description: "Words for moments of rejection, loneliness, or shame",
      icon: Shield,
      color: "text-purple-500",
      action: () => setCurrentView("scripts")
    },
    {
      id: "visualization",
      title: "Safe Place",
      description: "A guided visualization to feel protected",
      icon: Moon,
      color: "text-blue-500",
      action: () => {
        setCurrentView("visualization");
        logSession("visualization");
      }
    },
    {
      id: "reparenting",
      title: "Reparenting Prompts",
      description: "Gentle questions to nurture your inner child",
      icon: Sparkles,
      color: "text-amber-500",
      action: () => {
        getRandomPrompt();
        logSession("reparenting");
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-background dark:from-rose-950/20 dark:to-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => currentView === "home" ? navigate("/espresso") : setCurrentView("home")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-500" />
              Inner Child Mode
            </h1>
            <p className="text-muted-foreground text-sm">
              A safe space for gentle healing
            </p>
          </div>
        </div>

        {/* Home */}
        {currentView === "home" && (
          <div className="space-y-4">
            {tools.map((tool) => (
              <Card
                key={tool.id}
                className="p-5 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01] border-0 bg-card/80 backdrop-blur-sm"
                onClick={tool.action}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl bg-background/50 ${tool.color}`}>
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Special CTA */}
            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-rose-200 dark:border-rose-900 bg-gradient-to-br from-rose-100/50 to-pink-100/50 dark:from-rose-950/50 dark:to-pink-950/50"
              onClick={startHold}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-rose-500/20">
                  <Hand className="h-6 w-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-rose-700 dark:text-rose-300">
                    Hold Me for 60 Seconds 💗
                  </h3>
                  <p className="text-sm text-rose-600/70 dark:text-rose-400/70">
                    A calming moment of comfort and peace
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Reassurance */}
        {currentView === "reassurance" && (
          <Card className="p-8 text-center space-y-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 border-0">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-200/50 dark:bg-rose-800/50 flex items-center justify-center">
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
            <p className="text-xl font-medium leading-relaxed">{currentMessage}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={getRandomMessage}>
                Another message
              </Button>
              <Button onClick={() => setCurrentView("home")}>
                Back
              </Button>
            </div>
          </Card>
        )}

        {/* Scripts Selection */}
        {currentView === "scripts" && !selectedScript && (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center mb-6">
              Choose what you're feeling right now
            </p>
            {safeScripts.map((script) => (
              <Card
                key={script.id}
                className="p-4 cursor-pointer hover:shadow-md transition-all border-0 bg-card/80"
                onClick={() => {
                  setSelectedScript(script);
                  logSession(`script-${script.id}`);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{script.emoji}</span>
                  <span className="font-medium">{script.title}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Selected Script */}
        {currentView === "scripts" && selectedScript && (
          <Card className="p-8 space-y-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-0">
            <div className="text-center">
              <span className="text-4xl mb-4 block">{selectedScript.emoji}</span>
              <h3 className="font-semibold text-lg mb-2">{selectedScript.title}</h3>
            </div>
            <p className="text-lg leading-relaxed italic text-center">
              "{selectedScript.script}"
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setSelectedScript(null)}>
                Try another
              </Button>
              <Button onClick={() => {
                setSelectedScript(null);
                setCurrentView("home");
              }}>
                Done
              </Button>
            </div>
          </Card>
        )}

        {/* Visualization */}
        {currentView === "visualization" && (
          <Card className="p-8 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-0">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-200/50 dark:bg-blue-800/50 flex items-center justify-center">
              <Moon className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-center">Safe Place Visualization</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Close your eyes and take a deep breath...</p>
              <p>Imagine a place where you feel completely safe. It could be real or imagined.</p>
              <p>Picture the details — the colors, the sounds, the temperature of the air.</p>
              <p>In this place, nothing can hurt you. You are protected.</p>
              <p>Feel your body relax into this safety. Stay here as long as you need.</p>
              <p>When you're ready, slowly open your eyes, carrying that peace with you.</p>
            </div>
            <Button className="w-full" onClick={() => setCurrentView("home")}>
              Return gently
            </Button>
          </Card>
        )}

        {/* Reparenting */}
        {currentView === "reparenting" && (
          <Card className="p-8 text-center space-y-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-0">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-200/50 dark:bg-amber-800/50 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-xl font-medium leading-relaxed">{currentPrompt}</p>
            <p className="text-sm text-muted-foreground">
              Take your time to reflect. There's no wrong answer.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={getRandomPrompt}>
                Another prompt
              </Button>
              <Button onClick={() => setCurrentView("home")}>
                Done
              </Button>
            </div>
          </Card>
        )}

        {/* Hold Me */}
        {currentView === "hold" && (
          <div className="fixed inset-0 bg-gradient-to-b from-rose-100 to-pink-200 dark:from-rose-950 dark:to-pink-950 flex items-center justify-center z-50">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full"
              onClick={() => {
                setIsHolding(false);
                setCurrentView("home");
                if (holdProgress >= 100) {
                  logSession("hold-complete");
                }
              }}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="text-center p-8 max-w-md">
              {holdProgress < 100 ? (
                <>
                  <div className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-rose-300/50 flex items-center justify-center relative">
                    <div 
                      className="absolute inset-0 rounded-full bg-rose-400/30 animate-pulse"
                      style={{ 
                        transform: `scale(${1 + Math.sin(Date.now() / 1000) * 0.1})`,
                        transition: 'transform 1s ease-in-out'
                      }}
                    />
                    <Heart className="h-12 w-12 text-rose-500 animate-pulse" />
                  </div>
                  <p className="text-2xl font-medium text-rose-700 dark:text-rose-300 mb-4">
                    You are safe. You are loved.
                  </p>
                  <p className="text-rose-600/70 dark:text-rose-400/70 mb-6">
                    Breathe slowly... In through your nose... Out through your mouth...
                  </p>
                  <div className="w-full h-2 bg-rose-200/50 dark:bg-rose-800/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-400 rounded-full transition-all duration-1000"
                      style={{ width: `${holdProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-rose-500/70 mt-2">
                    {Math.ceil(60 - (holdProgress / 100 * 60))} seconds remaining
                  </p>
                </>
              ) : (
                <>
                  <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-rose-300/30 flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-rose-500" />
                  </div>
                  <p className="text-2xl font-medium text-rose-700 dark:text-rose-300 mb-4">
                    You did beautifully 💗
                  </p>
                  <p className="text-rose-600/70 dark:text-rose-400/70 mb-6">
                    Remember: You can return to this calm whenever you need.
                  </p>
                  <Button 
                    className="bg-rose-500 hover:bg-rose-600"
                    onClick={() => setCurrentView("home")}
                  >
                    Return with peace
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InnerChild;
