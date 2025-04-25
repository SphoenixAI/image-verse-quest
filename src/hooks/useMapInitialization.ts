
import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from '@/hooks/use-toast';

export const useMapInitialization = (mapboxToken: string | undefined) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const playerMarker = useRef<mapboxgl.Marker | null>(null);
  const isMapInitialized = useRef<boolean>(false);
  const locationWatchId = useRef<number | null>(null);
  const { toast } = useToast();

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Getting location...",
      description: "Please wait while we find your location",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
        
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 16,
            speed: 1.5
          });
          
          // Update player marker
          if (!playerMarker.current && map.current) {
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
          } else if (playerMarker.current) {
            playerMarker.current.setLngLat([longitude, latitude]);
          }
        }
        
        toast({
          title: "Location found",
          description: "Your current location has been found",
          variant: "default",
        });
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
        maximumAge: 30000,
        timeout: 10000
      }
    );
  }, [toast]);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || isMapInitialized.current) return;
    
    mapboxgl.accessToken = mapboxToken;
    isMapInitialized.current = true;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: userLocation || [-74.5, 40],
      zoom: 16,
      preserveDrawingBuffer: true, // Prevent constant redraws
    });

    const navControl = new mapboxgl.NavigationControl();
    map.current.addControl(navControl, 'top-right');
    
    return () => {
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
        locationWatchId.current = null;
      }
      
      map.current?.remove();
      map.current = null;
      isMapInitialized.current = false;
    };
  }, [mapboxToken, userLocation]);

  useEffect(() => {
    if (!mapboxToken || locationWatchId.current !== null) return;
    
    locationWatchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation((prev) => {
          // Only update if position has changed significantly
          if (prev && 
              Math.abs(prev[0] - longitude) < 0.00001 && 
              Math.abs(prev[1] - latitude) < 0.00001) {
            return prev;
          }
          return [longitude, latitude];
        });
        
        if (playerMarker.current && map.current) {
          playerMarker.current.setLngLat([longitude, latitude]);
        } else if (map.current && !playerMarker.current) {
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
          
          // Initialize to user's location
          map.current.setCenter([longitude, latitude]);
        }
      },
      (error) => {
        console.error('Error watching location:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
      }
    );
    
    return () => {
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
        locationWatchId.current = null;
      }
    };
  }, [mapboxToken, toast]);

  return { mapContainer, map, userLocation, getCurrentLocation };
};
