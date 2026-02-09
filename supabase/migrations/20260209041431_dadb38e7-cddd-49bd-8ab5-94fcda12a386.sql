-- Add explicit DENY policy for public/anonymous access to store_settings
-- This prevents any non-admin access even if other policies are misconfigured

-- First, drop existing policies and recreate with proper security
DROP POLICY IF EXISTS "Admins can manage settings" ON public.store_settings;
DROP POLICY IF EXISTS "Admins can read settings" ON public.store_settings;

-- Create restrictive admin-only policies (PERMISSIVE = YES, so these allow access for admins)
CREATE POLICY "Admins can manage settings" 
ON public.store_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create an explicit DENY policy for non-admin access (using RESTRICTIVE policy)
-- This ensures that even if someone bypasses admin check, they still can't read
CREATE POLICY "Deny non-admin access to settings"
ON public.store_settings
AS RESTRICTIVE
FOR ALL
TO authenticated, anon
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add a comment documenting the security rationale
COMMENT ON TABLE public.store_settings IS 'Store configuration including sensitive API keys. Access restricted to admin users only via RLS. Square API key should be migrated to environment variables (SQUARE_ACCESS_TOKEN secret) for production use.';