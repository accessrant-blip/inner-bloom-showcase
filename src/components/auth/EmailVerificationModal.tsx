import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";

interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onBackToLogin: () => void;
}

export default function EmailVerificationModal({
  open,
  onOpenChange,
  email,
  onBackToLogin,
}: EmailVerificationModalProps) {
  const [resending, setResending] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) throw error;

      toast({
        title: "Email sent",
        description: "Verification email resent.",
      });
    } catch (error: any) {
      toast({
        title: "Unable to resend",
        description: "Unable to resend email. Please try again in 1 minute.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  const handleBackToLogin = () => {
    onOpenChange(false);
    onBackToLogin();
  };

  const handleOpenEmailApp = () => {
    // Attempt to open default mail app
    window.location.href = "mailto:";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Verify your email
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            We've sent a verification link to{" "}
            <span className="font-medium text-foreground">{email}</span>.
            <br />
            <br />
            Please check your inbox. If you don't see it, check your spam/junk
            folder.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={handleOpenEmailApp}
            className="w-full rounded-xl gradient-hero hover:shadow-glow transition-all"
          >
            Open Email App
          </Button>

          <Button
            variant="outline"
            onClick={handleBackToLogin}
            className="w-full rounded-xl"
          >
            Back to Login
          </Button>
        </div>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleResendEmail}
            disabled={resending}
            className="text-primary hover:text-primary/80 transition-colors text-sm inline-flex items-center gap-2"
          >
            {resending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
