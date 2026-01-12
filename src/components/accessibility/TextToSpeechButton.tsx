import { Volume2, VolumeX, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TextToSpeechButtonProps {
  text: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary";
}

export function TextToSpeechButton({
  text,
  label = "Read aloud",
  disabled = false,
  className,
  size = "sm",
  variant = "outline",
}: TextToSpeechButtonProps) {
  const { toast } = useToast();

  const {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    isSupported,
  } = useTextToSpeech({
    rate: 0.9,
    onError: (error) => {
      toast({
        title: "Text-to-Speech Error",
        description: error,
        variant: "destructive",
      });
    },
  });

  const handleClick = () => {
    if (isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(text);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stop();
  };

  if (!isSupported) {
    return null;
  }

  const getIcon = () => {
    if (isSpeaking) {
      if (isPaused) {
        return <Play className="h-4 w-4" />;
      }
      return <Pause className="h-4 w-4" />;
    }
    return <Volume2 className="h-4 w-4" />;
  };

  const getLabel = () => {
    if (isSpeaking) {
      if (isPaused) {
        return "Resume";
      }
      return "Pause";
    }
    return label;
  };

  return (
    <TooltipProvider>
      <div className="inline-flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={variant}
              size={size}
              onClick={handleClick}
              disabled={disabled || !text}
              className={cn(
                "gap-2",
                isSpeaking && "border-primary text-primary",
                className
              )}
              aria-label={getLabel()}
              aria-pressed={isSpeaking}
            >
              {getIcon()}
              {size !== "icon" && <span className="sr-only sm:not-sr-only">{getLabel()}</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getLabel()}</p>
          </TooltipContent>
        </Tooltip>
        
        {isSpeaking && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleStop}
                className="h-8 w-8"
                aria-label="Stop reading"
              >
                <VolumeX className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stop reading</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
