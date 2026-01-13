import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Unlock, Lock } from "lucide-react";
import WordConnectGame from "./WordConnectGame";
import AuthModal from "@/components/auth/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface UnlockedFeature {
  round: number;
  feature: string;
  route: string;
}

const FEATURE_ROUTES: Record<number, string> = {
  1: "/wellness-toolkit/breathe",
  2: "/rant",
  3: "/book-help",
};

const WordConnectSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [unlockedFeatures, setUnlockedFeatures] = useState<UnlockedFeature[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("signup");
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

  const handleFeatureUnlock = (round: number, feature: string) => {
    setUnlockedFeatures((prev) => [
      ...prev,
      { round, feature, route: FEATURE_ROUTES[round] },
    ]);
  };

  const handleGameComplete = () => {
    setGameComplete(true);
  };

  const handleTryFeature = (route: string) => {
    if (!user) {
      setAuthModalTab("signup");
      setAuthModalOpen(true);
      return;
    }
    navigate(route);
  };

  const openAuthModal = (tab: "login" | "signup") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
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
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left side - Text content */}
            <div
              className={`space-y-6 transition-all duration-700 lg:sticky lg:top-24 ${
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
                Complete 3 rounds to unlock wellness tools. Each round reveals 
                a new feature designed to support your mental health journey.
              </p>

              <div className="flex flex-wrap gap-3 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>3 rounds</span>
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

              {/* Unlocked features list */}
              {unlockedFeatures.length > 0 && (
                <div className="space-y-3 pt-6">
                  <h4 className="text-sm font-semibold text-foreground">Unlocked Tools</h4>
                  {unlockedFeatures.map((item) => (
                    <div
                      key={item.round}
                      className="flex items-center gap-3 p-3 rounded-xl bg-success/10 border border-success/20 animate-scale-in"
                    >
                      <div className="p-1.5 rounded-full bg-success/20">
                        <Unlock className="w-4 h-4 text-success" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          Round {item.round}: {item.feature}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={user ? "wellness" : "outline"}
                        onClick={() => handleTryFeature(item.route)}
                        className="gap-1"
                      >
                        {user ? (
                          <>
                            Try it <ArrowRight className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" /> Locked
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right side - Game card */}
            <div className="relative">
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

                  <WordConnectGame
                    onFeatureUnlock={handleFeatureUnlock}
                    onGameComplete={handleGameComplete}
                    isLoggedIn={!!user}
                  />

                  {/* Auth buttons for game complete state */}
                  {gameComplete && !user && (
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        variant="wellness"
                        onClick={() => openAuthModal("signup")}
                        className="gap-2"
                      >
                        Create account
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => openAuthModal("login")}
                      >
                        Log in
                      </Button>
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
        defaultTab={authModalTab}
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
