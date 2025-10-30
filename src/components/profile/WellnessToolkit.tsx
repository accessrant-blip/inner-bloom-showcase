import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Sprout, BookOpen, Bell, TrendingUp, Gamepad2 } from "lucide-react";

export function WellnessToolkit() {
  const navigate = useNavigate();
  const tools = [
    {
      icon: Wind,
      title: "Breathe With Me",
      description: "Guided breathing exercises",
      gradient: "from-blue-100 to-blue-50"
    },
    {
      icon: Sprout,
      title: "Ground Yourself",
      description: "Grounding techniques",
      gradient: "from-green-100 to-green-50"
    },
    {
      icon: BookOpen,
      title: "Journal",
      description: "Your private thoughts",
      gradient: "from-purple-100 to-purple-50"
    },
    {
      icon: Bell,
      title: "Self Care Reminder",
      description: "Set wellness reminders",
      gradient: "from-pink-100 to-pink-50"
    },
    {
      icon: TrendingUp,
      title: "Track My Habit",
      description: "Monitor your progress",
      gradient: "from-amber-100 to-amber-50"
    },
    {
      icon: Gamepad2,
      title: "Mini Games",
      description: "Relax and play",
      gradient: "from-indigo-100 to-indigo-50"
    }
  ];

  return (
    <Card className="rounded-3xl shadow-soft border-warm-brown/20 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-warm-brown">
          <Sprout className="h-5 w-5" />
          Wellness Toolkit 🌿
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => navigate("/wellness-toolkit")}
          className="w-full rounded-xl gradient-hero text-primary-foreground hover:shadow-glow"
          size="lg"
        >
          Open Wellness Toolkit
        </Button>
      </CardContent>
    </Card>
  );
}