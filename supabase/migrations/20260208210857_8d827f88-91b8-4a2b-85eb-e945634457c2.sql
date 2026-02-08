-- Create trigger on auth.users to auto-create profiles
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update handle_new_user to also grant admin role for specific emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, name, points, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    250,
    'NINA-' || upper(left(split_part(NEW.email, '@', 1), 3)) || '-' || floor(random() * 1000)::text
  );
  
  -- Auto-grant admin role for owner email
  IF NEW.email = 'lydia@ninaarmend.co.site' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Also manually create profile and admin role for existing user (if they already signed up)
-- First get the user ID from auth and create their profile
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'lydia@ninaarmend.co.site' LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Insert profile if not exists
    INSERT INTO public.profiles (id, email, name, points, referral_code)
    VALUES (v_user_id, 'lydia@ninaarmend.co.site', 'Lydia', 250, 'NINA-LYD-' || floor(random() * 1000)::text)
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert admin role if not exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;