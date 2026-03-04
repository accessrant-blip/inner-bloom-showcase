import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

function buildRhythmMap(logs: any[], cycleLength: number) {
  const positiveBehaviors = new Set(["Happy", "Confident", "Motivated"]);
  const negativeBehaviors = new Set(["Sad", "Irritated", "Anxious", "Low Energy", "Brain Fog"]);
  const physicalBehaviors = new Set(["Craving Sugar", "Overeating", "Bloated", "Insomnia", "Screen Binge"]);

  // Group by cycle day
  const dayData: Record<number, { energy: number[]; mood: number[]; physical: number[]; count: number }> = {};
  
  for (let d = 1; d <= cycleLength; d++) {
    dayData[d] = { energy: [], mood: [], physical: [], count: 0 };
  }

  for (const log of logs) {
    const day = log.cycle_day;
    if (day < 1 || day > cycleLength) continue;
    const behaviors: string[] = log.behaviors || [];
    
    let posCount = 0, negCount = 0, physCount = 0;
    for (const b of behaviors) {
      if (positiveBehaviors.has(b)) posCount++;
      if (negativeBehaviors.has(b)) negCount++;
      if (physicalBehaviors.has(b)) physCount++;
    }
    
    // Energy: positive signals boost, negative reduce (scale 0-10)
    const energyScore = Math.min(10, Math.max(0, 5 + posCount * 2 - negCount * 1.5));
    // Mood: positive boosts, negative reduces
    const moodScore = Math.min(10, Math.max(0, 5 + posCount * 2 - negCount * 2));
    // Physical discomfort
    const physicalScore = Math.min(10, physCount * 2.5);

    dayData[day].energy.push(energyScore);
    dayData[day].mood.push(moodScore);
    dayData[day].physical.push(physicalScore);
    dayData[day].count++;
  }

  const rhythmMap: { day: number; energy: number; mood: number; physical: number; samples: number }[] = [];
  for (let d = 1; d <= cycleLength; d++) {
    const dd = dayData[d];
    rhythmMap.push({
      day: d,
      energy: dd.energy.length > 0 ? Math.round(dd.energy.reduce((a, b) => a + b, 0) / dd.energy.length * 10) / 10 : -1,
      mood: dd.mood.length > 0 ? Math.round(dd.mood.reduce((a, b) => a + b, 0) / dd.mood.length * 10) / 10 : -1,
      physical: dd.physical.length > 0 ? Math.round(dd.physical.reduce((a, b) => a + b, 0) / dd.physical.length * 10) / 10 : -1,
      samples: dd.count,
    });
  }

  return rhythmMap;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !lovableApiKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Invalid user token');

    const { data: cycleData } = await supabase
      .from('user_cycle_data')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!cycleData) {
      return new Response(
        JSON.stringify({ needsCycleData: true, message: "Set your last period date to unlock cycle-aware insights." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cycleInfo = calculateCyclePhase(cycleData.last_period_date, cycleData.cycle_length);

    // Fetch behavior logs
    const { data: behaviorLogs } = await supabase
      .from('cycle_behavior_logs')
      .select('cycle_day, cycle_phase, behaviors, logged_at')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: false })
      .limit(180);

    const logs = behaviorLogs || [];
    const logCount = logs.length;

    // Build rhythm map from all logs
    const rhythmMap = buildRhythmMap(logs, cycleInfo.cycleLength);

    // Build behavior context from logs
    const currentPhaseLogs = logs.filter((l: any) => l.cycle_phase === cycleInfo.phase);

    const behaviorFrequency: Record<string, number> = {};
    currentPhaseLogs.forEach((l: any) => {
      (l.behaviors || []).forEach((b: string) => {
        behaviorFrequency[b] = (behaviorFrequency[b] || 0) + 1;
      });
    });

    const topBehaviors = Object.entries(behaviorFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([b, count]) => `${b} (${count}x)`);

    const behaviorLogContext = currentPhaseLogs.slice(0, 20).map((l: any) =>
      `Day ${l.cycle_day} (${l.cycle_phase}): ${(l.behaviors || []).join(', ')}`
    ).join('\n');

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [moodRes, journalRes, dayPlanRes, rantRes] = await Promise.all([
      supabase.from('mood_journal').select('mood, note, created_at')
        .eq('user_id', user.id).gte('created_at', sixtyDaysAgo.toISOString())
        .order('created_at', { ascending: false }).limit(100),
      supabase.from('journal').select('content, created_at')
        .eq('user_id', user.id).gte('created_at', sixtyDaysAgo.toISOString())
        .order('created_at', { ascending: false }).limit(50),
      supabase.from('day_plans').select('mood, energy_level, goals, completed_tasks, plan_date')
        .eq('user_id', user.id).gte('created_at', sixtyDaysAgo.toISOString())
        .order('plan_date', { ascending: false }).limit(30),
      supabase.from('rants').select('content, mood, created_at')
        .eq('user_id', user.id).gte('created_at', sixtyDaysAgo.toISOString())
        .order('created_at', { ascending: false }).limit(30),
    ]);

    const moods = moodRes.data || [];
    const journals = journalRes.data || [];
    const dayPlans = dayPlanRes.data || [];
    const rants = rantRes.data || [];

    const moodContext = moods.slice(0, 30).map((m: any) =>
      `${new Date(m.created_at).toLocaleDateString()}: mood="${m.mood}"${m.note ? `, note="${m.note}"` : ''}`
    ).join('\n');

    const journalContext = journals.slice(0, 15).map((j: any) =>
      `${new Date(j.created_at).toLocaleDateString()}: "${j.content.slice(0, 200)}"`
    ).join('\n');

    const energyContext = dayPlans.slice(0, 15).map((d: any) =>
      `${d.plan_date}: energy=${d.energy_level}/5, mood="${d.mood || 'not recorded'}"`
    ).join('\n');

    const rantContext = rants.slice(0, 10).map((r: any) =>
      `${new Date(r.created_at).toLocaleDateString()}: mood="${r.mood || 'unset'}", "${r.content.slice(0, 150)}"`
    ).join('\n');

    // Get the most recent log to identify what the user is feeling RIGHT NOW
    const todayStr = new Date().toISOString().split('T')[0];
    const { data: todayLog } = await supabase
      .from('cycle_behavior_logs')
      .select('behaviors')
      .eq('user_id', user.id)
      .eq('logged_at', todayStr)
      .maybeSingle();

    const currentSignals: string[] = todayLog?.behaviors || [];
    const currentSignalsList = currentSignals.length > 0
      ? currentSignals.join(', ')
      : 'No signals logged today';

    const prompt = `You are a compassionate cycle-aware wellness analyst. The user is on Day ${cycleInfo.dayInCycle} of their ${cycleInfo.cycleLength}-day cycle, in the ${cycleInfo.phaseLabel} phase.

CRITICAL RULES — READ BEFORE GENERATING:
1. ONLY reference signals the user has ACTUALLY logged. The user's logged signals are the SOLE source of truth about how they feel.
2. NEVER infer, assume, or fabricate states the user did not log. If they did not log "low energy", "fatigue", or "brain fog", do NOT mention tiredness or exhaustion.
3. If the user logged POSITIVE signals like "confident", "motivated", or "happy", the reflection MUST center on those positive signals. Do NOT contradict them with negative assumptions based on cycle phase.
4. Cycle phase context is ONLY for biological education — it must NEVER override or contradict the user's actual logged signals.
5. Each insight MUST follow this exact order:
   a) Reference the user's specific logged signals first
   b) Connect those signals to their current cycle phase
   c) Offer a supportive suggestion that builds on their logged state
   d) Provide a short biological explanation if relevant

TODAY'S LOGGED SIGNALS: ${currentSignalsList}

HISTORICAL BEHAVIOR LOGS (${logCount} total entries):
Top behaviors during ${cycleInfo.phaseLabel} phase: ${topBehaviors.length > 0 ? topBehaviors.join(', ') : 'none yet'}

Recent logs during this phase:
${behaviorLogContext || 'No behavior logs for this phase yet'}

SUPPLEMENTARY DATA (last 60 days — use only to add context, never to override logged signals):

Mood Check-ins:
${moodContext || 'No mood data yet'}

Journal Entries:
${journalContext || 'No journal entries yet'}

Energy & Day Plans:
${energyContext || 'No energy data yet'}

Rant/Venting Entries:
${rantContext || 'No rant data yet'}

Generate exactly 3 insight cards based on the user's ACTUAL logged signals. Each MUST have ALL fields:

1. "title" - Warm, relatable, directly referencing a logged signal (e.g. if they logged "confident": "Your confidence is showing up right on time")
2. "patternReflection" - Start by naming the user's logged signal(s). Then note if/when this signal appeared in previous cycles during this phase. Be observational, not assumptive. (1-2 sentences)
3. "bridgeSuggestion" - A suggestion that BUILDS ON the user's current state:
   - If positive signals (confident, motivated, happy): suggest ways to channel or sustain that energy
   - If challenging signals (screen binge, cravings, brain fog): offer gentle low-pressure alternatives
   - NEVER suggest rest/recovery to someone who logged "motivated" or "confident"
4. "bioEducation" - Explain WHY this signal often appears during the ${cycleInfo.phaseLabel} phase. Warm language, no clinical jargon. (1-2 sentences)
5. "reassurance" - Must align with the logged signals. For positive signals: affirm and celebrate. For challenging signals: normalize and comfort.
6. "confidence" - 0.0 to 1.0 (higher when the signal has appeared in multiple previous logs for this phase)
7. "patternGraph" - { "previousCycle": [7 numbers 0-10], "currentCycle": [7 numbers 0-10] }
8. "graphLabel" - What the graph measures, matching the logged signal
9. "type" - One of: "pattern", "prediction", "bridge"

Also provide:
- "phaseDescription": one sentence about the ${cycleInfo.phaseLabel} phase emotionally
- "phaseTip": one actionable self-care tip for this phase

TONE: Supportive, observational, never assumptive. The app helps users understand their rhythm — it does not tell them how they should feel.

Return ONLY a JSON object:
{
  "phaseDescription": "...",
  "phaseTip": "...",
  "insights": [
    {
      "type": "pattern|prediction|bridge",
      "title": "...",
      "patternReflection": "...",
      "bridgeSuggestion": "...",
      "bioEducation": "...",
      "reassurance": "...",
      "confidence": 0.0-1.0,
      "patternGraph": { "previousCycle": [7 numbers], "currentCycle": [7 numbers] },
      "graphLabel": "..."
    }
  ]
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are a compassionate cycle-aware pattern analyst. Return only valid JSON. No markdown, no code fences.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit reached. Please try again in a moment.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let rawContent = aiData.choices[0]?.message?.content || '{}';
    rawContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      console.error('Failed to parse AI response:', rawContent);
      parsed = { phaseDescription: 'Taking a moment to tune in.', phaseTip: '', insights: [] };
    }

    // Store insights
    await supabase
      .from('cycle_mirror_insights')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (parsed.insights && parsed.insights.length > 0) {
      const insightsToInsert = parsed.insights.map((insight: any) => ({
        user_id: user.id,
        insight_type: insight.type,
        title: insight.title,
        content: insight.patternReflection || '',
        phase: cycleInfo.phase,
        confidence_score: insight.confidence || 0.5,
        suggested_actions: insight.bridgeSuggestion ? [insight.bridgeSuggestion] : [],
        pattern_data: {
          phaseDescription: parsed.phaseDescription,
          phaseTip: parsed.phaseTip,
          bioEducation: insight.bioEducation,
          reassurance: insight.reassurance,
          patternGraph: insight.patternGraph,
          graphLabel: insight.graphLabel,
          bridgeSuggestion: insight.bridgeSuggestion,
          cycleInfo,
        },
        is_active: true,
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      await supabase.from('cycle_mirror_insights').insert(insightsToInsert);
    }

    return new Response(
      JSON.stringify({
        cycleInfo,
        phaseDescription: parsed.phaseDescription,
        phaseTip: parsed.phaseTip,
        insights: parsed.insights || [],
        hasEnoughData: true,
        logCount,
        rhythmMap,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-cycle-insights:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
