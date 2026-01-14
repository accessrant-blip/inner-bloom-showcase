import { useState, useEffect, useCallback } from "react";
import { WordConnectGame } from "@/components/games/WordConnectGame";
import AuthModal from "@/components/auth/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_KEY = "rantfree_wordgame_progress";

interface GameProgress {
  currentLevel: number;
  completedWords: Record<number, string[]>;
  unlockedFeatures: string[];
  isGameCompleted: boolean;
  isSynced?: boolean;
}

const getDefaultProgress = (): GameProgress => ({
  currentLevel: 0,
  completedWords: {},
  unlockedFeatures: [],
  isGameCompleted: false,
  isSynced: false,
});

// Synchronous localStorage loader with error handling
const loadProgressFromStorage = (): GameProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the parsed data has required fields
      if (
        typeof parsed.currentLevel === "number" &&
        typeof parsed.completedWords === "object" &&
        Array.isArray(parsed.unlockedFeatures) &&
        typeof parsed.isGameCompleted === "boolean"
      ) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load/parse progress from localStorage:", e);
    // Reset corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
  return getDefaultProgress();
};

const WordConnectSection = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Initialize progress synchronously from localStorage - NEVER blocks
  const [savedProgress, setSavedProgress] = useState<GameProgress>(loadProgressFromStorage);
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);

  // Save progress to localStorage (sync, non-blocking)
  const saveLocalProgress = useCallback((progress: GameProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error("Failed to save progress to localStorage:", e);
    }
  }, []);

  // Sync progress to Supabase (background, non-blocking)
  const syncToSupabase = useCallback(async (progress: GameProgress, uid: string) => {
    try {
      const { error } = await supabase
        .from("user_game_progress")
        .upsert({
          user_id: uid,
          game_completed: progress.isGameCompleted,
          completed_at: progress.isGameCompleted ? new Date().toISOString() : null,
          progress: {
            currentLevel: progress.currentLevel,
            completedWords: progress.completedWords,
            unlockedFeatures: progress.unlockedFeatures,
          },
        }, {
          onConflict: "user_id",
        });

      if (error) throw error;

      // Mark as synced in localStorage
      const syncedProgress = { ...progress, isSynced: true };
      saveLocalProgress(syncedProgress);
      setSavedProgress(syncedProgress);
      
      return true;
    } catch (e) {
      console.error("Failed to sync progress to Supabase:", e);
      return false;
    }
  }, [saveLocalProgress]);

  // Load progress from Supabase (background, non-blocking)
  const loadSupabaseProgress = useCallback(async (uid: string): Promise<GameProgress | null> => {
    try {
      const { data, error } = await supabase
        .from("user_game_progress")
        .select("*")
        .eq("user_id", uid)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const progress = data.progress as { 
          currentLevel: number; 
          completedWords: Record<number, string[]>; 
          unlockedFeatures: string[] 
        };
        return {
          currentLevel: progress.currentLevel,
          completedWords: progress.completedWords,
          unlockedFeatures: progress.unlockedFeatures,
          isGameCompleted: data.game_completed,
          isSynced: true,
        };
      }
      return null;
    } catch (e) {
      console.error("Failed to load progress from Supabase:", e);
      return null;
    }
  }, []);

  // Background auth sync - never blocks UI
  useEffect(() => {
    let isMounted = true;

    const syncAuthInBackground = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (session?.user) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
          
          // Try to load from Supabase in background
          const supabaseProgress = await loadSupabaseProgress(session.user.id);
          
          if (!isMounted) return;
          
          if (supabaseProgress) {
            // Use Supabase progress if it's more advanced
            if (supabaseProgress.currentLevel > savedProgress.currentLevel || 
                supabaseProgress.isGameCompleted) {
              setSavedProgress(supabaseProgress);
              saveLocalProgress(supabaseProgress);
            }
          } else if (savedProgress.currentLevel > 0 || savedProgress.isGameCompleted) {
            // Sync local progress to Supabase
            syncToSupabase(savedProgress, session.user.id);
          }
        }
      } catch (e) {
        console.error("Background auth sync failed:", e);
        // Silently fail - game continues with local progress
      }
    };

    // Start background sync without blocking
    syncAuthInBackground();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      const nowAuthenticated = !!session;
      setIsAuthenticated(nowAuthenticated);
      setUserId(session?.user?.id || null);

      // User just logged in - sync in background
      if (nowAuthenticated && session?.user) {
        try {
          const supabaseProgress = await loadSupabaseProgress(session.user.id);
          
          if (!isMounted) return;
          
          if (supabaseProgress && supabaseProgress.isGameCompleted) {
            setSavedProgress(supabaseProgress);
            saveLocalProgress(supabaseProgress);
            toast.success("Welcome back! Your progress has been restored.");
          } else if (savedProgress.currentLevel > 0 || savedProgress.isGameCompleted) {
            const synced = await syncToSupabase(savedProgress, session.user.id);
            if (synced) {
              toast.success("Account created — progress saved.");
            }
          }
        } catch (e) {
          console.error("Auth state change sync failed:", e);
        }
        
        setAuthModalOpen(false);
        setShowCompletionPrompt(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadSupabaseProgress, saveLocalProgress, syncToSupabase, savedProgress]);

  const handleRequestAuth = () => {
    setShowCompletionPrompt(false);
    setAuthModalOpen(true);
  };

  // Called when Level 3 is completed
  const handleGameComplete = () => {
    if (!isAuthenticated) {
      // Show the completion prompt modal immediately
      setShowCompletionPrompt(true);
    }
  };

  const handleProgressUpdate = useCallback((progress: GameProgress) => {
    setSavedProgress(progress);
    saveLocalProgress(progress);
    
    // If authenticated, sync to Supabase in background
    if (isAuthenticated && userId) {
      syncToSupabase(progress, userId);
    }
  }, [isAuthenticated, userId, saveLocalProgress, syncToSupabase]);

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
                onGameComplete={handleGameComplete}
                savedProgress={savedProgress}
                onProgressUpdate={handleProgressUpdate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Completion prompt modal - shown after Level 3 for guests */}
      {showCompletionPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-card rounded-3xl p-8 max-w-md w-full text-center animate-scale-in"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Journey Complete</h3>
            <p className="text-muted-foreground mb-6">
              Create an account to save your progress and unlock tools.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRequestAuth}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={handleRequestAuth}
                className="w-full py-3 px-4 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => setShowCompletionPrompt(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
              >
                Continue without account
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
      />
    </section>
  );
};

export default WordConnectSection;
