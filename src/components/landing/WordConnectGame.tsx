import { useState, useCallback, useEffect } from "react";
import LetterWheel from "./LetterWheel";
import WordSlots from "./WordSlots";
import FeatureRevealCard from "./FeatureRevealCard";
import JourneyProgress from "./JourneyProgress";
import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Shuffle, RotateCcw } from "lucide-react";
import logo from "@/assets/rantfree-logo.jpg";

// Word to feature mapping
const WORD_FEATURES: Record<string, { title: string; description: string; route: string }> = {
  CALM: {
    title: "Instant Relief",
    description: "Quick breathing exercises and grounding techniques to find your calm in moments of stress.",
    route: "/instant-relief"
  },
  LISTEN: {
    title: "Empathetic Listeners",
    description: "Connect with trained listeners who understand and support you without judgment.",
    route: "/book-help"
  },
  HEAL: {
    title: "Book Therapist",
    description: "Professional therapy sessions with licensed mental health experts.",
    route: "/book-help"
  },
  RELEASE: {
    title: "Rant Journal",
    description: "A private space to express your thoughts and release emotional weight.",
    route: "/rant"
  },
  PEACE: {
    title: "Soul Stream",
    description: "Join a supportive community sharing their wellness journeys.",
    route: "/soul-stream"
  },
  GROW: {
    title: "Learn & Grow",
    description: "Curated resources and courses to build lasting mental wellness habits.",
    route: "/learn-and-grow"
  }
};

const TARGET_WORDS = Object.keys(WORD_FEATURES);

// Generate letters that can form multiple target words
const generateLetters = (): string[] => {
  // Use a curated set that allows forming CALM, HEAL, PEACE, GROW, LISTEN, RELEASE
  const baseLetters = ["C", "A", "L", "M", "H", "E", "P", "G"];
  return baseLetters.sort(() => Math.random() - 0.5);
};

const WordConnectGame = () => {
  const [letters, setLetters] = useState<string[]>(generateLetters);
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [revealedFeature, setRevealedFeature] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [hasShownJourneyModal, setHasShownJourneyModal] = useState(false);

  const progress = (foundWords.length / TARGET_WORDS.length) * 100;

  // Check if we should show journey modal
  useEffect(() => {
    if (foundWords.length >= 2 && !hasShownJourneyModal) {
      const timer = setTimeout(() => {
        setShowJourneyModal(true);
        setHasShownJourneyModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [foundWords.length, hasShownJourneyModal]);

  const handleLetterSelect = useCallback((index: number) => {
    setSelectedIndices(prev => {
      // If already selected and is the last one, allow backtracking
      const lastIndex = prev[prev.length - 1];
      if (prev.includes(index)) {
        const indexPosition = prev.indexOf(index);
        if (indexPosition === prev.length - 1) {
          // Remove last letter (backtrack)
          const newIndices = prev.slice(0, -1);
          setCurrentWord(newIndices.map(i => letters[i]).join(""));
          return newIndices;
        }
        return prev;
      }
      
      const newIndices = [...prev, index];
      setCurrentWord(newIndices.map(i => letters[i]).join(""));
      return newIndices;
    });
  }, [letters]);

  const handleDragEnd = useCallback(() => {
    const word = currentWord.toUpperCase();
    
    if (TARGET_WORDS.includes(word) && !foundWords.includes(word)) {
      setFoundWords(prev => [...prev, word]);
      setRevealedFeature(word);
      
      // Play success feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
    
    // Reset selection
    setSelectedIndices([]);
    setCurrentWord("");
  }, [currentWord, foundWords]);

  const shuffleLetters = () => {
    setLetters(prev => [...prev].sort(() => Math.random() - 0.5));
    setSelectedIndices([]);
    setCurrentWord("");
  };

  const clearSelection = () => {
    setSelectedIndices([]);
    setCurrentWord("");
  };

  const closeFeatureReveal = () => {
    setRevealedFeature(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <header className="pt-8 pb-4 px-6 text-center">
        <img 
          src={logo} 
          alt="RantFree" 
          className="h-12 mx-auto mb-6 rounded-lg"
          width={48}
          height={48}
        />
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Build your calm, one word at a time.
        </h1>
        <p className="text-muted-foreground text-lg">
          Connect letters. Unlock tools. Start your journey.
        </p>
      </header>

      {/* Journey Progress */}
      <JourneyProgress progress={progress} foundCount={foundWords.length} totalCount={TARGET_WORDS.length} />

      {/* Word Slots */}
      <WordSlots targetWords={TARGET_WORDS} foundWords={foundWords} />

      {/* Current Word Preview */}
      <div className="h-16 flex items-center justify-center">
        {currentWord && (
          <div className="text-3xl font-bold tracking-widest text-primary animate-pulse">
            {currentWord}
          </div>
        )}
      </div>

      {/* Letter Wheel */}
      <div className="flex-1 flex items-center justify-center px-4 pb-4">
        <LetterWheel
          letters={letters}
          selectedIndices={selectedIndices}
          onLetterSelect={handleLetterSelect}
          onDragEnd={handleDragEnd}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 pb-8 px-6">
        <Button
          variant="outline"
          size="lg"
          onClick={shuffleLetters}
          className="gap-2 bg-card/50 backdrop-blur-sm border-border/50"
        >
          <Shuffle className="h-4 w-4" />
          Shuffle
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={clearSelection}
          className="gap-2 bg-card/50 backdrop-blur-sm border-border/50"
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Feature Reveal Modal */}
      {revealedFeature && WORD_FEATURES[revealedFeature] && (
        <FeatureRevealCard
          word={revealedFeature}
          feature={WORD_FEATURES[revealedFeature]}
          onClose={closeFeatureReveal}
          onAuthRequired={() => setShowAuthModal(true)}
        />
      )}

      {/* Journey Modal */}
      {showJourneyModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-scale-in">
            <h2 className="text-2xl font-bold text-foreground mb-2">You're doing great.</h2>
            <p className="text-muted-foreground mb-6">
              Create your account to unlock all tools and continue your wellness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="wellness"
                className="flex-1"
                onClick={() => {
                  setShowJourneyModal(false);
                  setShowAuthModal(true);
                }}
              >
                Create Account
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowJourneyModal(false)}
              >
                Keep Playing
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal} 
        defaultTab="signup" 
      />
    </div>
  );
};

export default WordConnectGame;
