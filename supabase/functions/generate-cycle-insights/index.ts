import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Fetch mood entries (last 60 days)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [moodRes, journalRes, dayPlanRes, rantRes, existingInsights] = await Promise.all([
      supabase
        .from('mood_journal')
        .select('mood, note, created_at')
        .eq('user_id', user.id)
        .gte('created_at', sixtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('journal')
        .select('content, created_at')
        .eq('user_id', user.id)
        .gte('created_at', sixtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('day_plans')
        .select('mood, energy_level, goals, completed_tasks, plan_date')
        .eq('user_id', user.id)
        .gte('created_at', sixtyDaysAgo.toISOString())
        .order('plan_date', { ascending: false })
        .limit(30),
      supabase
        .from('rants')
        .select('content, mood, created_at')
        .eq('user_id', user.id)
        .gte('created_at', sixtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(30),
      supabase
        .from('cycle_mirror_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    const moods = moodRes.data || [];
    const journals = journalRes.data || [];
    const dayPlans = dayPlanRes.data || [];
    const rants = rantRes.data || [];

    const totalDataPoints = moods.length + journals.length + dayPlans.length + rants.length;

    if (totalDataPoints < 3) {
      return new Response(
        JSON.stringify({
          insights: [],
          message: "Keep checking in with yourself. After a few more entries, your personal patterns will begin to emerge.",
          hasEnoughData: false,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build context for AI
    const moodContext = moods.slice(0, 30).map((m, i) =>
      `${new Date(m.created_at).toLocaleDateString()}: mood="${m.mood}"${m.note ? `, note="${m.note}"` : ''}`
    ).join('\n');

    const journalContext = journals.slice(0, 15).map(j =>
      `${new Date(j.created_at).toLocaleDateString()}: "${j.content.slice(0, 200)}"`
    ).join('\n');

    const energyContext = dayPlans.slice(0, 15).map(d =>
      `${d.plan_date}: energy=${d.energy_level}/5, mood="${d.mood || 'not recorded'}"`
    ).join('\n');

    const rantContext = rants.slice(0, 10).map(r =>
      `${new Date(r.created_at).toLocaleDateString()}: mood="${r.mood || 'unset'}", "${r.content.slice(0, 150)}"`
    ).join('\n');

    const prompt = `You are a compassionate personal pattern analyst. Analyze this person's emotional and behavioral data to identify recurring patterns, predict upcoming shifts, and provide gentle, actionable guidance.

EMOTIONAL DATA (last 60 days):

Mood Check-ins:
${moodContext || 'No mood data yet'}

Journal Entries:
${journalContext || 'No journal entries yet'}

Energy & Day Plans:
${energyContext || 'No energy data yet'}

Rant/Venting Entries:
${rantContext || 'No rant data yet'}

Based on this data, generate exactly 4 insight cards in valid JSON format. Each insight must be one of these types:

1. "pattern" - A recurring emotional or behavioral pattern you've identified
2. "prediction" - A gentle anticipatory insight about what they may experience soon
3. "bridge" - A coping suggestion based on what has helped them before
4. "reassurance" - An affirming message about their resilience

Also determine the user's current emotional phase: "restoration" (low energy, needs rest), "emergence" (building energy), "radiance" (high energy, creative), or "reflection" (turning inward).

RULES:
- Use warm, human language
- No clinical or medical terminology
- No emojis
- Be specific to their actual data patterns
- Predictions should be gentle and empowering, never alarming
- Bridge suggestions should reference actual patterns from the data
- Keep each insight to 1-2 sentences

Return ONLY a JSON object with this structure:
{
  "phase": "restoration|emergence|radiance|reflection",
  "phaseDescription": "one sentence describing their current phase",
  "insights": [
    {
      "type": "pattern|prediction|bridge|reassurance",
      "title": "short title",
      "content": "the insight text",
      "confidence": 0.0-1.0,
      "suggestedActions": ["action1", "action2"]
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
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate pattern analyst. Return only valid JSON. No markdown, no code fences.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 1000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit reached. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let rawContent = aiData.choices[0]?.message?.content || '{}';
    
    // Clean markdown fences if present
    rawContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      console.error('Failed to parse AI response:', rawContent);
      parsed = {
        phase: 'reflection',
        phaseDescription: 'Taking a moment to look inward.',
        insights: []
      };
    }

    // Store insights in database (clear old ones first)
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
        content: insight.content,
        phase: parsed.phase,
        confidence_score: insight.confidence || 0.5,
        suggested_actions: insight.suggestedActions || [],
        pattern_data: { phaseDescription: parsed.phaseDescription },
        is_active: true,
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      await supabase.from('cycle_mirror_insights').insert(insightsToInsert);
    }

    return new Response(
      JSON.stringify({
        phase: parsed.phase,
        phaseDescription: parsed.phaseDescription,
        insights: parsed.insights || [],
        hasEnoughData: true,
        dataPoints: totalDataPoints,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-cycle-insights:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
