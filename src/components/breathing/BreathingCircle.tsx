import { cn } from "@/lib/utils";

type Phase = "inhale1" | "inhale2" | "hold" | "exhale";

interface BreathingCircleProps {
  isActive: boolean;
  phase: Phase;
  progress: number;
  reduceMotion: boolean;
}

const phaseText: Record<Phase, string> = {
  inhale1: "Inhale through your nose…",
  inhale2: "Inhale a little more…",
  hold: "Gently hold…",
  exhale: "Slow exhale through your mouth…",
};

function getScale(phase: Phase, progress: number, isActive: boolean): number {
  if (!isActive) return 1;
  switch (phase) {
    case "inhale1":
      return 1 + progress * 0.06;
    case "inhale2":
      return 1.06 + progress * 0.04;
    case "hold":
      return 1.1;
    case "exhale":
      return 1.1 - progress * 0.1;
    default:
      return 1;
  }
}

export default function BreathingCircle({
  isActive,
  phase,
  progress,
  reduceMotion,
}: BreathingCircleProps) {
  const scale = getScale(phase, progress, isActive);
  const transitionDuration = reduceMotion ? "0ms" : "200ms";

  return (
    <div
      className="relative flex items-center justify-center w-full"
      style={{ height: 320, maxHeight: 320, overflow: "hidden" }}
    >
      {/* Outer halo */}
      <div
        className="absolute rounded-full bg-primary/5 blur-2xl"
        style={{
          width: 240,
          height: 240,
          transform: `scale(${isActive ? scale * 1.1 : 1})`,
          transition: `transform ${transitionDuration} cubic-bezier(0.4,0,0.2,1)`,
        }}
        aria-hidden="true"
      />

      {/* Inner glow */}
      <div
        className="absolute rounded-full bg-primary/10 blur-xl"
        style={{
          width: 210,
          height: 210,
          transform: `scale(${isActive ? scale * 1.05 : 1})`,
          transition: `transform ${transitionDuration} cubic-bezier(0.4,0,0.2,1)`,
        }}
        aria-hidden="true"
      />

      {/* Main circle */}
      <div
        className="relative z-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 backdrop-blur-sm flex items-center justify-center"
        style={{
          width: 190,
          height: 190,
          transform: `scale(${scale})`,
          transition: `transform ${transitionDuration} cubic-bezier(0.4,0,0.2,1)`,
        }}
        role="img"
        aria-label={isActive ? phaseText[phase] : "Breathing circle. Press Begin to start."}
      >
        <p
          className={cn(
            "text-center text-foreground font-medium px-6 leading-relaxed transition-opacity",
            reduceMotion ? "duration-0" : "duration-500"
          )}
          style={{ fontSize: "1.05rem", opacity: isActive ? 1 : 0.5 }}
          aria-live="polite"
        >
          {isActive ? phaseText[phase] : "Ready when you are"}
        </p>
      </div>
    </div>
  );
}
