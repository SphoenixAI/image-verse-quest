
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, promptText } = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "Image URL is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // In a production app, you would use a real computer vision API like:
    // - Google Cloud Vision API
    // - AWS Rekognition
    // - Azure Computer Vision
    // - OpenAI CLIP for prompt matching
    
    // For demo purposes, we'll create a simulated analysis response
    // This would be replaced with actual API calls in production
    
    const simulateAnalysis = async (imageUrl: string, promptText: string) => {
      console.log(`Analyzing image: ${imageUrl} for prompt: ${promptText}`);
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock analysis based on the prompt text
      const analysis = {
        objects: generateObjectsBasedOnPrompt(promptText),
        text: generateTextBasedOnPrompt(promptText),
        faces: promptText.toLowerCase().includes('person') ? 1 : 0,
        animals: promptText.toLowerCase().includes('animal') ? [
          { name: 'dog', confidence: 0.87 }
        ] : [],
        matchConfidence: calculateMatchConfidence(promptText),
      };

      // Simulate moderation
      const moderationResults = {
        isAppropriate: true,
        isRelevant: analysis.matchConfidence > 0.6,
        isHighQuality: Math.random() > 0.2, // 80% chance of being high quality
        moderationScore: Math.random() * 0.3, // Lower is better (0-1 scale)
        moderationFlags: {},
      };
      
      return {
        analysis,
        ...moderationResults
      };
    };
    
    const result = await simulateAnalysis(imageUrl, promptText);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in analyze-image function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper functions for the simulation
function generateObjectsBasedOnPrompt(promptText: string): Array<{ name: string; confidence: number; boundingBox?: any }> {
  const promptLower = promptText.toLowerCase();
  const objects = [];
  
  if (promptLower.includes('energy drink')) {
    objects.push(
      { name: 'bottle', confidence: 0.92, boundingBox: { x: 50, y: 30, width: 200, height: 300 } },
      { name: 'energy drink', confidence: 0.85 }
    );
  } else if (promptLower.includes('sunset')) {
    objects.push(
      { name: 'sky', confidence: 0.95 },
      { name: 'sun', confidence: 0.88 },
      { name: 'horizon', confidence: 0.82 }
    );
  } else if (promptLower.includes('bicycle')) {
    objects.push(
      { name: 'bicycle', confidence: 0.94, boundingBox: { x: 100, y: 100, width: 400, height: 250 } },
      { name: 'wheel', confidence: 0.89 }
    );
  } else if (promptLower.includes('plant') || promptLower.includes('flower')) {
    objects.push(
      { name: 'plant', confidence: 0.91 },
      { name: 'flower', confidence: promptLower.includes('flower') ? 0.93 : 0.45 }
    );
  } else if (promptLower.includes('art') || promptLower.includes('street art')) {
    objects.push(
      { name: 'wall', confidence: 0.88 },
      { name: 'graffiti', confidence: 0.84 },
      { name: 'artwork', confidence: 0.79 }
    );
  } else {
    // Generic objects for other prompts
    objects.push({ name: 'object', confidence: 0.75 });
  }
  
  return objects;
}

function generateTextBasedOnPrompt(promptText: string): string[] {
  const promptLower = promptText.toLowerCase();
  
  if (promptLower.includes('energy drink')) {
    return ['BOOST', 'ENERGY', '200MG CAFFEINE'];
  } else if (promptLower.includes('store') || promptLower.includes('shop')) {
    return ['OPEN', 'SALE', 'DISCOUNT'];
  } else if (promptLower.includes('sign')) {
    return ['STOP', 'CAUTION', 'INFORMATION'];
  } else {
    return [];
  }
}

function calculateMatchConfidence(promptText: string): number {
  // Simulate a match confidence score between 0.65 and 0.98
  // In real implementation, this would be calculated by comparing the image analysis results
  // with the prompt requirements
  return 0.65 + (Math.random() * 0.33);
}
