
import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Check, X, ThumbsUp, ThumbsDown, Star, Zap } from 'lucide-react';
import HolographicBorder from './ui/holographic-border';

const Collection: React.FC = () => {
  const { state, voteOnImage } = useGame();
  const { images } = state.inventory;

  return (
    <div className="container mx-auto px-4 py-4">
      <h2 className="text-2xl font-bold mb-4 text-tech-primary">Your Collection</h2>
      
      {images.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            No images collected yet. Explore the map to find prompts!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden border border-tech-light/30 shadow-md">
              <CardHeader className="p-3 bg-tech-light/20">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-medium">
                    {state.player.username}'s Submission
                  </CardTitle>
                  <div className="flex items-center space-x-1">
                    {image.isFirstTimeItem && (
                      <Badge className="bg-gradient-to-r from-cyan-300 via-purple-500 to-blue-500 text-white border-none flex items-center">
                        <Star className="w-3 h-3 mr-1" /> First Discovery
                      </Badge>
                    )}
                    <Badge 
                      variant="outline" 
                      className={
                        image.isVerified 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-amber-100 text-amber-800 border-amber-200"
                      }
                    >
                      {image.isVerified ? (
                        <><Check className="w-3 h-3 mr-1" /> Verified</>
                      ) : (
                        <>Pending Verification</>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-100 overflow-hidden flex items-center justify-center">
                  <HolographicBorder isActive={!!image.isFirstTimeItem} className="w-full h-full">
                    <img 
                      src={image.imageUrl} 
                      alt="Collected" 
                      className="w-full h-full object-cover"
                    />
                  </HolographicBorder>
                  
                  {image.analysis && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs backdrop-blur-sm">
                      <p className="font-semibold">AI Analysis:</p>
                      <p>Detected: {image.analysis.objects.map(obj => obj.name).join(', ')}</p>
                      {image.analysis.text.length > 0 && (
                        <p>Text: {image.analysis.text.join(', ')}</p>
                      )}
                      <p>Confidence: {Math.round(image.analysis.matchConfidence * 100)}%</p>
                    </div>
                  )}
                  
                  {image.isFirstTimeItem && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-gradient-to-r from-cyan-300 via-purple-500 to-blue-500 p-2 rounded-full shadow-lg">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col p-3 border-t border-tech-light/30">
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-sm font-medium">Vote on authenticity:</span>
                  <div className="flex space-x-2">
                    <span className="text-xs flex items-center">
                      <ThumbsUp className="w-3 h-3 mr-1 text-green-500" /> 
                      {image.voteCount.authentic}
                    </span>
                    <span className="text-xs flex items-center">
                      <ThumbsDown className="w-3 h-3 mr-1 text-red-500" /> 
                      {image.voteCount.fake}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                    onClick={() => voteOnImage(image.id, true)}
                  >
                    <Check className="w-4 h-4 mr-1" /> Real
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => voteOnImage(image.id, false)}
                  >
                    <X className="w-4 h-4 mr-1" /> Fake
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
