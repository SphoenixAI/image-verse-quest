
// Game Types

export interface PromptData {
  id: string;
  text: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  rewards: {
    xp: number;
    chips: number;
    robotPartChance: number;
  };
  icon?: string;
}

export interface ImageSubmission {
  id: string;
  promptId: string;
  imageUrl: string;
  timestamp: Date;
  // Moderation fields
  moderationStatus: "pending" | "approved" | "rejected";
  moderationFlags?: Record<string, any>;
  moderationScore?: number;
  isAppropriate?: boolean | null;
  isRelevant?: boolean | null;
  isHighQuality?: boolean | null;
  analysis: ComputerVisionAnalysis | null;
  voteCount: {
    authentic: number;
    fake: number;
  };
  rewards: {
    xp: number;
    chips: number;
    robotPart?: RobotPart;
  };
  isVerified: boolean;
  isFirstTimeItem?: boolean;
}

export interface ComputerVisionAnalysis {
  objects: {
    name: string;
    confidence: number;
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }[];
  text: string[];
  faces: number;
  animals: {
    name: string;
    confidence: number;
  }[];
  matchConfidence: number;
}

export type RobotPartType = "head" | "torso" | "arms" | "legs" | "accessory";

export interface RobotPart {
  id: string;
  type: RobotPartType;
  name: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  imageUrl: string;
  stats: {
    power?: number;
    agility?: number;
    intelligence?: number;
  };
}

export interface AssembledRobot {
  id: string;
  name: string;
  parts: {
    head?: RobotPart;
    torso?: RobotPart;
    arms?: RobotPart;
    legs?: RobotPart;
    accessory?: RobotPart;
  };
  timestamp: Date;
  totalStats: {
    power: number;
    agility: number;
    intelligence: number;
  };
}

export interface PlayerProfile {
  id: string;
  username: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  chips: number;
  stats: {
    imagesCollected: number;
    promptsCompleted: number;
    robotsAssembled: number;
    accurateVotes: number;
    totalVotes: number;
    dailyQuestsCompleted: number;
    fakesDetected: number;
    strikesReceived: number;
    firstDiscoveries: number;
  };
  currentRobot: AssembledRobot | null;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  type: "collect" | "vote" | "assemble" | "walk";
  goal: number;
  progress: number;
  rewards: {
    xp: number;
    chips: number;
    robotPartChance: number;
  };
  completed: boolean;
}

export interface GameState {
  player: PlayerProfile;
  inventory: {
    images: ImageSubmission[];
    robotParts: RobotPart[];
    robots: AssembledRobot[];
  };
  quests: DailyQuest[];
  activePrompt: PromptData | null;
}

// Moderation log type (optional, added for completeness)
export interface ModerationLog {
  id: string;
  imageId: string;
  reviewerId: string;
  decision: string;
  reason?: string;
  timestamp: Date;
}
