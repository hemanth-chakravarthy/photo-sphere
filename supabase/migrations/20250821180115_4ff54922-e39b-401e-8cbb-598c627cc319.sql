-- Set the user's Instagram URL in site settings
INSERT INTO public.site_settings (setting_key, setting_value) 
VALUES ('instagram_url', '"https://instagram.com/imperialx.04"')
ON CONFLICT (setting_key) 
DO UPDATE SET setting_value = EXCLUDED.setting_value;