import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wind, Sprout, BookOpen, Bell, TrendingUp, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WellnessToolkit() {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    {
      id: "breathe",
      icon: Wind,
      title: "Breathe With Me",
      description: "Guided breathing exercises",
      gradient: "from-blue-100 to-blue-50"
    },
    {
      id: "ground",
      icon: Sprout,
      title: "Ground Yourself",
      description: "Grounding techniques",
      gradient: "from-green-100 to-green-50"
    },
    {
      id: "journal",
      icon: BookOpen,
      title: "Journal",
      description: "Your private thoughts",
      gradient: "from-purple-100 to-purple-50"
    },
    {
      id: "reminder",
      icon: Bell,
      title: "Self Care Reminder",
      description: "Set wellness reminders",
      gradient: "from-pink-100 to-pink-50"
    },
    {
      id: "habit",
      icon: TrendingUp,
      title: "Track My Habit",
      description: "Monitor your progress",
      gradient: "from-amber-100 to-amber-50"
    },
    {
      id: "games",
      icon: Gamepad2,
      title: "Mini Games",
      description: "Relax and play",
      gradient: "from-indigo-100 to-indigo-50"
    }
  ];

  const handleToolClick = (toolId: string) => {
    navigate(`/wellness-toolkit/${toolId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-white to-warm-peach/20">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/profile")}
            className="mb-4 text-warm-brown hover:bg-warm-cream"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          
          <h1 className="text-4xl font-bold text-warm-brown mb-2">
            Wellness Toolkit 🌿
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose a tool to support your wellbeing journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className="group p-8 rounded-3xl border border-warm-brown/20 hover:border-warm-orange/40 transition-all hover:shadow-soft bg-gradient-to-br from-white to-warm-cream/30 hover:scale-105 animate-fade-in"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow mx-auto`}>
                <tool.icon className="h-8 w-8 text-warm-brown" />
              </div>
              <h3 className="font-semibold text-xl text-warm-brown mb-2">{tool.title}</h3>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-3xl bg-warm-peach/20 border border-warm-orange/20 animate-fade-in">
          <p className="text-center text-warm-brown">
            Each tool is designed with care to support your mental wellbeing 💛
          </p>
        </div>
      </div>
    </div>
  );
}