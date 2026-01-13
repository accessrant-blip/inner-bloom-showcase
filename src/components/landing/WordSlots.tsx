import { cn } from "@/lib/utils";

interface WordSlotsProps {
  targetWords: string[];
  foundWords: string[];
}

const WordSlots = ({ targetWords, foundWords }: WordSlotsProps) => {
  return (
    <div className="px-6 py-4">
      <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
        {targetWords.map((word) => {
          const isFound = foundWords.includes(word);
          
          return (
            <div
              key={word}
              className={cn(
                "px-4 py-2 rounded-full border-2 transition-all duration-500",
                "text-sm font-semibold tracking-wider",
                isFound
                  ? "border-primary/50 bg-primary/10 text-primary shadow-glow animate-scale-in"
                  : "border-border/30 bg-card/20 text-muted-foreground/40"
              )}
            >
              {isFound ? (
                <span className="flex items-center gap-2">
                  {word}
                  <span className="text-xs opacity-70">✓</span>
                </span>
              ) : (
                <span className="flex gap-0.5">
                  {word.split("").map((_, i) => (
                    <span key={i} className="w-2 h-0.5 bg-muted-foreground/20 rounded" />
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WordSlots;
