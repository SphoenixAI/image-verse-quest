
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { PromptData } from '@/types/game';

export const useMapMarkers = (
  map: React.MutableRefObject<mapboxgl.Map | null>,
  userLocation: [number, number] | null,
  getRandomPrompt: () => PromptData,
  handleSelectPrompt: (prompt: PromptData) => void,
  mapboxToken: string | undefined
) => {
  const promptMapMarkers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!userLocation || !map.current || !mapboxToken) return;
    
    promptMapMarkers.current.forEach(marker => marker.remove());
    promptMapMarkers.current = [];

    const newPromptMarkers = [];
    for (let i = 0; i < 5; i++) {
      const randomDistance = 0.003 + Math.random() * 0.002;
      const randomAngle = Math.random() * 2 * Math.PI;
      const lng = userLocation[0] + randomDistance * Math.cos(randomAngle);
      const lat = userLocation[1] + randomDistance * Math.sin(randomAngle);
      
      const prompt = getRandomPrompt();
      
      const position = {
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60
      };
      
      newPromptMarkers.push({
        prompt,
        position,
        coordinates: [lng, lat]
      });
      
      const el = document.createElement('div');
      el.className = 'prompt-marker';
      el.innerHTML = `
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-${prompt.rarity === 'legendary' ? 'chips' : 
                                                 prompt.rarity === 'epic' ? 'rare' : 
                                                 prompt.rarity === 'rare' ? 'tech-primary' : 
                                                 prompt.rarity === 'uncommon' ? 'tech-accent' : 
                                                 'common'} 
                        flex items-center justify-center shadow-lg border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      `;
      
      el.addEventListener('click', () => {
        handleSelectPrompt(prompt);
      });
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current!);
        
      promptMapMarkers.current.push(marker);
    }
    
    return () => {
      promptMapMarkers.current.forEach(marker => marker.remove());
    };
  }, [userLocation, getRandomPrompt, mapboxToken, map, handleSelectPrompt]);

  return promptMapMarkers;
};
