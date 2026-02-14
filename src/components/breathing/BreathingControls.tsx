import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreathingControlsProps {
  isActive: boolean;
  isPaused: boolean;
  soundEnabled: boolean;
  onBegin: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onToggleSound: () => void;
}

function PillButton({
  onClick,
  label,
  children,
  className,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium",
        "bg-secondary/60 hover:bg-secondary text-foreground/80 hover:text-foreground",
        "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {children}
    </button>
  );
}

export default function BreathingControls({
  isActive,
  isPaused,
  soundEnabled,
  onBegin,
  onPause,
  onResume,
  onReset,
  onToggleSound,
}: BreathingControlsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {!isActive ? (
          <PillButton onClick={onBegin} label="Begin breathing exercise">
            <Play className="h-4 w-4" />
            Begin
          </PillButton>
        ) : (
          <>
            {isPaused ? (
              <PillButton onClick={onResume} label="Resume breathing">
                <Play className="h-4 w-4" />
                Resume
              </PillButton>
            ) : (
              <PillButton onClick={onPause} label="Pause breathing">
                <Pause className="h-4 w-4" />
                Pause
              </PillButton>
            )}
            <PillButton onClick={onReset} label="Reset breathing exercise">
              <RotateCcw className="h-4 w-4" />
              Reset
            </PillButton>
          </>
        )}

        <PillButton
          onClick={onToggleSound}
          label={soundEnabled ? "Disable audio guidance" : "Enable audio guidance"}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {soundEnabled ? "On" : "Off"}
        </PillButton>
      </div>

      <span className="text-xs text-muted-foreground">
        Audio Guidance: {soundEnabled ? "On" : "Off"}
      </span>
    </div>
  );
}
