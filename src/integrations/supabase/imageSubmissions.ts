import { supabase } from "@/integrations/supabase/client";
import { ImageSubmission } from "@/types/game";

// Submits an image for moderation. Returns the created record or error.
export async function submitImage(
  userId: string,
  promptId: string,
  imageUrl: string,
  analysis: any // Could be ComputerVisionAnalysis or null
): Promise<{ success: boolean; error?: string; data?: any }> {
  const { data, error } = await supabase
    .from("image_submissions")
    .insert([
      {
        user_id: userId,
        prompt_id: promptId,
        image_url: imageUrl,
        analysis: analysis ?? null,
        moderation_status: "pending",
        // Other moderation fields are left as defaults/null, will be set by the AI mod system
      },
    ])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
}
