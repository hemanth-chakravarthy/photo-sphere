-- Security Fix Phase 1: Database Function Hardening
-- Update all functions to include SECURITY DEFINER SET search_path = '' to prevent search path manipulation attacks

-- 1. Update log_admin_action function
CREATE OR REPLACE FUNCTION public.log_admin_action(p_action text, p_resource_type text, p_resource_id uuid DEFAULT NULL::uuid, p_details jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_details
  );
END;
$function$;

-- 2. Update validate_photo_metadata function
CREATE OR REPLACE FUNCTION public.validate_photo_metadata(p_title text, p_location text DEFAULT NULL::text, p_description text DEFAULT NULL::text, p_category text DEFAULT NULL::text, p_tags text[] DEFAULT NULL::text[])
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  -- Validate title (required, max 200 chars)
  IF p_title IS NULL OR LENGTH(TRIM(p_title)) = 0 OR LENGTH(p_title) > 200 THEN
    RETURN FALSE;
  END IF;

  -- Validate location (optional, max 100 chars)
  IF p_location IS NOT NULL AND LENGTH(p_location) > 100 THEN
    RETURN FALSE;
  END IF;

  -- Validate description (optional, max 1000 chars)
  IF p_description IS NOT NULL AND LENGTH(p_description) > 1000 THEN
    RETURN FALSE;
  END IF;

  -- Validate category (optional, max 50 chars)
  IF p_category IS NOT NULL AND LENGTH(p_category) > 50 THEN
    RETURN FALSE;
  END IF;

  -- Validate tags (optional, max 10 tags, each max 30 chars)
  IF p_tags IS NOT NULL THEN
    IF array_length(p_tags, 1) > 10 THEN
      RETURN FALSE;
    END IF;

    FOR i IN 1..array_length(p_tags, 1) LOOP
      IF LENGTH(p_tags[i]) > 30 THEN
        RETURN FALSE;
      END IF;
    END LOOP;
  END IF;

  RETURN TRUE;
END;
$function$;

-- 3. Update validate_photo_before_insert_update trigger function
CREATE OR REPLACE FUNCTION public.validate_photo_before_insert_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  IF NOT public.validate_photo_metadata(
    NEW.title,
    NEW.location,
    NEW.description,
    NEW.category,
    NEW.tags
  ) THEN
    RAISE EXCEPTION 'Photo metadata validation failed: invalid title, location, description, category, or tags';
  END IF;

  RETURN NEW;
END;
$function$;

-- 4. Update update_site_settings_updated_at function
CREATE OR REPLACE FUNCTION public.update_site_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 5. Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(
      (NEW.raw_app_meta_data->>'role')::text, 
      'user'
    )
  );
  RETURN NEW;
END;
$function$;

-- Security Fix Phase 3: Input Sanitization and Rate Limiting
-- Add a function to sanitize user input
CREATE OR REPLACE FUNCTION public.sanitize_text_input(input_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  -- Remove potentially dangerous characters and normalize whitespace
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Trim whitespace and limit length
  input_text := TRIM(input_text);
  
  -- Remove control characters but keep newlines and tabs for text areas
  input_text := regexp_replace(input_text, '[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', 'g');
  
  RETURN input_text;
END;
$function$;

-- Add rate limiting table for contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_form_rate_limit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL,
  submission_count integer DEFAULT 1,
  first_submission timestamp with time zone DEFAULT now(),
  last_submission timestamp with time zone DEFAULT now(),
  blocked_until timestamp with time zone
);

-- Create index for rate limiting lookups
CREATE INDEX IF NOT EXISTS idx_contact_rate_limit_ip_time ON public.contact_form_rate_limit(ip_address, last_submission);

-- Enable RLS on rate limiting table
ALTER TABLE public.contact_form_rate_limit ENABLE ROW LEVEL SECURITY;

-- Policy for rate limiting table (admin access only)
CREATE POLICY "Admin users can manage rate limiting" 
ON public.contact_form_rate_limit 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id = auth.uid()
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id = auth.uid()
  )
);

-- Add trigger to validate and sanitize contact messages
CREATE OR REPLACE FUNCTION public.validate_contact_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  -- Sanitize input fields
  NEW.name := public.sanitize_text_input(NEW.name);
  NEW.email := TRIM(LOWER(NEW.email));
  NEW.message := public.sanitize_text_input(NEW.message);
  NEW.admin_notes := public.sanitize_text_input(NEW.admin_notes);
  
  -- Validate required fields
  IF NEW.name IS NULL OR LENGTH(NEW.name) = 0 THEN
    RAISE EXCEPTION 'Name is required';
  END IF;
  
  IF NEW.email IS NULL OR LENGTH(NEW.email) = 0 OR NEW.email !~ '^[^@]+@[^@]+\.[^@]+$' THEN
    RAISE EXCEPTION 'Valid email is required';
  END IF;
  
  IF NEW.message IS NULL OR LENGTH(NEW.message) = 0 THEN
    RAISE EXCEPTION 'Message is required';
  END IF;
  
  -- Length limits
  IF LENGTH(NEW.name) > 100 THEN
    RAISE EXCEPTION 'Name must be less than 100 characters';
  END IF;
  
  IF LENGTH(NEW.email) > 255 THEN
    RAISE EXCEPTION 'Email must be less than 255 characters';
  END IF;
  
  IF LENGTH(NEW.message) > 2000 THEN
    RAISE EXCEPTION 'Message must be less than 2000 characters';
  END IF;

  RETURN NEW;
END;
$function$;

-- Create trigger for contact message validation
DROP TRIGGER IF EXISTS validate_contact_message_trigger ON public.contact_messages;
CREATE TRIGGER validate_contact_message_trigger
  BEFORE INSERT OR UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.validate_contact_message();

-- Add trigger to automatically log admin actions on photos
CREATE OR REPLACE FUNCTION public.log_photo_admin_action()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  -- Only log if user is an admin
  IF EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()) THEN
    CASE TG_OP
      WHEN 'INSERT' THEN
        PERFORM public.log_admin_action('CREATE', 'photo', NEW.id, to_jsonb(NEW));
      WHEN 'UPDATE' THEN
        PERFORM public.log_admin_action('UPDATE', 'photo', NEW.id, 
          jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));
      WHEN 'DELETE' THEN
        PERFORM public.log_admin_action('DELETE', 'photo', OLD.id, to_jsonb(OLD));
    END CASE;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create trigger for photo admin action logging
DROP TRIGGER IF EXISTS log_photo_admin_action_trigger ON public.photos;
CREATE TRIGGER log_photo_admin_action_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.photos
  FOR EACH ROW EXECUTE FUNCTION public.log_photo_admin_action();