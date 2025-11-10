import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

const mandalaSegments = [
  // Center circle
  { id: "center", path: "M 200 200 m -20 0 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0" },
  // Inner petals (8 petals)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `inner-${i}`,
    path: `M 200 200 L ${200 + 50 * Math.cos((i * Math.PI) / 4)} ${200 + 50 * Math.sin((i * Math.PI) / 4)} L ${200 + 50 * Math.cos(((i + 1) * Math.PI) / 4)} ${200 + 50 * Math.sin(((i + 1) * Math.PI) / 4)} Z`,
  })),
  // Middle petals (16 petals)
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `middle-${i}`,
    path: `M 200 200 L ${200 + 90 * Math.cos((i * Math.PI) / 8)} ${200 + 90 * Math.sin((i * Math.PI) / 8)} L ${200 + 90 * Math.cos(((i + 1) * Math.PI) / 8)} ${200 + 90 * Math.sin(((i + 1) * Math.PI) / 8)} Z`,
  })),
  // Outer petals (16 petals)
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `outer-${i}`,
    path: `M 200 200 L ${200 + 130 * Math.cos((i * Math.PI) / 8)} ${200 + 130 * Math.sin((i * Math.PI) / 8)} L ${200 + 130 * Math.cos(((i + 1) * Math.PI) / 8)} ${200 + 130 * Math.sin(((i + 1) * Math.PI) / 8)} Z`,
  })),
];

const colorPalette = [
  "#E6E6FA", // Lavender
  "#FFB6C1", // Light Pink
  "#98FF98", // Mint
  "#FFD700", // Gold
  "#87CEEB", // Sky Blue
  "#F0E68C", // Khaki
  "#DDA0DD", // Plum
  "#F5DEB3", // Wheat
  "#FFA07A", // Light Salmon
  "#20B2AA", // Light Sea Green
];

export const MandalaColoring = () => {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState(colorPalette[0]);

  const handleSegmentClick = (id: string) => {
    setColors((prev) => ({
      ...prev,
      [id]: selectedColor,
    }));
  };

  const resetMandala = () => {
    setColors({});
  };

  return (
    <Card className="rounded-3xl shadow-soft border-border animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          Mandala Coloring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {colorPalette.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                selectedColor === color ? "border-foreground scale-110 shadow-lg" : "border-border"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <svg
          viewBox="0 0 400 400"
          className="w-full max-w-md mx-auto border-2 border-border rounded-2xl bg-white"
        >
          {mandalaSegments.map((segment) => (
            <path
              key={segment.id}
              d={segment.path}
              fill={colors[segment.id] || "white"}
              stroke="#4A4A4A"
              strokeWidth="1"
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => handleSegmentClick(segment.id)}
            />
          ))}
        </svg>

        <Button onClick={resetMandala} variant="outline" className="w-full rounded-xl">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Mandala
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Tap segments to color your mandala
        </p>
      </CardContent>
    </Card>
  );
};
