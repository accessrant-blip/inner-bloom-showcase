import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { z } from "zod";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToLogin: () => void;
}

const emailSchema = z.string().trim().email({ message: "Please enter a valid email address" });

export default function ForgotPasswordModal({ open, onOpenChange, onBackToLogin }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: "Invalid Email",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(result.data, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSent(true);
    } catch (error: any) {
      // Always show success message to prevent email enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSent(false);
    setEmail("");
    onOpenChange(false);
  };

  const handleBackToLogin = () => {
    setSent(false);
    setEmail("");
    onBackToLogin();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Reset your password
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {sent 
              ? "Check your email for the reset link" 
              : "Enter your email to receive a password reset link"}
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="space-y-6 mt-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-foreground font-medium">
                If this email is registered, a password reset link has been sent.
              </p>
              <p className="text-muted-foreground text-sm">
                Please check your inbox and spam folder.
              </p>
            </div>

            <Button
              onClick={handleBackToLogin}
              className="w-full rounded-xl"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email address</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border-input bg-background"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl gradient-hero hover:shadow-glow transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>

            <Button
              type="button"
              onClick={handleBackToLogin}
              variant="ghost"
              className="w-full rounded-xl"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
