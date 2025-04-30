
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface LuminousHUDProps {
  isActive: boolean;
  analysisData?: any;
  className?: string;
  isProcessing?: boolean;
}

const LuminousHUD: React.FC<LuminousHUDProps> = ({ 
  isActive, 
  analysisData, 
  className,
  isProcessing = false
}) => {
  const [scanLines, setScanLines] = useState<Array<number>>([]);
  
  // Generate scan lines on mount and when processing state changes
  useEffect(() => {
    if (isProcessing || isActive) {
      const lines = Array.from({ length: 8 }, (_, i) => i);
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
    <div className={cn(
      "absolute inset-0 z-10 overflow-hidden pointer-events-none",
      className
    )}>
      {/* Scanning animation */}
      {isProcessing && (
        <div className="absolute inset-0 z-20">
          {/* Scan line animations */}
          <div className="absolute inset-0">
            {scanLines.map((_, index) => (
              <div 
                key={index} 
                className="absolute h-[2px] w-full bg-cyan-300 opacity-70 animate-scan-line"
                style={{ 
                  top: `${(index * 12) + 5}%`,
                  animationDelay: `${index * 120}ms`,
                  boxShadow: '0 0 10px #33C3F0, 0 0 20px #33C3F0'
                }}
              />
            ))}
          </div>
          
          {/* Corner brackets */}
          <div className="absolute top-1 left-1 w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-1 right-1 w-8 h-8 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-1 left-1 w-8 h-8 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-1 right-1 w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-cyan-300 text-lg font-mono animate-pulse">
              ANALYZING...
            </div>
          </div>
        </div>
      )}
      
      {/* Results display */}
      {isActive && !isProcessing && analysisData && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20">
          {/* Results panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-tech-primary/90 to-tech-primary/30 p-3 text-white font-mono text-xs overflow-auto max-h-[70%]">
            <div className="mb-2 flex justify-between items-center">
              <div className="text-cyan-300 font-bold">AI ANALYSIS RESULTS</div>
              <div className="text-cyan-300 text-xs">
                Match confidence: {Math.round(analysisData.matchConfidence * 100)}%
              </div>
            </div>
            
            {detectionResults.length > 0 ? (
              detectionResults.map((category, idx) => (
                <div key={idx} className="mb-2">
                  <div className="text-cyan-200 font-bold border-b border-cyan-500/30 mb-1">
                    {category.type}
                  </div>
                  <ul className="pl-2">
                    {category.items.map((item: string, i: number) => (
                      <li key={i} className="text-cyan-50 mb-0.5">
                        <span className="mr-1 text-pink-400">▸</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="text-cyan-100">No detections found.</div>
            )}
            
            <div className="mt-2 text-[10px] text-cyan-200 opacity-70">
              Tap to dismiss
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuminousHUD;
