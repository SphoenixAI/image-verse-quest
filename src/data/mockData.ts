import { 
  PromptData, 
  ImageSubmission, 
  ComputerVisionAnalysis, 
  RobotPart, 
  AssembledRobot, 
  PlayerProfile, 
  DailyQuest, 
  GameState 
} from "../types/game";

// Mock prompts
export const MOCK_PROMPTS: PromptData[] = [
  {
    id: "prompt-001",
    text: "Take a photo of an energy drink",
    category: "product",
    difficulty: "easy",
    rarity: "common",
    rewards: {
      xp: 100,
      chips: 5,
      robotPartChance: 0.1
    },
    icon: "coffee"
  },
  {
    id: "prompt-002",
    text: "Capture a sunset",
    category: "nature",
    difficulty: "medium",
    rarity: "uncommon",
    rewards: {
      xp: 150,
      chips: 8,
      robotPartChance: 0.15
    },
    icon: "sun"
  },
  {
    id: "prompt-003",
    text: "Find and photograph a bicycle",
    category: "transportation",
    difficulty: "easy",
    rarity: "common",
    rewards: {
      xp: 100,
      chips: 5,
      robotPartChance: 0.1
    }
  },
  {
    id: "prompt-004",
    text: "Take a photo of a flowering plant",
    category: "nature",
    difficulty: "medium",
    rarity: "uncommon",
    rewards: {
      xp: 150,
      chips: 8,
      robotPartChance: 0.15
    }
  },
  {
    id: "prompt-005",
    text: "Capture an image of street art",
    category: "art",
    difficulty: "hard",
    rarity: "rare",
    rewards: {
      xp: 250,
      chips: 15,
      robotPartChance: 0.25
    }
  }
];

// Mock robot parts
export const MOCK_ROBOT_PARTS: RobotPart[] = [
  {
    id: "part-001",
    type: "head",
    name: "Quantum Processor",
    rarity: "rare",
    imageUrl: "/placeholder.svg",
    stats: {
      power: 10,
      intelligence: 30
    }
  },
  {
    id: "part-002",
    type: "torso",
    name: "Titanium Chassis",
    rarity: "uncommon",
    imageUrl: "/placeholder.svg",
    stats: {
      power: 20,
      agility: 5
    }
  },
  {
    id: "part-003",
    type: "arms",
    name: "Hydraulic Manipulators",
    rarity: "common",
    imageUrl: "/placeholder.svg",
    stats: {
      power: 15,
      agility: 10
    }
  },
  {
    id: "part-004",
    type: "legs",
    name: "Hoverthrusters",
    rarity: "epic",
    imageUrl: "/placeholder.svg",
    stats: {
      agility: 30,
      power: 5
    }
  },
  {
    id: "part-005",
    type: "accessory",
    name: "Energy Shield",
    rarity: "legendary",
    imageUrl: "/placeholder.svg",
    stats: {
      power: 25,
      intelligence: 15
    }
  }
];

// Mock assembled robot
export const MOCK_ASSEMBLED_ROBOT: AssembledRobot = {
  id: "robot-001",
  name: "Sentinel X1",
  parts: {
    head: MOCK_ROBOT_PARTS[0],
    torso: MOCK_ROBOT_PARTS[1],
    arms: MOCK_ROBOT_PARTS[2],
    legs: MOCK_ROBOT_PARTS[3],
    accessory: MOCK_ROBOT_PARTS[4]
  },
  timestamp: new Date(),
  totalStats: {
    power: 75,
    agility: 45,
    intelligence: 45
  }
};

// Mock player profile
export const MOCK_PLAYER_PROFILE: PlayerProfile = {
  id: "player-001",
  username: "TechExplorer",
  level: 5,
  xp: 750,
  xpToNextLevel: 1000,
  chips: 120,
  stats: {
    imagesCollected: 27,
    promptsCompleted: 15,
    robotsAssembled: 3,
    accurateVotes: 42,
    totalVotes: 50,
    dailyQuestsCompleted: 12,
    fakesDetected: 8,
    strikesReceived: 0
  },
  currentRobot: MOCK_ASSEMBLED_ROBOT
};

// Mock image analysis
const MOCK_ANALYSIS: ComputerVisionAnalysis = {
  objects: [
    {
      name: "bottle",
      confidence: 0.92,
      boundingBox: {
        x: 50,
        y: 30,
        width: 200,
        height: 300
      }
    },
    {
      name: "energy drink",
      confidence: 0.85
    }
  ],
  text: ["BOOST", "ENERGY", "200MG CAFFEINE"],
  faces: 0,
  animals: [],
  matchConfidence: 0.88
};

// Mock image submissions
export const MOCK_IMAGE_SUBMISSIONS: ImageSubmission[] = [
  {
    id: "img-001",
    promptId: "prompt-001",
    imageUrl: "/placeholder.svg",
    timestamp: new Date(),
    analysis: MOCK_ANALYSIS,
    voteCount: {
      authentic: 12,
      fake: 2
    },
    rewards: {
      xp: 100,
      chips: 5,
      robotPart: MOCK_ROBOT_PARTS[2]
    },
    isVerified: true,
    moderationStatus: "approved",
    moderationFlags: {},
    moderationScore: 0,
    isAppropriate: true,
    isRelevant: true,
    isHighQuality: true
  }
];

// Mock daily quests
export const MOCK_DAILY_QUESTS: DailyQuest[] = [
  {
    id: "quest-001",
    title: "Image Collector",
    description: "Collect 3 images of any type",
    type: "collect",
    goal: 3,
    progress: 1,
    rewards: {
      xp: 150,
      chips: 10,
      robotPartChance: 0.2
    },
    completed: false
  },
  {
    id: "quest-002",
    title: "Deepfake Detective",
    description: "Vote on 5 images for authenticity",
    type: "vote",
    goal: 5,
    progress: 3,
    rewards: {
      xp: 100,
      chips: 8,
      robotPartChance: 0.1
    },
    completed: false
  },
  {
    id: "quest-003",
    title: "Explorer",
    description: "Walk 1km while playing",
    type: "walk",
    goal: 1000,
    progress: 350,
    rewards: {
      xp: 200,
      chips: 15,
      robotPartChance: 0.3
    },
    completed: false
  }
];

// Mock initial game state
export const INITIAL_GAME_STATE: GameState = {
  player: MOCK_PLAYER_PROFILE,
  inventory: {
    images: MOCK_IMAGE_SUBMISSIONS,
    robotParts: MOCK_ROBOT_PARTS,
    robots: [MOCK_ASSEMBLED_ROBOT]
  },
  quests: MOCK_DAILY_QUESTS,
  activePrompt: null
};
