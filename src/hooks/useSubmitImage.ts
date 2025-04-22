
import { useMutation } from "@tanstack/react-query";
import { submitImage } from "@/integrations/supabase/imageSubmissions";
import { useGame } from "@/context/GameContext";

export function useSubmitImage() {
  const { state } = useGame();

  // Example usage: submitImageMutation.mutate({ promptId, imageUrl, analysis })
  const submitImageMutation = useMutation({
    mutationFn: async ({
      promptId,
      imageUrl,
      analysis,
    }: {
      promptId: string;
      imageUrl: string;
      analysis: any;
    }) => {
      if (!state.player.id) throw new Error("Must be logged in.");
      return await submitImage(state.player.id, promptId, imageUrl, analysis);
    },
  });

  return submitImageMutation;
}
