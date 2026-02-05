import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { validateAuth } from "@/lib/authValidation";
import EmailVerificationModal from "./EmailVerificationModal";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
}

export default function AuthModal({ open, onOpenChange, defaultTab = "signup" }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(defaultTab === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; username?: string }>({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getReadableError = (errorMessage: string): string => {
    if (errorMessage.includes("User already registered")) {
      return "Email already exists. Please sign in instead.";
    }
    if (errorMessage.includes("Invalid login credentials")) {
      return "Invalid email or password.";
    }
    if (errorMessage.includes("Password should be")) {
      return "Invalid password. Must be at least 6 characters.";
    }
    return errorMessage || "Something went wrong. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Validate with zod schema
    const validation = validateAuth({ email, password, username }, isLogin);
    if (validation.success === false) {
      toast({
        title: "Validation Error",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: validation.data.email,
          password: validation.data.password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        
        onOpenChange(false);
        // Use setTimeout to ensure navigation happens after modal closes
        setTimeout(() => {
          navigate("/dashboard");
        }, 0);
      } else {
        const redirectUrl = `${window.location.origin}/dashboard`;
        
        const { error } = await supabase.auth.signUp({
          email: validation.data.email,
          password: validation.data.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username: validation.data.username || validation.data.email.split('@')[0],
            }
          }
        });

        if (error) throw error;

        // Show verification modal instead of toast
        setVerificationEmail(validation.data.email);
        setShowVerificationModal(true);
      }
    } catch (error: any) {
      toast({
        title: "Oops!",
        description: getReadableError(error.message),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowVerificationModal(false);
    setIsLogin(true);
    setPassword("");
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {isLogin ? "Welcome Back" : "Join RANT"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isLogin 
              ? "Your safe space awaits you" 
              : "Create your peaceful corner"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username">Username (optional)</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-xl border-input bg-background"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border-input bg-background"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    setShowForgotPassword(true);
                  }}
                  className="text-sm text-primary hover:text-primary-glow transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="rounded-xl border-input bg-background"
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
                Please wait...
              </>
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </Button>
        </form>


        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary-glow transition-colors text-sm"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          This space is yours — take a moment to breathe
        </p>
      </DialogContent>

      <EmailVerificationModal
        open={showVerificationModal}
        onOpenChange={setShowVerificationModal}
        email={verificationEmail}
        onBackToLogin={handleBackToLogin}
      />

      <ForgotPasswordModal
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
        onBackToLogin={() => {
          setShowForgotPassword(false);
          onOpenChange(true);
          setIsLogin(true);
        }}
      />
    </Dialog>
  );
}
