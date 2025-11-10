import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Mode = "normal" | "sos";

export default function BreatheWithMe() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("normal");
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timer, setTimer] = useState(0);

  const timings = {
    normal: { inhale: 4, hold: 4, exhale: 6 },
    sos: { inhale: 3, hold: 2, exhale: 4 }
  };

  useEffect(() => {
    if (!isActive) return;

    const currentTiming = timings[mode][phase];
    
    if (timer < currentTiming) {
      const timeout = setTimeout(() => setTimer(timer + 1), 1000);
      return () => clearTimeout(timeout);
    } else {
      setTimer(0);
      if (phase === "inhale") setPhase("hold");
      else if (phase === "hold") setPhase("exhale");
      else setPhase("inhale");
    }
  }, [isActive, timer, phase, mode]);

  const handleStart = () => {
    setIsActive(true);
    setPhase("inhale");
    setTimer(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setTimer(0);
    setPhase("inhale");
  };

  const getPhaseText = () => {
    if (phase === "inhale") return "Breathe In";
    if (phase === "hold") return "Hold";
    return "Breathe Out";
  };

  const getScale = () => {
    const currentTiming = timings[mode][phase];
    const progress = timer / currentTiming;
    
    if (phase === "inhale") return 1 + (progress * 0.5);
    if (phase === "exhale") return 1.5 - (progress * 0.5);
    return 1.5;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-warm-cream/30">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/wellness-toolkit")}
          className="mb-6 text-warm-brown hover:bg-warm-cream"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Toolkit
        </Button>

        <Card className="rounded-3xl shadow-soft border-warm-brown/20">
          <CardHeader>
            <CardTitle className="text-3xl text-warm-brown text-center">
              Breathe With Me
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex justify-center gap-4">
              <Button
                variant={mode === "normal" ? "default" : "outline"}
                onClick={() => { setMode("normal"); handleStop(); }}
                className="rounded-xl"
              >
                Normal Mode
              </Button>
              <Button
                variant={mode === "sos" ? "default" : "outline"}
                onClick={() => { setMode("sos"); handleStop(); }}
                className="rounded-xl bg-warm-salmon hover:bg-warm-salmon/90"
              >
                SOS Mode
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center py-12">
              <div
                className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center transition-transform duration-1000 ease-in-out"
                style={{ transform: `scale(${getScale()})` }}
              >
                <div className="text-center">
                  <p className="text-2xl font-semibold text-warm-brown mb-2">
                    {getPhaseText()}
                  </p>
                  {isActive && (
                    <p className="text-4xl font-bold text-warm-brown">
                      {timings[mode][phase] - timer}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {!isActive ? (
                <Button
                  onClick={handleStart}
                  className="rounded-xl px-8"
                  size="lg"
                >
                  Start Breathing
                </Button>
              ) : (
                <Button
                  onClick={handleStop}
                  variant="outline"
                  className="rounded-xl px-8"
                  size="lg"
                >
                  Stop
                </Button>
              )}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                {mode === "normal" 
                  ? "Follow the gentle rhythm: breathe in for 4, hold for 4, breathe out for 6"
                  : "Quick calming rhythm: breathe in for 3, hold for 2, breathe out for 4"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}