import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface CalendlyBookingProps {
  sessionType: "therapist" | "listener";
}

export const CalendlyBooking = ({ sessionType }: CalendlyBookingProps) => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  // Calendly URLs - replace with your actual Calendly links
  const calendlyUrls = {
    therapist: "https://calendly.com/accessrant/therapist-session",
    listener: "https://calendly.com/accessrant/listener-session",
  };

  useEffect(() => {
    // Listen for Calendly events
    const handleMessage = (e: MessageEvent) => {
      if (e.data.event && e.data.event === "calendly.event_scheduled") {
        setShowSuccess(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/dashboard");
  };

  return (
    <>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/book-help")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Professionals
          </Button>

          <div className="bg-card rounded-2xl p-8 shadow-soft">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Schedule a Session
              </h1>
              <p className="text-muted-foreground text-lg">
                Choose a date and time that works for you. A Google Meet link will be created automatically.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-border">
              <iframe
                src={calendlyUrls[sessionType]}
                width="100%"
                height="700"
                frameBorder="0"
                style={{ borderRadius: "12px" }}
                title="Schedule Appointment"
              />
            </div>

            <p className="text-center text-muted-foreground text-sm mt-6">
              You'll receive the meeting link and confirmation through your email.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center space-y-4 py-6">
            <CheckCircle className="h-16 w-16 text-success" />
            <h2 className="text-2xl font-bold text-foreground">Your Session is Confirmed</h2>
            <p className="text-muted-foreground">
              A Google Meet link has been emailed to you. You can join directly from your calendar.
            </p>
            <Button 
              onClick={handleCloseSuccess} 
              className="w-full bg-success hover:bg-success-hover text-success-foreground"
            >
              Back to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
