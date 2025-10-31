import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pause, Play, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InstantRelief = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<"inhale1" | "inhale2" | "exhale" | "pause">("inhale1");
  const [isComplete, setIsComplete] = useState(false);
  const [scale, setScale] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalRounds = 5;

  const phaseMessages = {
    inhale1: "Inhale...",
    inhale2: "Inhale again...",
    exhale: "Exhale slowly...",
    pause: "Rest...",
  };

  const phaseDurations = {
    inhale1: 1000,
    inhale2: 1000,
    exhale: 5000,
    pause: 3000,
  };

  useEffect(() => {
    if (!isActive || isPaused || isComplete) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return;
    }

    // Animate circle based on phase
    if (phase === "inhale1" || phase === "inhale2") {
      setScale(1.5);
    } else if (phase === "exhale") {
      setScale(0.8);
    } else {
      setScale(1);
    }

    const duration = phaseDurations[phase];

    timerRef.current = setTimeout(() => {
      if (phase === "inhale1") {
        setPhase("inhale2");
      } else if (phase === "inhale2") {
        setPhase("exhale");
      } else if (phase === "exhale") {
        setPhase("pause");
      } else {
        // End of pause - move to next round or complete
        if (currentRound >= totalRounds) {
          setIsComplete(true);
          setIsActive(false);
        } else {
          setCurrentRound(currentRound + 1);
          setPhase("inhale1");
        }
      }
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isActive, isPaused, phase, currentRound, isComplete]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setIsComplete(false);
    setCurrentRound(1);
    setPhase("inhale1");
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleEnd = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentRound(1);
    setPhase("inhale1");
    setScale(1);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleRestart = () => {
    setIsComplete(false);
    handleStart();
  };

  return (
    <div className="min-h-screen gradient-misty flex flex-col page-transition">
      {/* Header */}
      <header className="p-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        {!isComplete ? (
          <>
            {/* Title */}
            <h1 className="text-foreground text-3xl font-bold mb-2 text-center">
              Instant Relief Breathing
            </h1>
            <p className="text-muted-foreground text-center mb-12 max-w-md">
              Follow the breathing pattern for immediate calm
            </p>

            {/* Breathing Circle */}
            <div className="relative mb-12">
              <div
                className="w-64 h-64 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-1000 ease-in-out shadow-glow"
                style={{
                  transform: `scale(${scale})`,
                }}
              >
                <div className="text-center">
                  <p className="text-primary text-2xl font-semibold mb-2">
                    {isActive ? phaseMessages[phase] : "Ready to begin"}
                  </p>
                  {isActive && (
                    <p className="text-foreground/80 text-lg">
                      Round {currentRound} of {totalRounds}
                    </p>
                  )}
                </div>
              </div>

              {/* Outer glow ring */}
              <div
                className="absolute inset-0 w-64 h-64 rounded-full bg-primary/10 blur-2xl transition-transform duration-1000"
                style={{
                  transform: `scale(${scale * 1.2})`,
                }}
              />
            </div>

            {/* Progress Dots */}
            <div className="flex gap-3 mb-12">
              {[...Array(totalRounds)].map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index + 1 < currentRound
                      ? "bg-primary"
                      : index + 1 === currentRound
                      ? "bg-primary scale-125"
                      : "bg-primary/30"
                  }`}
                />
              ))}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4">
              {!isActive ? (
                <Button
                  onClick={handleStart}
                  size="lg"
                  variant="wellness"
                  className="text-lg px-8 py-6 shadow-glow rounded-xl"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Breathing
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handlePause}
                    size="lg"
                    variant="outline"
                    className="bg-card/80 border-border text-foreground hover:bg-card/90 backdrop-blur-sm text-lg px-8 py-6 rounded-xl"
                  >
                    {isPaused ? (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="mr-2 h-5 w-5" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleEnd}
                    size="lg"
                    variant="outline"
                    className="bg-card/80 border-border text-foreground hover:bg-card/90 backdrop-blur-sm text-lg px-8 py-6 rounded-xl"
                  >
                    <X className="mr-2 h-5 w-5" />
                    End Session
                  </Button>
                </>
              )}
            </div>
          </>
        ) : (
          /* Completion Message */
          <div className="text-center animate-fade-in max-w-lg">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-6xl">✨</span>
            </div>
            <h2 className="text-foreground text-4xl font-bold mb-4">You did it!</h2>
            <p className="text-muted-foreground text-xl mb-8 leading-relaxed">
              Notice how your body feels now. Take a moment of gratitude for taking care of
              yourself.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleRestart}
                size="lg"
                variant="wellness"
                className="text-lg px-8 py-6 shadow-glow rounded-xl"
              >
                Practice Again
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                variant="outline"
                className="bg-card/80 border-border text-foreground hover:bg-card/90 backdrop-blur-sm text-lg px-8 py-6 rounded-xl"
              >
                Return Home
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Ambient Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
    </div>
  );
};

export default InstantRelief;
