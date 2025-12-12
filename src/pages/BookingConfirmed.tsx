import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BookingConfirmed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-elegant p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-primary/10 rounded-full p-4">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Your session request has been submitted.
          </h1>
          <p className="text-muted-foreground">
            We'll notify you shortly once it's confirmed.
          </p>
        </div>

        <Button 
          onClick={() => navigate("/dashboard")}
          className="w-full"
          variant="wellness"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmed;
