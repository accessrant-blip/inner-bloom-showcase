import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BreathingCircle from "@/components/breathing/BreathingCircle";
import type { BreathingPhase } from "@/components/breathing/BreathingCircle";
import BreathingControls from "@/components/breathing/BreathingControls";
import BreathingProgressRing from "@/components/breathing/BreathingProgressRing";
import { useBreathingAudio, type AudioMode } from "@/hooks/useBreathingAudio";
import { usePrefersReducedMotion } from "@/components/accessibility/AccessibilityProvider";

// ── Single timeline: 3.5s inhale, 0.75s topup, 7s exhale, 1s rest ≈ 12.25s per cycle ──
const PHASES: { phase: BreathingPhase; duration: number }[] = [
  { phase: "inhale", duration: 3500 },
  { phase: "topup", duration: 750 },
  { phase: "exhale", duration: 7000 },
  { phase: "rest", duration: 1000 },
];

const CYCLE_DURATION = PHASES.reduce((s, p) => s + p.duration, 0); // 12250ms
const TOTAL_ROUNDS = 6;
const TOTAL_DURATION = CYCLE_DURATION * TOTAL_ROUNDS;
const TICK = 50; // ms per tick

/**
 * Given elapsed ms within a single cycle, returns current phase + progress within it.
 */
function resolvePhase(cycleElapsed: number): {
  phase: BreathingPhase;
  progress: number;
  countdown: number;
} {
  let accumulated = 0;
  for (const p of PHASES) {
    if (cycleElapsed < accumulated + p.duration) {
      const inPhase = cycleElapsed - accumulated;
      const remaining = Math.ceil((p.duration - inPhase) / 1000);
      return { phase: p.phase, progress: inPhase / p.duration, countdown: remaining };
    }
    accumulated += p.duration;
  }
  // Fallback – end of cycle
  return { phase: "rest", progress: 1, countdown: 0 };
}

const AUDIO_MODES: AudioMode[] = ["full", "minimal", "silent"];

const InstantRelief = () => {
  const navigate = useNavigate();
  const reduceMotion = usePrefersReducedMotion();

  const [audioMode, setAudioMode] = useState<AudioMode>("full");
  const { speak, stop: stopAudio } = useBreathingAudio(audioMode);

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Master elapsed time (ms) – the SINGLE source of truth
  const [elapsed, setElapsed] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSpokenPhaseRef = useRef<string | null>(null);

  // Derived state from elapsed
  const currentRound = Math.min(Math.floor(elapsed / CYCLE_DURATION) + 1, TOTAL_ROUNDS);
  const cycleElapsed = elapsed % CYCLE_DURATION;
  const { phase, progress, countdown } = resolvePhase(cycleElapsed);
  const sessionProgress = elapsed / TOTAL_DURATION;

  // ── Single master tick ──
  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isActive || isPaused || isComplete) {
      clearTick();
      return;
    }

    tickRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + TICK;
        if (next >= TOTAL_DURATION) {
          // Complete
          return TOTAL_DURATION;
        }
        return next;
      });
    }, TICK);

    return clearTick;
  }, [isActive, isPaused, isComplete, clearTick]);

  // ── Completion detection ──
  useEffect(() => {
    if (elapsed >= TOTAL_DURATION && isActive) {
      setIsActive(false);
      setIsComplete(true);
      stopAudio();
    }
  }, [elapsed, isActive, stopAudio]);

  // ── Audio: speak once per phase transition, driven by same timeline ──
  useEffect(() => {
    if (!isActive || isPaused || isComplete) return;

    const phaseKey = `${currentRound}-${phase}`;
    if (phaseKey !== lastSpokenPhaseRef.current) {
      lastSpokenPhaseRef.current = phaseKey;
      speak(phase);
    }
  }, [isActive, isPaused, isComplete, currentRound, phase, speak]);

  // ── Controls ──
  const handleBegin = () => {
    setIsActive(true);
    setIsPaused(false);
    setIsComplete(false);
    setElapsed(0);
    lastSpokenPhaseRef.current = null;
  };

  const handlePause = () => {
    setIsPaused(true);
    stopAudio();
  };

  const handleResume = () => {
    lastSpokenPhaseRef.current = null; // re-speak current phase on resume
    setIsPaused(false);
  };

  const handleReset = () => {
    clearTick();
    setIsActive(false);
    setIsPaused(false);
    setIsComplete(false);
    setElapsed(0);
    lastSpokenPhaseRef.current = null;
    stopAudio();
  };

  const handleCycleAudioMode = () => {
    const idx = AUDIO_MODES.indexOf(audioMode);
    const next = AUDIO_MODES[(idx + 1) % AUDIO_MODES.length];
    if (next === "silent") stopAudio();
    setAudioMode(next);
  };

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
              <p className="text-muted-foreground/70 text-sm mb-3 italic">
                This is panic, not danger. Let's reset your system.
              </p>
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
                progress={progress}
                countdown={countdown}
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
              audioMode={audioMode}
              onBegin={handleBegin}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
              onCycleAudioMode={handleCycleAudioMode}
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
              Your nervous system has shifted.
            </h2>
            <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
              Notice one small change in your body.
            </p>
            <p className="text-muted-foreground/70 text-sm mb-10">
              You are safe. Your body is settling.
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={handleBegin}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium bg-secondary/60 hover:bg-secondary text-foreground/80 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Repeat Reset
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
