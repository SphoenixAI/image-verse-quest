
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
    
    // For demo purposes, we'll create a more advanced simulated analysis response
    // This would be replaced with actual API calls in production
    
    const simulateAnalysis = async (imageUrl: string, promptText: string) => {
      console.log(`Analyzing image: ${imageUrl} for prompt: ${promptText}`);
      
      // Simulate API latency to show processing animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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

// Enhanced helper functions for the simulation with more detailed responses
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
      { name: 'container', confidence: 0.95, boundingBox: { x: 50, y: 30, width: 200, height: 300 } },
      { name: 'energy drink', confidence: 0.97 },
      { name: brand, confidence: 0.88 },
      { name: `${brand} ${type}`, confidence: 0.85 },
      { name: `${flavor} flavor`, confidence: 0.75 }
    );
  } else if (promptLower.includes('sunset')) {
    objects.push(
      { name: 'sky', confidence: 0.97 },
      { name: 'sun', confidence: 0.93 },
      { name: 'horizon', confidence: 0.89 },
      { name: 'clouds', confidence: 0.87 },
      { name: 'orange sky', confidence: 0.91 },
      { name: 'landscape silhouette', confidence: 0.76 }
    );
  } else if (promptLower.includes('bicycle')) {
    const bikeTypes = ['mountain bike', 'road bike', 'hybrid', 'cruiser', 'bmx'];
    const bikeType = bikeTypes[Math.floor(Math.random() * bikeTypes.length)];
    
    objects.push(
      { name: 'bicycle', confidence: 0.96, boundingBox: { x: 100, y: 100, width: 400, height: 250 } },
      { name: 'wheel', confidence: 0.94 },
      { name: bikeType, confidence: 0.85 },
      { name: 'handlebar', confidence: 0.89 },
      { name: 'pedal', confidence: 0.81 },
      { name: 'chain', confidence: 0.77 },
      { name: 'frame', confidence: 0.92 }
    );
  } else if (promptLower.includes('plant') || promptLower.includes('flower')) {
    const plantTypes = ['succulent', 'fern', 'cactus', 'ivy', 'aloe'];
    const flowerTypes = ['rose', 'tulip', 'daisy', 'sunflower', 'lily'];
    
    let type;
    if (promptLower.includes('flower')) {
      type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      objects.push(
        { name: 'plant', confidence: 0.93 },
        { name: 'flower', confidence: 0.96 },
        { name: type, confidence: 0.87 },
        { name: 'petal', confidence: 0.89 },
        { name: 'stem', confidence: 0.84 },
        { name: 'foliage', confidence: 0.77 }
      );
    } else {
      type = plantTypes[Math.floor(Math.random() * plantTypes.length)];
      objects.push(
        { name: 'plant', confidence: 0.95 },
        { name: type, confidence: 0.89 },
        { name: 'leaf', confidence: 0.92 },
        { name: 'pot', confidence: 0.83 },
        { name: 'soil', confidence: 0.72 }
      );
    }
  } else if (promptLower.includes('art') || promptLower.includes('street art')) {
    objects.push(
      { name: 'wall', confidence: 0.91 },
      { name: 'graffiti', confidence: 0.88 },
      { name: 'artwork', confidence: 0.85 },
      { name: 'mural', confidence: 0.93 },
      { name: 'spray paint', confidence: 0.81 },
      { name: 'colors', confidence: 0.95 },
      { name: 'urban art', confidence: 0.78 }
    );
  } else {
    // Generate more detailed generic objects for other prompts
    const genericObjects = [
      { name: 'object', confidence: 0.75 + Math.random() * 0.2 },
      { name: 'item', confidence: 0.7 + Math.random() * 0.2 }
    ];
    
    // Add some contextual objects based on common scene elements
    const sceneObjects = [
      { name: 'person', confidence: 0.6 + Math.random() * 0.3 },
      { name: 'building', confidence: 0.65 + Math.random() * 0.3 },
      { name: 'vehicle', confidence: 0.55 + Math.random() * 0.3 },
      { name: 'tree', confidence: 0.6 + Math.random() * 0.3 },
      { name: 'furniture', confidence: 0.5 + Math.random() * 0.3 }
    ];
    
    // Add 1-2 generic objects
    objects.push(...genericObjects);
    
    // Add 1-3 scene objects randomly
    const numSceneObjects = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numSceneObjects; i++) {
      const randomIndex = Math.floor(Math.random() * sceneObjects.length);
      if (Math.random() > 0.6) { // 40% chance to add each object
        objects.push(sceneObjects[randomIndex]);
      }
    }
  }
  
  // Sort by confidence descending
  return objects.sort((a, b) => b.confidence - a.confidence);
}

