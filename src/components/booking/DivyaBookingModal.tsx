import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, ArrowRight, Loader2, ExternalLink } from "lucide-react";

interface DivyaBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleFormUrl: string;
  calendlyUrl: string;
  professionalName: string;
}

type BookingStep = "form" | "confirmation";

const DivyaBookingModal = ({
  isOpen,
  onClose,
  googleFormUrl,
  calendlyUrl,
  professionalName,
}: DivyaBookingModalProps) => {
  const [step, setStep] = useState<BookingStep>("form");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmitted = () => {
    setStep("confirmation");
  };

  const handleOpenCalendly = () => {
    // Open Calendly popup widget
    if (typeof window !== "undefined" && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: calendlyUrl,
      });
    } else {
      // Fallback if Calendly widget hasn't loaded
      window.open(calendlyUrl, "_blank", "noopener,noreferrer");
    }
    // Close the modal after opening Calendly
    handleClose();
  };

  const handleClose = () => {
    setStep("form");
    setIsLoading(false);
    onClose();
  };

  // Convert Google Form URL to embedded format
  const getEmbeddedFormUrl = (url: string) => {
    // Check if it's already an embed URL
    if (url.includes("/viewform?embedded=true")) {
      return url;
    }
    // Convert regular form URL to embedded format
    if (url.includes("/viewform")) {
      return url.replace("/viewform", "/viewform?embedded=true");
    }
    // If it's a shortened URL or different format, append embedded param
    if (url.includes("forms.gle")) {
      return url; // Shortened URLs will redirect properly
    }
    return `${url}${url.includes("?") ? "&" : "?"}embedded=true`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden">
        {step === "form" && (
          <>
            <DialogHeader className="p-4 md:p-6 pb-2 md:pb-4">
              <DialogTitle className="text-xl md:text-2xl font-bold text-foreground">
                📋 Complete Booking Form
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Please fill out the form below for your session with {professionalName}
              </DialogDescription>
            </DialogHeader>

            {/* Embedded Google Form */}
            <div className="px-4 md:px-6 flex-1 overflow-hidden">
              <div className="relative w-full h-[50vh] md:h-[55vh] bg-muted/20 rounded-lg overflow-hidden border border-border">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}
                <iframe
                  src={getEmbeddedFormUrl(googleFormUrl)}
                  className="w-full h-full border-0"
                  title="Booking Form"
                  onLoad={() => setIsLoading(false)}
                  onLoadStart={() => setIsLoading(true)}
                >
                  Loading form...
                </iframe>
              </div>
            </div>

            {/* Form completion button */}
            <div className="p-4 md:p-6 pt-4 border-t border-border bg-muted/30">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <p className="text-sm text-muted-foreground text-center sm:text-left">
                  After submitting the form above, click the button to continue
                </p>
                <Button
                  onClick={handleFormSubmitted}
                  className="w-full sm:w-auto bg-gradient-to-r from-success to-success-hover hover:from-success-hover hover:to-success text-white font-semibold px-6 py-2 rounded-xl shadow-soft hover:shadow-glow transition-all min-h-[44px]"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  I've Submitted the Form
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "confirmation" && (
          <div className="p-6 md:p-10 text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-success/10 flex items-center justify-center animate-scale-in">
                <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-success" />
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              ✅ Form Submitted!
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md mx-auto">
              Thank you! Now choose a suitable time slot for your session with {professionalName}.
            </p>

            {/* Continue to Scheduling Button */}
            <Button
              onClick={handleOpenCalendly}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-primary-foreground font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 min-h-[56px] text-base md:text-lg"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Continue to Scheduling
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            {/* Additional Info */}
            <p className="text-sm text-muted-foreground mt-6">
              You'll be able to pick a date and time that works for you 📅
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DivyaBookingModal;
