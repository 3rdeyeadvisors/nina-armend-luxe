-- Fix security issues: Remove overly permissive public read policies

-- 1. Drop public read policy on customers table
DROP POLICY IF EXISTS "Public can read customers" ON public.customers;

-- 2. Drop public read policy on orders table
DROP POLICY IF EXISTS "Public can read orders" ON public.orders;

-- 3. Drop public read policy on store_settings table
DROP POLICY IF EXISTS "Public can read settings" ON public.store_settings;

-- 4. Drop overly permissive profiles read policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- 5. Create proper profiles read policy (users can only view their own profile)
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 6. Allow admins to read all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. Allow admins to read customers (since public read is removed)
CREATE POLICY "Admins can read customers"
ON public.customers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 8. Allow admins to read orders (since public read is removed)
CREATE POLICY "Admins can read orders"
ON public.orders
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 9. Allow admins to read store settings (since public read is removed)
CREATE POLICY "Admins can read settings"
ON public.store_settings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));