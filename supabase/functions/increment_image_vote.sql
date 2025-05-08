
-- Function to safely increment a vote count in the image_submissions table
CREATE OR REPLACE FUNCTION public.increment_image_vote(image_id UUID, vote_type TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.image_submissions
  SET votes = CASE
    WHEN vote_type = 'authentic' THEN 
      jsonb_set(votes, '{authentic}', ((votes->>'authentic')::int + 1)::text::jsonb)
    WHEN vote_type = 'fake' THEN 
      jsonb_set(votes, '{fake}', ((votes->>'fake')::int + 1)::text::jsonb)
    ELSE votes
    END
  WHERE id = image_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
