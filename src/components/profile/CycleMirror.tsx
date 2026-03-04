import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  RefreshCw, Eye, TrendingUp, Shield, Heart, Compass,
  Sparkles, Brain, Lightbulb, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CycleMirrorProps {
  userId: string;
}

interface PatternGraph {
  previousCycle: number[];
  currentCycle: number[];
}

interface Insight {
  type: "pattern" | "prediction" | "bridge" | "reassurance";
  title: string;
  patternReflection: string;
  bridgeSuggestion: string;
  bioEducation: string;
  reassurance: string;
  confidence: number;
  patternGraph: PatternGraph;
  graphLabel: string;
}

interface CycleData {
  phase: "restoration" | "emergence" | "radiance" | "reflection";
  phaseDescription: string;
  insights: Insight[];
  hasEnoughData: boolean;
  message?: string;
}

const phaseConfig = {
  restoration: {
    label: "Restoration",
    icon: Shield,
    description: "A time for gentle rest and recovery",
    gradient: "from-primary/5 to-muted/30",
  },
  emergence: {
    label: "Emergence",
    icon: TrendingUp,
    description: "Building momentum and fresh energy",
    gradient: "from-accent/10 to-primary/5",
  },
  radiance: {
    label: "Radiance",
    icon: Sparkles,
    description: "Creative energy and clarity at their peak",
    gradient: "from-primary/10 to-accent/10",
  },
  reflection: {
    label: "Reflection",
    icon: Eye,
    description: "Turning inward with awareness",
    gradient: "from-muted/40 to-card/60",
  },
};

const insightIcons = {
  pattern: Eye,
  prediction: Compass,
  bridge: Heart,
  reassurance: Shield,
};

const insightLabels = {
  pattern: "Pattern",
  prediction: "Anticipation",
  bridge: "Suggestion",
  reassurance: "Affirmation",
};

