import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Phase = "inhale1" | "inhale2" | "hold" | "exhale";

const InstantRelief = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<Phase>("inhale1");
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const totalRounds = 5;

  const phaseConfig = {
    inhale1: {
      duration: 2000,
      message: "Inhale through your nose",
      subtext: "",
    },
    inhale2: {
      duration: 1000,
      message: "Take a second short inhale",
      subtext: "Top off the breath",
    },
    hold: {
      duration: 1000,
      message: "Hold for a moment",
      subtext: "",
    },
    exhale: {
      duration: 5500,
      message: "Slowly exhale through your mouth",
      subtext: "Empty your lungs completely",
    },
  };

  const getCircleScale = () => {
    if (!isActive) return 1;
    switch (phase) {
      case "inhale1":
        return 1.3 + (progress * 0.2);
      case "inhale2":
        return 1.5 + (progress * 0.1);
      case "hold":
        return 1.6;
      case "exhale":
        return 1.6 - (progress * 0.7);
      default:
        return 1;
    }
  };

  const getCircleColor = () => {
    if (!isActive) return "bg-primary/20";
    switch (phase) {
      case "inhale1":
      case "inhale2":
        return "bg-primary/30";
      case "hold":
        return "bg-primary/35";
      case "exhale":
        return "bg-primary/20";
      default:
        return "bg-primary/20";
    }
  };

  useEffect(() => {
    if (!isActive || isComplete) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    const duration = phaseConfig[phase].duration;
    const progressInterval = 50;
    let elapsed = 0;

    progressRef.current = setInterval(() => {
      elapsed += progressInterval;
      setProgress(Math.min(elapsed / duration, 1));
    }, progressInterval);

    timerRef.current = setTimeout(() => {
      setProgress(0);
      if (phase === "inhale1") {
        setPhase("inhale2");
      } else if (phase === "inhale2") {
        setPhase("hold");
      } else if (phase === "hold") {
        setPhase("exhale");
      } else {
        if (currentRound >= totalRounds) {
          setIsComplete(true);
          setIsActive(false);
        } else {
          setCurrentRound((prev) => prev + 1);
          setPhase("inhale1");
        }
      }
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isActive, phase, currentRound, isComplete]);

  const handleStart = () => {
    setIsActive(true);
    setIsComplete(false);
    setCurrentRound(1);
    setPhase("inhale1");
    setProgress(0);
  };

  const handleReturn = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>
        
        {isActive && (
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
            aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            {soundEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </button>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        {!isComplete ? (
          <>
            {/* Title */}
            {!isActive && (
              <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-foreground text-3xl font-bold mb-3">
                  Instant Calm Breathing
                </h1>
                <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                  A 1-minute breathing reset when things feel overwhelming.
                </p>
              </div>
            )}

            {/* Round indicator when active */}
            {isActive && (
              <div className="text-center mb-6 animate-fade-in">
                <p className="text-muted-foreground text-sm">
                  Cycle {currentRound} of {totalRounds}
                </p>
              </div>
            )}

            {/* Breathing Circle */}
            <div className="relative mb-8">
              <div
                className={`w-56 h-56 rounded-full ${getCircleColor()} backdrop-blur-sm flex items-center justify-center transition-all duration-300 ease-out`}
                style={{
                  transform: `scale(${getCircleScale()})`,
                }}
              >
                <div className="text-center px-6">
                  {isActive ? (
                    <>
                      <p className="text-foreground text-xl font-semibold mb-2 leading-relaxed">
                        {phaseConfig[phase].message}
                      </p>
                      {phaseConfig[phase].subtext && (
                        <p className="text-muted-foreground text-sm">
                          {phaseConfig[phase].subtext}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-foreground/70 text-lg">
                      Ready when you are
                    </p>
                  )}
                </div>
              </div>

              {/* Outer glow ring */}
              <div
                className={`absolute inset-0 w-56 h-56 rounded-full bg-primary/10 blur-2xl transition-all duration-300`}
                style={{
                  transform: `scale(${getCircleScale() * 1.2})`,
                }}
              />
            </div>

            {/* Progress Dots */}
            {isActive && (
              <div className="flex gap-3 mb-8 animate-fade-in">
                {[...Array(totalRounds)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index + 1 < currentRound
                        ? "bg-primary"
                        : index + 1 === currentRound
                        ? "bg-primary scale-125"
                        : "bg-primary/30"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Start Button */}
            {!isActive && (
              <Button
                onClick={handleStart}
                size="lg"
                variant="wellness"
                className="text-lg px-10 py-6 rounded-xl animate-fade-in"
              >
                <Play className="mr-2 h-5 w-5" />
                Begin Breathing
              </Button>
            )}

            {/* Reminder text */}
            {isActive && (
              <p className="text-muted-foreground/70 text-sm text-center mt-8 max-w-xs animate-fade-in">
                You don't need to do this perfectly. Just follow along.
              </p>
            )}
          </>
        ) : (
          /* Completion State */
          <div className="text-center animate-fade-in max-w-md px-4">
            <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-12 h-12 bg-primary/40 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-primary rounded-full" />
              </div>
            </div>
            
            <h2 className="text-foreground text-3xl font-bold mb-4">
              Breathing Complete
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Notice how your body feels now.
            </p>
            
            <Button
              onClick={handleReturn}
              size="lg"
              variant="wellness"
              className="text-lg px-10 py-6 rounded-xl"
            >
              Return to Home
            </Button>
          </div>
        )}
      </div>

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default InstantRelief;
