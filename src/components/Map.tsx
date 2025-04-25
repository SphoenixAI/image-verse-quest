
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useToast } from '@/hooks/use-toast';
import CaptureImage from './CaptureImage';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import MapControls from './map/MapControls';
import PromptMarker from './map/PromptMarker';
import { Skeleton } from './ui/skeleton';
import { PromptData } from '@/types/game';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map: React.FC = () => {
  const { state, setActivePrompt, getRandomPrompt } = useGame();
  const [promptMarkers, setPromptMarkers] = useState<Array<{ prompt: PromptData; position: { x: number; y: number } }>>([]);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const { toast } = useToast();
  const { data: mapboxToken, isLoading: isLoadingToken, error: tokenError } = useMapboxToken();
  
  const { mapContainer, map, userLocation } = useMapInitialization(mapboxToken);
  
  const handleSelectPrompt = (prompt: PromptData) => {
    setActivePrompt(prompt);
    toast({
      title: "New Prompt!",
      description: `${prompt.text} - ${prompt.rarity.charAt(0).toUpperCase() + prompt.rarity.slice(1)}`,
      duration: 3000,
    });
  };
  
  const promptMapMarkers = useMapMarkers(map, userLocation, getRandomPrompt, handleSelectPrompt, mapboxToken);

  const handleScanArea = () => {
    if (!userLocation || !map.current) {
      toast({
        title: "Location Required",
        description: "Please allow location access to scan the area",
        variant: "destructive",
      });
      return;
    }
    
    const prompt = getRandomPrompt();
    
    const randomDistance = 0.003 + Math.random() * 0.002;
    const randomAngle = Math.random() * 2 * Math.PI;
    const lng = userLocation[0] + randomDistance * Math.cos(randomAngle);
    const lat = userLocation[1] + randomDistance * Math.sin(randomAngle);
    
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
    
    import('mapbox-gl').then(mapboxgl => {
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current!);
        
      promptMapMarkers.current.push(marker);
    });
    
    setPromptMarkers([
      ...promptMarkers, 
      {
        prompt,
        position: {
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60
        }
      }
    ]);
    
    toast({
      title: "Area Scanned",
      description: "New collection opportunity discovered!",
      duration: 3000,
    });
  };

  const handleOpenCamera = () => {
    if (state.activePrompt) {
      setShowCaptureModal(true);
    }
  };

  const handleCloseCamera = () => {
    setShowCaptureModal(false);
  };

  return (
    <div className="relative h-[calc(100vh-13rem)] overflow-hidden bg-[#f0f2f5] dark:bg-gray-900 rounded-lg border border-tech-light/30">
      {isLoadingToken && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <Skeleton className="w-32 h-8" />
        </div>
      )}
      
      {tokenError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Error Loading Map</h2>
            <p className="text-red-600">Could not load the map. Please try again later.</p>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} className="absolute inset-0" />
      
      <MapControls 
        activePrompt={state.activePrompt}
        onScanArea={handleScanArea}
        onOpenCamera={handleOpenCamera}
      />

      {showCaptureModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <CaptureImage onClose={handleCloseCamera} />
        </div>
      )}
    </div>
  );
};

export default Map;
