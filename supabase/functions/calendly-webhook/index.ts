import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, calendly-webhook-signature',
};

interface CalendlyEvent {
  uri: string;
  name: string;
  start_time: string;
  end_time: string;
  event_type: string;
  status: string;
  invitees_counter: {
    total: number;
    active: number;
    limit: number;
  };
}

interface CalendlyInvitee {
  uri: string;
  email: string;
  name: string;
  status: string;
  questions_and_answers?: Array<{
    question: string;
    answer: string;
  }>;
}

interface CalendlyWebhookPayload {
  event: string;
  payload: {
    event: CalendlyEvent;
    invitee?: CalendlyInvitee;
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse the webhook payload
    const webhookData: CalendlyWebhookPayload = await req.json();
    console.log('Received Calendly webhook:', webhookData.event);

    const { event, payload } = webhookData;
    const calendlyEvent = payload.event;
    const invitee = payload.invitee;

    // Extract session type from event type name or custom questions
    let sessionType = 'therapist'; // default
    if (calendlyEvent.name.toLowerCase().includes('listener')) {
      sessionType = 'listener';
    } else if (calendlyEvent.name.toLowerCase().includes('therapist')) {
      sessionType = 'therapist';
    }

    // Handle different webhook events
    if (event === 'invitee.created' || event === 'invitee.scheduled') {
      if (!invitee) {
        console.error('No invitee data in webhook payload');
        return new Response(
          JSON.stringify({ error: 'Missing invitee data' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Insert the scheduled session
      const { data, error } = await supabase
        .from('scheduled_sessions')
        .insert({
          name: invitee.name,
          email: invitee.email,
          scheduled_at: calendlyEvent.start_time,
          session_type: sessionType,
          calendly_event_id: calendlyEvent.uri,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting scheduled session:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Successfully created scheduled session:', data);

      return new Response(
        JSON.stringify({ success: true, data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (event === 'invitee.canceled') {
      // Delete the canceled session
      const { error } = await supabase
        .from('scheduled_sessions')
        .delete()
        .eq('calendly_event_id', calendlyEvent.uri);

      if (error) {
        console.error('Error deleting scheduled session:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Successfully deleted canceled session');

      return new Response(
        JSON.stringify({ success: true, message: 'Session canceled' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For other event types, just acknowledge receipt
    return new Response(
      JSON.stringify({ success: true, message: 'Webhook received' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error processing Calendly webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
