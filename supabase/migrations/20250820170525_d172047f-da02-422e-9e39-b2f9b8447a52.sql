-- Remove unwanted site settings
DELETE FROM public.site_settings 
WHERE setting_key IN (
  'site_title',
  'site_tagline', 
  'site_description',
  'custom_domain',
  'theme',
  'font_family',
  'gallery_layout',
  'show_featured_photos',
  'show_collections', 
  'show_about_section',
  'show_contact_form',
  'hero_title',
  'hero_subtitle'
);