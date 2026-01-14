import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shuffle, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Level {
  id: number;
  name: string;
  letters: string[];
  targetWords: string[];
  unlockedFeature: string;
  featureDescription: string;
}

const LEVELS: Level[] = [
  {
    id: 1,
    name: "Calm & Control",
    letters: ["C", "A", "L", "M", "R", "E"],
    targetWords: ["CALM", "CLEAR", "REAL"],
    unlockedFeature: "Instant Relief Breathing",
    featureDescription: "Quick breathing exercises for immediate calm",
  },
  {
    id: 2,
    name: "Safety & Ease",
    letters: ["S", "A", "F", "E", "T", "Y", "E"],
    targetWords: ["SAFE", "EASE", "YES"],
    unlockedFeature: "Rant Journal",
    featureDescription: "Private space to express your thoughts",
  },
  {
    id: 3,
    name: "Healing & Hope",
    letters: ["H", "E", "A", "L", "O", "P"],
    targetWords: ["HEAL", "HOPE", "HELP"],
    unlockedFeature: "Book Empathetic Listener",
    featureDescription: "Connect with trained listeners",
  },
];

interface WordConnectGameProps {
  onSignup: () => void;
  onLogin: () => void;
  isAuthenticated: boolean;
}

export const WordConnectGame = ({ onSignup, onLogin, isAuthenticated }: WordConnectGameProps) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [unlockedFeatures, setUnlockedFeatures] = useState<string[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const letterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const level = LEVELS[currentLevel];

  useEffect(() => {
    setShuffledLetters([...level.letters].sort(() => Math.random() - 0.5));
    setFoundWords(new Set());
    setSelectedIndices([]);
    setCurrentWord("");
    setLevelComplete(false);
  }, [currentLevel, level.letters]);

  const getLetterPosition = (index: number) => {
    const total = shuffledLetters.length;
    const radius = 90;
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  const handleLetterStart = (index: number) => {
    setIsDragging(true);
    setSelectedIndices([index]);
    setCurrentWord(shuffledLetters[index]);
  };

  const handleLetterMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !containerRef.current) return;

    letterRefs.current.forEach((ref, index) => {
      if (ref && !selectedIndices.includes(index)) {
        const rect = ref.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2)
        );
        
        if (distance < 30) {
          setSelectedIndices(prev => [...prev, index]);
          setCurrentWord(prev => prev + shuffledLetters[index]);
        }
      }
    });
  }, [isDragging, selectedIndices, shuffledLetters]);

  const handleLetterEnd = () => {
    setIsDragging(false);
    checkWord();
  };

  const checkWord = () => {
    if (level.targetWords.includes(currentWord) && !foundWords.has(currentWord)) {
      const newFoundWords = new Set([...foundWords, currentWord]);
      setFoundWords(newFoundWords);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 600);

      if (newFoundWords.size === level.targetWords.length) {
        setUnlockedFeatures(prev => [...prev, level.unlockedFeature]);
        setTimeout(() => setLevelComplete(true), 800);
      }
    }
    setSelectedIndices([]);
    setCurrentWord("");
  };

  const handleShuffle = () => {
    setShuffledLetters([...shuffledLetters].sort(() => Math.random() - 0.5));
  };

  const handleClear = () => {
    setSelectedIndices([]);
    setCurrentWord("");
  };

  const handleNextLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel(prev => prev + 1);
    } else {
      setGameComplete(true);
    }
  };

  const handlePlayAgain = () => {
    setCurrentLevel(0);
    setFoundWords(new Set());
    setSelectedIndices([]);
    setCurrentWord("");
    setLevelComplete(false);
    setUnlockedFeatures([]);
    setGameComplete(false);
  };

  const progress = (foundWords.size / level.targetWords.length) * 100;

  // Journey Complete screen - shown only after all 3 levels
  if (gameComplete) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-scale-in">
          <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">You've unlocked your journey.</h3>
        <p className="text-muted-foreground mb-6 max-w-xs text-sm">
          Create your free account to save progress and unlock RantFree tools.
        </p>
        
        {!isAuthenticated && (
          <div className="space-y-3 w-full max-w-xs">
            <Button 
              onClick={onSignup} 
              className="w-full rounded-xl" 
              variant="wellness"
            >
              Create Account
            </Button>
            <Button 
              onClick={onLogin} 
              variant="outline" 
              className="w-full rounded-xl"
            >
              Log In
            </Button>
          </div>
        )}

        {isAuthenticated && (
          <div className="space-y-3 w-full max-w-xs">
            <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
              <p className="font-medium text-primary text-sm">All tools unlocked</p>
              <p className="text-xs text-muted-foreground mt-1">Visit your dashboard to start your wellness journey</p>
            </div>
          </div>
        )}

        <button
          onClick={handlePlayAgain}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
        >
          Play again
        </button>
      </div>
    );
  }

  if (levelComplete) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-scale-in">
          <span className="text-2xl font-bold text-primary">{currentLevel + 1}</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Level Complete</h3>
        <p className="text-muted-foreground mb-4">You've unlocked:</p>
        <div className="bg-primary/10 rounded-xl p-4 mb-6 border border-primary/20">
          <p className="font-medium text-primary">{level.unlockedFeature}</p>
          <p className="text-xs text-muted-foreground mt-1">{level.featureDescription}</p>
        </div>
        <Button onClick={handleNextLevel} className="rounded-xl" variant="wellness">
          {currentLevel < LEVELS.length - 1 ? "Next Level" : "View All Tools"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xs text-muted-foreground mb-1">Level {currentLevel + 1} of 3</div>
        <h4 className="font-semibold text-foreground">{level.name}</h4>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Word slots */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {level.targetWords.map((word) => (
          <div
            key={word}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
              foundWords.has(word)
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-muted/50 text-muted-foreground border border-border/50"
            )}
          >
            {foundWords.has(word) ? word : word.split("").map(() => "_").join(" ")}
          </div>
        ))}
      </div>

      {/* Current word display */}
      <div className="h-8 flex items-center justify-center mb-4">
        <span className={cn(
          "text-lg font-semibold tracking-wider transition-all",
          currentWord ? "text-primary" : "text-transparent",
          showSuccess && "text-primary scale-110"
        )}>
          {currentWord || "..."}
        </span>
      </div>

      {/* Letter wheel */}
      <div 
        ref={containerRef}
        className="relative w-[220px] h-[220px] mx-auto mb-6"
        onMouseMove={(e) => handleLetterMove(e.clientX, e.clientY)}
        onMouseUp={handleLetterEnd}
        onMouseLeave={handleLetterEnd}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          handleLetterMove(touch.clientX, touch.clientY);
        }}
        onTouchEnd={handleLetterEnd}
      >
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {selectedIndices.map((idx, i) => {
            if (i === 0) return null;
            const prevIdx = selectedIndices[i - 1];
            const prev = getLetterPosition(prevIdx);
            const curr = getLetterPosition(idx);
            return (
              <line
                key={`${prevIdx}-${idx}`}
                x1={110 + prev.x}
                y1={110 + prev.y}
                x2={110 + curr.x}
                y2={110 + curr.y}
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                className="opacity-60"
              />
            );
          })}
        </svg>

        {/* Center circle */}
        <div className="absolute inset-1/4 rounded-full bg-gradient-to-br from-primary/10 to-transparent" />

        {/* Letters */}
        {shuffledLetters.map((letter, index) => {
          const pos = getLetterPosition(index);
          const isSelected = selectedIndices.includes(index);
          return (
            <div
              key={`${letter}-${index}`}
              ref={(el) => (letterRefs.current[index] = el)}
              className={cn(
                "absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center",
                "text-lg font-bold cursor-pointer select-none transition-all duration-150",
                "border-2",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg shadow-primary/40"
                  : "bg-card text-foreground border-border hover:border-primary/50 hover:scale-105"
              )}
              style={{
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
              }}
              onMouseDown={() => handleLetterStart(index)}
              onTouchStart={() => handleLetterStart(index)}
            >
              {letter}
            </div>
          );
        })}
      </div>

      {/* Control buttons */}
      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShuffle}
          className="rounded-xl"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Shuffle
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="rounded-xl"
          disabled={selectedIndices.length === 0}
        >
          <X className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  );
};
