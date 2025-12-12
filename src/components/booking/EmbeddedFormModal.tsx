import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

interface EmbeddedFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formUrl: string;
  professionalName: string;
}

const EmbeddedFormModal = ({
  isOpen,
  onClose,
  formUrl,
  professionalName,
}: EmbeddedFormModalProps) => {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Convert edit URL to embedded viewform URL
  const getEmbedUrl = (url: string) => {
    // Remove /edit and query params, add /viewform?embedded=true
    const baseUrl = url.split("/edit")[0].split("/viewform")[0];
    return `${baseUrl}/viewform?embedded=true`;
  };

  const embedUrl = getEmbedUrl(formUrl);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      setIsSubmitted(false);
    }
  }, [isOpen]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    
    // Check if the iframe URL contains formResponse (form submitted)
    try {
      const iframe = iframeRef.current;
      if (iframe) {
        // We can't access cross-origin iframe URLs directly, 
        // so we'll use a different approach - listen for the form submission
        // by checking if the iframe content changes to the confirmation page
        const checkSubmission = () => {
          try {
            // Try to detect submission by checking iframe document
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
              const url = iframeDoc.location?.href || "";
              if (url.includes("formResponse")) {
                setIsSubmitted(true);
              }
            }
          } catch {
            // Cross-origin restriction - use alternative detection
            // Google Forms redirects to a confirmation page, we'll detect this via onload
          }
        };
        checkSubmission();
      }
    } catch {
      // Cross-origin access blocked - expected behavior
    }
  };

  // Alternative: Monitor multiple iframe loads (form submit causes reload)
  const loadCountRef = useRef(0);
  
  const handleLoad = () => {
    loadCountRef.current += 1;
    setIsLoading(false);
    
    // After first load (initial form), subsequent loads indicate submission
    if (loadCountRef.current > 1) {
      setIsSubmitted(true);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      loadCountRef.current = 0;
    }
  }, [isOpen]);

  const handleReturnToDashboard = () => {
    onClose();
    navigate("/dashboard");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
        {!isSubmitted ? (
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-xl font-bold text-foreground">
                Book Session with {professionalName}
              </DialogTitle>
            </DialogHeader>
            <div className="relative flex-1 h-full px-6 pb-6">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <Loader2 className="w-8 h-8 animate-spin text-success" />
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={embedUrl}
                className="w-full h-[calc(90vh-100px)] border-0 rounded-lg"
                onLoad={handleLoad}
                title="Booking Form"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Booking Submitted
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Your request has been sent successfully. You will receive a confirmation soon.
            </p>
            <Button
              onClick={handleReturnToDashboard}
              className="bg-gradient-to-r from-success to-success-hover hover:from-success-hover hover:to-success text-white font-semibold px-8 py-3 rounded-xl"
            >
              Return to Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmbeddedFormModal;
