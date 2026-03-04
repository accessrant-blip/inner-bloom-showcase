import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  RefreshCw, Eye, TrendingUp, Shield, Heart, Compass,
  Sparkles, Brain, Lightbulb, Activity, Calendar, X, Check
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
  logCount?: number;
}

const phaseConfig: Record<string, { label: string; icon: typeof Shield; gradient: string; color: string }> = {
  menstrual: { label: "Menstrual", icon: Shield, gradient: "from-destructive/5 via-muted/20 to-card/60", color: "text-destructive/70" },
  follicular: { label: "Follicular", icon: TrendingUp, gradient: "from-accent/10 via-primary/5 to-card/60", color: "text-primary/70" },
  ovulation: { label: "Ovulation", icon: Sparkles, gradient: "from-primary/10 via-accent/10 to-card/60", color: "text-primary" },
  luteal: { label: "Luteal", icon: Eye, gradient: "from-muted/40 via-secondary/20 to-card/60", color: "text-muted-foreground" },
};

const insightIcons = { pattern: Eye, prediction: Compass, bridge: Heart };
const insightLabels = { pattern: "Pattern", prediction: "Prediction", bridge: "Suggestion" };

const BEHAVIOR_CHIPS = [
  { label: "Happy", category: "positive" },
  { label: "Confident", category: "positive" },
  { label: "Motivated", category: "positive" },
  { label: "Emotional", category: "mood" },
  { label: "Sad", category: "mood" },
  { label: "Irritated", category: "mood" },
  { label: "Anxious", category: "mood" },
  { label: "Brain Fog", category: "cognitive" },
  { label: "Low Energy", category: "physical" },
  { label: "Screen Binge", category: "behavioral" },
  { label: "Craving Sugar", category: "physical" },
  { label: "Overeating", category: "physical" },
  { label: "Bloated", category: "physical" },
  { label: "Insomnia", category: "physical" },
];

const chipColors: Record<string, string> = {
  positive: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
  mood: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  cognitive: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20 hover:bg-violet-500/20",
  physical: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20",
  behavioral: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20 hover:bg-sky-500/20",
};

const chipSelectedColors: Record<string, string> = {
  positive: "bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border-emerald-500/40",
  mood: "bg-amber-500/25 text-amber-800 dark:text-amber-300 border-amber-500/40",
  cognitive: "bg-violet-500/25 text-violet-800 dark:text-violet-300 border-violet-500/40",
  physical: "bg-rose-500/25 text-rose-800 dark:text-rose-300 border-rose-500/40",
  behavioral: "bg-sky-500/25 text-sky-800 dark:text-sky-300 border-sky-500/40",
};

function calculateCyclePhase(lastPeriodDate: string, cycleLength: number) {
  const today = new Date();
  const periodStart = new Date(lastPeriodDate);
  const diffMs = today.getTime() - periodStart.getTime();
  const dayInCycle = Math.floor(diffMs / (1000 * 60 * 60 * 24)) % cycleLength + 1;
  const menstrualEnd = Math.min(5, cycleLength);
  const follicularEnd = Math.round(cycleLength * 0.45);
  const ovulationEnd = Math.round(cycleLength * 0.55);

  let phase: string, phaseLabel: string;
  if (dayInCycle <= menstrualEnd) { phase = "menstrual"; phaseLabel = "Menstrual"; }
  else if (dayInCycle <= follicularEnd) { phase = "follicular"; phaseLabel = "Follicular"; }
  else if (dayInCycle <= ovulationEnd) { phase = "ovulation"; phaseLabel = "Ovulation"; }
  else { phase = "luteal"; phaseLabel = "Luteal"; }

  return { phase, phaseLabel, dayInCycle, cycleLength };
}

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
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data } = await (supabase.from as any)('user_cycle_data')
        .select('last_period_date, cycle_length')
        .eq('user_id', userId)
        .maybeSingle();
      if (data) {
        setLastPeriod(data.last_period_date || "");
        setCycleLength(String(data.cycle_length || 28));
      }
    })();
  }, [userId]);

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
      behavior_tags: [],
    }, { onConflict: 'user_id' });

    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Cycle data saved" });
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
            Share a few details so Cycle Mirror can understand your personal rhythm.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Last Period Start Date</Label>
            <Input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="rounded-xl border-border/50 bg-muted/20 h-10 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Average Cycle Length (days)</Label>
            <Input type="number" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)}
              min="20" max="45"
              className="rounded-xl border-border/50 bg-muted/20 h-10 text-sm" />
          </div>
        </div>
        <Button onClick={save} disabled={saving || !lastPeriod}
          className="w-full rounded-xl h-11 bg-primary/90 hover:bg-primary text-primary-foreground">
          {saving ? "Saving..." : "Save and Continue"}
        </Button>
      </CardContent>
    </Card>
  );
}

