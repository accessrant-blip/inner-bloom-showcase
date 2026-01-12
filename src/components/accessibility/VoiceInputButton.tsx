import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, MicOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const lastProcessedRef = useRef('');
  const onTranscriptRef = useRef(onTranscript);

  // Keep ref updated
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // Handle transcript changes - send complete phrases to parent
  useEffect(() => {
    if (transcript && transcript !== lastProcessedRef.current) {
      // Only send new content
      const newContent = transcript.slice(lastProcessedRef.current.length).trim();
      if (newContent) {
        onTranscriptRef.current(newContent + ' ');
      }
      lastProcessedRef.current = transcript;
    }
  }, [transcript]);

  // Reset state when listening stops
  useEffect(() => {
    if (!listening) {
      setIsInitializing(false);
    }
  }, [listening]);

  const handleStart = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsInitializing(false);
      return;
    }

    setIsInitializing(true);

    try {
      // Request microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);

      // Reset before starting fresh
      resetTranscript();
      lastProcessedRef.current = '';

      // Start listening
      await SpeechRecognition.startListening({
        continuous: false,
        language: 'en-US',
      });
    } catch (error) {
      setIsInitializing(false);
      setHasPermission(false);

      let errorMessage = 'Failed to access microphone.';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = 'Microphone access was denied. Please allow microphone access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No microphone found. Please connect a microphone and try again.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Microphone is in use by another application.';
        } else {
          errorMessage = `Microphone error: ${error.message}`;
        }
      }

      toast({
        title: "Voice Input Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setIsInitializing(false);
  };

  // Show disabled state if not supported
  if (!browserSupportsSpeechRecognition) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size={size}
              disabled
              className={cn("opacity-50 cursor-not-allowed", className)}
              aria-label="Voice input not supported"
              aria-disabled="true"
            >
              <AlertCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice input is not supported in this browser.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try Chrome, Edge, or Safari for voice input.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const isActive = listening || isInitializing;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isActive ? "default" : "outline"}
            size={size}
            onClick={isActive ? handleStop : handleStart}
            disabled={disabled}
            className={cn(
              "transition-all relative focus:ring-2 focus:ring-offset-2",
              listening && "bg-red-500 hover:bg-red-600 text-white border-red-500",
              listening && "animate-pulse",
              className
            )}
            aria-label={
              isInitializing
                ? "Requesting microphone access"
                : listening
                ? "Click to stop voice input"
                : "Click to start voice input"
            }
            aria-pressed={listening}
            role="switch"
            aria-checked={listening}
          >
            {isInitializing ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : listening ? (
              <MicOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Mic className="h-4 w-4" aria-hidden="true" />
            )}
            
            {/* Recording indicator pulse */}
            {listening && (
              <span 
                className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-400"
                aria-hidden="true"
              >
                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping" />
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {isInitializing ? (
            <p>Requesting microphone access...</p>
          ) : listening ? (
            <div className="space-y-1">
              <p className="font-medium">Listening... Click to stop</p>
              {transcript && (
                <p className="text-xs text-muted-foreground italic truncate max-w-[200px]">
                  "{transcript}"
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <p>Click to speak</p>
              <p className="text-xs text-muted-foreground">Speech-to-Text</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
