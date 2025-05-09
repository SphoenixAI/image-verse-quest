
import { supabase } from "@/integrations/supabase/client";

/**
 * Submit a user vote on an image's authenticity
 */
export async function submitVote(
  userId: string,
  imageId: string,
  isAuthentic: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    // Insert the vote into the user_votes table
    const { error } = await supabase
      .from("user_votes")
      .insert([
        {
          user_id: userId,
          image_id: imageId,
          vote_type: isAuthentic ? "authentic" : "fake",
        },
      ]);

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violated - user already voted
        return { 
          success: false, 
          error: "You have already voted on this image" 
        };
      }
      return { success: false, error: error.message };
    }

    // Update the votes count in the image_submissions table
    const voteField = isAuthentic ? "authentic" : "fake";
    
    // Fix: Use the correct parameter names for the RPC call
    const { error: updateError } = await supabase.rpc(
      "increment_image_vote",
      { 
        image_id: imageId, 
        vote_type: voteField 
      }
    );

    if (updateError) {
      console.error("Error updating vote count:", updateError);
      return { success: true }; // Vote was recorded even if count update failed
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting vote:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred while recording your vote" 
    };
  }
}

/**
 * Check if a user has already voted on a specific image
 */
export async function hasUserVotedOnImage(
  userId: string,
  imageId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("user_votes")
      .select("id")
      .eq("user_id", userId)
      .eq("image_id", imageId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No data found - user hasn't voted
        return false;
      }
      console.error("Error checking vote status:", error);
      return false;
    }

    // If we got data, user has voted
    return !!data;
  } catch (error) {
    console.error("Error checking vote status:", error);
    return false;
  }
}
