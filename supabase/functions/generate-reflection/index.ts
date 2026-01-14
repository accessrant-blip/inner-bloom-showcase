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
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !lovableApiKey) {
      throw new Error('Missing environment variables');
    }

    // Use ANON_KEY with user's auth header - RLS will enforce access control
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    console.log('Fetching rants for user:', user.id);

    // Fetch recent rants
    const { data: rants, error: rantsError } = await supabase
      .from('rants')
      .select('content, mood, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (rantsError) {
      console.error('Error fetching rants:', rantsError);
      throw rantsError;
    }

    console.log('Fetched rants:', rants?.length || 0);

    if (!rants || rants.length === 0) {
      return new Response(
        JSON.stringify({
          reflection: "You haven't shared any thoughts yet. When you're ready, your journal is here — a safe space just for you. Take your time 💛"
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create prompt for AI
    const rantsContext = rants.map((r, i) => 
      `Entry ${i + 1} (${new Date(r.created_at).toLocaleDateString()}): ${r.content}${r.mood ? ` [Mood: ${r.mood}]` : ''}`
    ).join('\n\n');

    const prompt = `You are a compassionate mental wellness companion. Based on the following journal entries, provide a gentle, empathetic reflection on the user's emotional patterns. Be supportive, affirming, and kind. Keep it concise (2-3 sentences). Focus on growth, resilience, and self-compassion.

Journal Entries:
${rantsContext}

Provide a warm, supportive reflection:`;

    console.log('Calling Lovable AI...');

    // Call Lovable AI
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
            content: 'You are a compassionate mental wellness companion. Provide gentle, empathetic reflections that affirm and support users on their emotional journey.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const reflection = aiData.choices[0]?.message?.content || "You're doing better than you think. Keep going 💛";

    console.log('Generated reflection successfully');

    return new Response(
      JSON.stringify({ reflection }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-reflection:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        reflection: "Take a moment to breathe. You're stronger than you know 💛"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});