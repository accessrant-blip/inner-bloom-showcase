import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, PhoneOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SessionFeedback } from "./SessionFeedback";

interface VoiceCallSessionProps {
  bookingId: string;
  professionalId: string;
  professionalName: string;
  onEnd: () => void;
}

export const VoiceCallSession = ({ bookingId, professionalId, professionalName, onEnd }: VoiceCallSessionProps) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [callId, setCallId] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeCall();
    return () => {
      // Cleanup
    };
  }, []);

  useEffect(() => {
    if (status === 'connected') {
      const interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const initializeCall = async () => {
    try {
      const generatedCallId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCallId(generatedCallId);

      // Start call
      const { data, error } = await supabase.functions.invoke('manage-call', {
        body: {
          action: 'start',
          bookingId,
          professionalId,
          callId: generatedCallId,
        }
      });

      if (error) throw error;

      // Simulate connection (in real app, use Twilio Voice SDK)
      setTimeout(async () => {
        // Add a small delay to ensure call record is committed to database
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStatus('connected');
        await updateCallStatus('connected');
        toast({
          title: "Connected",
          description: `You're now connected with ${professionalName} 🌿`,
        });
      }, 2000);
    } catch (error) {
      console.error('Error initializing call:', error);
      toast({
        title: "Error",
        description: "Failed to start call",
        variant: "destructive",
      });
    }
  };

  const updateCallStatus = async (newStatus: string, callDuration?: number) => {
    try {
      await supabase.functions.invoke('manage-call', {
        body: {
          action: 'update',
          callId,
          bookingId,
          status: newStatus,
          duration: callDuration,
        }
      });
    } catch (error) {
      console.error('Error updating call:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In real app: implement actual audio muting
  };

  const endCall = async () => {
    setStatus('ended');
    await updateCallStatus('completed', duration);
    setShowFeedback(true);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (showFeedback) {
    return (
      <SessionFeedback
        bookingId={bookingId}
        professionalId={professionalId}
        professionalName={professionalName}
        onComplete={onEnd}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Session with {professionalName}
          </h2>
          
          <div className="space-y-2">
            {status === 'connecting' && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Connecting...</span>
              </div>
            )}
            
            {status === 'connected' && (
              <div className="space-y-4">
                <div className="text-primary font-medium flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Connected 🌿
                </div>
                <div className="text-4xl font-bold text-foreground">
                  {formatDuration(duration)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            variant={isMuted ? "destructive" : "outline"}
            onClick={toggleMute}
            className="rounded-full h-16 w-16"
            disabled={status !== 'connected'}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <Button
            size="lg"
            variant="destructive"
            onClick={endCall}
            className="rounded-full h-16 w-16"
            disabled={status !== 'connected'}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {status === 'connecting' && 'Please wait while we connect you...'}
          {status === 'connected' && 'Click the red button to end the call'}
        </div>
      </Card>
    </div>
  );
};