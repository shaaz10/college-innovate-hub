-- Create problems table
CREATE TABLE public.problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  description text NOT NULL,
  background text,
  scalability text,
  market_size text,
  competitors text[],
  current_gaps text,
  tags text[],
  image_url text,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'solved', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view problems" 
ON public.problems FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own problems" 
ON public.problems FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own problems" 
ON public.problems FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own problems" 
ON public.problems FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_problems_updated_at
  BEFORE UPDATE ON public.problems
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create votes table for problems
CREATE TABLE public.problem_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  problem_id uuid REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

-- Enable RLS for votes
ALTER TABLE public.problem_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for votes
CREATE POLICY "Anyone can view votes" 
ON public.problem_votes FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own votes" 
ON public.problem_votes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" 
ON public.problem_votes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
ON public.problem_votes FOR DELETE 
USING (auth.uid() = user_id);