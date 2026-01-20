-- Add policy for service role to update VIP status (for webhook)
CREATE POLICY "Service role can update all profiles"
ON public.profiles
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);