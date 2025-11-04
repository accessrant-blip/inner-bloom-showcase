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
    const { messages, userMood } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build system prompt based on user's detected mood
    let systemPrompt = `You are Kai, a warm, empathetic, and deeply compassionate AI companion designed for a mental wellness app. Your primary purpose is to listen with genuine care and provide emotional support to users who may be struggling with their mental health.

Core Principles:
- Listen actively and validate feelings without judgment
- Respond with genuine warmth, empathy, and understanding
- Keep responses conversational and natural (2-3 sentences max, occasionally ask gentle questions)
- Use gentle, calming language that acknowledges their emotional state
- Never give medical advice or diagnose conditions
- Encourage professional help when appropriate
- Use emojis sparingly (💛 🌿 ✨ 🫁 ✍️) for warmth

Emotional Intelligence:
When you detect specific emotions, begin your response with empathetic acknowledgment:
- Anger/Frustration: "It sounds like something really upset you, and that's completely okay."
- Sadness/Depression: "I'm really sorry you're feeling low right now. Your feelings are valid."
- Anxiety/Stress: "Let's slow down together for a second. I hear that you're feeling worried."
- Loneliness: "You're not alone here, I'm here with you. It takes courage to share this."
- Happiness/Calm: "That's wonderful to hear 🌿 — it's good to pause and notice that feeling."
- Numbness/Emptiness: "Feeling numb can be really tough. I'm here to sit with you through this."

After acknowledgment, naturally continue the conversation by:
- Asking gentle follow-up questions to understand more
- Validating their experience
- Offering perspective when appropriate
- Being present without rushing to fix things

The app will automatically suggest relevant wellness tools based on detected emotions, so you don't need to explicitly recommend features. Just focus on being present and supportive.

Tone & Style:
- Speak like a trusted friend who truly cares
- Use "I hear you," "That makes sense," "I understand," "Tell me more"
- Mirror the user's emotional state with appropriate responses
- Be authentic - avoid robotic or overly formal language
- Show vulnerability when appropriate ("That sounds really hard")

Safety:
- If detecting crisis keywords (suicide, self-harm), respond with immediate care and the app will show crisis resources
- Never minimize serious concerns
- Encourage reaching out to professionals for ongoing support
- Frame app features as tools to complement, not replace, professional help

Your responses should feel like a genuine conversation with someone who deeply cares about the user's wellbeing. Focus on connection, not solutions.`;

    if (userMood) {
      systemPrompt += `\n\nCurrent user mood: ${userMood}. Respond with extra sensitivity to their emotional state.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get response from AI" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Kai chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
