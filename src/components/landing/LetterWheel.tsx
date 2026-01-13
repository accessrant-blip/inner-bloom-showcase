import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LetterWheelProps {
  letters: string[];
  selectedIndices: number[];
  onLetterSelect: (index: number) => void;
  onDragEnd: () => void;
}

const LetterWheel = ({ letters, selectedIndices, onLetterSelect, onDragEnd }: LetterWheelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  const radius = 120;
  const centerX = 150;
  const centerY = 150;

  // Calculate letter positions in a circle
  const letterPositions = letters.map((_, index) => {
    const angle = (index / letters.length) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  // Update connection lines when selection changes
  useEffect(() => {
    if (selectedIndices.length < 2) {
      setLines([]);
      return;
    }

    const newLines = [];
    for (let i = 0; i < selectedIndices.length - 1; i++) {
      const from = letterPositions[selectedIndices[i]];
      const to = letterPositions[selectedIndices[i + 1]];
      newLines.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y });
    }
    setLines(newLines);
  }, [selectedIndices, letterPositions]);

  const getLetterFromPoint = useCallback((clientX: number, clientY: number): number | null => {
    if (!containerRef.current) return null;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    for (let i = 0; i < letterPositions.length; i++) {
      const pos = letterPositions[i];
      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      if (distance < 30) {
        return i;
      }
    }
    return null;
  }, [letterPositions]);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    const index = getLetterFromPoint(clientX, clientY);
    if (index !== null) {
      onLetterSelect(index);
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const index = getLetterFromPoint(clientX, clientY);
    if (index !== null && !selectedIndices.includes(index)) {
      onLetterSelect(index);
    }
  };

  const handleEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd();
    }
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => handleEnd();

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const onTouchEnd = () => handleEnd();

  return (
    <div
      ref={containerRef}
      className="relative w-[300px] h-[300px] touch-none select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background circle */}
      <div className="absolute inset-4 rounded-full bg-card/30 backdrop-blur-xl border border-border/30 shadow-2xl" />

      {/* SVG for connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            strokeLinecap="round"
            className="opacity-70"
          />
        ))}
      </svg>

      {/* Letters */}
      {letters.map((letter, index) => {
        const pos = letterPositions[index];
        const isSelected = selectedIndices.includes(index);
        const selectionOrder = selectedIndices.indexOf(index);

        return (
          <div
            key={index}
            className={cn(
              "absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center",
              "text-xl font-bold transition-all duration-150",
              "bg-card/80 backdrop-blur-sm border-2",
              isSelected
                ? "border-primary bg-primary/20 text-primary scale-110 shadow-glow"
                : "border-border/50 text-foreground hover:border-primary/50"
            )}
            style={{
              left: pos.x,
              top: pos.y,
              zIndex: isSelected ? 10 + selectionOrder : 1
            }}
          >
            {letter}
          </div>
        );
      })}

      {/* Center decoration */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/10 border border-primary/20" />
    </div>
  );
};

export default LetterWheel;
