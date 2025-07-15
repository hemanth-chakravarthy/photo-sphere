
-- Create admin authentication function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  );
$$;

-- Create storage bucket for uploaded images
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-photos', 'user-photos', true);

-- Create storage policies for admin-only uploads
CREATE POLICY "Admin users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-photos' AND
  public.is_admin()
);

CREATE POLICY "Admin users can update photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'user-photos' AND
  public.is_admin()
);

CREATE POLICY "Admin users can delete photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-photos' AND
  public.is_admin()
);

-- Allow public read access to photos
CREATE POLICY "Public can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-photos');
