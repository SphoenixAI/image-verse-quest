
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
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock analysis based on the prompt text
      const analysis = {
        objects: generateObjectsBasedOnPrompt(promptText),
        text: generateTextBasedOnPrompt(promptText),
        faces: countFacesBasedOnPrompt(promptText),
        animals: generateAnimalsBasedOnPrompt(promptText),
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
    // Generate more detailed energy drink analysis
    const brands = ['monster', 'red bull', 'rockstar', 'bang', 'reign', 'celsius'];
    const types = ['original', 'sugar-free', 'zero', 'ultra', 'reserve', 'nitro'];
    const flavors = ['original', 'blue', 'green', 'peach', 'watermelon', 'mango'];
    
    // Randomly select brand, type and flavor for variety
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const flavor = flavors[Math.floor(Math.random() * flavors.length)];
    
    objects.push(
      { name: 'bottle', confidence: 0.92, boundingBox: { x: 50, y: 30, width: 200, height: 300 } },
      { name: 'energy drink', confidence: 0.95 },
      { name: brand, confidence: 0.88 },
      { name: `${brand} ${type}`, confidence: 0.85 },
      { name: `${flavor} flavor`, confidence: 0.75 }
    );
  } else if (promptLower.includes('sunset')) {
    objects.push(
      { name: 'sky', confidence: 0.95 },
      { name: 'sun', confidence: 0.88 },
      { name: 'horizon', confidence: 0.82 },
      { name: 'clouds', confidence: 0.78 },
      { name: 'orange sky', confidence: 0.86 }
    );
  } else if (promptLower.includes('bicycle')) {
    const bikeTypes = ['mountain bike', 'road bike', 'hybrid', 'cruiser', 'bmx'];
    const bikeType = bikeTypes[Math.floor(Math.random() * bikeTypes.length)];
    
    objects.push(
      { name: 'bicycle', confidence: 0.94, boundingBox: { x: 100, y: 100, width: 400, height: 250 } },
      { name: 'wheel', confidence: 0.89 },
      { name: bikeType, confidence: 0.82 },
      { name: 'handlebar', confidence: 0.79 },
      { name: 'pedal', confidence: 0.75 }
    );
  } else if (promptLower.includes('plant') || promptLower.includes('flower')) {
    const plantTypes = ['succulent', 'fern', 'cactus', 'ivy', 'aloe'];
    const flowerTypes = ['rose', 'tulip', 'daisy', 'sunflower', 'lily'];
    
    let type;
    if (promptLower.includes('flower')) {
      type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      objects.push(
        { name: 'plant', confidence: 0.91 },
        { name: 'flower', confidence: 0.93 },
        { name: type, confidence: 0.85 },
        { name: 'petal', confidence: 0.82 },
        { name: 'stem', confidence: 0.78 }
      );
    } else {
      type = plantTypes[Math.floor(Math.random() * plantTypes.length)];
      objects.push(
        { name: 'plant', confidence: 0.93 },
        { name: type, confidence: 0.87 },
        { name: 'leaf', confidence: 0.89 },
        { name: 'pot', confidence: 0.75 }
      );
    }
  } else if (promptLower.includes('art') || promptLower.includes('street art')) {
    objects.push(
      { name: 'wall', confidence: 0.88 },
      { name: 'graffiti', confidence: 0.84 },
      { name: 'artwork', confidence: 0.79 },
      { name: 'mural', confidence: 0.82 },
      { name: 'spray paint', confidence: 0.76 }
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
    // Generate random brand and slogan text commonly found on energy drinks
    const brands = ['MONSTER', 'RED BULL', 'ROCKSTAR', 'BANG', 'REIGN', 'CELSIUS'];
    const taglines = ['ENERGY', 'UNLEASH THE BEAST', 'ZERO SUGAR', 'POWER UP', '200MG CAFFEINE'];
    
    const selectedBrand = brands[Math.floor(Math.random() * brands.length)];
    const selectedTaglines = [];
    
    // Pick 2-3 random taglines
    const numTaglines = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < numTaglines; i++) {
      const tagline = taglines[Math.floor(Math.random() * taglines.length)];
      if (!selectedTaglines.includes(tagline)) {
        selectedTaglines.push(tagline);
      }
    }
    
    return [selectedBrand, ...selectedTaglines];
  } else if (promptLower.includes('store') || promptLower.includes('shop')) {
    const storeTexts = ['OPEN', 'SALE', 'DISCOUNT', '50% OFF', 'NEW ARRIVALS', 'CLEARANCE'];
    const results = [];
    
    // Pick 2-3 random texts
    const numTexts = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < numTexts; i++) {
      const text = storeTexts[Math.floor(Math.random() * storeTexts.length)];
      if (!results.includes(text)) {
        results.push(text);
      }
    }
    
    return results;
  } else if (promptLower.includes('sign')) {
    const signTexts = ['STOP', 'CAUTION', 'DANGER', 'EXIT', 'NO PARKING', 'ONE WAY'];
    return [signTexts[Math.floor(Math.random() * signTexts.length)]];
  } else if (promptLower.includes('food') || promptLower.includes('restaurant')) {
    const foodTexts = ['MENU', 'SPECIAL', 'ORGANIC', 'FRESH', 'HOMEMADE', 'LOCAL'];
    const results = [];
    
    // Pick 1-3 random texts
    const numTexts = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numTexts; i++) {
      const text = foodTexts[Math.floor(Math.random() * foodTexts.length)];
      if (!results.includes(text)) {
        results.push(text);
      }
    }
    
    return results;
  } else {
    return [];
  }
}

