import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  RefreshCw, Eye, TrendingUp, Shield, Heart, Compass,
  Sparkles, Brain, Lightbulb, Activity, Calendar, X
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
  type: "pattern" | "prediction" | "bridge";
  title: string;
  patternReflection: string;
  bridgeSuggestion: string;
  bioEducation: string;
  reassurance: string;
  confidence: number;
  patternGraph: PatternGraph;
  graphLabel: string;
}

interface CycleInfo {
  phase: string;
  phaseLabel: string;
  dayInCycle: number;
  cycleLength: number;
}

interface CycleData {
  cycleInfo: CycleInfo;
  phaseDescription: string;
  phaseTip: string;
  insights: Insight[];
  hasEnoughData: boolean;
  needsCycleData?: boolean;
  message?: string;
}

const phaseConfig: Record<string, { label: string; icon: typeof Shield; gradient: string; color: string }> = {
  menstrual: {
    label: "Menstrual",
    icon: Shield,
    gradient: "from-destructive/5 via-muted/20 to-card/60",
    color: "text-destructive/70",
  },
  follicular: {
    label: "Follicular",
    icon: TrendingUp,
    gradient: "from-accent/10 via-primary/5 to-card/60",
    color: "text-primary/70",
  },
  ovulation: {
    label: "Ovulation",
    icon: Sparkles,
    gradient: "from-primary/10 via-accent/10 to-card/60",
    color: "text-primary",
  },
  luteal: {
    label: "Luteal",
    icon: Eye,
    gradient: "from-muted/40 via-secondary/20 to-card/60",
    color: "text-muted-foreground",
  },
};

const insightIcons = { pattern: Eye, prediction: Compass, bridge: Heart };
const insightLabels = { pattern: "Pattern", prediction: "Prediction", bridge: "Suggestion" };

const BEHAVIOR_OPTIONS = [
  "Cravings", "Brain fog", "Low energy", "Screen binge",
  "Mood swings", "Anxiety", "Irritability", "Bloating",
  "Insomnia", "Motivation dip",
];

