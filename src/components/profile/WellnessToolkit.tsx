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
          className="w-full mb-6 rounded-xl gradient-hero text-primary-foreground hover:shadow-glow"
          size="lg"
        >
          Open Wellness Toolkit
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.slice(0, 3).map((tool) => (
            <div
              key={tool.title}
              className="p-6 rounded-2xl border border-warm-brown/20 bg-gradient-to-br from-white to-warm-cream/30"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4`}>
                <tool.icon className="h-6 w-6 text-warm-brown" />
              </div>
              <h3 className="font-semibold text-warm-brown mb-1">{tool.title}</h3>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-warm-peach/20 border border-warm-orange/20">
          <p className="text-sm text-warm-brown text-center">
            Click "Open Wellness Toolkit" to access all tools 💛
          </p>
        </div>
      </CardContent>
    </Card>
  );
}