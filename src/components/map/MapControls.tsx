
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, Navigation } from 'lucide-react';
import { PromptData } from '@/types/game';

interface MapControlsProps {
  activePrompt: PromptData | null;
  onScanArea: () => void;
  onOpenCamera: () => void;
  onFindLocation: () => void;
}

const MapControls: React.FC<MapControlsProps> = memo(({ 
  activePrompt, 
  onScanArea, 
  onOpenCamera, 
  onFindLocation 
}) => {
  return (
    <>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
        <Button 
          className={`rounded-full w-16 h-16 ${activePrompt ? 'bg-tech-primary' : 'bg-gray-400'} hover:bg-tech-secondary transition-all duration-300 shadow-lg`}
          disabled={!activePrompt}
          onClick={onOpenCamera}
        >
          <Camera className="w-8 h-8 text-white" />
        </Button>
        {activePrompt && (
          <div className="mt-2 bg-white/90 dark:bg-tech-dark/90 px-3 py-1 rounded-full text-sm shadow-md">
            {activePrompt.text}
          </div>
        )}
      </div>
      
      <div className="absolute bottom-6 right-6 z-20 flex flex-col space-y-2">
        <Button 
          className="rounded-full bg-tech-accent hover:bg-tech-accent/80 shadow-md"
          onClick={onFindLocation}
        >
          <Navigation className="w-5 h-5 mr-1" />
          Find Me
        </Button>
        
        <Button 
          className="rounded-full bg-tech-accent hover:bg-tech-accent/80 shadow-md"
          onClick={onScanArea}
        >
          <MapPin className="w-5 h-5 mr-1" />
          Scan Area
        </Button>
      </div>
    </>
  );
});

MapControls.displayName = 'MapControls';

export default MapControls;
