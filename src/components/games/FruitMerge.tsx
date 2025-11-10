import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

type Fruit = {
  value: number;
  emoji: string;
};

const fruits: Fruit[] = [
  { value: 2, emoji: "🍒" },
  { value: 4, emoji: "🍓" },
  { value: 8, emoji: "🍊" },
  { value: 16, emoji: "🍋" },
  { value: 32, emoji: "🍎" },
  { value: 64, emoji: "🍇" },
  { value: 128, emoji: "🍉" },
  { value: 256, emoji: "🍑" },
  { value: 512, emoji: "🍍" },
  { value: 1024, emoji: "🥭" },
  { value: 2048, emoji: "🌟" },
];

const getFruit = (value: number) => {
  return fruits.find((f) => f.value === value) || fruits[0];
};

export const FruitMerge = () => {
  const [grid, setGrid] = useState<number[][]>(
    Array(4)
      .fill(null)
      .map(() => Array(4).fill(0))
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initializeGame = () => {
    const newGrid = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  };

  const addRandomTile = (grid: number[][]) => {
    const emptyTiles: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) emptyTiles.push([i, j]);
      }
    }
    if (emptyTiles.length > 0) {
      const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = (direction: "up" | "down" | "left" | "right") => {
    if (gameOver) return;

    let newGrid = grid.map((row) => [...row]);
    let moved = false;
    let newScore = score;

    const moveAndMerge = (arr: number[]) => {
      const filtered = arr.filter((val) => val !== 0);
      const merged: number[] = [];
      let i = 0;
      while (i < filtered.length) {
        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
          const mergedValue = filtered[i] * 2;
          merged.push(mergedValue);
          newScore += mergedValue;
          i += 2;
          moved = true;
        } else {
          merged.push(filtered[i]);
          i++;
        }
      }
      while (merged.length < 4) merged.push(0);
      return merged;
    };

    if (direction === "left" || direction === "right") {
      newGrid = newGrid.map((row) => {
        const result = direction === "left" ? moveAndMerge(row) : moveAndMerge([...row].reverse()).reverse();
        if (JSON.stringify(result) !== JSON.stringify(row)) moved = true;
        return result;
      });
    } else {
      for (let col = 0; col < 4; col++) {
        const column = newGrid.map((row) => row[col]);
        const result = direction === "up" ? moveAndMerge(column) : moveAndMerge([...column].reverse()).reverse();
        if (JSON.stringify(result) !== JSON.stringify(column)) moved = true;
        result.forEach((val, row) => {
          newGrid[row][col] = val;
        });
      }
    }

    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(newScore);
      checkGameOver(newGrid);
    }
  };

  const checkGameOver = (grid: number[][]) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) return;
        if (j < 3 && grid[i][j] === grid[i][j + 1]) return;
        if (i < 3 && grid[i][j] === grid[i + 1][j]) return;
      }
    }
    setGameOver(true);
  };

  useState(() => {
    initializeGame();
  });

  return (
    <Card className="rounded-3xl shadow-soft border-border animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <span>Fruit Merge</span>
          <span className="text-lg">Score: {score}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {grid.map((row, i) =>
            row.map((cell, j) => {
              const fruit = getFruit(cell);
              return (
                <div
                  key={`${i}-${j}`}
                  className="aspect-square bg-muted rounded-xl flex items-center justify-center text-4xl font-bold transition-all hover:scale-105"
                  style={{
                    backgroundColor: cell ? `hsl(${Math.log2(cell) * 30}, 70%, 85%)` : undefined,
                  }}
                >
                  {cell > 0 && fruit.emoji}
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-2 justify-center flex-wrap">
          <Button onClick={() => move("up")} variant="outline" className="rounded-xl">
            ↑
          </Button>
          <div className="w-full" />
          <Button onClick={() => move("left")} variant="outline" className="rounded-xl">
            ←
          </Button>
          <Button onClick={() => move("down")} variant="outline" className="rounded-xl">
            ↓
          </Button>
          <Button onClick={() => move("right")} variant="outline" className="rounded-xl">
            →
          </Button>
        </div>

        <Button onClick={initializeGame} variant="outline" className="w-full rounded-xl">
          <RotateCcw className="h-4 w-4 mr-2" />
          New Game
        </Button>

        {gameOver && (
          <div className="text-center p-4 bg-destructive/10 rounded-xl">
            <p className="text-foreground font-semibold">Game Over!</p>
            <p className="text-sm text-muted-foreground">Final Score: {score}</p>
          </div>
        )}

        <p className="text-sm text-center text-muted-foreground">
          Merge matching fruits to create new ones
        </p>
      </CardContent>
    </Card>
  );
};
