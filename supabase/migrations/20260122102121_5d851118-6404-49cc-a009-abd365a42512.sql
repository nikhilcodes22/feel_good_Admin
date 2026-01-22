-- Add lending details columns to assets table
ALTER TABLE public.assets 
ADD COLUMN IF NOT EXISTS lent_to_phone text,
ADD COLUMN IF NOT EXISTS lent_to_address text,
ADD COLUMN IF NOT EXISTS rent_amount numeric,
ADD COLUMN IF NOT EXISTS is_overdue boolean DEFAULT false;