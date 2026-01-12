import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function VoiceInputButton({
  onTranscript,
  disabled = false,
  className,
  size = "icon",
}: VoiceInputButtonProps) {
  const { toast } = useToast();

  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    continuous: false,
    interimResults: true,
    onResult: (result) => {
      if (result.isFinal) {
        onTranscript(result.transcript);
      }
    },
    onError: (error) => {
      toast({
        title: "Voice Input Error",
        description: error,
        variant: "destructive",
      });
    },
  });

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isListening ? "default" : "outline"}
            size={size}
            onClick={handleClick}
            disabled={disabled}
            className={cn(
              "transition-all",
              isListening && "bg-red-500 hover:bg-red-600 animate-pulse",
              className
            )}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            aria-pressed={isListening}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? "Stop voice input" : "Voice input (Speech-to-Text)"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
