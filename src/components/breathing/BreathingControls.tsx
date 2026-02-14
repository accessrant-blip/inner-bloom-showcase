import { Play, Pause, RotateCcw, Volume2, VolumeX, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AudioMode } from "@/hooks/useBreathingAudio";

interface BreathingControlsProps {
  isActive: boolean;
  isPaused: boolean;
  audioMode: AudioMode;
  onBegin: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onCycleAudioMode: () => void;
}

function PillButton({
  onClick,
  label,
  children,
  className,
  active,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium",
        "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-primary/20 text-primary hover:bg-primary/30"
          : "bg-secondary/60 hover:bg-secondary text-foreground/80 hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

const AUDIO_LABELS: Record<AudioMode, string> = {
  full: "Full Guidance",
  minimal: "Minimal Cues",
  silent: "Silent",
};

const AUDIO_ICONS: Record<AudioMode, typeof Volume2> = {
  full: Volume2,
  minimal: MessageCircle,
  silent: VolumeX,
};

export default function BreathingControls({
  isActive,
  isPaused,
  audioMode,
  onBegin,
  onPause,
  onResume,
  onReset,
  onCycleAudioMode,
}: BreathingControlsProps) {
  const AudioIcon = AUDIO_ICONS[audioMode];

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
          onClick={onCycleAudioMode}
          label={`Audio mode: ${AUDIO_LABELS[audioMode]}. Click to change.`}
          active={audioMode !== "silent"}
        >
          <AudioIcon className="h-4 w-4" />
          {AUDIO_LABELS[audioMode]}
        </PillButton>
      </div>

      <span className="text-xs text-muted-foreground">
        Audio: {AUDIO_LABELS[audioMode]}
      </span>
    </div>
  );
}