// Mini sparkline graph component
function MiniGraph({ data, label }: { data: PatternGraph; label: string }) {
  const allVals = [...data.previousCycle, ...data.currentCycle];
  const max = Math.max(...allVals, 1);
  const w = 200;
  const h = 60;
  const pad = 4;

  const toPath = (points: number[]) => {
    return points.map((v, i) => {
      const x = pad + (i / (points.length - 1)) * (w - pad * 2);
      const y = h - pad - (v / max) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  };

  return (
    <div className="mt-3">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
        {label}
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14 rounded-lg bg-muted/30">
        {/* Previous cycle - dashed, muted */}
        <path
          d={toPath(data.previousCycle)}
          fill="none"
          stroke="hsl(var(--muted-foreground) / 0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        {/* Current cycle - solid, primary */}
        <path
          d={toPath(data.currentCycle)}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Current cycle dots */}
        {data.currentCycle.map((v, i) => {
          const x = pad + (i / (data.currentCycle.length - 1)) * (w - pad * 2);
          const y = h - pad - (v / max) * (h - pad * 2);
          return (
            <circle key={i} cx={x} cy={y} r="2" fill="hsl(var(--primary))" />
          );
        })}
      </svg>
      <div className="flex justify-between mt-1 px-0.5">
        <span className="text-[9px] text-muted-foreground/50 flex items-center gap-1">
          <span className="w-3 h-px bg-muted-foreground/25 inline-block" style={{ borderTop: "1px dashed" }} />
          Previous
        </span>
        <span className="text-[9px] text-primary/60 flex items-center gap-1">
          <span className="w-3 h-0.5 bg-primary rounded inline-block" />
          Current
        </span>
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const Icon = insightIcons[insight.type] || Eye;
  const label = insightLabels[insight.type] || "Insight";

  return (
    <Card className="rounded-2xl border-border/40 shadow-soft backdrop-blur-sm bg-card/80 overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-primary/8 shrink-0">
            <Icon className="h-4 w-4 text-primary/70" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
              {label}
            </span>
            <h4 className="text-sm font-semibold text-foreground leading-snug mt-0.5">
              {insight.title}
            </h4>
          </div>
          {insight.confidence >= 0.7 && (
            <span className="text-[9px] text-primary/50 font-medium bg-primary/5 px-2 py-0.5 rounded-full shrink-0">
              Strong
            </span>
          )}
        </div>

        {/* Pattern Reflection */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {insight.patternReflection}
        </p>

        {/* Mini Graph */}
        {insight.patternGraph && (
          <MiniGraph data={insight.patternGraph} label={insight.graphLabel || "Trend"} />
        )}

        {/* Bridge Suggestion */}
        {insight.bridgeSuggestion && (
          <div className="flex gap-2.5 p-3 rounded-xl bg-accent/30 border border-accent-foreground/5">
            <Lightbulb className="h-3.5 w-3.5 text-primary/60 mt-0.5 shrink-0" />
            <p className="text-xs text-foreground/80 leading-relaxed">
              {insight.bridgeSuggestion}
            </p>
          </div>
        )}

        {/* Bio-Education Micro Lesson */}
        {insight.bioEducation && (
          <div className="flex gap-2.5 p-3 rounded-xl bg-muted/40">
            <Brain className="h-3.5 w-3.5 text-muted-foreground/50 mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              {insight.bioEducation}
            </p>
          </div>
        )}

        {/* Reassurance */}
        {insight.reassurance && (
          <p className="text-xs text-primary/70 font-medium pt-1 border-t border-border/30">
            {insight.reassurance}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Preview / empty state before generation
function PreviewState() {
  return (
    <Card className="rounded-2xl border-border/40 shadow-soft bg-card/60 backdrop-blur-sm overflow-hidden">
      <CardContent className="py-10 px-6 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center">
          <Activity className="h-6 w-6 text-primary/40" />
        </div>
        <div className="space-y-2 max-w-xs mx-auto">
          <h3 className="text-sm font-semibold text-foreground">
            Discover Your Emotional Rhythm
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Cycle Mirror analyzes your mood check-ins, journal entries, energy levels,
            and behavioral patterns over the last 60 days to reveal your unique emotional rhythms.
          </p>
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
            The more you check in, the richer your pattern insights become.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function CycleMirror({ userId }: CycleMirrorProps) {
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [loading, setLoading] = useState(false);
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
      const phase = (data[0]?.phase as CycleData["phase"]) || "reflection";
      const patternData = data[0]?.pattern_data as any;
      setCycleData({
        phase,
        phaseDescription: patternData?.phaseDescription || "",
        insights: data.map((d) => {
          const pd = d.pattern_data as any;
          return {
            type: d.insight_type as Insight["type"],
            title: d.title,
            patternReflection: d.content,
            bridgeSuggestion: pd?.bridgeSuggestion || "",
            bioEducation: pd?.bioEducation || "",
            reassurance: pd?.reassurance || "",
            confidence: Number(d.confidence_score) || 0.5,
            patternGraph: pd?.patternGraph || { previousCycle: [5,5,5,5,5,5,5], currentCycle: [5,5,5,5,5,5,5] },
            graphLabel: pd?.graphLabel || "Trend",
          };
        }),
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
      {/* Header Card */}
      <Card className="rounded-3xl shadow-soft border-border/40 overflow-hidden bg-card/80 backdrop-blur-sm">
        <div className={cn("bg-gradient-to-br p-6", phase.gradient)}>
          <div className="flex items-center gap-2.5 mb-1">
            <Compass className="h-5 w-5 text-primary/70" />
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              Cycle Mirror
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Your personal pattern navigator
          </p>

          {/* Phase Indicator */}
          {cycleData?.hasEnoughData && (
            <div className="mt-4 flex items-center gap-3 p-3.5 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30">
              <PhaseIcon className="h-7 w-7 text-primary/60" />
              <div>
                <p className="text-xs font-semibold text-foreground/80">
                  Current Phase: {phase.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {cycleData.phaseDescription}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Content Area */}
      {cycleData?.hasEnoughData && cycleData.insights.length > 0 ? (
        <div className="space-y-4">
          {cycleData.insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
          ))}
        </div>
      ) : !cycleData?.hasEnoughData && cycleData?.message ? (
        <Card className="rounded-2xl shadow-soft border-border/40 bg-card/60">
          <CardContent className="py-8 text-center space-y-2">
            <Eye className="h-7 w-7 mx-auto text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {cycleData.message}
            </p>
          </CardContent>
        </Card>
      ) : !cycleData ? (
        <PreviewState />
      ) : null}

      {/* Generate Button */}
      <Button
        onClick={generateInsights}
        disabled={loading}
        variant="outline"
        className="w-full rounded-xl border-primary/20 hover:bg-primary/5 text-foreground h-11"
      >
        {loading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Analyzing your patterns...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            {cycleData?.hasEnoughData ? "Refresh My Patterns" : "Reveal My Patterns"}
          </>
        )}
      </Button>

      <p className="text-[10px] text-center text-muted-foreground/50">
        Insights drawn from your mood, journal, and energy data over the last 60 days
      </p>
    </div>
  );
}
