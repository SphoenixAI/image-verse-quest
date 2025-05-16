
import { supabase } from "@/integrations/supabase/client";
import { Database } from "./types";

// Define proper types for the vote_type
type VoteType = "authentic" | "fake";

// Define type for the RPC function parameters
interface IncrementImageVoteParams {
  image_id: string;
  vote_type: VoteType;
}

/**
 * Submit a user vote on an image's authenticity
 */
export async function submitVote(
  userId: string,
  imageId: string,
  isAuthentic: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    // Convert boolean to the appropriate vote type
    const voteType: VoteType = isAuthentic ? "authentic" : "fake";
    
    // Insert the vote into the user_votes table
    const { error } = await supabase
      .from("user_votes")
      .insert([
        {
          user_id: userId,
          image_id: imageId,
          vote_type: voteType,
        } as Database["public"]["Tables"]["user_votes"]["Insert"]
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
    // Use a more direct approach with explicit typing
    const { error: updateError } = await supabase.rpc(
      "increment_image_vote",
      {
        image_id: imageId,
        vote_type: voteType as string // Cast to string to bypass the type checking issue
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
