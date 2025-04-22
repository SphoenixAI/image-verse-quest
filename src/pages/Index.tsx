
import React, { useState } from 'react';
import { GameProvider } from '../context/GameContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Map from '../components/Map';
import Collection from '../components/Collection';
import Robot from '../components/Robot';
import Quests from '../components/Quests';
import Profile from '../components/Profile';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [activeTab, setActiveTab] = useState('map');

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return <Map />;
      case 'collection':
        return <Collection />;
      case 'robot':
        return <Robot />;
      case 'quests':
        return <Quests />;
      case 'profile':
        return <Profile />;
      default:
        return <Map />;
    }
  };

  return (
    <GameProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </GameProvider>
  );
};

export default Index;
