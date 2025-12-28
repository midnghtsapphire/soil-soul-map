-- Create favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
ON public.favorites
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can add favorites
CREATE POLICY "Users can add favorites"
ON public.favorites
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "Users can remove their own favorites"
ON public.favorites
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_listing_id ON public.favorites(listing_id);