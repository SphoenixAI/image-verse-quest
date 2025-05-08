import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Check, X, ThumbsUp, ThumbsDown, Star, Zap } from 'lucide-react';
import HolographicBorder from './ui/holographic-border';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useImageVoting } from '@/hooks/useImageVoting';
import { useQueryClient } from '@tanstack/react-query';

const Collection: React.FC = () => {
  const { state } = useGame();
  const { toast } = useToast();
  const { images } = state.inventory;
  const queryClient = useQueryClient();

  const handleVote = async (imageId: string, isAuthentic: boolean) => {
    // This component now uses the useImageVoting hook internally
    // for actual vote submission
    try {
      // We'll update the UI optimistically
      voteOnImage(imageId, isAuthentic);
      
      // Show success toast
      sonnerToast.success(
        isAuthentic ? "Voted as authentic" : "Voted as fake", 
        { description: "Thank you for contributing to AI training!" }
      );

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["hasVoted", state.player.id, imageId] });
    } catch (error) {
      toast({
        title: "Voting Failed",
        description: error instanceof Error ? error.message : "Failed to submit your vote",
        variant: "destructive",
      });
    }
  };
  
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
            <ImageCard 
              key={image.id} 
              image={image} 
              onVote={handleVote} 
              playerUserId={state.player.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Extract ImageCard to a separate component
const ImageCard = ({ image, onVote, playerUserId }) => {
  // Use the new hook for voting
  const { hasVoted, isLoading } = useImageVoting(image.id);
  
  return (
    <Card key={image.id} className="overflow-hidden border border-tech-light/30 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-3 bg-tech-light/20">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">
            {state.player.username}'s Submission
          </CardTitle>
          <div className="flex items-center space-x-1">
            {image.isFirstTimeItem && (
              <Badge className="bg-gradient-to-r from-cyan-300 via-purple-500 to-blue-500 text-white border-none flex items-center shadow-md">
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
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-3 py-4 text-xs backdrop-blur-sm">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-semibold text-cyan-300">AI Analysis:</p>
                <span className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded text-[10px]">
                  {Math.round(image.analysis.matchConfidence * 100)}% match
                </span>
              </div>
              
              {image.analysis.objects && image.analysis.objects.length > 0 && (
                <p className="mb-0.5"><span className="text-cyan-200">Detected:</span> {image.analysis.objects.slice(0, 3).map(obj => obj.name).join(', ')}{image.analysis.objects.length > 3 ? '...' : ''}</p>
              )}
              
              {image.analysis.text && image.analysis.text.length > 0 && (
                <p className="mb-0.5"><span className="text-cyan-200">Text:</span> {image.analysis.text.slice(0, 2).join(', ')}{image.analysis.text.length > 2 ? '...' : ''}</p>
              )}
              
              {image.analysis.faces > 0 && (
                <p className="mb-0.5"><span className="text-cyan-200">Faces:</span> {image.analysis.faces} detected</p>
              )}
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
          <div className="flex space-x-3">
            <span className="text-xs flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full">
              <ThumbsUp className="w-3 h-3 mr-1 text-green-600" /> 
              {image.voteCount.authentic}
            </span>
            <span className="text-xs flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full">
              <ThumbsDown className="w-3 h-3 mr-1 text-red-600" /> 
              {image.voteCount.fake}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex-1 ${
              hasVoted || isLoading
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "border-green-500 text-green-600 hover:bg-green-50"
            }`}
            onClick={() => onVote(image.id, true)}
            disabled={hasVoted || isLoading}
          >
            <Check className="w-4 h-4 mr-1" /> Real
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex-1 ${
              hasVoted || isLoading
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "border-red-500 text-red-600 hover:bg-red-50"
            }`}
            onClick={() => onVote(image.id, false)}
            disabled={hasVoted || isLoading}
          >
            <X className="w-4 h-4 mr-1" /> Fake
          </Button>
        </div>
        
        {hasVoted && (
          <div className="mt-2 text-xs text-center text-gray-500">
            You've already voted on this image
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Collection;
