-- Add missing database triggers for security and validation
-- (Skip contact_messages trigger as it already exists)

-- 1. Triggers for photos validation and audit logging
CREATE TRIGGER validate_photo_trigger
  BEFORE INSERT OR UPDATE ON public.photos
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_photo_before_insert_update();

CREATE TRIGGER audit_photo_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.photos
  FOR EACH ROW
  EXECUTE FUNCTION public.log_photo_admin_action();

-- 2. Trigger for site_settings timestamp updates
CREATE TRIGGER update_site_settings_timestamp
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_site_settings_updated_at();

-- 3. Function and trigger to prevent unauthorized role changes in profiles
CREATE OR REPLACE FUNCTION public.validate_profile_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Allow role changes only if user is admin or if it's the initial profile creation
  IF OLD IS NOT NULL AND OLD.role != NEW.role THEN
    IF NOT EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()) THEN
      RAISE EXCEPTION 'Only admin users can change roles';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_profile_role_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_role_change();