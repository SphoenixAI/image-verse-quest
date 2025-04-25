
import React from 'react';
import { cn } from '@/lib/utils';

interface HolographicBorderProps {
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
}

const HolographicBorder: React.FC<HolographicBorderProps> = ({ 
  children, 
  isActive, 
  className 
}) => {
  if (!isActive) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      {/* Holographic dripping oil slick effect container */}
      <div className="absolute inset-0 z-0 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-purple-500 to-blue-500 animate-pulse-gentle" />
        
        {/* Dripping effect elements */}
        <div className="absolute bottom-0 left-1/4 w-1 h-8 bg-cyan-300 rounded-t-full animate-drip-slow" />
        <div className="absolute bottom-0 left-2/4 w-1.5 h-10 bg-blue-400 rounded-t-full animate-drip-medium" />
        <div className="absolute bottom-0 left-3/4 w-1 h-6 bg-purple-400 rounded-t-full animate-drip-fast" />
        
        {/* Oil slick shine effects */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 animate-shine-slide" />
        </div>
        
        {/* Prismatic color shift */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-blue-500 to-purple-600 opacity-40 mix-blend-overlay animate-color-shift" />
      </div>
      
      {/* Content container with slight padding to show the border */}
      <div className="relative z-10 m-1 bg-white dark:bg-tech-dark rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default HolographicBorder;
