
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image, Check, X, Loader2, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { useGame } from '@/context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import { useImageAnalysis } from '@/hooks/useImageAnalysis';
import { useSubmitImage } from '@/hooks/useSubmitImage';
import HolographicBorder from './ui/holographic-border';
import { Dialog, DialogContent } from './ui/dialog';

interface CaptureImageProps {
  onClose: () => void;
}

const CaptureImage: React.FC<CaptureImageProps> = ({ onClose }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [usingCamera, setUsingCamera] = useState(false);
  const [isFirstTimeItem, setIsFirstTimeItem] = useState(false);
  const [detailedAnalysis, setDetailedAnalysis] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();
  const { state, addImageSubmission, addRobotPart } = useGame();
  const imageAnalysis = useImageAnalysis();
  const submitImageMutation = useSubmitImage();
  
  useEffect(() => {
    // Cleanup function to stop camera stream when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);
  
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
          setUsingCamera(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const startCamera = async () => {
    setUsingCamera(true);
    setCapturing(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCapturing(false);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions or try using file upload instead.",
        variant: "destructive",
      });
      setUsingCamera(false);
      setCapturing(false);
    }
  };

  const takePicture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const imageDataURL = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataURL);
      
      // Stop the camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const handleCapture = () => {
    // For devices with camera support, start camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      startCamera();
    } else {
      // Fallback to file selection
      toast({
        title: "Camera not available",
        description: "Your device doesn't support camera access. Using file upload instead.",
      });
      triggerFileInput();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setDetailedAnalysis(null);
    setIsFirstTimeItem(false);
    
    if (usingCamera) {
      startCamera();
    }
  };

  const checkIfFirstTimeItem = (analysis: any) => {
    // This would normally check against a database of previously registered items
    // For demo purposes, we'll randomly determine if it's a first-time item
    // In a real implementation, this would query the database for the specific detected objects

    // If we have detected objects with high confidence, use them for the check
    if (analysis.objects && analysis.objects.length > 0) {
      const highConfidenceObjects = analysis.objects.filter((obj: any) => obj.confidence > 0.8);
      
      // For demo purposes, let's say there's a 25% chance it's a first-time item
      return Math.random() < 0.25;
    }
    
    return false;
  };

  const handleSubmit = async () => {
    if (!capturedImage || !state.activePrompt) return;
    
    try {
      // First analyze the image
      const analysis = await imageAnalysis.mutateAsync({
        imageUrl: capturedImage,
        promptText: state.activePrompt.text,
      });

      // Store the detailed analysis for display
      setDetailedAnalysis(analysis);

      // Check if this is a first-time registered item
      const isFirstTime = checkIfFirstTimeItem(analysis.analysis);
      setIsFirstTimeItem(isFirstTime);

      // If image passed moderation, submit it
      if (analysis.isAppropriate) {
        // In a production app, first upload to storage, then get a URL
        const imageUrl = capturedImage;
        
        // Submit to database
        await submitImageMutation.mutateAsync({
          promptId: state.activePrompt.id,
          imageUrl: imageUrl,
          analysis: analysis.analysis,
        });
        
        // Calculate bonus chips for rare finds
        let bonusChips = 0;
        if (isFirstTime) {
          bonusChips = 50; // Bonus for first-time registered items
          
          // Award a special robot part
          const specialRobotPart = {
            id: uuidv4(),
            type: "accessory" as const,
            name: "Holographic Scanner",
            rarity: "legendary" as const,
            imageUrl: "/robot-parts/holographic-scanner.png", // Placeholder
            stats: {
              power: 15,
              intelligence: 25
            }
          };
          
          // Add the special part to player's inventory
          addRobotPart(specialRobotPart);
        }
        
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
            chips: state.activePrompt.rewards.chips + bonusChips,
            // Potentially add robot part based on chance
            robotPart: Math.random() < state.activePrompt.rewards.robotPartChance 
              ? state.inventory.robotParts[Math.floor(Math.random() * state.inventory.robotParts.length)]
              : undefined
          },
          isVerified: true,
          moderationStatus: "approved" as const,
          moderationFlags: analysis.moderationFlags || {},
          moderationScore: analysis.moderationScore,
          isAppropriate: analysis.isAppropriate,
          isRelevant: analysis.isRelevant,
          isHighQuality: analysis.isHighQuality,
          isFirstTimeItem: isFirstTime
        };
        
        // Add to game state
        addImageSubmission(newSubmission);
        
        // Show success dialog
        setShowSuccess(true);
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

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
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
          
          <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center relative">
            {usingCamera && !capturedImage ? (
              <>
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover"
                  autoPlay 
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />
              </>
            ) : capturedImage ? (
              <HolographicBorder isActive={isFirstTimeItem} className="w-full h-full">
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full h-full object-cover"
                />
              </HolographicBorder>
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
          {usingCamera && !capturedImage ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                  }
                  setUsingCamera(false);
                  onClose();
                }}
              >
                Cancel
              </Button>
              
              <Button 
                onClick={takePicture}
                className="bg-tech-primary text-white flex items-center"
              >
                <Camera className="w-4 h-4 mr-1" /> Take Photo
              </Button>
            </>
          ) : capturedImage ? (
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

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">Image Collected!</h3>
            
            {isFirstTimeItem && (
              <div className="mb-4 p-3 bg-gradient-to-r from-cyan-300 via-purple-500 to-blue-500 rounded-lg text-white">
                <Zap className="w-6 h-6 mx-auto mb-2" />
                <p className="font-bold">First Discovery Bonus!</p>
                <p className="text-sm">You're the first to register this item!</p>
                <p className="mt-2">
                  <span className="font-bold text-xl">+50</span> AI Chips
                </p>
                <p className="text-xs mt-1">Special Robot Part Added to Inventory</p>
              </div>
            )}
            
            <p className="mb-4">
              You earned {state.activePrompt.rewards.xp} XP and {state.activePrompt.rewards.chips + (isFirstTimeItem ? 50 : 0)} AI Chips
            </p>
            
            {detailedAnalysis && (
              <div className="text-left mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
                <h4 className="font-bold text-center mb-1">AI Analysis</h4>
                {detailedAnalysis.analysis.objects && detailedAnalysis.analysis.objects.length > 0 && (
                  <p><span className="font-semibold">Detected:</span> {detailedAnalysis.analysis.objects.map((obj: any) => `${obj.name} (${Math.round(obj.confidence * 100)}%)`).join(', ')}</p>
                )}
                {detailedAnalysis.analysis.text && detailedAnalysis.analysis.text.length > 0 && (
                  <p><span className="font-semibold">Text:</span> {detailedAnalysis.analysis.text.join(', ')}</p>
                )}
                <p><span className="font-semibold">Match confidence:</span> {Math.round(detailedAnalysis.analysis.matchConfidence * 100)}%</p>
              </div>
            )}
            
            <Button 
              className="mt-4 w-full bg-tech-primary" 
              onClick={handleCloseSuccess}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CaptureImage;
