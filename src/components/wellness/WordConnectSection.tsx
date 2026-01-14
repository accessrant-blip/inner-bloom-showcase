import { useState, useEffect } from "react";
import { WordConnectGame } from "@/components/games/WordConnectGame";
import AuthModal from "@/components/auth/AuthModal";
import { supabase } from "@/integrations/supabase/client";

const WordConnectSection = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRequestAuth = () => {
    setAuthModalOpen(true);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Title and explanation */}
          <div className="text-center lg:text-left animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Build calm, one word at a time.
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
              Connect letters to unlock RantFree tools for relief and support.
            </p>
            <div className="hidden lg:block mt-8">
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">1</div>
                  <span>Complete Level 1 to unlock Instant Relief Breathing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">2</div>
                  <span>Complete Level 2 to unlock Rant Journal</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">3</div>
                  <span>Complete Level 3 to unlock Book Empathetic Listener</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Game card */}
          <div className="flex justify-center lg:justify-end">
            <div 
              className="w-full max-w-sm p-6 rounded-3xl animate-fade-in"
              style={{
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
              }}
            >
              <WordConnectGame 
                onRequestAuth={handleRequestAuth}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
      />
    </section>
  );
};

export default WordConnectSection;
