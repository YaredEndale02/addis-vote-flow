-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'organizer', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
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

-- RLS policy: users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy: only admins can manage roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create categories table for admin management
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories are publicly readable
CREATE POLICY "Categories are publicly readable"
ON public.categories
FOR SELECT
USING (true);

-- Only organizers/admins can manage categories
CREATE POLICY "Organizers can manage categories"
ON public.categories
FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'));

-- Create nominees/contestants table
CREATE TABLE public.contestants (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contestants
ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;

-- Contestants are publicly readable
CREATE POLICY "Contestants are publicly readable"
ON public.contestants
FOR SELECT
USING (true);

-- Only organizers/admins can manage contestants
CREATE POLICY "Organizers can manage contestants"
ON public.contestants
FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'));

-- Create app_settings table for leaderboard control
CREATE TABLE public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Settings are publicly readable
CREATE POLICY "Settings are publicly readable"
ON public.app_settings
FOR SELECT
USING (true);

-- Only organizers/admins can manage settings
CREATE POLICY "Organizers can manage settings"
ON public.app_settings
FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer'));

-- Insert default settings
INSERT INTO public.app_settings (key, value) VALUES 
  ('leaderboard_visible', '{"enabled": true}'::jsonb),
  ('leaderboard_frozen', '{"enabled": false}'::jsonb);

-- Create vote_counts view for leaderboard (aggregates votes without exposing voter info)
CREATE OR REPLACE VIEW public.vote_counts AS
SELECT 
  category_id,
  nominee_id,
  COUNT(*) as vote_count
FROM public.votes
GROUP BY category_id, nominee_id;

-- Grant access to the view
GRANT SELECT ON public.vote_counts TO anon, authenticated;

-- Add updated_at triggers
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contestants_updated_at
BEFORE UPDATE ON public.contestants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed categories from existing data
INSERT INTO public.categories (id, name, description, icon, display_order) VALUES
  ('game-for-change', 'Best Game for Change', 'Games that drive social impact and meaningful change in communities', '🌍', 1),
  ('game-for-entertainment', 'Best Game for Entertainment', 'The most entertaining and engaging gaming experience', '🎮', 2),
  ('community-builder', 'Best Community Builder', 'Outstanding contribution to building and nurturing gaming communities', '👥', 3),
  ('esports-team', 'Best Esports Team', 'The top competitive esports team showcasing excellence', '🏆', 4),
  ('game-streamer', 'Best Game Streamer', 'The most engaging and influential game streamer', '📺', 5),
  ('enabler', 'Best Enabler', 'Outstanding support for the Ethiopian gaming ecosystem', '⚡', 6),
  ('funny-content', 'Best Funny Gaming Content', 'The funniest and most entertaining gaming content creator', '😂', 7),
  ('chewata-awaqi', 'Chewata Awaqi of the Year', 'The ultimate gaming icon of the year', '👑', 8);

-- Seed contestants from existing data
INSERT INTO public.contestants (id, name, description, category_id) VALUES
  ('n1', 'EcoQuest Ethiopia', 'An educational game promoting environmental awareness', 'game-for-change'),
  ('n2', 'Heritage Heroes', 'Preserving Ethiopian culture through interactive storytelling', 'game-for-change'),
  ('n3', 'Unity Bridge', 'A multiplayer game fostering cultural understanding', 'game-for-change'),
  ('n4', 'Abyssinia Legends', 'Epic RPG adventure set in ancient Ethiopia', 'game-for-entertainment'),
  ('n5', 'Speed Rush Addis', 'High-octane racing through Ethiopian streets', 'game-for-entertainment'),
  ('n6', 'Puzzle Masters ET', 'Mind-bending puzzles with Ethiopian themes', 'game-for-entertainment'),
  ('n7', 'GamersHub Ethiopia', 'Building the largest gaming community in East Africa', 'community-builder'),
  ('n8', 'Addis Esports League', 'Organizing competitive tournaments nationwide', 'community-builder'),
  ('n9', 'Gaming Sisters ET', 'Empowering women in Ethiopian gaming', 'community-builder'),
  ('n10', 'Team Habesha', 'Dominating regional FIFA competitions', 'esports-team'),
  ('n11', 'Addis Legends', 'Top performers in mobile esports', 'esports-team'),
  ('n12', 'Ethiopian Thunder', 'Rising stars in competitive gaming', 'esports-team'),
  ('n13', 'GameMaster Yonas', 'Entertaining thousands with daily streams', 'game-streamer'),
  ('n14', 'Sara Plays', 'Inspiring a new generation of gamers', 'game-streamer'),
  ('n15', 'ET Gaming Pro', 'Professional gameplay and tutorials', 'game-streamer'),
  ('n16', 'Ethio Game Studios', 'Supporting indie developers across Ethiopia', 'enabler'),
  ('n17', 'Gaming Café Network', 'Providing accessible gaming spaces nationwide', 'enabler'),
  ('n18', 'Youth Gaming Initiative', 'Training the next generation of game developers', 'enabler'),
  ('n19', 'Habesha Fails', 'The funniest gaming moments compilation', 'funny-content'),
  ('n20', 'Comedy Gamer ET', 'Making gaming hilarious one video at a time', 'funny-content'),
  ('n21', 'Laugh & Play', 'Comedy sketches meet gaming culture', 'funny-content'),
  ('n22', 'Legend Dawit', 'Iconic presence in Ethiopian gaming', 'chewata-awaqi'),
  ('n23', 'Queen Meron', 'Breaking barriers in competitive gaming', 'chewata-awaqi'),
  ('n24', 'Champion Beki', 'Inspiring millions through gaming excellence', 'chewata-awaqi');

-- Enable realtime for vote_counts updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;