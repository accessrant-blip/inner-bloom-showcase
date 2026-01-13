import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Unlock } from "lucide-react";
import WordConnectGame from "./WordConnectGame";
import AuthModal from "@/components/auth/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const FEATURE_ROUTES: Record<string, string> = {
  CALM: "/wellness-toolkit/breathe",
  REST: "/wellness-toolkit",
  HEAL: "/kai",
  SAFE: "/connect",
  GROW: "/wellness-toolkit/habit",
  RESET: "/wellness-toolkit/ground",
};

const WordConnectSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [unlockedFeature, setUnlockedFeature] = useState<{ word: string; feature: string } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!hasAnimated) {
            setHasAnimated(true);
          }
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.2, rootMargin: "-50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const handleFeatureUnlock = (word: string, feature: string) => {
    setUnlockedFeature({ word, feature });
  };

  const handleTryFeature = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    if (unlockedFeature) {
      const route = FEATURE_ROUTES[unlockedFeature.word] || "/dashboard";
      navigate(route);
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-background via-accent/5 to-background"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side - Text content */}
            <div
              className={`space-y-6 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Interactive Experience
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Build your calm,{" "}
                <span className="gradient-hero bg-clip-text text-transparent">
                  one word at a time
                </span>
              </h2>

              <p className="text-lg text-muted-foreground max-w-lg">
                Connect letters to unlock wellness tools. Each word you discover reveals 
                a new feature designed to support your mental health journey.
              </p>

              <div className="flex flex-wrap gap-3 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Drag to connect</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Unlock features</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Start healing</span>
                </div>
              </div>
            </div>

            {/* Right side - Game card */}
            <div className="relative lg:sticky lg:top-24 self-start">
              <div
                className={`relative transition-all duration-1000 ${
                  hasAnimated
                    ? isVisible
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-50 translate-y-4 scale-98"
                    : "opacity-0 translate-y-20 scale-95"
                }`}
              >
                {/* Glassmorphism card */}
                <div
                  className={`relative p-8 rounded-3xl backdrop-blur-xl
                    bg-white/60 dark:bg-white/10
                    border border-white/40 dark:border-white/20
                    shadow-2xl
                    ${hasAnimated && isVisible ? "animate-glow-pulse" : ""}
                  `}
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)",
                  }}
                >
                  {/* Gradient border glow */}
                  <div
                    className="absolute -inset-[1px] rounded-3xl -z-10 opacity-50"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)/0.3), hsl(var(--accent)/0.2))",
                    }}
                  />

                  <WordConnectGame onFeatureUnlock={handleFeatureUnlock} />

                  {/* Unlocked feature card */}
                  {unlockedFeature && (
                    <div
                      className="mt-6 p-4 rounded-2xl bg-success/10 dark:bg-success/20 border border-success/30
                        animate-scale-in"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-success/20">
                          <Unlock className="w-5 h-5 text-success" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {unlockedFeature.word} unlocked!
                          </p>
                          <p className="text-sm text-muted-foreground">
                            → {unlockedFeature.feature}
                          </p>
                          <Button
                            size="sm"
                            variant="wellness"
                            className="mt-3"
                            onClick={handleTryFeature}
                          >
                            {user ? "Try this feature" : "Sign up to unlock"}
                            <ArrowRight className="ml-1 w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full blur-xl animate-float" />
                <div
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-accent/30 rounded-full blur-xl animate-float"
                  style={{ animationDelay: "2s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab="signup"
      />

      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(var(--primary), 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          }
          50% {
            box-shadow: 0 0 40px rgba(var(--primary), 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.2);
          }
        }
        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        .scale-98 {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
};

export default WordConnectSection;
