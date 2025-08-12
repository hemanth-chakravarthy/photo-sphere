-- Fix security issue: Remove sensitive data from admin_users table
-- The admin_users table should only track which users are admins, not store credentials

-- Remove the sensitive columns that shouldn't be in this table
ALTER TABLE public.admin_users 
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS password_hash;

-- Add a comment to clarify the table's purpose
COMMENT ON TABLE public.admin_users IS 'Reference table for tracking which authenticated users have admin privileges. Does not store credentials - uses Supabase auth system.';