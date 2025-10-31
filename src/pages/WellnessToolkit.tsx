import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wind, Sprout, BookOpen, Bell, TrendingUp, Gamepad2 } from "lucide-react";

export default function WellnessToolkit() {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    {
      id: "breathe",
      icon: Wind,
      title: "Breathe With Me",
      description: "Guided breathing exercises",
      gradient: "from-primary/20 to-primary/10"
    },
    {
      id: "ground",
      icon: Sprout,
      title: "Ground Yourself",
      description: "Grounding techniques",
      gradient: "from-primary/30 to-primary/15"
    },
    {
      id: "journal",
      icon: BookOpen,
      title: "Journal",
      description: "Your private thoughts",
      gradient: "from-primary/25 to-primary/10"
    },
    {
      id: "reminder",
      icon: Bell,
      title: "Self Care Reminder",
      description: "Set wellness reminders",
      gradient: "from-primary/20 to-primary/10"
    },
    {
      id: "habit",
      icon: TrendingUp,
      title: "Track My Habit",
      description: "Monitor your progress",
      gradient: "from-primary/25 to-primary/15"
    },
    {
      id: "games",
      icon: Gamepad2,
      title: "Mini Games",
      description: "Relax and play",
      gradient: "from-primary/30 to-primary/10"
    }
  ];

  const handleToolClick = (toolId: string) => {
    navigate(`/wellness-toolkit/${toolId}`);
  };

  return (
    <div className="min-h-screen bg-background/50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
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
              className="group p-8 rounded-3xl border border-border hover:border-primary/40 transition-all hover:shadow-soft bg-card hover:scale-105 animate-fade-in"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow mx-auto`}>
                <tool.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-2">{tool.title}</h3>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/20 animate-fade-in">
          <p className="text-center text-foreground">
            Each tool is designed with care to support your mental wellbeing 💛
          </p>
        </div>
      </div>
    </div>
  );
}