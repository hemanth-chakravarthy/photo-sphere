-- Allow public read access to site settings so social media links are visible to all visitors
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Keep the existing admin policy for write operations by updating it to be more specific
DROP POLICY IF EXISTS "Admin users can manage site settings" ON public.site_settings;

CREATE POLICY "Admin users can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (auth.uid() IN (SELECT admin_users.id FROM admin_users))
WITH CHECK (auth.uid() IN (SELECT admin_users.id FROM admin_users));