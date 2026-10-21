-- Complete & Idempotent Schema Setup for Addis Games Week Awards (Multi-Year & 2026)

-- 1. Helper function for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Auth signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Roles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'organizer', 'user');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own roles' AND tablename = 'user_roles') THEN
    CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage roles' AND tablename = 'user_roles') THEN
    CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 4. Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  edition INTEGER NOT NULL DEFAULT 2026,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS edition INTEGER NOT NULL DEFAULT 2026;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Categories are publicly readable' AND tablename = 'categories') THEN
    CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Organizers can manage categories' AND tablename = 'categories') THEN
    CREATE POLICY "Organizers can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'));
  END IF;
END $$;

-- 5. Contestants table
CREATE TABLE IF NOT EXISTS public.contestants (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  edition INTEGER NOT NULL DEFAULT 2026,
  is_winner BOOLEAN DEFAULT false,
  final_rank INTEGER DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.contestants ADD COLUMN IF NOT EXISTS edition INTEGER NOT NULL DEFAULT 2026;
ALTER TABLE public.contestants ADD COLUMN IF NOT EXISTS is_winner BOOLEAN DEFAULT false;
ALTER TABLE public.contestants ADD COLUMN IF NOT EXISTS final_rank INTEGER DEFAULT NULL;
ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Contestants are publicly readable' AND tablename = 'contestants') THEN
    CREATE POLICY "Contestants are publicly readable" ON public.contestants FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Organizers can manage contestants' AND tablename = 'contestants') THEN
    CREATE POLICY "Organizers can manage contestants" ON public.contestants FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'));
  END IF;
END $$;

-- 6. Votes table
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  nominee_id TEXT NOT NULL,
  edition INTEGER NOT NULL DEFAULT 2026,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS edition INTEGER NOT NULL DEFAULT 2026;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Update unique constraint to allow voting per year
ALTER TABLE public.votes DROP CONSTRAINT IF EXISTS votes_user_id_category_id_key;
ALTER TABLE public.votes DROP CONSTRAINT IF EXISTS votes_user_category_edition_unique;
ALTER TABLE public.votes ADD CONSTRAINT votes_user_category_edition_unique UNIQUE (user_id, category_id, edition);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own votes' AND tablename = 'votes') THEN
    CREATE POLICY "Users can view their own votes" ON public.votes FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own votes' AND tablename = 'votes') THEN
    CREATE POLICY "Users can insert their own votes" ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own votes' AND tablename = 'votes') THEN
    CREATE POLICY "Users can update their own votes" ON public.votes FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 7. App settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Settings are publicly readable' AND tablename = 'app_settings') THEN
    CREATE POLICY "Settings are publicly readable" ON public.app_settings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Organizers can manage settings' AND tablename = 'app_settings') THEN
    CREATE POLICY "Organizers can manage settings" ON public.app_settings FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'));
  END IF;
END $$;

INSERT INTO public.app_settings (key, value) VALUES 
  ('leaderboard_visible', '{"enabled": true}'::jsonb),
  ('leaderboard_frozen', '{"enabled": false}'::jsonb),
  ('active_edition', '{"value": 2026}'::jsonb),
  ('voting_deadline_2026', '{"deadline": "2026-12-15T23:59:59+03:00"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- 8. Seed historical categories (2024)
INSERT INTO public.categories (id, name, description, icon, display_order, edition) VALUES
  ('game-for-change', 'Best Game for Change', 'Games that drive social impact and meaningful change in communities', '🌍', 1, 2024),
  ('game-for-entertainment', 'Best Game for Entertainment', 'The most entertaining and engaging gaming experience', '🎮', 2, 2024),
  ('community-builder', 'Best Community Builder', 'Outstanding contribution to building and nurturing gaming communities', '👥', 3, 2024),
  ('esports-team', 'Best Esports Team', 'The top competitive esports team showcasing excellence', '🏆', 4, 2024),
  ('game-streamer', 'Best Game Streamer', 'The most engaging and influential game streamer', '📺', 5, 2024),
  ('enabler', 'Best Enabler', 'Outstanding support for the Ethiopian gaming ecosystem', '⚡', 6, 2024),
  ('funny-content', 'Best Funny Gaming Content', 'The funniest and most entertaining gaming content creator', '😂', 7, 2024),
  ('chewata-awaqi', 'Chewata Awaqi of the Year', 'The ultimate gaming icon of the year', '👑', 8, 2024)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order;

-- 9. Seed historical contestants (2024)
INSERT INTO public.contestants (id, name, description, category_id, edition, is_winner, final_rank) VALUES
  ('n1', 'EcoQuest Ethiopia', 'An educational game promoting environmental awareness', 'game-for-change', 2024, false, 2),
  ('n2', 'Heritage Heroes', 'Preserving Ethiopian culture through interactive storytelling', 'game-for-change', 2024, true, 1),
  ('n3', 'Unity Bridge', 'A multiplayer game fostering cultural understanding', 'game-for-change', 2024, false, 3),
  ('n4', 'Abyssinia Legends', 'Epic RPG adventure set in ancient Ethiopia', 'game-for-entertainment', 2024, true, 1),
  ('n5', 'Speed Rush Addis', 'High-octane racing through Ethiopian streets', 'game-for-entertainment', 2024, false, 2),
  ('n6', 'Puzzle Masters ET', 'Mind-bending puzzles with Ethiopian themes', 'game-for-entertainment', 2024, false, 3),
  ('n7', 'GamersHub Ethiopia', 'Building the largest gaming community in East Africa', 'community-builder', 2024, true, 1),
  ('n8', 'Addis Esports League', 'Organizing competitive tournaments nationwide', 'community-builder', 2024, false, 2),
  ('n9', 'Gaming Sisters ET', 'Empowering women in Ethiopian gaming', 'community-builder', 2024, false, 3),
  ('n10', 'Team Habesha', 'Dominating regional FIFA competitions', 'esports-team', 2024, true, 1),
  ('n11', 'Addis Legends', 'Top performers in mobile esports', 'esports-team', 2024, false, 2),
  ('n12', 'Ethiopian Thunder', 'Rising stars in competitive gaming', 'esports-team', 2024, false, 3),
  ('n13', 'GameMaster Yonas', 'Entertaining thousands with daily streams', 'game-streamer', 2024, true, 1),
  ('n14', 'Sara Plays', 'Inspiring a new generation of gamers', 'game-streamer', 2024, false, 2),
  ('n15', 'ET Gaming Pro', 'Professional gameplay and tutorials', 'game-streamer', 2024, false, 3),
  ('n16', 'Ethio Game Studios', 'Supporting indie developers across Ethiopia', 'enabler', 2024, true, 1),
  ('n17', 'Gaming Café Network', 'Providing accessible gaming spaces nationwide', 'enabler', 2024, false, 2),
  ('n18', 'Youth Gaming Initiative', 'Training the next generation of game developers', 'enabler', 2024, false, 3),
  ('n19', 'Habesha Fails', 'The funniest gaming moments compilation', 'funny-content', 2024, true, 1),
  ('n20', 'Comedy Gamer ET', 'Making gaming hilarious one video at a time', 'funny-content', 2024, false, 2),
  ('n21', 'Laugh & Play', 'Comedy sketches meet gaming culture', 'funny-content', 2024, false, 3),
  ('n22', 'Legend Dawit', 'Iconic presence in Ethiopian gaming', 'chewata-awaqi', 2024, true, 1),
  ('n23', 'Queen Meron', 'Breaking barriers in competitive gaming', 'chewata-awaqi', 2024, false, 2),
  ('n24', 'Champion Beki', 'Inspiring millions through gaming excellence', 'chewata-awaqi', 2024, false, 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  is_winner = EXCLUDED.is_winner,
  final_rank = EXCLUDED.final_rank;

-- 10. Vote Counts RPC Function
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
