-- Drop the security definer view and replace with a standard function
DROP VIEW IF EXISTS public.vote_counts;

-- Create a secure function to get vote counts (no security definer needed)
CREATE OR REPLACE FUNCTION public.get_vote_counts()
RETURNS TABLE (
  category_id TEXT,
  nominee_id TEXT,
  vote_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 
    v.category_id,
    v.nominee_id,
    COUNT(*)::BIGINT as vote_count
  FROM public.votes v
  GROUP BY v.category_id, v.nominee_id
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION public.get_vote_counts() TO anon, authenticated;