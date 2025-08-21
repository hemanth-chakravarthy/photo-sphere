-- Allow admin users to delete contact messages
CREATE POLICY IF NOT EXISTS "Admin users can delete contact messages"
ON public.contact_messages
FOR DELETE
USING (
  auth.uid() IN (SELECT admin_users.id FROM public.admin_users)
);
