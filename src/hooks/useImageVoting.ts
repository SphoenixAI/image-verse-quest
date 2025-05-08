
import { useMutation, useQuery } from "@tanstack/react-query";
import { submitVote, hasUserVotedOnImage } from "@/integrations/supabase/userVotes";
import { useGame } from "@/context/GameContext";

export function useImageVoting(imageId: string) {
  const { state } = useGame();
  const userId = state.player.id;

  // Query to check if user has already voted
  const hasVotedQuery = useQuery({
    queryKey: ["hasVoted", userId, imageId],
    queryFn: () => hasUserVotedOnImage(userId, imageId),
    enabled: !!userId && !!imageId,
  });

  // Mutation for submitting a vote
  const voteMutation = useMutation({
    mutationFn: (isAuthentic: boolean) => submitVote(userId, imageId, isAuthentic),
  });

  return {
    hasVoted: hasVotedQuery.data ?? false,
    isLoading: hasVotedQuery.isLoading,
    submitVote: (isAuthentic: boolean) => voteMutation.mutate(isAuthentic),
    isSubmitting: voteMutation.isPending,
    error: voteMutation.error,
  };
}
