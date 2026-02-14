import { cn } from "@/lib/utils";

export type BreathingPhase = "inhale" | "topup" | "exhale" | "rest";

interface BreathingCircleProps {
  isActive: boolean;
  phase: BreathingPhase;
  progress: number;
  countdown: number;
  reduceMotion: boolean;
}

const phaseText: Record<BreathingPhase, string> = {
  inhale: "Inhale through your nose…",
  topup: "…just a little more…",
  exhale: "Slow exhale through your mouth…",
  rest: "Let your shoulders soften…",
};

function getScale(phase: BreathingPhase, progress: number, isActive: boolean): number {
  if (!isActive) return 1;
  switch (phase) {
    case "inhale":
      return 1 + progress * 0.07;
    case "topup":
      return 1.07 + progress * 0.03;
    case "exhale":
      return 1.1 - progress * 0.1;
    case "rest":
      return 1;
    default:
      return 1;
  }
}

export default function BreathingCircle({
  isActive,
  phase,
  progress,
  countdown,
  reduceMotion,
}: BreathingCircleProps) {
  const scale = getScale(phase, progress, isActive);
  const dur = reduceMotion ? "0ms" : "200ms";

  return (
    <div
      className="relative flex items-center justify-center w-full"
      style={{ height: 320, maxHeight: 320, overflow: "hidden" }}
    >
      {/* Outer halo */}
      <div
        className="absolute rounded-full bg-primary/5 blur-2xl"
        style={{
          width: 240, height: 240,
          transform: `scale(${isActive ? scale * 1.1 : 1})`,
          transition: `transform ${dur} cubic-bezier(0.4,0,0.2,1)`,
        }}
        aria-hidden="true"
      />

      {/* Inner glow */}
      <div
        className="absolute rounded-full bg-primary/10 blur-xl"
        style={{
          width: 210, height: 210,
          transform: `scale(${isActive ? scale * 1.05 : 1})`,
          transition: `transform ${dur} cubic-bezier(0.4,0,0.2,1)`,
        }}
        aria-hidden="true"
      />

      {/* Main circle */}
      <div
        className="relative z-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 backdrop-blur-sm flex flex-col items-center justify-center"
        style={{
          width: 190, height: 190,
          transform: `scale(${scale})`,
          transition: `transform ${dur} cubic-bezier(0.4,0,0.2,1)`,
        }}
        role="img"
        aria-label={isActive ? `${phaseText[phase]} ${countdown} seconds remaining` : "Breathing circle. Press Begin to start."}
      >
        {/* Instruction text */}
        <p
          className={cn(
            "text-center text-foreground font-medium px-6 leading-relaxed transition-opacity",
            reduceMotion ? "duration-0" : "duration-500"
          )}
          style={{ fontSize: "0.95rem", opacity: isActive ? 1 : 0.5 }}
          aria-live="polite"
        >
          {isActive ? phaseText[phase] : "Ready when you are"}
        </p>

        {/* Countdown */}
        {isActive && countdown > 0 && (
          <span
            className={cn(
              "text-foreground/40 font-light mt-1 transition-opacity",
              reduceMotion ? "duration-0" : "duration-300"
            )}
            style={{ fontSize: "1.75rem" }}
            aria-hidden="true"
          >
            {countdown}
          </span>
        )}
      </div>
    </div>
  );
}
