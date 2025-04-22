
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Camera, Search, MapPin } from 'lucide-react';
import { PromptData } from '../types/game';
import { useToast } from '@/hooks/use-toast';
import CaptureImage from './CaptureImage';

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
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 animate-pulse-gentle`} 
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

const Map: React.FC = () => {
  const { state, setActivePrompt, getRandomPrompt } = useGame();
  const [promptMarkers, setPromptMarkers] = useState<Array<{ prompt: PromptData; position: { x: number; y: number } }>>([]);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Generate random prompt markers
    const markers = [];
    for (let i = 0; i < 5; i++) {
      markers.push({
        prompt: getRandomPrompt(),
        position: {
          x: 20 + Math.random() * 60, // Keep within visible area
          y: 20 + Math.random() * 60
        }
      });
    }
    setPromptMarkers(markers);
  }, [getRandomPrompt]);

  const handleSelectPrompt = (prompt: PromptData) => {
    setActivePrompt(prompt);
    toast({
      title: "New Prompt!",
      description: `${prompt.text} - ${prompt.rarity.charAt(0).toUpperCase() + prompt.rarity.slice(1)}`,
      duration: 3000,
    });
  };

  const handleScanArea = () => {
    // Add a new random prompt
    const newPrompt = getRandomPrompt();
    setPromptMarkers([
      ...promptMarkers, 
      {
        prompt: newPrompt,
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
      {/* Map Background - we'd use a real map in a production app */}
      <div className="absolute inset-0 bg-tech-light/10 bg-opacity-50">
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
          {Array.from({ length: 36 }).map((_, index) => (
            <div key={index} className="border border-tech-light/20 dark:border-tech-dark/40" />
          ))}
        </div>
        
        {/* Player Location */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-tech-primary border-4 border-white flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 rounded-full bg-white" />
            </div>
            <div className="absolute -z-10 w-20 h-20 rounded-full bg-tech-primary opacity-20 animate-ping" style={{ left: '-4px', top: '-4px' }} />
          </div>
        </div>
        
        {/* Prompt Markers */}
        {promptMarkers.map((marker, index) => (
          <PromptMarker 
            key={index}
            prompt={marker.prompt}
            position={marker.position}
            onSelect={handleSelectPrompt}
          />
        ))}
      </div>
      
      {/* Camera Button */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
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
      
      {/* Scan Area Button */}
      <div className="absolute bottom-6 right-6">
        <Button 
          className="rounded-full bg-tech-accent hover:bg-tech-accent/80 shadow-md"
          onClick={handleScanArea}
        >
          <MapPin className="w-5 h-5 mr-1" />
          Scan Area
        </Button>
      </div>

      {/* Image Capture Modal */}
      {showCaptureModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <CaptureImage onClose={handleCloseCamera} />
        </div>
      )}
    </div>
  );
};

export default Map;
