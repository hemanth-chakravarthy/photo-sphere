import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface RateLimitRecord {
  ip_address: string;
  submission_count: number;
  first_submission: string;
  last_submission: string;
  blocked_until?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get client IP address
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     '127.0.0.1';

    // Rate limiting check
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - (15 * 60 * 1000));

    // Check existing rate limit record
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .from('contact_form_rate_limit')
      .select('*')
      .eq('ip_address', clientIP)
      .single();

    if (rateLimitError && rateLimitError.code !== 'PGRST116') {
      console.error('Rate limit check error:', rateLimitError);
      throw new Error('Rate limit check failed');
    }

    // Check if IP is currently blocked
    if (rateLimitData?.blocked_until && new Date(rateLimitData.blocked_until) > now) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: rateLimitData.blocked_until
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check submission count in the last 15 minutes
    if (rateLimitData) {
      const lastSubmission = new Date(rateLimitData.last_submission);
      
      if (lastSubmission > fifteenMinutesAgo) {
        // Still within rate limit window
        if (rateLimitData.submission_count >= 5) {
          // Block for 1 hour
          const blockedUntil = new Date(now.getTime() + (60 * 60 * 1000));
          
          await supabase
            .from('contact_form_rate_limit')
            .update({
              blocked_until: blockedUntil.toISOString(),
              submission_count: rateLimitData.submission_count + 1,
              last_submission: now.toISOString()
            })
            .eq('ip_address', clientIP);

          return new Response(JSON.stringify({ 
            error: 'Too many submissions. You are blocked for 1 hour.',
            retryAfter: blockedUntil.toISOString()
          }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } else {
        // Reset counter if outside window
        await supabase
          .from('contact_form_rate_limit')
          .update({
            submission_count: 1,
            first_submission: now.toISOString(),
            last_submission: now.toISOString(),
            blocked_until: null
          })
          .eq('ip_address', clientIP);
      }
    }

    // Parse and validate form data
    const formData: ContactFormData = await req.json();

    // Server-side validation
    if (!formData.name || typeof formData.name !== 'string' || formData.name.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!formData.email || typeof formData.email !== 'string' || 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!formData.message || typeof formData.message !== 'string' || formData.message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Length validation
    if (formData.name.length > 100) {
      return new Response(JSON.stringify({ error: 'Name must be less than 100 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (formData.email.length > 255) {
      return new Response(JSON.stringify({ error: 'Email must be less than 255 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (formData.message.length > 2000) {
      return new Response(JSON.stringify({ error: 'Message must be less than 2000 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert contact message
    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        message: formData.message.trim()
      });

    if (insertError) {
      console.error('Contact message insert error:', insertError);
      throw new Error('Failed to submit contact message');
    }

    // Update rate limit record
    if (rateLimitData) {
      await supabase
        .from('contact_form_rate_limit')
        .update({
          submission_count: rateLimitData.submission_count + 1,
          last_submission: now.toISOString()
        })
        .eq('ip_address', clientIP);
    } else {
      await supabase
        .from('contact_form_rate_limit')
        .insert({
          ip_address: clientIP,
          submission_count: 1,
          first_submission: now.toISOString(),
          last_submission: now.toISOString()
        });
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Message sent successfully!' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error. Please try again later.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});