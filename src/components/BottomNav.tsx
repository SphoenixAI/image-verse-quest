
import React from 'react';
import { 
  Search, 
  Image, 
  User, 
  Box, 
  LayoutList
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'map', label: 'Map', icon: Search },
    { id: 'collection', label: 'Collection', icon: Image },
    { id: 'robot', label: 'Robot', icon: Box },
    { id: 'quests', label: 'Quests', icon: LayoutList },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="sticky bottom-0 z-50 bg-white dark:bg-tech-dark border-t border-tech-light/30 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                className={cn(
                  "flex flex-col items-center py-2 px-5 transition-colors relative",
                  isActive ? "text-tech-primary" : "text-gray-500 dark:text-gray-400"
                )}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className={cn(
                  "w-6 h-6 mb-1",
                  isActive ? "text-tech-primary" : "text-gray-500 dark:text-gray-400"
                )} />
                
                <span className="text-xs font-medium">{tab.label}</span>
                
                {isActive && (
                  <div className="absolute -bottom-0 left-0 w-full h-0.5 bg-tech-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
