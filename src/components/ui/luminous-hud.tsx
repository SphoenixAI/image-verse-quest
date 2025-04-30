
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface LuminousHUDProps {
  isActive: boolean;
  analysisData?: any;
  className?: string;
  isProcessing?: boolean;
  onToggle?: () => void;
}

const LuminousHUD: React.FC<LuminousHUDProps> = ({ 
  isActive, 
  analysisData, 
  className,
  isProcessing = false,
  onToggle
}) => {
  const [scanLines, setScanLines] = useState<Array<number>>([]);
  
  // Generate scan lines on mount and when processing state changes
  useEffect(() => {
    if (isProcessing || isActive) {
      const lines = Array.from({ length: 12 }, (_, i) => i);
      setScanLines(lines);
    } else {
      setScanLines([]);
    }
  }, [isProcessing, isActive]);

  if (!isActive && !isProcessing) return null;

  // Format detection results for display
  const formatDetections = () => {
    if (!analysisData) return [];
    
    const results = [];
    
    // Add object detections
    if (analysisData.objects && analysisData.objects.length > 0) {
      results.push({
        type: 'OBJECTS',
        items: analysisData.objects.map((obj: any) => 
          `${obj.name} (${Math.round(obj.confidence * 100)}%)`
        )
      });
    }
    
    // Add text detections
    if (analysisData.text && analysisData.text.length > 0) {
      results.push({
        type: 'TEXT',
        items: analysisData.text
      });
    }
    
    // Add face detections
    if (analysisData.faces && analysisData.faces > 0) {
      results.push({
        type: 'FACES',
        items: [`Detected ${analysisData.faces} ${analysisData.faces === 1 ? 'face' : 'faces'}`]
      });
    }
    
    // Add animal detections
    if (analysisData.animals && analysisData.animals.length > 0) {
      results.push({
        type: 'ANIMALS',
        items: analysisData.animals.map((animal: any) => 
          `${animal.name} (${Math.round(animal.confidence * 100)}%)`
        )
      });
    }
    
    return results;
  };

  const detectionResults = formatDetections();

  return (
    <div 
      className={cn(
        "absolute inset-0 z-10 overflow-hidden",
        className,
        onToggle ? "cursor-pointer" : "pointer-events-none"
      )}
      onClick={onToggle}
    >
      {/* Scanning animation */}
      {isProcessing && (
        <div className="absolute inset-0 z-20 bg-black/10 backdrop-blur-[1px]">
          {/* Enhanced scan line animations */}
          <div className="absolute inset-0 overflow-hidden">
            {scanLines.map((_, index) => (
              <div 
                key={index} 
                className="absolute h-[2px] w-full bg-cyan-300 opacity-70 animate-scan-line"
                style={{ 
                  top: `${(index * 8) + 5}%`,
                  animationDelay: `${index * 120}ms`,
                  boxShadow: '0 0 15px #33C3F0, 0 0 25px rgba(51, 195, 240, 0.7)'
                }}
              />
            ))}
          </div>
          
          {/* Enhanced corner brackets with 3D effect */}
          <div className="absolute top-1 left-1 w-12 h-12 border-t-2 border-l-2 border-cyan-400 shadow-[inset_0px_0px_10px_rgba(51,195,240,0.6)] transform skew-x-2"></div>
          <div className="absolute top-1 right-1 w-12 h-12 border-t-2 border-r-2 border-cyan-400 shadow-[inset_0px_0px_10px_rgba(51,195,240,0.6)] transform -skew-x-2"></div>
          <div className="absolute bottom-1 left-1 w-12 h-12 border-b-2 border-l-2 border-cyan-400 shadow-[inset_0px_0px_10px_rgba(51,195,240,0.6)] transform -skew-x-2"></div>
          <div className="absolute bottom-1 right-1 w-12 h-12 border-b-2 border-r-2 border-cyan-400 shadow-[inset_0px_0px_10px_rgba(51,195,240,0.6)] transform skew-x-2"></div>
          
          {/* Oil drip effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/5 w-1 h-0 bg-gradient-to-b from-cyan-300/80 to-transparent animate-drip-slow rounded-b-full"></div>
            <div className="absolute top-0 left-2/5 w-1.5 h-0 bg-gradient-to-b from-purple-400/80 to-transparent animate-drip-medium rounded-b-full delay-300"></div>
            <div className="absolute top-0 left-3/5 w-1 h-0 bg-gradient-to-b from-blue-400/80 to-transparent animate-drip-fast rounded-b-full delay-600"></div>
            <div className="absolute top-0 left-4/5 w-1.5 h-0 bg-gradient-to-b from-cyan-300/80 to-transparent animate-drip-medium rounded-b-full delay-900"></div>
          </div>
          
          {/* Enhanced text display with shimmering effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 perspective-500">
            <div className="relative">
              <div className="text-cyan-300 text-xl font-mono animate-pulse font-bold tracking-wider flex items-center">
                <span className="mr-3 animate-pulse-gentle" style={{ animationDelay: '0.1s' }}>ANALYZING</span>
                <span className="animate-pulse-gentle" style={{ animationDelay: '0.3s' }}>•</span>
                <span className="animate-pulse-gentle" style={{ animationDelay: '0.5s' }}>•</span>
                <span className="animate-pulse-gentle" style={{ animationDelay: '0.7s' }}>•</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shine-slide"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Results display */}
      {isActive && !isProcessing && analysisData && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-20">
          {/* Holographic motion background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/10 via-purple-500/10 to-blue-500/10 animate-color-shift"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(51,195,240,0.2)_0%,transparent_70%)] animate-pulse-gentle"></div>
            
            {/* Additional oil drip effects for static display */}
            <div className="absolute top-0 right-1/6 w-1 h-0 bg-gradient-to-b from-cyan-300/40 to-transparent animate-drip-slow rounded-b-full"></div>
            <div className="absolute top-0 right-2/6 w-1.5 h-0 bg-gradient-to-b from-purple-400/40 to-transparent animate-drip-medium rounded-b-full delay-500"></div>
            <div className="absolute top-0 right-3/6 w-1 h-0 bg-gradient-to-b from-blue-400/40 to-transparent animate-drip-fast rounded-b-full delay-1000"></div>
          </div>
          
          {/* Results panel with enhanced styling */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-tech-primary/90 to-tech-primary/30 p-4 text-white font-mono overflow-auto max-h-[70%] shadow-[0_-10px_30px_rgba(155,135,245,0.3)]">
            <div className="mb-3 flex justify-between items-center border-b border-cyan-500/50 pb-2">
              <div className="text-cyan-300 font-bold text-lg tracking-wider">AI ANALYSIS RESULTS</div>
              <div className="text-cyan-300 text-sm bg-cyan-900/30 px-2 py-1 rounded-md backdrop-blur-sm">
                Match confidence: {Math.round(analysisData.matchConfidence * 100)}%
              </div>
            </div>
            
            {detectionResults.length > 0 ? (
              <div className="space-y-3">
                {detectionResults.map((category, idx) => (
                  <div key={idx} className="bg-tech-primary/20 backdrop-blur-sm rounded-md p-2">
                    <div className="text-cyan-200 font-bold border-b border-cyan-500/30 mb-2 pb-1 flex items-center">
                      <span className="bg-cyan-500/20 px-2 py-0.5 rounded mr-2">{category.type}</span>
                      <div className="h-[1px] flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                    </div>
                    <ul className="pl-2 space-y-1.5">
                      {category.items.map((item: string, i: number) => (
                        <li key={i} className="text-cyan-50 flex items-start">
                          <span className="mr-2 text-pink-400 text-lg leading-none">▸</span> 
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-cyan-100 bg-tech-primary/20 backdrop-blur-sm rounded-md p-3">No detections found.</div>
            )}
            
            <div className="mt-3 flex items-center justify-center">
              <div className="text-sm text-cyan-200 bg-tech-primary/40 px-3 py-1.5 rounded-full shadow-inner flex items-center">
                <span className="animate-pulse mr-2">●</span>
                Tap to dismiss
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuminousHUD;
