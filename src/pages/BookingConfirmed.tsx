import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BookingConfirmed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-elegant p-6 md:p-8 max-w-md w-full text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-primary/10 rounded-full p-4 md:p-5">
            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          </div>
        </div>
        
        {/* Confirmation Text */}
        <div className="space-y-2 md:space-y-3">
          <h1 className="text-xl md:text-2xl font-semibold text-foreground leading-tight">
            Your session request has been submitted.
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            We'll notify you shortly once it's confirmed.
          </p>
        </div>

        {/* Action Buttons - Stacked on mobile */}
        <div className="flex flex-col gap-3 pt-2">
          <Button 
            onClick={() => navigate("/dashboard")}
            className="w-full min-h-[48px] text-base"
            variant="wellness"
          >
            Back to Dashboard
          </Button>
          <Button 
            onClick={() => navigate("/book-help")}
            className="w-full min-h-[48px] text-base"
            variant="outline"
          >
            Book Another Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmed;
