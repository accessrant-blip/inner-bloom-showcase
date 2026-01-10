import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "5 Things You Can See", prompt: "Look around and name 5 things you can see" },
  { id: 2, title: "4 Things You Can Touch", prompt: "Notice 4 things you can physically touch" },
  { id: 3, title: "3 Things You Can Hear", prompt: "Listen carefully for 3 sounds around you" },
  { id: 4, title: "2 Things You Can Smell", prompt: "Identify 2 scents in your environment" },
  { id: 5, title: "1 Thing You Can Taste", prompt: "Notice 1 thing you can taste" },
];

export default function GroundYourself() {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [totalCompletions, setTotalCompletions] = useState(0);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("grounding_progress")
      .select("completed_count")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setTotalCompletions(data.completed_count);
    }
  };

  const handleStepToggle = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const handleComplete = async () => {
    if (completedSteps.length !== 5) {
      toast.error("Please complete all 5 steps");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existing } = await supabase
      .from("grounding_progress")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("grounding_progress")
        .update({
          completed_count: existing.completed_count + 1,
          last_completed_at: new Date().toISOString()
        })
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("grounding_progress")
        .insert({
          user_id: user.id,
          completed_count: 1,
          last_completed_at: new Date().toISOString()
        });
    }

    setTotalCompletions(prev => prev + 1);
    setCompletedSteps([]);
    toast.success("Grounding exercise completed!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-warm-cream/30">
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
              Ground Yourself
            </CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              The 5-4-3-2-1 Technique • Completed {totalCompletions} times
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step) => (
              <Collapsible key={step.id}>
                <CollapsibleTrigger asChild>
                  <button
                    onClick={() => handleStepToggle(step.id)}
                    className={`w-full p-6 rounded-2xl border transition-all text-left ${
                      completedSteps.includes(step.id)
                        ? "border-green-400 bg-green-50"
                        : "border-warm-brown/20 bg-white hover:border-warm-orange/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-warm-brown">
                        {step.title}
                      </h3>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        completedSteps.includes(step.id)
                          ? "border-green-500 bg-green-500"
                          : "border-warm-brown/30"
                      }`}>
                        {completedSteps.includes(step.id) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-4">
                  <p className="text-muted-foreground mt-2">{step.prompt}</p>
                </CollapsibleContent>
              </Collapsible>
            ))}

            <Button
              onClick={handleComplete}
              disabled={completedSteps.length !== 5}
              className="w-full rounded-xl mt-6"
              size="lg"
            >
              Complete Exercise
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}