-- Add square_application_id and square_location_id to store_settings
ALTER TABLE public.store_settings
ADD COLUMN IF NOT EXISTS square_application_id text,
ADD COLUMN IF NOT EXISTS square_location_id text;

-- Update the public store_info view to include these new fields
CREATE OR REPLACE VIEW public.store_info AS
  SELECT id, store_name, currency, tax_rate, low_stock_threshold, pos_provider, square_application_id, square_location_id, created_at, updated_at
  FROM public.store_settings;

-- Ensure permissions are maintained
GRANT SELECT ON public.store_info TO anon, authenticated;
