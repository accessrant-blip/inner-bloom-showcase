import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Check } from "lucide-react";

interface WordConnectGameProps {
  onFeatureUnlock: (word: string, feature: string) => void;
}

const WELLNESS_WORDS: Record<string, string> = {
  CALM: "Instant Relief Breathing",
  REST: "Sleep & Recovery Tools",
  HEAL: "Guided Healing Sessions",
  SAFE: "Anonymous Support Circles",
  GROW: "Personal Growth Tracker",
  RESET: "Daily Mindfulness Reset",
};

const LETTERS = ["C", "A", "L", "M", "R", "E", "S", "T", "H", "G", "O", "W"];

const WordConnectGame = ({ onFeatureUnlock }: WordConnectGameProps) => {
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [unlockedWords, setUnlockedWords] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastUnlocked, setLastUnlocked] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Display only 6 letters in the wheel
  const displayLetters = LETTERS.slice(0, 6);

  const getLetterPosition = (index: number, total: number) => {
    const angle = (index * 360) / total - 90;
    const radius = 70;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  const handleLetterStart = (index: number) => {
    setIsDragging(true);
    setSelectedLetters([index]);
    setCurrentWord(displayLetters[index]);
  };

  const handleLetterEnter = (index: number) => {
    if (!isDragging) return;
    if (selectedLetters.includes(index)) return;
    
    setSelectedLetters((prev) => [...prev, index]);
    setCurrentWord((prev) => prev + displayLetters[index]);
  };

  const checkWord = useCallback(() => {
    const word = currentWord.toUpperCase();
    if (WELLNESS_WORDS[word] && !unlockedWords.includes(word)) {
      setUnlockedWords((prev) => [...prev, word]);
      setLastUnlocked(word);
      setShowSuccess(true);
      onFeatureUnlock(word, WELLNESS_WORDS[word]);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  }, [currentWord, unlockedWords, onFeatureUnlock]);

  const handleEnd = () => {
    if (isDragging) {
      checkWord();
    }
    setIsDragging(false);
    setSelectedLetters([]);
    setCurrentWord("");
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

  return (
    <div className="relative">
      {/* Current word display */}
      <div className="text-center mb-6">
        <div className="h-10 flex items-center justify-center">
          {currentWord ? (
            <span className="text-2xl font-bold text-primary tracking-widest animate-scale-in">
              {currentWord}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Connect letters to form words
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

      {/* Unlocked words display */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {Object.keys(WELLNESS_WORDS).slice(0, 4).map((word) => (
          <span
            key={word}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
              ${
                unlockedWords.includes(word)
                  ? "bg-success/20 text-success dark:bg-success/30"
                  : "bg-muted text-muted-foreground"
              }
            `}
          >
            {unlockedWords.includes(word) && <Check className="inline w-3 h-3 mr-1" />}
            {word}
          </span>
        ))}
      </div>

      {/* Success animation */}
      {showSuccess && lastUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-scale-in">
            <Sparkles className="w-16 h-16 text-primary animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

export default WordConnectGame;
