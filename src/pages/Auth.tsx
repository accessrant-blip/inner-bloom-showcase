import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Moon, Sun, ArrowLeft } from "lucide-react";
import { validateAuth } from "@/lib/authValidation";
import { useTheme } from "next-themes";
import rantfreeLogo from "@/assets/rantfree-logo.svg";
import EmailVerificationModal from "@/components/auth/EmailVerificationModal";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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

        // Navigate immediately, toast after
        navigate("/dashboard");
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
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

        // Show verification modal and set awaiting state
        setVerificationEmail(validation.data.email);
        setShowVerificationModal(true);
        setAwaitingVerification(true);
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
    setAwaitingVerification(false);
    setIsLogin(true);
    setPassword("");
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = resolvedTheme === "dark";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with back button and theme toggle */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img src={rantfreeLogo} alt="RantFree logo" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-bold text-xl text-foreground">RantFree</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full hover:bg-muted"
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              )}
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl shadow-soft p-8 border border-border">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {isLogin ? "Welcome Back" : "Join RantFree"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin 
                  ? "Your safe space awaits you" 
                  : "Create your peaceful corner"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username (optional)</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-xl"
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
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="rounded-xl"
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

            {awaitingVerification && (
              <p className="text-center text-sm text-muted-foreground mt-4 animate-pulse">
                Waiting for email verification...
              </p>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setAwaitingVerification(false);
                }}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              This space is yours — take a moment to breathe
            </p>
          </div>
        </div>
      </div>

      <EmailVerificationModal
        open={showVerificationModal}
        onOpenChange={setShowVerificationModal}
        email={verificationEmail}
        onBackToLogin={handleBackToLogin}
      />
    </div>
  );
}