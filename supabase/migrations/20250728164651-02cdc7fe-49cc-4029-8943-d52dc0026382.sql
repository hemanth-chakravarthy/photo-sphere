-- Check if the current user exists in admin_users table and insert if not
INSERT INTO admin_users (id, email, password_hash)
SELECT 
  '72415d28-6535-4f1c-91d9-d1fdf0537b1b'::uuid,
  'admin123@gmail.com',
  'placeholder_hash'
WHERE NOT EXISTS (
  SELECT 1 FROM admin_users WHERE id = '72415d28-6535-4f1c-91d9-d1fdf0537b1b'::uuid
);