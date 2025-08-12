-- Fix security issue: Add RLS policies to protect user email addresses in profiles table

-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Users can only update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- Policy 3: Allow admins to view all profiles (for admin functionality)
CREATE POLICY "Admin users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.id = auth.uid()
  )
);

-- Policy 4: Allow admins to update all profiles (for admin functionality)
CREATE POLICY "Admin users can update all profiles" 
ON public.profiles 
FOR UPDATE 
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

-- Policy 5: Allow profile creation during user registration
CREATE POLICY "Allow profile creation during registration" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Add comment to clarify security measures
COMMENT ON TABLE public.profiles IS 'User profiles with RLS policies protecting email addresses from unauthorized access';