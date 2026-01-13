import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Check, Trophy, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface WordConnectGameProps {
  onFeatureUnlock: (round: number, feature: string) => void;
  onGameComplete: () => void;
  isLoggedIn: boolean;
}

interface Round {
  letters: string[];
  targetWords: string[];
  feature: string;
  featureRoute: string;
}

const ROUNDS: Round[] = [
  {
    letters: ["C", "A", "L", "M", "R", "E"],
    targetWords: ["CALM", "CLEAR", "REAL", "ME"],
    feature: "Instant Relief Breathing",
    featureRoute: "/wellness-toolkit/breathe",
  },
  {
    letters: ["B", "R", "E", "A", "T", "H"],
    targetWords: ["BREATHE", "HEAR", "BARE", "TEA"],
    feature: "Rant Journal",
    featureRoute: "/rant",
  },
  {
    letters: ["R", "E", "S", "E", "T", "G"],
    targetWords: ["RESET", "REST", "SET", "GET"],
    feature: "Book Empathetic Listener / Therapist",
    featureRoute: "/book-help",
  },
];

const WordConnectGame = ({ onFeatureUnlock, onGameComplete, isLoggedIn }: WordConnectGameProps) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showNice, setShowNice] = useState(false);
  const [showRoundComplete, setShowRoundComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const round = ROUNDS[currentRound];
  const displayLetters = round.letters;
  const progress = (foundWords.length / round.targetWords.length) * 100;

  const getLetterPosition = (index: number, total: number) => {
    const angle = (index * 360) / total - 90;
    const radius = 70;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  const handleLetterStart = (index: number) => {
    if (showRoundComplete || gameComplete) return;
    setIsDragging(true);
    setSelectedLetters([index]);
    setCurrentWord(displayLetters[index]);
  };

  const handleLetterEnter = (index: number) => {
    if (!isDragging || showRoundComplete || gameComplete) return;
    if (selectedLetters.includes(index)) return;
    
    setSelectedLetters((prev) => [...prev, index]);
    setCurrentWord((prev) => prev + displayLetters[index]);
  };

  const checkWord = useCallback(() => {
    const word = currentWord.toUpperCase();
    if (round.targetWords.includes(word) && !foundWords.includes(word)) {
      const newFoundWords = [...foundWords, word];
      setFoundWords(newFoundWords);
      setShowNice(true);
      setTimeout(() => setShowNice(false), 1000);

      // Check if round is complete
      if (newFoundWords.length === round.targetWords.length) {
        setShowConfetti(true);
        setShowRoundComplete(true);
        onFeatureUnlock(currentRound + 1, round.feature);
        
        setTimeout(() => {
          setShowConfetti(false);
        }, 2000);
      }
    }
  }, [currentWord, foundWords, round, currentRound, onFeatureUnlock]);

  const handleEnd = () => {
    if (isDragging) {
      checkWord();
    }
    setIsDragging(false);
    setSelectedLetters([]);
    setCurrentWord("");
  };

  const handleNextRound = () => {
    if (currentRound < ROUNDS.length - 1) {
      setCurrentRound((prev) => prev + 1);
      setFoundWords([]);
      setShowRoundComplete(false);
    } else {
      setGameComplete(true);
      onGameComplete();
    }
  };

  useEffect(() => {
    const handleGlobalEnd = () => handleEnd();
    window.addEventListener("mouseup", handleGlobalEnd);
    window.addEventListener("touchend", handleGlobalEnd);
    return () => {
      window.removeEventListener("mouseup", handleGlobalEnd);
      window.removeEventListener("touchend", handleGlobalEnd);
    };
  }, [isDragging, currentWord]);

  // Game Complete Screen
  if (gameComplete) {
    return (
      <div className="relative text-center py-8">
        {/* Celebration background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-float"
              style={{
                left: `${10 + (i * 8)}%`,
                top: `${20 + (i % 3) * 25}%`,
                background: `hsl(${150 + i * 20}, 70%, 60%)`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-2">Journey Started</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
            You've unlocked your first set of wellness tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="wellness" className="gap-2">
              Create account
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              Log in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Round indicator */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Star className="w-4 h-4" />
          Round {currentRound + 1} of 3
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>{foundWords.length} of {round.targetWords.length} words</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current word display */}
      <div className="text-center mb-6">
        <div className="h-10 flex items-center justify-center relative">
          {currentWord ? (
            <span className="text-2xl font-bold text-primary tracking-widest animate-scale-in">
              {currentWord}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Connect letters to form words
            </span>
          )}
          
          {/* Nice! micro-animation */}
          {showNice && (
            <span className="absolute -right-2 -top-2 text-success text-sm font-bold animate-bounce">
              Nice!
            </span>
          )}
        </div>
      </div>

      {/* Letter wheel */}
      <div
        ref={containerRef}
        className="relative w-48 h-48 mx-auto select-none touch-none"
        onMouseLeave={handleEnd}
      >
        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 animate-pulse" />
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {selectedLetters.map((letterIndex, i) => {
            if (i === 0) return null;
            const prevIndex = selectedLetters[i - 1];
            const prevPos = getLetterPosition(prevIndex, displayLetters.length);
            const currPos = getLetterPosition(letterIndex, displayLetters.length);
            return (
              <line
                key={`line-${i}`}
                x1={prevPos.x + 96}
                y1={prevPos.y + 96}
                x2={currPos.x + 96}
                y2={currPos.y + 96}
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                className="opacity-60"
              />
            );
          })}
        </svg>

        {/* Letters */}
        {displayLetters.map((letter, index) => {
          const pos = getLetterPosition(index, displayLetters.length);
          const isSelected = selectedLetters.includes(index);
          
          return (
            <button
              key={index}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center
                text-lg font-bold transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? "bg-primary text-primary-foreground scale-110 shadow-glow"
                    : "bg-card dark:bg-card/80 text-foreground hover:bg-primary/10 shadow-soft"
                }
                border-2 ${isSelected ? "border-primary" : "border-border"}
              `}
              style={{
                left: `calc(50% + ${pos.x}px - 24px)`,
                top: `calc(50% + ${pos.y}px - 24px)`,
              }}
              onMouseDown={() => handleLetterStart(index)}
              onMouseEnter={() => handleLetterEnter(index)}
              onTouchStart={(e) => {
                e.preventDefault();
                handleLetterStart(index);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                const letterButton = element?.closest("button");
                if (letterButton) {
                  const letterIndex = displayLetters.indexOf(letterButton.textContent || "");
                  if (letterIndex !== -1) {
                    handleLetterEnter(letterIndex);
                  }
                }
              }}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Target words display */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {round.targetWords.map((word) => (
          <span
            key={word}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
              ${
                foundWords.includes(word)
                  ? "bg-success/20 text-success dark:bg-success/30 shadow-glow-success"
                  : "bg-muted text-muted-foreground"
              }
            `}
          >
            {foundWords.includes(word) && <Check className="inline w-3 h-3 mr-1" />}
            {foundWords.includes(word) ? word : "????".slice(0, word.length)}
          </span>
        ))}
      </div>

      {/* Round complete overlay */}
      {showRoundComplete && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <div className="text-center p-6 animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-success animate-pulse" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2">
              Round {currentRound + 1} Complete!
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {round.feature} unlocked
            </p>
            <Button variant="wellness" onClick={handleNextRound} className="gap-2">
              {currentRound < ROUNDS.length - 1 ? "Next Round" : "Finish"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(200px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 2s ease-out forwards;
        }
        .shadow-glow-success {
          box-shadow: 0 0 12px hsl(var(--success) / 0.4);
        }
      `}</style>
    </div>
  );
};

export default WordConnectGame;