function generateTextBasedOnPrompt(promptText: string): string[] {
  const promptLower = promptText.toLowerCase();
  
  if (promptLower.includes('energy drink')) {
    // Generate random brand and slogan text commonly found on energy drinks
    const brands = ['MONSTER', 'RED BULL', 'ROCKSTAR', 'BANG', 'REIGN', 'CELSIUS'];
    const taglines = ['ENERGY', 'UNLEASH THE BEAST', 'ZERO SUGAR', 'POWER UP', '200MG CAFFEINE', 'NATURAL FLAVORS', 'PERFORMANCE'];
    const warnings = ['NOT RECOMMENDED FOR CHILDREN', 'HIGH CAFFEINE CONTENT'];
    
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
    
    // Add a warning with 50% chance
    if (Math.random() > 0.5) {
      selectedTaglines.push(warnings[Math.floor(Math.random() * warnings.length)]);
    }
    
    return [selectedBrand, ...selectedTaglines];
  } else if (promptLower.includes('store') || promptLower.includes('shop')) {
    const storeTexts = ['OPEN', 'SALE', 'DISCOUNT', '50% OFF', 'NEW ARRIVALS', 'CLEARANCE', 'BUY ONE GET ONE FREE'];
    const storeNames = ['CITY MARKET', 'FASHION HUB', 'TECH WORLD', 'GROCERY STORE', 'BOOKSHOP'];
    const results = [];
    
    // Add store name with 70% chance
    if (Math.random() > 0.3) {
      results.push(storeNames[Math.floor(Math.random() * storeNames.length)]);
    }
    
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
    const signTexts = ['STOP', 'CAUTION', 'DANGER', 'EXIT', 'NO PARKING', 'ONE WAY', 'DO NOT ENTER', 'YIELD', 'CONSTRUCTION AHEAD', 'DETOUR'];
    // Add 1-2 sign texts
    const results = [];
    const numTexts = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numTexts; i++) {
      const text = signTexts[Math.floor(Math.random() * signTexts.length)];
      if (!results.includes(text)) {
        results.push(text);
      }
    }
    return results;
  } else if (promptLower.includes('food') || promptLower.includes('restaurant')) {
    const foodTexts = ['MENU', 'SPECIAL', 'ORGANIC', 'FRESH', 'HOMEMADE', 'LOCAL', 'GLUTEN FREE', 'VEGAN OPTION'];
    const restaurantNames = ['THE GRILL', 'CASA ITALIANA', 'OCEAN VIEW', 'GREEN GARDEN', 'SPICE HOUSE'];
    const results = [];
    
    // Add restaurant name with 60% chance
    if (Math.random() > 0.4) {
      results.push(restaurantNames[Math.floor(Math.random() * restaurantNames.length)]);
    }
    
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
    // For other prompts, simulate some text detection with 40% chance
    if (Math.random() < 0.4) {
      const genericTexts = ['BRAND', 'LABEL', 'TEXT', 'INFORMATION', 'LOGO', 'NAME'];
      return [genericTexts[Math.floor(Math.random() * genericTexts.length)]];
    }
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
  } else if (promptLower.includes('portrait') || promptLower.includes('photo')) {
    return Math.random() < 0.8 ? 1 : 0; // 80% chance of a face
  } else {
    // Most photos won't have faces
    const hasFace = Math.random() < 0.15; // 15% chance
    return hasFace ? 1 : 0;
  }
}

