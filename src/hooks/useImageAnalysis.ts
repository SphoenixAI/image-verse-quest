
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ImageAnalysisParams {
  imageUrl: string;
  promptText: string;
}

export interface AnalysisResponse {
  analysis: {
    objects: Array<{
      name: string;
      confidence: number;
      boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
    text: string[];
    faces: number;
    animals: Array<{
      name: string;
      confidence: number;
    }>;
    matchConfidence: number;
  };
  isAppropriate: boolean;
  isRelevant: boolean;
  isHighQuality: boolean;
  moderationScore: number;
  moderationFlags: Record<string, any>;
}

export function useImageAnalysis() {
  const analyzeImage = async ({ imageUrl, promptText }: ImageAnalysisParams): Promise<AnalysisResponse> => {
    const { data, error } = await supabase.functions.invoke("analyze-image", {
      body: { imageUrl, promptText },
    });

    if (error) {
      console.error("Error analyzing image:", error);
      throw new Error(error.message || "Failed to analyze image");
    }

    return data as AnalysisResponse;
  };

  return useMutation({
    mutationFn: analyzeImage,
  });
}
