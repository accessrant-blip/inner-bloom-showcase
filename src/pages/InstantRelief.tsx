import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BreathingCircle from "@/components/breathing/BreathingCircle";
import BreathingControls from "@/components/breathing/BreathingControls";
import BreathingProgressRing from "@/components/breathing/BreathingProgressRing";
import { useBreathingAudio } from "@/hooks/useBreathingAudio";
import { usePrefersReducedMotion } from "@/components/accessibility/AccessibilityProvider";

type Phase = "inhale1" | "inhale2" | "hold" | "exhale";

const PHASE_DURATIONS: Record<Phase, number> = {
  inhale1: 2000,
  inhale2: 1000,
  hold: 1000,
  exhale: 5500,
};

const TOTAL_ROUNDS = 5;
const CYCLE_DURATION = Object.values(PHASE_DURATIONS).reduce((a, b) => a + b, 0);
const TOTAL_DURATION = CYCLE_DURATION * TOTAL_ROUNDS; // ~47.5s

const InstantRelief = () => {
  const navigate = useNavigate();
  const reduceMotion = usePrefersReducedMotion();
  const { speak, stop: stopAudio } = useBreathingAudio();

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<Phase>("inhale1");
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [sessionElapsed, setSessionElapsed] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const lastPhaseRef = useRef<Phase | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  }, []);

  // Speak on phase change
  useEffect(() => {
    if (isActive && !isPaused && soundEnabled && phase !== lastPhaseRef.current) {
      speak(phase);
    }
    lastPhaseRef.current = phase;
  }, [phase, isActive, isPaused, soundEnabled, speak]);

  // Main breathing loop
  useEffect(() => {
    if (!isActive || isPaused || isComplete) {
      clearTimers();
      return;
    }

    const duration = PHASE_DURATIONS[phase];
    const tick = 50;
    let elapsed = 0;

    progressRef.current = setInterval(() => {
      elapsed += tick;
      setPhaseProgress(Math.min(elapsed / duration, 1));
      setSessionElapsed((prev) => Math.min(prev + tick, TOTAL_DURATION));
    }, tick);

    timerRef.current = setTimeout(() => {
      setPhaseProgress(0);
      if (phase === "inhale1") setPhase("inhale2");
      else if (phase === "inhale2") setPhase("hold");
      else if (phase === "hold") setPhase("exhale");
      else {
        if (currentRound >= TOTAL_ROUNDS) {
          setIsComplete(true);
          setIsActive(false);
          stopAudio();
        } else {
          setCurrentRound((r) => r + 1);
          setPhase("inhale1");
        }
      }
    }, duration);

    return clearTimers;
  }, [isActive, isPaused, phase, currentRound, isComplete, clearTimers, stopAudio]);

  const handleBegin = () => {
    setIsActive(true);
    setIsPaused(false);
    setIsComplete(false);
    setCurrentRound(1);
    setPhase("inhale1");
    setPhaseProgress(0);
    setSessionElapsed(0);
  };

  const handlePause = () => {
    setIsPaused(true);
    stopAudio();
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    clearTimers();
    setIsActive(false);
    setIsPaused(false);
    setIsComplete(false);
    setCurrentRound(1);
    setPhase("inhale1");
    setPhaseProgress(0);
    setSessionElapsed(0);
    stopAudio();
  };

  const handleToggleSound = () => {
    if (soundEnabled) stopAudio();
    setSoundEnabled((s) => !s);
  };

  const sessionProgress = sessionElapsed / TOTAL_DURATION;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-foreground hover:text-primary transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 pb-16 pt-4">
        {!isComplete ? (
          <>
            {/* Title + Subtitle */}
            <div className="text-center mb-6 animate-fade-in max-w-md">
              <h1 className="text-foreground text-2xl sm:text-3xl font-bold mb-2">
                Instant Calm Breathing
              </h1>
              <p className="text-muted-foreground text-base">
                A 1-minute breathing reset when things feel overwhelming.
              </p>
            </div>

            {/* Round & timer indicator */}
            {isActive && (
              <div className="flex items-center gap-3 mb-4 animate-fade-in">
                <BreathingProgressRing progress={sessionProgress} />
                <div className="text-sm text-muted-foreground">
                  <span>
                    Cycle {currentRound} of {TOTAL_ROUNDS}
                  </span>
                  {isPaused && (
                    <span className="ml-2 text-primary font-medium">Paused</span>
                  )}
                </div>
              </div>
            )}

            {/* Breathing Circle — fixed container */}
            <div className="w-full max-w-sm mx-auto mb-8" style={{ height: 320 }}>
              <BreathingCircle
                isActive={isActive && !isPaused}
                phase={phase}
                progress={phaseProgress}
                reduceMotion={reduceMotion}
              />
            </div>

            {/* Progress Dots */}
            {isActive && (
              <div
                className="flex gap-2.5 mb-6 animate-fade-in"
                role="group"
                aria-label={`Breathing cycle ${currentRound} of ${TOTAL_ROUNDS}`}
              >
                {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i + 1 < currentRound
                        ? "bg-primary"
                        : i + 1 === currentRound
                        ? "bg-primary scale-125"
                        : "bg-primary/25"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            )}

            {/* Controls */}
            <BreathingControls
              isActive={isActive}
              isPaused={isPaused}
              soundEnabled={soundEnabled}
              onBegin={handleBegin}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
              onToggleSound={handleToggleSound}
            />

            {/* Helper text */}
            {isActive && !isPaused && (
              <p className="text-muted-foreground/60 text-sm text-center mt-6 max-w-xs animate-fade-in">
                You don't need to do this perfectly. Just follow along.
              </p>
            )}
          </>
        ) : (
          /* Completion */
          <div className="text-center animate-fade-in max-w-md px-4 mt-12">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/15 flex items-center justify-center">
              <div className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-primary rounded-full" />
              </div>
            </div>

            <h2 className="text-foreground text-2xl font-bold mb-3">
              Breathing Complete
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              You did it. Your nervous system just reset a little.
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={handleBegin}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium bg-secondary/60 hover:bg-secondary text-foreground/80 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Repeat
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default InstantRelief;
