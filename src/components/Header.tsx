
import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { ChipIcon } from './icons/ChipIcon';

const Header: React.FC = () => {
  const { state } = useGame();
  const { player } = state;

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-tech-dark/90 backdrop-blur-md border-b border-tech-light/30 shadow-sm">
      <div className="container mx-auto py-2 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 border-2 border-tech-primary">
            <AvatarImage src={player.currentRobot?.parts.head?.imageUrl || "/placeholder.svg"} alt="Profile" />
            <AvatarFallback className="bg-tech-primary text-white">
              {player.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{player.username}</span>
            <div className="flex items-center space-x-1">
              <span className="bg-tech-primary text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                {player.level}
              </span>
              <div className="flex-1 w-24">
                <Progress 
                  value={(player.xp / player.xpToNextLevel) * 100} 
                  className="h-2 bg-tech-light" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="flex items-center space-x-1 border-tech-primary text-tech-primary">
            <ChipIcon className="h-4 w-4" />
            <span className="font-bold">{player.chips}</span>
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center space-x-1">
            <span className="font-medium">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