function generateAnimalsBasedOnPrompt(promptText: string): Array<{ name: string; confidence: number }> {
  const promptLower = promptText.toLowerCase();
  
  if (promptLower.includes('pet') || promptLower.includes('animal')) {
    const animals = ['dog', 'cat', 'bird', 'hamster', 'rabbit', 'fish', 'guinea pig', 'turtle'];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    return [{ name: animal, confidence: 0.85 + Math.random() * 0.1 }];
  } else if (promptLower.includes('dog')) {
    const breeds = ['labrador', 'poodle', 'golden retriever', 'german shepherd', 'bulldog', 'beagle', 'husky', 'pug'];
    const breed = breeds[Math.floor(Math.random() * breeds.length)];
    return [
      { name: 'dog', confidence: 0.94 },
      { name: breed, confidence: 0.78 + Math.random() * 0.1 },
      { name: 'canine', confidence: 0.85 }
    ];
  } else if (promptLower.includes('cat')) {
    const breeds = ['siamese', 'persian', 'maine coon', 'tabby', 'bengal', 'ragdoll', 'sphynx'];
    const breed = breeds[Math.floor(Math.random() * breeds.length)];
    return [
      { name: 'cat', confidence: 0.96 },
      { name: breed, confidence: 0.76 + Math.random() * 0.1 },
      { name: 'feline', confidence: 0.89 }
    ];
  } else if (promptLower.includes('wildlife') || promptLower.includes('nature')) {
    const wildlifeChance = Math.random();
    if (wildlifeChance < 0.6) { // Increased chance
      const wildlife = ['bird', 'squirrel', 'deer', 'rabbit', 'fox', 'raccoon', 'chipmunk', 'duck'];
      const animal = wildlife[Math.floor(Math.random() * wildlife.length)];
      return [{ name: animal, confidence: 0.72 + Math.random() * 0.2 }];
    }
  } else if (promptLower.includes('farm')) {
    const farmAnimals = ['cow', 'horse', 'sheep', 'goat', 'chicken', 'pig'];
    const animal = farmAnimals[Math.floor(Math.random() * farmAnimals.length)];
    return [{ name: animal, confidence: 0.8 + Math.random() * 0.15 }];
  }
  
  // For other prompts, small chance to detect an animal
  if (Math.random() < 0.1) {
    const commonAnimals = ['dog', 'cat', 'bird'];
    return [{ name: commonAnimals[Math.floor(Math.random() * commonAnimals.length)], confidence: 0.65 + Math.random() * 0.15 }];
  }
  
  return [];
}

function calculateMatchConfidence(promptText: string): number {
  // Generate more accurate confidence scores for better simulation
  const promptLower = promptText.toLowerCase();
  
  // Base confidence is between 0.65 and 0.85
  let confidence = 0.65 + (Math.random() * 0.20);
  
  // Adjust confidence based on prompt specificity
  // More specific prompts would have higher match confidence in a real system
  if (promptLower.includes('energy drink')) {
    confidence += 0.12;
  } else if (promptLower.includes('sunset')) {
    confidence += 0.10;
  } else if (promptLower.includes('bicycle')) {
    confidence += 0.13;
  } else if (promptLower.includes('flower')) {
    confidence += 0.11;
  } else if (promptLower.includes('dog') || promptLower.includes('cat')) {
    confidence += 0.14;
  } else if (promptLower.includes('food')) {
    confidence += 0.09;
  }
  
  // Cap confidence at 0.98 (not 1.0 to simulate some real-world uncertainty)
  return Math.min(0.98, confidence);
}
