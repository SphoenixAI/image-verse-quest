
import React, { useState, useCallback, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useToast } from '@/hooks/use-toast';
import CaptureImage from './CaptureImage';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import MapControls from './map/MapControls';
import { Skeleton } from './ui/skeleton';
import { PromptData } from '@/types/game';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map: React.FC = () => {
  const { state, setActivePrompt, getRandomPrompt } = useGame();
  const [promptMarkers, setPromptMarkers] = useState<Array<{ prompt: PromptData; position: { x: number; y: number } }>>([]);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const { toast } = useToast();
  const { data: mapboxToken, isLoading: isLoadingToken, error: tokenError } = useMapboxToken();
  
  // Use refs to prevent unnecessary re-renders
  const scanRequestRef = useRef<number>(0);
  const { mapContainer, map, userLocation, getCurrentLocation } = useMapInitialization(mapboxToken);
  
  const handleSelectPrompt = useCallback((prompt: PromptData) => {
    setActivePrompt(prompt);
    toast({
      title: "New Prompt!",
      description: `${prompt.text} - ${prompt.rarity.charAt(0).toUpperCase() + prompt.rarity.slice(1)}`,
      duration: 3000,
    });
  }, [setActivePrompt, toast]);
  
  const { markers, addMarker } = useMapMarkers(map, userLocation, getRandomPrompt, handleSelectPrompt, mapboxToken);

  const handleScanArea = useCallback(() => {
    if (!userLocation || !map.current) {
      toast({
        title: "Location Required",
        description: "Please allow location access to scan the area",
        variant: "destructive",
      });
      return;
    }
    
    // Use ref to prevent multiple rapid scans
    const currentRequest = ++scanRequestRef.current;
    
    // Only proceed if this is still the most recent scan request
    setTimeout(() => {
      if (currentRequest !== scanRequestRef.current) return;
      
      const prompt = getRandomPrompt();
      
      const randomDistance = 0.003 + Math.random() * 0.002;
      const randomAngle = Math.random() * 2 * Math.PI;
      const lng = userLocation[0] + randomDistance * Math.cos(randomAngle);
      const lat = userLocation[1] + randomDistance * Math.sin(randomAngle);
      
      addMarker(lng, lat, prompt);
      
      setPromptMarkers(prev => [
        ...prev, 
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
    }, 300); // Add a small delay to prevent rapid consecutive scans
  }, [userLocation, map, addMarker, getRandomPrompt, toast]);

  const handleOpenCamera = useCallback(() => {
    if (state.activePrompt) {
      setShowCaptureModal(true);
    }
  }, [state.activePrompt]);

  const handleCloseCamera = useCallback(() => {
    setShowCaptureModal(false);
  }, []);
  
  const handleFindLocation = useCallback(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

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
        onFindLocation={handleFindLocation}
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
