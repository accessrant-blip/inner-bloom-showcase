import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Dumbbell,
  MessageCircle,
  Heart,
  Zap,
  ArrowRight,
  Sparkles } from
"lucide-react";

const tools = [
{
  id: "day-builder",
  title: "Day Builder",
  description: "Plan your day with micro-steps that match your energy",
  icon: Calendar,
  gradient: "from-amber-500/20 to-orange-500/20",
  iconColor: "text-amber-500",
  path: "/espresso/day-builder"
},
{
  id: "mental-gym",
  title: "Mental Gym",
  description: "Train your emotional muscles with quick daily drills",
  icon: Dumbbell,
  gradient: "from-blue-500/20 to-indigo-500/20",
  iconColor: "text-blue-500",
  path: "/espresso/mental-gym"
},
{
  id: "social-anxiety",
  title: "Social Anxiety Trainer",
  description: "Build confidence with guided social missions",
  icon: MessageCircle,
  gradient: "from-purple-500/20 to-pink-500/20",
  iconColor: "text-purple-500",
  path: "/espresso/social-trainer"
},
{
  id: "inner-child",
  title: "Inner Child Mode",
  description: "Gentle comfort and healing for your inner self",
  icon: Heart,
  gradient: "from-rose-500/20 to-red-500/20",
  iconColor: "text-rose-500",
  path: "/espresso/inner-child"
}];


const filters = [
{ id: "plan", label: "Plan my day", emoji: "📋" },
{ id: "train", label: "Train my mind", emoji: "🧠" },
{ id: "confidence", label: "Practice confidence", emoji: "💪" },
{ id: "comfort", label: "Comfort myself", emoji: "🤗" }];


const ShotOfEspresso = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredTools = activeFilter ?
  tools.filter((tool) => {
    if (activeFilter === "plan") return tool.id === "day-builder";
    if (activeFilter === "train") return tool.id === "mental-gym";
    if (activeFilter === "confidence") return tool.id === "social-anxiety";
    if (activeFilter === "comfort") return tool.id === "inner-child";
    return true;
  }) :
  tools;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Quick Mental Boost</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Shot of Espresso 

          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Quick mental energy. Practical tools. Right now.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground text-center mb-4">
            What do you need today?
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) =>
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() =>
              setActiveFilter(activeFilter === filter.id ? null : filter.id)
              }
              className="rounded-full transition-all">

                <span className="mr-1">{filter.emoji}</span>
                {filter.label}
              </Button>
            )}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTools.map((tool) =>
          <Card
            key={tool.id}
            className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${tool.gradient} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
            onClick={() => navigate(tool.path)}>

              <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                  className={`p-3 rounded-2xl bg-background/50 ${tool.iconColor}`}>

                    <tool.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Quick
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {tool.title}
                </h3>
                <p className="text-muted-foreground mb-6">{tool.description}</p>
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Start
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Motivation */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground italic">
            "Small steps lead to big changes. You've got this." 💫
          </p>
        </div>
      </div>
    </div>);

};

export default ShotOfEspresso;