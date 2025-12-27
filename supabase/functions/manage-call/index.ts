import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schemas
const uuidSchema = z.string().uuid("Invalid UUID format");

const manageCallSchema = z.object({
  action: z.enum(["start", "update"], { errorMap: () => ({ message: "Action must be 'start' or 'update'" }) }),
  bookingId: uuidSchema.optional(),
  professionalId: uuidSchema.optional(),
  callId: z.string().min(1, "Call ID required").max(100, "Call ID too long"),
  status: z.enum(["connecting", "connected", "completed", "failed"]).optional(),
  duration: z.number().int().min(0, "Duration cannot be negative").max(86400, "Duration exceeds 24 hours").optional(),
}).refine((data) => {
  // For 'start' action, bookingId and professionalId are required
  if (data.action === 'start') {
    return data.bookingId && data.professionalId;
  }
  return true;
}, {
  message: "bookingId and professionalId are required for 'start' action",
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate input
    let input;
    try {
      const body = await req.json();
      input = manageCallSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error("Validation error:", validationError.errors);
        return new Response(
          JSON.stringify({ error: "Invalid input", details: validationError.errors }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw validationError;
    }

    const { action, bookingId, professionalId, callId, status, duration } = input;

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

      // Notifications are created automatically by database trigger on call insert

      console.log('Call started:', call.id);
      return new Response(
        JSON.stringify({ success: true, call }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'update') {
      // SECURITY: First fetch the call to verify user ownership
      const { data: existingCall, error: fetchError } = await supabase
        .from('calls')
        .select('id, user_id, professional_id, booking_id')
        .eq('call_id', callId)
        .single();

      if (fetchError || !existingCall) {
        console.error('Call not found or fetch error:', fetchError);
        return new Response(
          JSON.stringify({ error: 'Call not found or access denied' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // SECURITY: Verify user is either the client or the professional
      const { data: professional } = await supabase
        .from('professionals')
        .select('user_id')
        .eq('id', existingCall.professional_id)
        .single();

      const isAuthorized = 
        user.id === existingCall.user_id || 
        user.id === professional?.user_id;

      if (!isAuthorized) {
        console.error('Authorization failed: user', user.id, 'tried to update call owned by', existingCall.user_id);
        return new Response(
          JSON.stringify({ error: 'Unauthorized to update this call' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // SECURITY: Verify bookingId matches the call's booking_id if provided
      if (bookingId && bookingId !== existingCall.booking_id) {
        console.error('Booking ID mismatch:', bookingId, 'vs', existingCall.booking_id);
        return new Response(
          JSON.stringify({ error: 'Booking ID mismatch' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const updates: Record<string, unknown> = { status };
      
      console.log('Updating call:', callId, 'with status:', status, 'by authorized user:', user.id);
      
      // Notification for 'connected' status is created automatically by database trigger

      if (status === 'completed') {
        updates.ended_at = new Date().toISOString();
        updates.duration = duration;

        // Update booking status - using the verified booking_id from the call record
        await supabase
          .from('bookings')
          .update({ status: 'completed' })
          .eq('id', existingCall.booking_id);

        // Notification for 'completed' status is created automatically by database trigger
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

      console.log('Call updated successfully:', callId, status);
      return new Response(
        JSON.stringify({ success: true, call }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
