-- Add is_vip column to profiles table
ALTER TABLE public.profiles ADD COLUMN is_vip boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN vip_purchased_at timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN payment_email text;