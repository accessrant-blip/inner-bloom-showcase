import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Eye, TrendingUp, Shield, Heart, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface CycleMirrorProps {
  userId: string;
}

interface Insight {
  type: "pattern" | "prediction" | "bridge" | "reassurance";
  title: string;
  content: string;
  confidence: number;
  suggestedActions: string[];
}

interface CycleData {
  phase: "restoration" | "emergence" | "radiance" | "reflection";
  phaseDescription: string;
  insights: Insight[];
  hasEnoughData: boolean;
  dataPoints?: number;
  message?: string;
}

const phaseConfig = {
  restoration: {
    label: "Restoration",
    gradient: "from-[hsl(var(--primary)/0.08)] to-[hsl(var(--muted)/0.5)]",
    accent: "text-primary/70",
    icon: Shield,
    bg: "bg-primary/5",
  },
  emergence: {
    label: "Emergence",
    gradient: "from-[hsl(var(--accent)/0.1)] to-[hsl(var(--muted)/0.3)]",
    accent: "text-accent-foreground/70",
    icon: TrendingUp,
    bg: "bg-accent/5",
  },
  radiance: {
    label: "Radiance",
    gradient: "from-[hsl(var(--primary)/0.12)] to-[hsl(var(--accent)/0.08)]",
    accent: "text-primary",
    icon: Compass,
    bg: "bg-primary/8",
  },
  reflection: {
    label: "Reflection",
    gradient: "from-[hsl(var(--muted)/0.6)] to-[hsl(var(--card)/0.8)]",
    accent: "text-muted-foreground",
    icon: Eye,
    bg: "bg-muted/10",
  },
};

const insightTypeConfig = {
  pattern: { icon: Eye, label: "Pattern", borderColor: "border-primary/20" },
  prediction: { icon: Compass, label: "Anticipation", borderColor: "border-accent/30" },
  bridge: { icon: Heart, label: "Suggestion", borderColor: "border-primary/25" },
  reassurance: { icon: Shield, label: "Affirmation", borderColor: "border-muted-foreground/20" },
};

export function CycleMirror({ userId }: CycleMirrorProps) {
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [cachedInsights, setCachedInsights] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadCachedInsights();
  }, [userId]);

  const loadCachedInsights = async () => {
    const { data } = await supabase
      .from('cycle_mirror_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(4);

    if (data && data.length > 0) {
      setCachedInsights(data);
      const phase = data[0]?.phase as CycleData["phase"] || "reflection";
      const phaseDesc = (data[0]?.pattern_data as any)?.phaseDescription || "";
      setCycleData({
        phase,
        phaseDescription: phaseDesc,
        insights: data.map((d) => ({
          type: d.insight_type as Insight["type"],
          title: d.title,
          content: d.content,
          confidence: Number(d.confidence_score) || 0.5,
          suggestedActions: (d.suggested_actions as string[]) || [],
        })),
        hasEnoughData: true,
      });
    }
  };

  const generateInsights = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('generate-cycle-insights', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;

      if (data.error) {
        toast({ title: "Could not generate insights", description: data.error, variant: "destructive" });
        return;
      }

      setCycleData(data);
    } catch (error: any) {
      console.error('Error generating cycle insights:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentPhase = cycleData?.phase || "reflection";
  const phase = phaseConfig[currentPhase];
  const PhaseIcon = phase.icon;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <Card className="rounded-3xl shadow-soft border-border overflow-hidden">
        <div className={cn("bg-gradient-to-br", phase.gradient)}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-foreground text-lg tracking-tight">
              <Compass className="h-5 w-5 text-primary/80" />
              Cycle Mirror — Your Pattern Navigator
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              An evolving map of your emotional rhythms
            </p>
          </CardHeader>

          {/* Phase indicator */}
          {cycleData?.hasEnoughData && (
            <CardContent className="pt-0 pb-5">
              <div className={cn("flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm border border-border/40", phase.bg)}>
                <PhaseIcon className={cn("h-8 w-8", phase.accent)} />
                <div>
                  <p className={cn("text-sm font-medium", phase.accent)}>
                    Current Phase: {phase.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {cycleData.phaseDescription}
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </div>
      </Card>

      {/* Insights */}
      {cycleData?.hasEnoughData && cycleData.insights.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {cycleData.insights.map((insight, i) => {
            const config = insightTypeConfig[insight.type];
            const InsightIcon = config.icon;
            return (
              <Card
                key={i}
                className={cn(
                  "rounded-2xl shadow-soft border transition-all duration-300 hover:shadow-md",
                  config.borderColor
                )}
              >
                <CardContent className="pt-5 pb-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <InsightIcon className="h-4 w-4 text-primary/60" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {config.label}
                    </span>
                    {insight.confidence >= 0.7 && (
                      <span className="ml-auto text-[10px] text-primary/50 font-medium">
                        Strong pattern
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-foreground leading-snug">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.content}
                  </p>
                  {insight.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {insight.suggestedActions.map((action, j) => (
                        <span
                          key={j}
                          className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary/70 border border-primary/10"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : !cycleData?.hasEnoughData && cycleData?.message ? (
        <Card className="rounded-2xl shadow-soft border-border">
          <CardContent className="pt-6 pb-6 text-center space-y-2">
            <Eye className="h-8 w-8 mx-auto text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {cycleData.message}
            </p>
          </CardContent>
        </Card>
      ) : !cycleData ? (
        <Card className="rounded-2xl shadow-soft border-border">
          <CardContent className="pt-6 pb-6 text-center space-y-2">
            <Compass className="h-8 w-8 mx-auto text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Generate your first pattern analysis to begin
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Generate / Refresh button */}
      <Button
        onClick={generateInsights}
        disabled={loading}
        variant="outline"
        className="w-full rounded-xl border-primary/20 hover:bg-primary/5 text-foreground"
      >
        {loading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Analyzing your patterns...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            {cycleData ? "Refresh Pattern Analysis" : "Discover My Patterns"}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground/60">
        Insights are drawn from your mood, journal, and energy data over the last 60 days
      </p>
    </div>
  );
}