function MiniGraph({ data, label }: { data: PatternGraph; label: string }) {
  const allVals = [...data.previousCycle, ...data.currentCycle];
  const max = Math.max(...allVals, 1);
  const w = 200, h = 60, pad = 4;

  const toPath = (points: number[]) =>
    points.map((v, i) => {
      const x = pad + (i / (points.length - 1)) * (w - pad * 2);
      const y = h - pad - (v / max) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");

  return (
    <div className="mt-3">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">{label}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14 rounded-lg bg-muted/30">
        <path d={toPath(data.previousCycle)} fill="none" stroke="hsl(var(--muted-foreground) / 0.25)" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d={toPath(data.currentCycle)} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.currentCycle.map((v, i) => {
          const x = pad + (i / (data.currentCycle.length - 1)) * (w - pad * 2);
          const y = h - pad - (v / max) * (h - pad * 2);
          return <circle key={i} cx={x} cy={y} r="2" fill="hsl(var(--primary))" />;
        })}
      </svg>
      <div className="flex justify-between mt-1 px-0.5">
        <span className="text-[9px] text-muted-foreground/50 flex items-center gap-1">
          <span className="w-3 h-px bg-muted-foreground/25 inline-block" style={{ borderTop: "1px dashed" }} /> Previous
        </span>
        <span className="text-[9px] text-primary/60 flex items-center gap-1">
          <span className="w-3 h-0.5 bg-primary rounded inline-block" /> Current
        </span>
      </div>
    </div>
  );
}

function InsightCard({ insight, index }: { insight: Insight; index: number }) {
  const Icon = insightIcons[insight.type] || Eye;
  const label = insightLabels[insight.type] || "Insight";

  return (
    <Card
      className="rounded-2xl border-border/40 shadow-soft backdrop-blur-sm bg-card/80 overflow-hidden transition-all duration-500 hover:shadow-md animate-fade-in"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-primary/8 shrink-0">
            <Icon className="h-4 w-4 text-primary/70" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">{label}</span>
            <h4 className="text-sm font-semibold text-foreground leading-snug mt-0.5">{insight.title}</h4>
          </div>
          {insight.confidence >= 0.7 && (
            <span className="text-[9px] text-primary/50 font-medium bg-primary/5 px-2 py-0.5 rounded-full shrink-0">Strong</span>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{insight.patternReflection}</p>

        {insight.patternGraph && <MiniGraph data={insight.patternGraph} label={insight.graphLabel || "Trend"} />}

        {insight.bridgeSuggestion && (
          <div className="flex gap-2.5 p-3 rounded-xl bg-accent/30 border border-accent-foreground/5">
            <Lightbulb className="h-3.5 w-3.5 text-primary/60 mt-0.5 shrink-0" />
            <p className="text-xs text-foreground/80 leading-relaxed">{insight.bridgeSuggestion}</p>
          </div>
        )}

        {insight.bioEducation && (
          <div className="flex gap-2.5 p-3 rounded-xl bg-muted/40">
            <Brain className="h-3.5 w-3.5 text-muted-foreground/50 mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">{insight.bioEducation}</p>
          </div>
        )}

        {insight.reassurance && (
          <p className="text-xs text-primary/70 font-medium pt-1 border-t border-border/30">{insight.reassurance}</p>
        )}
      </CardContent>
    </Card>
  );
}

function CycleSetup({ userId, onComplete }: { userId: string; onComplete: () => void }) {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const save = async () => {
    if (!lastPeriod) {
      toast({ title: "Please enter your last period date", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await (supabase.from as any)('user_cycle_data').upsert({
      user_id: userId,
      last_period_date: lastPeriod,
      cycle_length: parseInt(cycleLength) || 28,
      behavior_tags: selectedTags,
    }, { onConflict: 'user_id' });

    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
    } else {
      onComplete();
    }
    setSaving(false);
  };

  return (
    <Card className="rounded-2xl border-border/40 shadow-soft bg-card/80 backdrop-blur-sm overflow-hidden animate-fade-in">
      <CardContent className="p-6 space-y-5">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-primary/40" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Set Up Your Cycle</h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Share a few details so Cycle Mirror can understand your personal rhythm and generate meaningful predictions.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Last Period Start Date</Label>
            <Input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="rounded-xl border-border/50 bg-muted/20 h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Average Cycle Length (days)</Label>
            <Input
              type="number"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              min="20" max="45"
              className="rounded-xl border-border/50 bg-muted/20 h-10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Recent Behaviors (optional)</Label>
            <div className="flex flex-wrap gap-1.5">
              {BEHAVIOR_OPTIONS.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer text-[11px] rounded-full transition-all",
                    selectedTags.includes(tag)
                      ? "bg-primary/15 text-primary border-primary/30 hover:bg-primary/20"
                      : "bg-transparent text-muted-foreground border-border/50 hover:bg-muted/40"
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && <X className="h-3 w-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={save}
          disabled={saving || !lastPeriod}
          className="w-full rounded-xl h-11 bg-primary/90 hover:bg-primary text-primary-foreground"
        >
          {saving ? "Saving..." : "Save and Continue"}
        </Button>
      </CardContent>
    </Card>
  );
}

function PhaseIndicator({ cycleInfo, phaseDescription, phaseTip }: { cycleInfo: CycleInfo; phaseDescription: string; phaseTip: string }) {
  const config = phaseConfig[cycleInfo.phase] || phaseConfig.luteal;
  const PhaseIcon = config.icon;
  const progress = (cycleInfo.dayInCycle / cycleInfo.cycleLength) * 100;

  return (
    <Card className="rounded-3xl shadow-soft border-border/40 overflow-hidden bg-card/80 backdrop-blur-sm">
      <div className={cn("bg-gradient-to-br p-6", config.gradient)}>
        <div className="flex items-center gap-2.5 mb-1">
          <Compass className="h-5 w-5 text-primary/70" />
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Cycle Mirror</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Your personal rhythm navigator</p>

        <div className="p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 space-y-3">
          <div className="flex items-center gap-3">
            <PhaseIcon className={cn("h-7 w-7", config.color)} />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <p className="text-sm font-semibold text-foreground/90">{config.label} Phase</p>
                <span className="text-[11px] text-muted-foreground">Day {cycleInfo.dayInCycle} of {cycleInfo.cycleLength}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{phaseDescription}</p>
            </div>
          </div>

          {/* Cycle progress bar */}
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/50 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground/50">
              <span>Menstrual</span>
              <span>Follicular</span>
              <span>Ovulation</span>
              <span>Luteal</span>
            </div>
          </div>

          {phaseTip && (
            <div className="flex gap-2 p-2.5 rounded-xl bg-accent/20 border border-accent-foreground/5">
              <Lightbulb className="h-3.5 w-3.5 text-primary/50 mt-0.5 shrink-0" />
              <p className="text-[11px] text-foreground/70 leading-relaxed">{phaseTip}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function CycleMirror({ userId }: CycleMirrorProps) {
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [hasCycleSetup, setHasCycleSetup] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkCycleSetup();
  }, [userId]);

  const checkCycleSetup = async () => {
    const { data } = await (supabase.from as any)('user_cycle_data')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    setHasCycleSetup(!!data);
    if (data) loadCachedInsights();
  };

  const loadCachedInsights = async () => {
    const { data } = await supabase
      .from('cycle_mirror_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (data && data.length > 0) {
      const pd = data[0]?.pattern_data as any;
      setCycleData({
        cycleInfo: pd?.cycleInfo || { phase: "luteal", phaseLabel: "Luteal", dayInCycle: 1, cycleLength: 28 },
        phaseDescription: pd?.phaseDescription || "",
        phaseTip: pd?.phaseTip || "",
        insights: data.map((d) => {
          const p = d.pattern_data as any;
          return {
            type: d.insight_type as Insight["type"],
            title: d.title,
            patternReflection: d.content,
            bridgeSuggestion: p?.bridgeSuggestion || "",
            bioEducation: p?.bioEducation || "",
            reassurance: p?.reassurance || "",
            confidence: Number(d.confidence_score) || 0.5,
            patternGraph: p?.patternGraph || { previousCycle: [5,5,5,5,5,5,5], currentCycle: [5,5,5,5,5,5,5] },
            graphLabel: p?.graphLabel || "Trend",
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
      if (data.needsCycleData) {
        setHasCycleSetup(false);
        setShowSetup(true);
        return;
      }
      setCycleData(data);
    } catch (error: any) {
      console.error('Error generating cycle insights:', error);
      toast({ title: "Something went wrong", description: "Please try again in a moment", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (hasCycleSetup === null) {
    return <div className="flex items-center justify-center py-12"><RefreshCw className="h-5 w-5 animate-spin text-muted-foreground/40" /></div>;
  }

  if (!hasCycleSetup || showSetup) {
    return (
      <div className="space-y-5 animate-fade-in">
        <CycleSetup userId={userId} onComplete={() => { setHasCycleSetup(true); setShowSetup(false); }} />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {cycleData?.cycleInfo ? (
        <PhaseIndicator
          cycleInfo={cycleData.cycleInfo}
          phaseDescription={cycleData.phaseDescription}
          phaseTip={cycleData.phaseTip}
        />
      ) : (
        <Card className="rounded-3xl shadow-soft border-border/40 overflow-hidden bg-card/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-muted/20 to-card/60 p-6">
            <div className="flex items-center gap-2.5 mb-1">
              <Compass className="h-5 w-5 text-primary/70" />
              <h2 className="text-lg font-semibold text-foreground tracking-tight">Cycle Mirror</h2>
            </div>
            <p className="text-xs text-muted-foreground">Your personal rhythm navigator</p>
          </div>
        </Card>
      )}

      {cycleData?.insights && cycleData.insights.length > 0 ? (
        <div className="space-y-4">
          {cycleData.insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} index={i} />
          ))}
        </div>
      ) : !cycleData ? (
        <Card className="rounded-2xl border-border/40 shadow-soft bg-card/60 backdrop-blur-sm">
          <CardContent className="py-10 px-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary/40" />
            </div>
            <div className="space-y-2 max-w-xs mx-auto">
              <h3 className="text-sm font-semibold text-foreground">Discover Your Cycle Rhythm</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cycle Mirror connects your mood, energy, and behaviors with your cycle phase to reveal patterns unique to you.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex gap-2">
        <Button
          onClick={generateInsights}
          disabled={loading}
          variant="outline"
          className="flex-1 rounded-xl border-primary/20 hover:bg-primary/5 text-foreground h-11"
        >
          {loading ? (
            <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Analyzing your rhythm...</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" />{cycleData?.hasEnoughData ? "Refresh Predictions" : "Reveal My Rhythm"}</>
          )}
        </Button>
        <Button
          onClick={() => setShowSetup(true)}
          variant="ghost"
          size="icon"
          className="rounded-xl h-11 w-11 text-muted-foreground hover:text-foreground"
          title="Update cycle info"
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-[10px] text-center text-muted-foreground/50">
        Predictions drawn from your mood, journal, energy data, and cycle phase over the last 60 days
      </p>
    </div>
  );
}
