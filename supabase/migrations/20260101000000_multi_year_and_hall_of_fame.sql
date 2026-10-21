-- Migration for multi-year support & 2026 event cycle

-- 1. Add edition and winner metadata to categories
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS edition INTEGER NOT NULL DEFAULT 2026;

-- 2. Add edition and winner metadata to contestants
ALTER TABLE public.contestants ADD COLUMN IF NOT EXISTS edition INTEGER NOT NULL DEFAULT 2026;
ALTER TABLE public.contestants ADD COLUMN IF NOT EXISTS is_winner BOOLEAN DEFAULT false;
ALTER TABLE public.contestants ADD COLUMN IF NOT EXISTS final_rank INTEGER DEFAULT NULL;

-- 3. Tag historical contestants and categories as 2024 edition
UPDATE public.categories SET edition = 2024 WHERE edition = 2026;
UPDATE public.contestants SET edition = 2024 WHERE edition = 2026;

-- Mark official 2024 winners for the Hall of Fame archive
UPDATE public.contestants SET is_winner = true, final_rank = 1 WHERE id IN ('n2', 'n4', 'n7', 'n10', 'n13', 'n16', 'n19', 'n22');
UPDATE public.contestants SET is_winner = false, final_rank = 2 WHERE id IN ('n1', 'n5', 'n8', 'n11', 'n14', 'n17', 'n20', 'n23');
UPDATE public.contestants SET is_winner = false, final_rank = 3 WHERE id IN ('n3', 'n6', 'n9', 'n12', 'n15', 'n18', 'n21', 'n24');

-- 4. Update votes table for multi-year editions
ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS edition INTEGER NOT NULL DEFAULT 2026;
UPDATE public.votes SET edition = 2024 WHERE edition = 2026;

-- Update unique constraint to allow voting per category per year
ALTER TABLE public.votes DROP CONSTRAINT IF EXISTS votes_user_id_category_id_key;
ALTER TABLE public.votes DROP CONSTRAINT IF EXISTS votes_user_category_edition_unique;
ALTER TABLE public.votes ADD CONSTRAINT votes_user_category_edition_unique UNIQUE (user_id, category_id, edition);

-- 5. Update app_settings with 2026 configuration
INSERT INTO public.app_settings (key, value) VALUES
  ('active_edition', '{"value": 2026}'::jsonb),
  ('voting_deadline_2026', '{"deadline": "2026-12-15T23:59:59+03:00"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- 6. Update get_vote_counts function to support filtering by edition
CREATE OR REPLACE FUNCTION public.get_vote_counts(_edition INTEGER DEFAULT 2026)
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
  WHERE v.edition = _edition
  GROUP BY v.category_id, v.nominee_id
$$;

GRANT EXECUTE ON FUNCTION public.get_vote_counts(INTEGER) TO anon, authenticated;
