
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
      {/* Enhanced holographic dripping oil slick effect container */}
      <div className="absolute inset-0 z-0 rounded-lg overflow-hidden">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-purple-500 to-blue-500 animate-pulse-gentle" />
        
        {/* Beveled edge effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-70" style={{mixBlendMode: 'overlay'}} />
        <div className="absolute inset-0 bg-gradient-to-tl from-black/20 to-transparent" style={{mixBlendMode: 'multiply'}} />
        
        {/* Enhanced dripping effect elements with shadows */}
        <div className="absolute bottom-0 left-1/6 w-1 h-8 bg-gradient-to-b from-cyan-300 to-cyan-400/80 rounded-t-full animate-drip-slow shadow-lg shadow-cyan-300/30" />
        <div className="absolute bottom-0 left-2/6 w-1.5 h-10 bg-gradient-to-b from-blue-400 to-blue-500/80 rounded-t-full animate-drip-medium shadow-lg shadow-blue-400/30" />
        <div className="absolute bottom-0 left-3/6 w-1 h-6 bg-gradient-to-b from-purple-400 to-purple-500/80 rounded-t-full animate-drip-fast shadow-lg shadow-purple-400/30" />
        <div className="absolute bottom-0 left-4/6 w-1.5 h-9 bg-gradient-to-b from-cyan-300 to-cyan-400/80 rounded-t-full animate-drip-medium shadow-lg shadow-cyan-300/30" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-0 left-5/6 w-1 h-7 bg-gradient-to-b from-blue-400 to-blue-500/80 rounded-t-full animate-drip-slow shadow-lg shadow-blue-400/30" style={{animationDelay: '0.5s'}} />
        
        {/* Enhanced oil slick shine effects */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 animate-shine-slide" />
        </div>
        
        {/* Enhanced prismatic color shift */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-blue-500 to-purple-600 opacity-50 mix-blend-overlay animate-color-shift" />
        
        {/* Inner shadow */}
        <div className="absolute inset-0 shadow-inner shadow-black/20 rounded-lg" />
      </div>
      
      {/* Content container with slight padding to show the border */}
      <div className="relative z-10 m-1.5 bg-white dark:bg-tech-dark rounded-md overflow-hidden shadow-md">
        {children}
      </div>
    </div>
  );
};

export default HolographicBorder;
