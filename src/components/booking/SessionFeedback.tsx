import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SessionFeedbackProps {
  bookingId: string;
  professionalId: string;
  professionalName: string;
  onComplete: () => void;
}

export const SessionFeedback = ({ bookingId, professionalId, professionalName, onComplete }: SessionFeedbackProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('session_feedback')
        .insert({
          booking_id: bookingId,
          user_id: user.id,
          professional_id: professionalId,
          rating,
          notes: notes || null,
        });

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted",
      });

      onComplete();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/20 p-3">
              <Check className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">
            ✅ Session Completed
          </h2>
          <p className="text-muted-foreground">
            How was your experience with {professionalName}?
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-10 w-10 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Additional Notes (Optional)
            </label>
            <Textarea
              placeholder="Share your thoughts about the session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </Card>
    </div>
  );
};