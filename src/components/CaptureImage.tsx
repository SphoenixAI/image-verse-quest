
import React, { useState, useRef } from 'react';
import { Camera, Image, Check, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { useGame } from '@/context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import { useImageAnalysis } from '@/hooks/useImageAnalysis';
import { useSubmitImage } from '@/hooks/useSubmitImage';

interface CaptureImageProps {
  onClose: () => void;
}

const CaptureImage: React.FC<CaptureImageProps> = ({ onClose }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { state, addImageSubmission } = useGame();
  const imageAnalysis = useImageAnalysis();
  const submitImageMutation = useSubmitImage();
  
  if (!state.activePrompt) {
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCapture = () => {
    setCapturing(true);
    // In a real app, this would use the device camera
    // For now, just trigger file selection
    triggerFileInput();
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleSubmit = async () => {
    if (!capturedImage || !state.activePrompt) return;
    
    try {
      // First analyze the image
      const analysis = await imageAnalysis.mutateAsync({
        imageUrl: capturedImage,
        promptText: state.activePrompt.text,
      });

      // If image passed moderation, submit it
      if (analysis.isAppropriate) {
        // In a production app, first upload to storage, then get a URL
        const imageUrl = capturedImage; // For demo just using data URL
        
        // Submit to database
        await submitImageMutation.mutateAsync({
          promptId: state.activePrompt.id,
          imageUrl: imageUrl,
          analysis: analysis.analysis,
        });
        
        // Create local submission record for the game state
        const newSubmission = {
          id: uuidv4(),
          promptId: state.activePrompt.id,
          imageUrl: imageUrl,
          timestamp: new Date(),
          analysis: analysis.analysis,
          voteCount: {
            authentic: 0,
            fake: 0
          },
          rewards: {
            xp: state.activePrompt.rewards.xp,
            chips: state.activePrompt.rewards.chips,
            // Potentially add robot part based on chance
            robotPart: Math.random() < state.activePrompt.rewards.robotPartChance 
              ? state.inventory.robotParts[Math.floor(Math.random() * state.inventory.robotParts.length)]
              : undefined
          },
          isVerified: true,
          moderationStatus: "approved" as "approved" | "pending" | "rejected",
          moderationFlags: analysis.moderationFlags || {},
          moderationScore: analysis.moderationScore,
          isAppropriate: analysis.isAppropriate,
          isRelevant: analysis.isRelevant,
          isHighQuality: analysis.isHighQuality
        };
        
        // Add to game state
        addImageSubmission(newSubmission);
        
        toast({
          title: "Image Collected!",
          description: `You earned ${state.activePrompt.rewards.xp} XP and ${state.activePrompt.rewards.chips} AI Chips`,
        });
        
        onClose();
      } else {
        toast({
          title: "Image Rejected",
          description: "The image didn't pass our content moderation. Please try again.",
          variant: "destructive",
        });
        setCapturedImage(null);
      }
    } catch (error) {
      console.error("Error submitting image:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-tech-primary text-white">
        <CardTitle className="text-center">Capture Image</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-4 text-center">
          <p className="font-medium">{state.activePrompt.text}</p>
          <span className="text-xs bg-tech-light px-2 py-1 rounded-full">
            {state.activePrompt.rarity.charAt(0).toUpperCase() + state.activePrompt.rarity.slice(1)}
          </span>
        </div>
        
        <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4">
              <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">
                Tap the camera button below to take a photo
              </p>
            </div>
          )}
        </div>
        
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 border-t">
        {capturedImage ? (
          <>
            <Button 
              variant="outline" 
              onClick={handleRetake}
              className="flex items-center"
            >
              <X className="w-4 h-4 mr-1" /> Retake
            </Button>
            
            <Button 
              onClick={handleSubmit}
              className="bg-tech-primary text-white flex items-center"
              disabled={submitImageMutation.isPending || imageAnalysis.isPending}
            >
              {(submitImageMutation.isPending || imageAnalysis.isPending) ? (
                <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Processing</>
              ) : (
                <><Check className="w-4 h-4 mr-1" /> Submit</>
              )}
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleCapture}
              className="bg-tech-primary text-white flex items-center"
              disabled={capturing}
            >
              {capturing ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Camera className="w-4 h-4 mr-1" />
              )}
              Capture Image
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CaptureImage;
