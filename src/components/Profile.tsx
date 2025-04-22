
import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { ChipIcon } from './icons/ChipIcon';
import { Camera, Image, Star, Award, Check, ThumbsUp, Milestone, AlertTriangle } from 'lucide-react';
import { AssembledRobot } from '@/types/game';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  return (
    <div className={`border ${color} rounded-lg p-3 flex items-center space-x-3`}>
      <div className={`w-10 h-10 ${color} bg-opacity-20 rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
};

interface RobotDisplayProps {
  robot: AssembledRobot;
}

const RobotDisplay: React.FC<RobotDisplayProps> = ({ robot }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-32">
        {/* This would be a proper 3D or layered render in a real app */}
        {/* Head */}
        {robot.parts.head && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-tech-light border-2 border-tech-secondary overflow-hidden">
            <img src={robot.parts.head.imageUrl} alt="Head" className="w-full h-full object-cover" />
          </div>
        )}
        
        {/* Torso */}
        {robot.parts.torso && (
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-lg bg-tech-light border-2 border-tech-secondary overflow-hidden">
            <img src={robot.parts.torso.imageUrl} alt="Torso" className="w-full h-full object-cover" />
          </div>
        )}
        
        {/* Arms */}
        {robot.parts.arms && (
          <>
            <div className="absolute top-12 left-0 w-4 h-12 rounded-lg bg-tech-light border-2 border-tech-secondary overflow-hidden">
              <img src={robot.parts.arms.imageUrl} alt="Arms" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-12 right-0 w-4 h-12 rounded-lg bg-tech-light border-2 border-tech-secondary overflow-hidden">
              <img src={robot.parts.arms.imageUrl} alt="Arms" className="w-full h-full object-cover" />
            </div>
          </>
        )}
        
        {/* Legs */}
        {robot.parts.legs && (
          <>
            <div className="absolute bottom-0 left-1/3 w-5 h-14 rounded-lg bg-tech-light border-2 border-tech-secondary overflow-hidden">
              <img src={robot.parts.legs.imageUrl} alt="Legs" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-1/3 w-5 h-14 rounded-lg bg-tech-light border-2 border-tech-secondary overflow-hidden">
              <img src={robot.parts.legs.imageUrl} alt="Legs" className="w-full h-full object-cover" />
            </div>
          </>
        )}
        
        {/* Accessory */}
        {robot.parts.accessory && (
          <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-tech-primary overflow-hidden">
            <img src={robot.parts.accessory.imageUrl} alt="Accessory" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      
      <p className="text-sm font-medium mt-2">{robot.name}</p>
      
      <div className="mt-1 flex space-x-2 text-xs">
        <span className="bg-tech-light/30 px-1.5 py-0.5 rounded-full">PWR: {robot.totalStats.power}</span>
        <span className="bg-tech-light/30 px-1.5 py-0.5 rounded-full">AGI: {robot.totalStats.agility}</span>
        <span className="bg-tech-light/30 px-1.5 py-0.5 rounded-full">INT: {robot.totalStats.intelligence}</span>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const { state } = useGame();
  const { player, inventory } = state;
  
  return (
    <div className="container mx-auto px-4 py-4">
      <Card className="border border-tech-light/30 overflow-hidden mb-6">
        <CardHeader className="p-4 bg-gradient-to-r from-tech-primary to-tech-accent text-white">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src={player.currentRobot?.parts.head?.imageUrl || "/placeholder.svg"} alt="Profile" />
              <AvatarFallback className="bg-tech-secondary text-white text-lg">
                {player.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <CardTitle className="text-xl mb-1">{player.username}</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                  Level {player.level}
                </div>
                <div className="flex items-center space-x-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                  <ChipIcon className="w-3 h-3" />
                  <span>{player.chips}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>XP: {player.xp} / {player.xpToNextLevel}</span>
              <span>{Math.round((player.xp / player.xpToNextLevel) * 100)}%</span>
            </div>
            <Progress 
              value={(player.xp / player.xpToNextLevel) * 100} 
              className="h-2 bg-white/20" 
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Current Robot</h3>
          
          {player.currentRobot ? (
            <RobotDisplay robot={player.currentRobot} />
          ) : (
            <p className="text-center text-gray-500 text-sm py-4">
              No robot assembled yet. Visit the Robot Workshop to create one!
            </p>
          )}
        </CardContent>
      </Card>
      
      <h3 className="font-bold mb-3 text-tech-primary">Statistics</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard 
          icon={<Camera className="w-5 h-5 text-tech-primary" />}
          label="Images Collected"
          value={player.stats.imagesCollected}
          color="border-tech-primary"
        />
        
        <StatCard 
          icon={<Image className="w-5 h-5 text-tech-accent" />}
          label="Prompts Completed"
          value={player.stats.promptsCompleted}
          color="border-tech-accent"
        />
        
        <StatCard 
          icon={<Star className="w-5 h-5 text-amber-500" />}
          label="Robots Assembled"
          value={player.stats.robotsAssembled}
          color="border-amber-500"
        />
        
        <StatCard 
          icon={<Award className="w-5 h-5 text-emerald-500" />}
          label="Daily Quests"
          value={player.stats.dailyQuestsCompleted}
          color="border-emerald-500"
        />
      </div>
      
      <h3 className="font-bold mb-3 text-tech-primary">AI Contribution Stats</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <StatCard 
          icon={<ThumbsUp className="w-5 h-5 text-blue-500" />}
          label="Voting Accuracy"
          value={Math.round((player.stats.accurateVotes / player.stats.totalVotes) * 100) || 0}
          color="border-blue-500"
        />
        
        <StatCard 
          icon={<Check className="w-5 h-5 text-teal-500" />}
          label="Fakes Detected"
          value={player.stats.fakesDetected}
          color="border-teal-500"
        />
        
        <StatCard 
          icon={<Milestone className="w-5 h-5 text-indigo-500" />}
          label="Total Votes"
          value={player.stats.totalVotes}
          color="border-indigo-500"
        />
        
        <StatCard 
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          label="Strikes Received"
          value={player.stats.strikesReceived}
          color="border-red-500"
        />
      </div>
    </div>
  );
};

export default Profile;
