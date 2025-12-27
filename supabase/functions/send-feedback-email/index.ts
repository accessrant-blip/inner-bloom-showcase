import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackRequest {
  name: string;
  email: string;
  responsiveness: string;
  recommend: string;
  suggestions: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, responsiveness, recommend, suggestions }: FeedbackRequest = await req.json();

    console.log("Sending feedback email for:", name, email);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "AccessRant Feedback <onboarding@resend.dev>",
        to: ["accessrant@gmail.com"],
        subject: `New Feedback from ${name}`,
        html: `
          <h1>New Feedback Received</h1>
          <p><strong>From:</strong> ${name} (${email})</p>
          <hr />
          <p><strong>App Responsiveness:</strong> ${responsiveness || "Not answered"}</p>
          <p><strong>Would Recommend:</strong> ${recommend || "Not answered"}</p>
          <h3>Suggestions/Feature Requests:</h3>
          <p>${suggestions || "No suggestions provided"}</p>
          <hr />
          <p style="color: #888; font-size: 12px;">This feedback was submitted via the AccessRant app.</p>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-feedback-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
