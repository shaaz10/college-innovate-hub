-- Create ideas table
CREATE TABLE public.ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  problem_id uuid REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  stage integer DEFAULT 1 CHECK (stage >= 1 AND stage <= 9),
  mentor text,
  contact text NOT NULL,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  attachments text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_members table (shared by ideas and startups)
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('idea', 'startup')),
  entity_id uuid NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create startups table
CREATE TABLE public.startups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  stage integer DEFAULT 1 CHECK (stage >= 1 AND stage <= 9),
  funding_status text,
  schemes text[],
  upvotes integer DEFAULT 0,
  one_pager_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create milestones table for startups
CREATE TABLE public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  target_date date,
  completed boolean DEFAULT false,
  completed_date date,
  created_at timestamptz DEFAULT now()
);

-- Create comments table (for problems, ideas, and startups)
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('problem', 'idea', 'startup')),
  entity_id uuid NOT NULL,
  parent_comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create idea_votes table
CREATE TABLE public.idea_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  idea_id uuid REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, idea_id)
);

-- Create startup_votes table
CREATE TABLE public.startup_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('upvote')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, startup_id)
);

-- Create comment_votes table
CREATE TABLE public.comment_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

-- Enable RLS on all tables
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for ideas
CREATE POLICY "Anyone can view ideas" ON public.ideas FOR SELECT USING (true);
CREATE POLICY "Users can create their own ideas" ON public.ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ideas" ON public.ideas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ideas" ON public.ideas FOR DELETE USING (auth.uid() = user_id);

-- Create policies for team_members
CREATE POLICY "Anyone can view team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Users can manage team members for their entities" ON public.team_members FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.ideas WHERE id = entity_id AND user_id = auth.uid() AND entity_type = 'idea'
    UNION
    SELECT 1 FROM public.startups WHERE id = entity_id AND user_id = auth.uid() AND entity_type = 'startup'
  )
);

-- Create policies for startups
CREATE POLICY "Anyone can view startups" ON public.startups FOR SELECT USING (true);
CREATE POLICY "Users can create their own startups" ON public.startups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own startups" ON public.startups FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own startups" ON public.startups FOR DELETE USING (auth.uid() = user_id);

-- Create policies for milestones
CREATE POLICY "Anyone can view milestones" ON public.milestones FOR SELECT USING (true);
CREATE POLICY "Users can manage milestones for their startups" ON public.milestones FOR ALL USING (
  EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND user_id = auth.uid())
);

-- Create policies for comments
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Create policies for votes
CREATE POLICY "Anyone can view idea votes" ON public.idea_votes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own idea votes" ON public.idea_votes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view startup votes" ON public.startup_votes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own startup votes" ON public.startup_votes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comment votes" ON public.comment_votes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own comment votes" ON public.comment_votes FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_startups_updated_at
  BEFORE UPDATE ON public.startups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();