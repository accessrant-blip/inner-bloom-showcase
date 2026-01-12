import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MoodTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMood: {
    emoji: string;
    label: string;
  } | null;
}

const moodSuggestions: Record<string, { title: string; description: string; action: string; path: string }> = {
  Angry: {
    title: "Try Instant Relief Breathing",
    description: "You're feeling angry. That's okay — it happens to everyone. Try a quick breathing exercise to calm your body?",
    action: "Try Breathing Tool",
    path: "/instant-relief",
  },
  Anxious: {
    title: "Ground Yourself",
    description: "Feeling anxious can be overwhelming. A quick grounding exercise can help bring you back to the present.",
    action: "Try Grounding Exercise",
    path: "/wellness-toolkit/ground",
  },
  Sad: {
    title: "Write in Your Journal",
    description: "It's okay to feel sad. Writing down your thoughts can help you process these feelings.",
    action: "Open Journal",
    path: "/wellness-toolkit/journal",
  },
  Okay: {
    title: "Take a Moment",
    description: "You're feeling okay — and that's perfectly fine. Would you like to check in with a calming activity?",
    action: "Explore Tools",
    path: "/wellness-toolkit/breathe",
  },
  Happy: {
    title: "Capture This Moment",
    description: "You're feeling happy — that's wonderful! Would you like to write about what's bringing you joy?",
    action: "Write in Journal",
    path: "/wellness-toolkit/journal",
  },
  Good: {
    title: "Keep the Momentum",
    description: "You're feeling good! Keep this positive energy going with a self-care activity.",
    action: "Explore Tools",
    path: "/wellness-toolkit/breathe",
  },
};

export default function MoodTrackerModal({ isOpen, onClose, selectedMood }: MoodTrackerModalProps) {
  const [note, setNote] = useState("");
  const [stage, setStage] = useState<"input" | "acknowledgment" | "suggestion">("input");
  const navigate = useNavigate();
  const { toast } = useToast();

  const saveMood = async (skipNote: boolean = false) => {
    if (!selectedMood) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to save your mood.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("mood_journal").insert({
      user_id: user.id,
      mood: selectedMood.label,
      note: skipNote ? null : note.trim() || null,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setStage("acknowledgment");
    setTimeout(() => {
      setStage("suggestion");
    }, 2000);
  };

  const handleClose = () => {
    setNote("");
    setStage("input");
    onClose();
  };

  const handleSuggestionAction = () => {
    if (selectedMood && moodSuggestions[selectedMood.label]) {
      navigate(moodSuggestions[selectedMood.label].path);
      handleClose();
    }
  };

  if (!selectedMood) return null;

  const suggestion = moodSuggestions[selectedMood.label];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        {stage === "input" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center mb-2">
                Why are you feeling {selectedMood.label.toLowerCase()}? {selectedMood.emoji}
              </DialogTitle>
              <p className="text-sm text-muted-foreground text-center">
                Adding a note can help you understand your feelings better. (Optional)
              </p>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="I'm feeling this way because..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[120px] bg-input border-border focus:border-primary resize-none"
              />
              
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => saveMood(true)}
                  className="border-border hover:bg-muted"
                >
                  Skip
                </Button>
                <Button
                  onClick={() => saveMood(false)}
                  variant="wellness"
                >
                  Save Note
                </Button>
              </div>
            </div>
          </>
        )}

        {stage === "acknowledgment" && (
          <div className="py-8 text-center animate-fade-in">
            <div className="text-6xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Thanks for checking in with yourself.
            </h3>
            <p className="text-muted-foreground">
              Emotions are valid — you're doing great by noticing them.
            </p>
          </div>
        )}

        {stage === "suggestion" && suggestion && (
          <div className="space-y-6 py-4 animate-fade-in">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {suggestion.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {suggestion.description}
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-border hover:bg-muted"
              >
                Skip for now
              </Button>
              <Button
                onClick={handleSuggestionAction}
                variant="wellness"
              >
                {suggestion.action}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
