
import React from 'react';
import { PromptData } from '@/types/game';
import { Search } from 'lucide-react';

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

export default PromptMarker;
