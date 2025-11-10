import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Check } from "lucide-react";

const words = [
  "PEACE", "CALM", "BREATHE", "RELAX", "HOPE",
  "JOY", "LOVE", "TRUST", "KIND", "CARE"
];

const gridSize = 10;

type Cell = {
  letter: string;
  isWord: boolean;
  isFound: boolean;
};

const generateGrid = (): Cell[][] => {
  const grid: Cell[][] = Array(gridSize)
    .fill(null)
    .map(() =>
      Array(gridSize)
        .fill(null)
        .map(() => ({
          letter: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
          isWord: false,
          isFound: false,
        }))
    );

  // Place words horizontally and vertically
  words.forEach((word) => {
    const horizontal = Math.random() > 0.5;
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 50) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (horizontal && col + word.length <= gridSize) {
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[row][col + i].isWord && grid[row][col + i].letter !== word[i]) {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = { letter: word[i], isWord: true, isFound: false };
          }
          placed = true;
        }
      } else if (!horizontal && row + word.length <= gridSize) {
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[row + i][col].isWord && grid[row + i][col].letter !== word[i]) {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[row + i][col] = { letter: word[i], isWord: true, isFound: false };
          }
          placed = true;
        }
      }
      attempts++;
    }
  });

  return grid;
};

export const Wordscape = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setGrid(generateGrid());
    setFoundWords(new Set());
    setSelectedCells([]);
    setSelecting(false);
  };

  const handleMouseDown = (row: number, col: number) => {
    setSelecting(true);
    setSelectedCells([[row, col]]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (selecting) {
      setSelectedCells((prev) => [...prev, [row, col]]);
    }
  };

  const handleMouseUp = () => {
    setSelecting(false);
    checkWord();
    setSelectedCells([]);
  };

  const checkWord = () => {
    const word = selectedCells.map(([r, c]) => grid[r][c].letter).join("");
    
    if (words.includes(word) && !foundWords.has(word)) {
      setFoundWords((prev) => new Set([...prev, word]));
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
        selectedCells.forEach(([r, c]) => {
          newGrid[r][c].isFound = true;
        });
        return newGrid;
      });
    }
  };

  const isSelected = (row: number, col: number) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  return (
    <Card className="rounded-3xl shadow-soft border-border animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <span>Wordscape</span>
          <span className="text-sm">
            Found: {foundWords.size}/{words.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="grid gap-1 max-w-md mx-auto select-none"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setSelecting(false);
            setSelectedCells([]);
          }}
        >
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                onMouseDown={() => handleMouseDown(i, j)}
                onMouseEnter={() => handleMouseEnter(i, j)}
                className={`aspect-square flex items-center justify-center text-xs font-semibold rounded cursor-pointer transition-all ${
                  cell.isFound
                    ? "bg-primary/30 text-primary-foreground"
                    : isSelected(i, j)
                    ? "bg-primary/50 text-primary-foreground scale-110"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {cell.letter}
              </div>
            ))
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-foreground">Words to Find:</h3>
          <div className="flex flex-wrap gap-2">
            {words.map((word) => (
              <div
                key={word}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  foundWords.has(word)
                    ? "bg-primary text-primary-foreground line-through"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {word}
                {foundWords.has(word) && <Check className="inline h-3 w-3 ml-1" />}
              </div>
            ))}
          </div>
        </div>

        <Button onClick={resetGame} variant="outline" className="w-full rounded-xl">
          <RotateCcw className="h-4 w-4 mr-2" />
          New Puzzle
        </Button>

        {foundWords.size === words.length && (
          <div className="text-center p-4 bg-primary/10 rounded-xl animate-fade-in">
            <p className="text-foreground font-semibold">Perfect! You found all words!</p>
          </div>
        )}

        <p className="text-sm text-center text-muted-foreground">
          Click and drag to select words
        </p>
      </CardContent>
    </Card>
  );
};
