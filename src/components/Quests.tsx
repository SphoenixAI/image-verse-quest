
import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { CheckCircle, Award, ChevronRight } from 'lucide-react';
import { ChipIcon } from './icons/ChipIcon';

const Quests: React.FC = () => {
  const { state } = useGame();
  const { quests } = state;
  
  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'collect':
        return <span className="text-blue-500">📷</span>;
      case 'vote':
        return <span className="text-green-500">🔍</span>;
      case 'assemble':
        return <span className="text-purple-500">🤖</span>;
      case 'walk':
        return <span className="text-amber-500">👣</span>;
      default:
        return <span className="text-gray-500">❓</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <h2 className="text-2xl font-bold mb-4 text-tech-primary">Daily Quests</h2>
      
      <div className="grid gap-4">
        {quests.map(quest => (
          <Card key={quest.id} className="overflow-hidden border border-tech-light/30">
            <CardHeader className="p-3 flex flex-row items-center justify-between bg-tech-light/20">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center mr-2 rounded-full bg-white">
                  {getQuestIcon(quest.type)}
                </div>
                <CardTitle className="text-base font-medium">{quest.title}</CardTitle>
              </div>
              
              {quest.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </CardHeader>
            
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{quest.description}</p>
              
              <div className="flex items-center justify-between mb-1 text-xs">
                <span>Progress: {quest.progress} / {quest.goal}</span>
                <span>{Math.round((quest.progress / quest.goal) * 100)}%</span>
              </div>
              
              <Progress 
                value={(quest.progress / quest.goal) * 100} 
                className="h-2"
              />
            </CardContent>
            
            <CardFooter className="p-3 flex justify-between items-center border-t border-tech-light/30">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-tech-light/30 px-2 py-1 rounded-full">
                  <Award className="w-4 h-4 text-tech-primary" />
                  <span className="text-sm font-medium">{quest.rewards.xp} XP</span>
                </div>
                
                <div className="flex items-center space-x-1 bg-tech-light/30 px-2 py-1 rounded-full">
                  <ChipIcon className="w-4 h-4 text-chips" />
                  <span className="text-sm font-medium">{quest.rewards.chips}</span>
                </div>
              </div>
              
              <Button
                variant={quest.completed ? "outline" : "default"}
                size="sm"
                disabled={!quest.completed}
              >
                {quest.completed ? "Claim Reward" : "In Progress"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Quests;
