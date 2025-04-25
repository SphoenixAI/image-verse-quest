
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Camera, Search, MapPin } from 'lucide-react';
import { PromptData } from '../types/game';
import { useToast } from '@/hooks/use-toast';
import CaptureImage from './CaptureImage';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '@/hooks/useMapboxToken';

interface PromptMarkerProps {
  prompt: PromptData;
  position: { x: number; y: number };
  onSelect: (prompt: PromptData) => void;
}

const PromptMarker: React.FC<PromptMarkerProps> = ({ prompt, position, onSelect }) => {
  const rarityColors = {
    common: 'bg-common',
    uncommon: 'bg-tech-accent',
    rare: 'bg-tech-primary',
    epic: 'bg-rare',
    legendary: 'bg-chips'
  };

  return (
    <div 
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 animate-pulse-gentle z-10`} 
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onClick={() => onSelect(prompt)}
    >
      <div className="relative">
        <div className={`w-10 h-10 rounded-full ${rarityColors[prompt.rarity]} flex items-center justify-center shadow-lg border-2 border-white`}>
          {prompt.icon ? (
            <span className="text-white">{prompt.icon}</span>
          ) : (
            <Search className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
      </div>
    </div>
  );
};

const MapTokenInput = ({ onSubmit }: { onSubmit: (token: string) => void }) => {
  const [token, setToken] = useState('');

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Mapbox Token Required</h2>
        <p className="mb-4 text-sm">
          Please enter your Mapbox public token to enable the map functionality. You can get a token from 
          <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-tech-primary ml-1">
            Mapbox Dashboard
          </a>.
        </p>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="pk.eyJ1Ijoi..."
        />
        <Button 
          onClick={() => onSubmit(token)} 
          className="w-full bg-tech-primary"
          disabled={!token.trim().startsWith('pk.')}
        >
          Save Token
        </Button>
      </div>
    </div>
  );
};

const Map: React.FC = () => {
  const { state, setActivePrompt, getRandomPrompt } = useGame();
  const [promptMarkers, setPromptMarkers] = useState<Array<{ prompt: PromptData; position: { x: number; y: number } }>>([]);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();
  const { data: mapboxToken, isLoading: isLoadingToken, error: tokenError } = useMapboxToken();
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const playerMarker = useRef<mapboxgl.Marker | null>(null);
  const promptMapMarkers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: userLocation || [-74.5, 40],
      zoom: 16
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    
    map.current.addControl(geolocateControl);
    
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!mapboxToken) return;
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
        
        if (map.current && !playerMarker.current) {
          map.current.setCenter([longitude, latitude]);
        }
        
        if (userLocation && map.current) {
          if (!playerMarker.current) {
            const el = document.createElement('div');
            el.className = 'player-marker';
            el.innerHTML = `
              <div class="w-12 h-12 rounded-full bg-tech-primary border-4 border-white flex items-center justify-center shadow-lg">
                <div class="w-4 h-4 rounded-full bg-white"></div>
              </div>
              <div class="absolute -z-10 w-20 h-20 rounded-full bg-tech-primary opacity-20 animate-ping" style="left: -4px; top: -4px;"></div>
            `;
            
            playerMarker.current = new mapboxgl.Marker(el)
              .setLngLat([longitude, latitude])
              .addTo(map.current);
          } else {
            playerMarker.current.setLngLat([longitude, latitude]);
          }
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        toast({
          title: "Location Error",
          description: `Could not get your location: ${error.message}`,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );
    
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [mapboxToken, map.current]);

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
    
    setPromptMarkers(newPromptMarkers.map(({ prompt, position }) => ({ prompt, position })));
  }, [userLocation, getRandomPrompt, mapboxToken]);

  const handleSelectPrompt = (prompt: PromptData) => {
    setActivePrompt(prompt);
    toast({
      title: "New Prompt!",
      description: `${prompt.text} - ${prompt.rarity.charAt(0).toUpperCase() + prompt.rarity.slice(1)}`,
      duration: 3000,
    });
  };

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
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map.current!);
      
    promptMapMarkers.current.push(marker);
    
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
          <div className="text-white">Loading map...</div>
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
      
      {!mapboxToken && !isLoadingToken && (
        <div className="absolute inset-0 bg-tech-light/10 bg-opacity-50">
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
            {Array.from({ length: 36 }).map((_, index) => (
              <div key={index} className="border border-tech-light/20 dark:border-tech-dark/40" />
            ))}
          </div>
          
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-tech-primary border-4 border-white flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 rounded-full bg-white" />
              </div>
              <div className="absolute -z-10 w-20 h-20 rounded-full bg-tech-primary opacity-20 animate-ping" style={{ left: '-4px', top: '-4px' }} />
            </div>
          </div>
          
          {promptMarkers.map((marker, index) => (
            <PromptMarker 
              key={index}
              prompt={marker.prompt}
              position={marker.position}
              onSelect={handleSelectPrompt}
            />
          ))}
        </div>
      )}
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
        <Button 
          className={`rounded-full w-16 h-16 ${state.activePrompt ? 'bg-tech-primary' : 'bg-gray-400'} hover:bg-tech-secondary transition-all duration-300 shadow-lg`}
          disabled={!state.activePrompt}
          onClick={handleOpenCamera}
        >
          <Camera className="w-8 h-8 text-white" />
        </Button>
        {state.activePrompt && (
          <div className="mt-2 bg-white/90 dark:bg-tech-dark/90 px-3 py-1 rounded-full text-sm shadow-md">
            {state.activePrompt.text}
          </div>
        )}
      </div>
      
      <div className="absolute bottom-6 right-6 z-20">
        <Button 
          className="rounded-full bg-tech-accent hover:bg-tech-accent/80 shadow-md"
          onClick={handleScanArea}
        >
          <MapPin className="w-5 h-5 mr-1" />
          Scan Area
        </Button>
      </div>

      {showCaptureModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <CaptureImage onClose={handleCloseCamera} />
        </div>
      )}
    </div>
  );
};

export default Map;
