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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, bookingId, professionalId, callId, status, duration } = await req.json();

    if (action === 'start') {
      // Create a new call record
      const { data: call, error: callError } = await supabase
        .from('calls')
        .insert({
          booking_id: bookingId,
          user_id: user.id,
          professional_id: professionalId,
          call_id: callId,
          status: 'connecting',
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (callError) throw callError;

      // Create notifications
      await supabase.from('notifications').insert([
        {
          user_id: user.id,
          type: 'call_started',
          title: 'Call Started',
          message: 'Your session is connecting...',
        },
        {
          user_id: professionalId,
          type: 'call_started',
          title: 'Incoming Call',
          message: 'A client is calling you.',
        }
      ]);

      console.log('Call started:', call.id);
      return new Response(
        JSON.stringify({ success: true, call }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'update') {
      const updates: any = { status };
      
      console.log('Updating call:', callId, 'with status:', status);
      
      if (status === 'connected') {
        // Notify both parties
        await supabase.from('notifications').insert([
          {
            user_id: user.id,
            type: 'call_connected',
            title: 'Connected',
            message: 'You are now connected 🌿',
          }
        ]);
      }

      if (status === 'completed') {
        updates.ended_at = new Date().toISOString();
        updates.duration = duration;

        // Update booking status
        await supabase
          .from('bookings')
          .update({ status: 'completed' })
          .eq('id', bookingId);

        // Notify completion
        await supabase.from('notifications').insert([
          {
            user_id: user.id,
            type: 'call_completed',
            title: 'Session Completed',
            message: 'Your session has ended. Please share your feedback!',
          }
        ]);
      }

      const { data: call, error: updateError } = await supabase
        .from('calls')
        .update(updates)
        .eq('call_id', callId)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }
      
      if (!call) {
        console.error('Call not found with call_id:', callId);
        throw new Error('Call not found');
      }

      console.log('Call updated successfully:', callId, status);
      return new Response(
        JSON.stringify({ success: true, call }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});