
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Shuffle, Plus, Cog } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { AssembledRobot, RobotPart, RobotPartType } from '@/types/game';

const RobotPartCard: React.FC<{ part: RobotPart; isSelected: boolean; onSelect: () => void }> = ({ 
  part, 
  isSelected,
  onSelect
}) => {
  const rarityColors = {
    common: 'border-common bg-common/10',
    uncommon: 'border-tech-accent bg-tech-accent/10',
    rare: 'border-tech-primary bg-tech-primary/10',
    epic: 'border-rare bg-rare/10',
    legendary: 'border-chips bg-chips/10'
  };

  return (
    <div 
      className={`robot-part cursor-pointer ${rarityColors[part.rarity]} ${isSelected ? 'ring-2 ring-tech-primary' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-2">
        <div className="w-12 h-12 bg-tech-light rounded-md flex items-center justify-center">
          {/* Replace with actual robot part image */}
          <img src={part.imageUrl} alt={part.name} className="w-10 h-10 object-contain" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-sm">{part.name}</h4>
          <Badge variant="outline" className="text-xs capitalize">
            {part.rarity}
          </Badge>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-tech-light/30 grid grid-cols-3 gap-1 text-xs">
        {part.stats.power && (
          <div className="flex items-center">
            <span className="mr-1 font-bold">PWR:</span> {part.stats.power}
          </div>
        )}
        {part.stats.agility && (
          <div className="flex items-center">
            <span className="mr-1 font-bold">AGI:</span> {part.stats.agility}
          </div>
        )}
        {part.stats.intelligence && (
          <div className="flex items-center">
            <span className="mr-1 font-bold">INT:</span> {part.stats.intelligence}
          </div>
        )}
      </div>
    </div>
  );
};

const Robot: React.FC = () => {
  const { state, assembleRobot } = useGame();
  const { robotParts } = state.inventory;

  const [selectedParts, setSelectedParts] = useState<Record<RobotPartType, RobotPart | null>>({
    head: null,
    torso: null,
    arms: null,
    legs: null,
    accessory: null
  });

  const [activeTab, setActiveTab] = useState<RobotPartType>('head');

  const handlePartSelect = (part: RobotPart) => {
    setSelectedParts(prev => ({
      ...prev,
      [part.type]: part
    }));
  };

  const handleRandomAssembly = () => {
    const randomParts: Record<RobotPartType, RobotPart | null> = {
      head: null,
      torso: null,
      arms: null,
      legs: null,
      accessory: null
    };

    // Group parts by type
    const partsByType: Record<RobotPartType, RobotPart[]> = {
      head: [],
      torso: [],
      arms: [],
      legs: [],
      accessory: []
    };

    robotParts.forEach(part => {
      partsByType[part.type].push(part);
    });

    // Select random part for each type if available
    Object.keys(partsByType).forEach(type => {
      const partsOfType = partsByType[type as RobotPartType];
      if (partsOfType.length > 0) {
        const randomIndex = Math.floor(Math.random() * partsOfType.length);
        randomParts[type as RobotPartType] = partsOfType[randomIndex];
      }
    });

    setSelectedParts(randomParts);
  };

  const handleAssembleRobot = () => {
    // Calculate total stats
    const totalStats = {
      power: 0,
      agility: 0,
      intelligence: 0
    };

    Object.values(selectedParts).forEach(part => {
      if (part) {
        if (part.stats.power) totalStats.power += part.stats.power;
        if (part.stats.agility) totalStats.agility += part.stats.agility;
        if (part.stats.intelligence) totalStats.intelligence += part.stats.intelligence;
      }
    });

    const newRobot: AssembledRobot = {
      id: uuidv4(),
      name: `Robot ${state.inventory.robots.length + 1}`,
      parts: selectedParts,
      timestamp: new Date(),
      totalStats
    };

    assembleRobot(newRobot);

    // Reset selected parts
    setSelectedParts({
      head: null,
      torso: null,
      arms: null,
      legs: null,
      accessory: null
    });
  };

  const canAssemble = Object.values(selectedParts).some(part => part !== null);

  const filteredParts = robotParts.filter(part => part.type === activeTab);

  return (
    <div className="container mx-auto px-4 py-4">
      <h2 className="text-2xl font-bold mb-4 text-tech-primary">Robot Workshop</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Robot Preview */}
        <Card className="border border-tech-light/30 overflow-hidden">
          <CardHeader className="bg-tech-light/20 p-3">
            <CardTitle className="text-base font-medium">Robot Preview</CardTitle>
          </CardHeader>
          
          <CardContent className="p-4">
            <div className="aspect-square bg-tech-light/20 rounded-lg flex items-center justify-center overflow-hidden">
              {/* This would be a proper 3D or layered render in a real app */}
              <div className="relative w-3/4 h-3/4 flex flex-col items-center">
                {/* Head */}
                <div className="w-24 h-24 rounded-full bg-tech-light border-2 border-tech-secondary mb-2 flex items-center justify-center overflow-hidden">
                  {selectedParts.head ? (
                    <img src={selectedParts.head.imageUrl} alt="Head" className="w-full h-full object-cover" />
                  ) : (
                    <Plus className="w-8 h-8 text-tech-secondary opacity-50" />
                  )}
                </div>
                
                {/* Torso */}
                <div className="w-32 h-32 rounded-lg bg-tech-light border-2 border-tech-secondary mb-2 flex items-center justify-center overflow-hidden">
                  {selectedParts.torso ? (
                    <img src={selectedParts.torso.imageUrl} alt="Torso" className="w-full h-full object-cover" />
                  ) : (
                    <Plus className="w-8 h-8 text-tech-secondary opacity-50" />
                  )}
                  
                  {/* Arms */}
                  <div className="absolute left-0 w-8 h-24 rounded-lg bg-tech-light border-2 border-tech-secondary flex items-center justify-center overflow-hidden">
                    {selectedParts.arms ? (
                      <img src={selectedParts.arms.imageUrl} alt="Arms" className="w-full h-full object-cover" />
                    ) : (
                      <Plus className="w-4 h-4 text-tech-secondary opacity-50" />
                    )}
                  </div>
                  
                  <div className="absolute right-0 w-8 h-24 rounded-lg bg-tech-light border-2 border-tech-secondary flex items-center justify-center overflow-hidden">
                    {selectedParts.arms ? (
                      <img src={selectedParts.arms.imageUrl} alt="Arms" className="w-full h-full object-cover" />
                    ) : (
                      <Plus className="w-4 h-4 text-tech-secondary opacity-50" />
                    )}
                  </div>
                </div>
                
                {/* Legs */}
                <div className="flex space-x-2">
                  <div className="w-10 h-28 rounded-lg bg-tech-light border-2 border-tech-secondary flex items-center justify-center overflow-hidden">
                    {selectedParts.legs ? (
                      <img src={selectedParts.legs.imageUrl} alt="Legs" className="w-full h-full object-cover" />
                    ) : (
                      <Plus className="w-4 h-4 text-tech-secondary opacity-50" />
                    )}
                  </div>
                  
                  <div className="w-10 h-28 rounded-lg bg-tech-light border-2 border-tech-secondary flex items-center justify-center overflow-hidden">
                    {selectedParts.legs ? (
                      <img src={selectedParts.legs.imageUrl} alt="Legs" className="w-full h-full object-cover" />
                    ) : (
                      <Plus className="w-4 h-4 text-tech-secondary opacity-50" />
                    )}
                  </div>
                </div>
                
                {/* Accessory */}
                {selectedParts.accessory && (
                  <div className="absolute top-0 right-0 w-10 h-10 rounded-full bg-tech-primary flex items-center justify-center overflow-hidden">
                    <img src={selectedParts.accessory.imageUrl} alt="Accessory" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            
            {canAssemble && (
              <div className="mt-4 grid grid-cols-3 gap-2 bg-tech-light/20 p-2 rounded-lg">
                <div className="text-sm">
                  <span className="font-bold">PWR:</span> {Object.values(selectedParts).reduce((acc, part) => acc + (part?.stats.power || 0), 0)}
                </div>
                <div className="text-sm">
                  <span className="font-bold">AGI:</span> {Object.values(selectedParts).reduce((acc, part) => acc + (part?.stats.agility || 0), 0)}
                </div>
                <div className="text-sm">
                  <span className="font-bold">INT:</span> {Object.values(selectedParts).reduce((acc, part) => acc + (part?.stats.intelligence || 0), 0)}
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-3 border-t border-tech-light/30 flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1 border-tech-secondary text-tech-secondary hover:bg-tech-secondary/10"
              onClick={handleRandomAssembly}
            >
              <Shuffle className="w-4 h-4 mr-1" /> Random
            </Button>
            
            <Button 
              className="flex-1 bg-tech-primary hover:bg-tech-primary/90"
              disabled={!canAssemble}
              onClick={handleAssembleRobot}
            >
              <Cog className="w-4 h-4 mr-1" /> Assemble
            </Button>
          </CardFooter>
        </Card>
        
        {/* Parts Selection */}
        <Card className="border border-tech-light/30">
          <CardHeader className="p-0">
            <div className="flex border-b border-tech-light/30">
              {(['head', 'torso', 'arms', 'legs', 'accessory'] as RobotPartType[]).map(type => (
                <button
                  key={type}
                  className={`flex-1 py-2 text-sm font-medium capitalize ${activeTab === type ? 'bg-tech-light/20 text-tech-primary' : 'text-gray-500'}`}
                  onClick={() => setActiveTab(type)}
                >
                  {type}
                  <div className="collection-badge">
                    {robotParts.filter(part => part.type === type).length}
                  </div>
                </button>
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="p-4">
            {filteredParts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">
                  No {activeTab} parts collected yet. Explore and collect images to find robot parts!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2">
                {filteredParts.map(part => (
                  <RobotPartCard
                    key={part.id}
                    part={part}
                    isSelected={selectedParts[part.type]?.id === part.id}
                    onSelect={() => handlePartSelect(part)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Robot;