function BehaviorLogger({ userId, cycleInfo }: { userId: string; cycleInfo: CycleInfo }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loggedToday, setLoggedToday] = useState(false);
  const [todayBehaviors, setTodayBehaviors] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkTodayLog();
  }, [userId]);

  const checkTodayLog = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await (supabase.from as any)('cycle_behavior_logs')
      .select('behaviors')
      .eq('user_id', userId)
      .eq('logged_at', today)
      .maybeSingle();
    if (data) {
      setLoggedToday(true);
      setTodayBehaviors(data.behaviors || []);
    }
  };

  const toggle = (label: string) => {
    setSelected(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };

  const logToday = async () => {
    if (selected.length === 0) {
      toast({ title: "Select at least one signal", variant: "destructive" });
      return;
    }
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    const { error } = await (supabase.from as any)('cycle_behavior_logs').upsert({
      user_id: userId,
      cycle_day: cycleInfo.dayInCycle,
      cycle_phase: cycleInfo.phase,
      behaviors: selected,
      logged_at: today,
    }, { onConflict: 'user_id,logged_at' });

    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
    } else {
      setLoggedToday(true);
      setTodayBehaviors(selected);
      toast({ title: "Logged for today", description: `${selected.length} signal${selected.length > 1 ? 's' : ''} recorded` });
    }
    setSaving(false);
  };

  return (
    <Card className="rounded-2xl border-border/40 shadow-soft bg-card/80 backdrop-blur-sm overflow-hidden animate-fade-in">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/8">
            <Activity className="h-4 w-4 text-primary/60" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {loggedToday ? "Today's Log" : "How are you feeling today?"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {loggedToday
                ? `Day ${cycleInfo.dayInCycle} - ${phaseConfig[cycleInfo.phase]?.label || cycleInfo.phase} phase`
                : "Select the signals that resonate with you right now"}
            </p>
          </div>
        </div>

        {loggedToday ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {todayBehaviors.map(b => {
                const chip = BEHAVIOR_CHIPS.find(c => c.label === b);
                const cat = chip?.category || "mood";
                return (
                  <Badge key={b} className={cn("text-[11px] rounded-full border", chipSelectedColors[cat])}>
                    <Check className="h-3 w-3 mr-1" />{b}
                  </Badge>
                );
              })}
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground"
              onClick={() => { setLoggedToday(false); setSelected(todayBehaviors); }}>
              Update today's log
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5">
              {BEHAVIOR_CHIPS.map(chip => {
                const isSelected = selected.includes(chip.label);
                return (
                  <Badge
                    key={chip.label}
                    variant="outline"
                    className={cn(
                      "cursor-pointer text-[11px] rounded-full transition-all border",
                      isSelected ? chipSelectedColors[chip.category] : chipColors[chip.category]
                    )}
                    onClick={() => toggle(chip.label)}
                  >
                    {isSelected && <Check className="h-3 w-3 mr-1" />}
                    {chip.label}
                  </Badge>
                );
              })}
            </div>
            <Button onClick={logToday} disabled={saving || selected.length === 0}
              className="w-full rounded-xl h-10 bg-primary/90 hover:bg-primary text-primary-foreground text-sm">
              {saving ? "Saving..." : `Log Today (${selected.length} selected)`}
            </Button>
          </>
        )}
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
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
              <div className="h-full rounded-full bg-primary/50 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground/50">
              <span>Menstrual</span><span>Follicular</span><span>Ovulation</span><span>Luteal</span>
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

function LogCountBanner({ count }: { count: number }) {
  const needed = 20;
  const pct = Math.min((count / needed) * 100, 100);
  const ready = count >= needed;

  return (
    <Card className="rounded-2xl border-border/40 shadow-soft bg-card/60 backdrop-blur-sm">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-foreground/80">
            {ready ? "Enough data for AI predictions" : "Building your pattern profile"}
          </p>
          <span className="text-[11px] text-muted-foreground">{count}/{needed} logs</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-500", ready ? "bg-emerald-500/60" : "bg-primary/40")}
            style={{ width: `${pct}%` }} />
        </div>
        {!ready && (
          <p className="text-[10px] text-muted-foreground/60">
            Log your daily signals to unlock cycle-aware predictions. {needed - count} more entries needed.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function CycleMirror({ userId }: CycleMirrorProps) {
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [hasCycleSetup, setHasCycleSetup] = useState<boolean | null>(null);
  const [localCycleInfo, setLocalCycleInfo] = useState<CycleInfo | null>(null);
  const [logCount, setLogCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const { toast } = useToast();

  const checkCycleSetup = useCallback(async () => {
    const { data } = await (supabase.from as any)('user_cycle_data')
      .select('id, last_period_date, cycle_length')
      .eq('user_id', userId)
      .maybeSingle();

    setHasCycleSetup(!!data);
    if (data) {
      const info = calculateCyclePhase(data.last_period_date, data.cycle_length);
      setLocalCycleInfo(info);
      loadCachedInsights();
      fetchLogCount();
    }
  }, [userId]);

  useEffect(() => { checkCycleSetup(); }, [checkCycleSetup]);

  const fetchLogCount = async () => {
    const { count } = await (supabase.from as any)('cycle_behavior_logs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
    setLogCount(count || 0);
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
      console.error('Error:', error);
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
        <CycleSetup userId={userId} onComplete={() => { setHasCycleSetup(true); setShowSetup(false); checkCycleSetup(); }} />
      </div>
    );
  }

  const displayCycleInfo = cycleData?.cycleInfo || localCycleInfo;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Phase Indicator */}
      {displayCycleInfo ? (
        <PhaseIndicator
          cycleInfo={displayCycleInfo}
          phaseDescription={cycleData?.phaseDescription || ""}
          phaseTip={cycleData?.phaseTip || ""}
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

      {/* Behavior Logger */}
      {displayCycleInfo && (
        <BehaviorLogger userId={userId} cycleInfo={displayCycleInfo} />
      )}

      {/* Log Count Progress */}
      <LogCountBanner count={logCount} />

      {/* AI Insight Cards */}
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
                Log your daily signals and Cycle Mirror will reveal patterns unique to you across your cycle phases.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={generateInsights} disabled={loading} variant="outline"
          className="flex-1 rounded-xl border-primary/20 hover:bg-primary/5 text-foreground h-11">
          {loading ? (
            <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Analyzing your rhythm...</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" />{cycleData?.hasEnoughData ? "Refresh Predictions" : "Reveal My Rhythm"}</>
          )}
        </Button>
        <Button onClick={() => setShowSetup(true)} variant="ghost" size="icon"
          className="rounded-xl h-11 w-11 text-muted-foreground hover:text-foreground" title="Update cycle info">
          <Calendar className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-[10px] text-center text-muted-foreground/50">
        Predictions drawn from your behavior logs, mood, journal entries, and cycle phase
      </p>
    </div>
  );
}
