
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from '@/hooks/use-toast';

export const useMapInitialization = (mapboxToken: string | undefined) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const playerMarker = useRef<mapboxgl.Marker | null>(null);
  const isMapInitialized = useRef<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || isMapInitialized.current) return;
    
    mapboxgl.accessToken = mapboxToken;
    isMapInitialized.current = true;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: userLocation || [-74.5, 40],
      zoom: 16
    });

    const navControl = new mapboxgl.NavigationControl();
    map.current.addControl(navControl, 'top-right');
    
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
      isMapInitialized.current = false;
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
  }, [mapboxToken, toast]);

  return { mapContainer, map, userLocation };
};
