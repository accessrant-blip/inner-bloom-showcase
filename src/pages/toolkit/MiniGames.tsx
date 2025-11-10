import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flower2, Apple, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZenGarden } from "@/components/games/ZenGarden";
import { FruitMerge } from "@/components/games/FruitMerge";
import { MandalaColoring } from "@/components/games/MandalaColoring";
import { Wordscape } from "@/components/games/Wordscape";

const games = [
  {
    id: "zen-garden",
    title: "Zen Garden",
    description: "Draw patterns in the sand",
    icon: Flower2,
    gradient: "from-green-200 to-green-100"
  },
  {
    id: "fruit-merge",
    title: "Fruit Merge",
    description: "Merge fruits to relax",
    icon: Apple,
    gradient: "from-red-200 to-orange-100"
  },
  {
    id: "mandala",
    title: "Mandala Coloring",
    description: "Color beautiful mandalas",
    icon: Palette,
    gradient: "from-purple-200 to-pink-100"
  },
  {
    id: "wordscape",
    title: "Wordscape",
    description: "Find peaceful words",
    icon: Sparkles,
    gradient: "from-blue-200 to-cyan-100"
  }
];

export default function MiniGames() {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleGameClick = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const renderGame = () => {
    switch (selectedGame) {
      case "zen-garden":
        return <ZenGarden />;
      case "fruit-merge":
        return <FruitMerge />;
      case "mandala":
        return <MandalaColoring />;
      case "wordscape":
        return <Wordscape />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-warm-cream/30">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          <Button
            variant="ghost"
            onClick={() => selectedGame ? setSelectedGame(null) : navigate("/wellness-toolkit")}
            className="text-warm-brown hover:bg-warm-cream"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {selectedGame ? "Back to Games" : "Back to Toolkit"}
          </Button>
        </div>

        {selectedGame ? (
          renderGame()
        ) : (
          <Card className="rounded-3xl shadow-soft border-warm-brown/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-3xl text-warm-brown text-center">
                Mini Games
              </CardTitle>
              <p className="text-center text-muted-foreground mt-2">
                Relax and unwind with calming activities
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => handleGameClick(game.id)}
                    className="group p-8 rounded-2xl border border-warm-brown/20 hover:border-warm-orange/40 transition-all bg-white hover:scale-105"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow`}>
                      <game.icon className="h-8 w-8 text-warm-brown" />
                    </div>
                    <h3 className="font-semibold text-xl text-warm-brown mb-2">
                      {game.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {game.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-warm-peach/20 border border-warm-orange/20">
                <p className="text-center text-warm-brown">
                  Choose a game to start your calming journey
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}