function countFacesBasedOnPrompt(promptText: string): number {
  const promptLower = promptText.toLowerCase();
  
  if (promptLower.includes('person') || promptLower.includes('people')) {
    // Randomly determine number of faces
    return Math.floor(Math.random() * 3) + 1;
  } else if (promptLower.includes('selfie')) {
    return 1;
  } else if (promptLower.includes('crowd')) {
    return Math.floor(Math.random() * 5) + 3;
  } else {
    // Most photos won't have faces
    const hasFace = Math.random() < 0.1; // 10% chance
    return hasFace ? 1 : 0;
  }
}

function generateAnimalsBasedOnPrompt(promptText: string): Array<{ name: string; confidence: number }> {
  const promptLower = promptText.toLowerCase();
  
  if (promptLower.includes('pet') || promptLower.includes('animal')) {
    const animals = ['dog', 'cat', 'bird', 'hamster', 'rabbit', 'fish'];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    return [{ name: animal, confidence: 0.85 + Math.random() * 0.1 }];
  } else if (promptLower.includes('dog')) {
    const breeds = ['labrador', 'poodle', 'golden retriever', 'german shepherd', 'bulldog'];
    const breed = breeds[Math.floor(Math.random() * breeds.length)];
    return [
      { name: 'dog', confidence: 0.92 },
      { name: breed, confidence: 0.78 }
    ];
  } else if (promptLower.includes('cat')) {
    const breeds = ['siamese', 'persian', 'maine coon', 'tabby', 'bengal'];
    const breed = breeds[Math.floor(Math.random() * breeds.length)];
    return [
      { name: 'cat', confidence: 0.94 },
      { name: breed, confidence: 0.76 }
    ];
  } else if (promptLower.includes('wildlife') || promptLower.includes('nature')) {
    const wildlifeChance = Math.random();
    if (wildlifeChance < 0.3) {
      const wildlife = ['bird', 'squirrel', 'deer', 'rabbit', 'fox'];
      const animal = wildlife[Math.floor(Math.random() * wildlife.length)];
      return [{ name: animal, confidence: 0.72 + Math.random() * 0.15 }];
    }
  }
  
  return [];
}

function calculateMatchConfidence(promptText: string): number {
  // Generate more accurate confidence scores for better simulation
  const promptLower = promptText.toLowerCase();
  
  // Base confidence is between 0.65 and 0.8
  let confidence = 0.65 + (Math.random() * 0.15);
  
  // Adjust confidence based on prompt specificity
  // More specific prompts would have higher match confidence in a real system
  if (promptLower.includes('energy drink')) {
    confidence += 0.12;
  } else if (promptLower.includes('sunset')) {
    confidence += 0.08;
  } else if (promptLower.includes('bicycle')) {
    confidence += 0.1;
  } else if (promptLower.includes('flower')) {
    confidence += 0.09;
  }
  
  // Cap confidence at 0.98 (not 1.0 to simulate some real-world uncertainty)
  return Math.min(0.98, confidence);
}
