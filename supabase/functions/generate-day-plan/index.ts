import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goals, mood, energyLevel, easyMode, adjustment } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const moodContext = {
      depressed: "feeling low energy and unmotivated",
      anxious: "feeling worried and on edge",
      stressed: "feeling overwhelmed with responsibilities",
      lonely: "feeling disconnected and isolated",
      neutral: "feeling neither particularly good nor bad"
    };

    const energyContext = {
      1: "extremely low energy, needs very gentle activities",
      2: "low energy, needs easy tasks with lots of breaks",
      3: "moderate energy, can handle normal activities",
      4: "good energy, can handle productive tasks",
      5: "high energy, ready for challenging activities"
    };

    let adjustmentInstructions = "";
    if (adjustment === "easier") {
      adjustmentInstructions = "Make tasks simpler, add more breaks, reduce expectations.";
    } else if (adjustment === "productive") {
      adjustmentInstructions = "Add more productive tasks, fewer breaks, higher expectations.";
    }

    const systemPrompt = `You are a compassionate wellness coach creating a daily schedule for someone who is ${moodContext[mood as keyof typeof moodContext] || "managing their day"} and has ${energyContext[energyLevel as keyof typeof energyContext] || "moderate energy"}.

${easyMode ? "IMPORTANT: Make this day extra gentle. Smaller tasks, more breaks, lower expectations." : ""}
${adjustmentInstructions}

Create a realistic day plan with 10-15 micro-steps from morning to evening. Each task should be:
- Small and achievable (2-30 minutes)
- Include self-care moments
- Have clear, gentle time suggestions
- Include meals, hydration, and movement

Goals for today: ${goals?.join(", ") || "general wellness"}

Return ONLY a JSON array of schedule items in this exact format:
[
  {"time": "7:00 AM", "task": "Wake up slowly, stretch in bed for 2 minutes"},
  {"time": "7:05 AM", "task": "Open curtains, let light in"},
  ...
]

No explanations, just the JSON array.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate my day plan now." }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    
    // Parse the JSON from the response
    let schedule;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      schedule = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (parseError) {
      console.error("Error parsing schedule:", parseError, content);
      // Return a fallback schedule
      schedule = [
        { time: "7:00 AM", task: "Wake up gently, take a moment to breathe" },
        { time: "7:10 AM", task: "Drink a glass of water" },
        { time: "7:30 AM", task: "Light breakfast" },
        { time: "8:00 AM", task: "10-minute walk or stretching" },
        { time: "9:00 AM", task: "Start on your main goal for today" },
        { time: "10:30 AM", task: "Take a 10-minute break" },
        { time: "12:00 PM", task: "Lunch and some fresh air" },
        { time: "1:00 PM", task: "Continue with tasks (gentle pace)" },
        { time: "3:00 PM", task: "Healthy snack and hydration break" },
        { time: "5:00 PM", task: "Wind down from work/tasks" },
        { time: "6:00 PM", task: "Dinner time" },
        { time: "7:00 PM", task: "Relaxing activity (reading, music, hobby)" },
        { time: "9:00 PM", task: "Begin bedtime routine" },
        { time: "10:00 PM", task: "Rest well 💤" }
      ];
    }

    return new Response(
      JSON.stringify({ schedule }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-day-plan:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
