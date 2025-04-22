
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, PromptData, ImageSubmission, RobotPart, AssembledRobot } from '../types/game';
import { INITIAL_GAME_STATE, MOCK_PROMPTS } from '../data/mockData';

type GameAction = 
  | { type: 'SET_ACTIVE_PROMPT'; payload: PromptData | null }
  | { type: 'ADD_IMAGE_SUBMISSION'; payload: ImageSubmission }
  | { type: 'VOTE_ON_IMAGE'; payload: { id: string; isAuthentic: boolean } }
  | { type: 'ADD_ROBOT_PART'; payload: RobotPart }
  | { type: 'ASSEMBLE_ROBOT'; payload: AssembledRobot }
  | { type: 'SET_CURRENT_ROBOT'; payload: string }
  | { type: 'UPDATE_QUEST_PROGRESS'; payload: { id: string; progress: number } }
  | { type: 'AWARD_XP'; payload: number }
  | { type: 'AWARD_CHIPS'; payload: number };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_ACTIVE_PROMPT':
      return { ...state, activePrompt: action.payload };
    
    case 'ADD_IMAGE_SUBMISSION':
      // Update quest progress if there's a collect quest
      const updatedQuestsAfterCollect = state.quests.map(quest => {
        if (quest.type === 'collect' && !quest.completed) {
          const newProgress = quest.progress + 1;
          return {
            ...quest,
            progress: newProgress,
            completed: newProgress >= quest.goal
          };
        }
        return quest;
      });
      
      return {
        ...state,
        inventory: {
          ...state.inventory,
          images: [...state.inventory.images, action.payload]
        },
        player: {
          ...state.player,
          xp: state.player.xp + action.payload.rewards.xp,
          chips: state.player.chips + action.payload.rewards.chips,
          stats: {
            ...state.player.stats,
            imagesCollected: state.player.stats.imagesCollected + 1,
            promptsCompleted: state.player.stats.promptsCompleted + 1
          }
        },
        quests: updatedQuestsAfterCollect,
        activePrompt: null // Reset active prompt after submission
      };
    
    case 'VOTE_ON_IMAGE':
      // Update quest progress if there's a vote quest
      const updatedQuestsAfterVote = state.quests.map(quest => {
        if (quest.type === 'vote' && !quest.completed) {
          const newProgress = quest.progress + 1;
          return {
            ...quest,
            progress: newProgress,
            completed: newProgress >= quest.goal
          };
        }
        return quest;
      });

      return {
        ...state,
        inventory: {
          ...state.inventory,
          images: state.inventory.images.map(img => 
            img.id === action.payload.id
              ? {
                  ...img,
                  voteCount: {
                    authentic: img.voteCount.authentic + (action.payload.isAuthentic ? 1 : 0),
                    fake: img.voteCount.fake + (action.payload.isAuthentic ? 0 : 1)
                  }
                }
              : img
          )
        },
        player: {
          ...state.player,
          stats: {
            ...state.player.stats,
            totalVotes: state.player.stats.totalVotes + 1
          }
        },
        quests: updatedQuestsAfterVote
      };
    
    case 'ADD_ROBOT_PART':
      return {
        ...state,
        inventory: {
          ...state.inventory,
          robotParts: [...state.inventory.robotParts, action.payload]
        }
      };
    
    case 'ASSEMBLE_ROBOT':
      return {
        ...state,
        inventory: {
          ...state.inventory,
          robots: [...state.inventory.robots, action.payload]
        },
        player: {
          ...state.player,
          currentRobot: action.payload,
          stats: {
            ...state.player.stats,
            robotsAssembled: state.player.stats.robotsAssembled + 1
          }
        }
      };
    
    case 'SET_CURRENT_ROBOT':
      const selectedRobot = state.inventory.robots.find(robot => robot.id === action.payload) || null;
      return {
        ...state,
        player: {
          ...state.player,
          currentRobot: selectedRobot
        }
      };
    
    case 'UPDATE_QUEST_PROGRESS':
      return {
        ...state,
        quests: state.quests.map(quest => 
          quest.id === action.payload.id
            ? {
                ...quest,
                progress: action.payload.progress,
                completed: action.payload.progress >= quest.goal
              }
            : quest
        )
      };
    
    case 'AWARD_XP':
      // Check if player should level up
      let newXp = state.player.xp + action.payload;
      let newLevel = state.player.level;
      let newXpToNextLevel = state.player.xpToNextLevel;
      
      if (newXp >= state.player.xpToNextLevel) {
        newLevel += 1;
        newXp -= state.player.xpToNextLevel;
        newXpToNextLevel = Math.floor(state.player.xpToNextLevel * 1.5);
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          xp: newXp,
          level: newLevel,
          xpToNextLevel: newXpToNextLevel
        }
      };
    
    case 'AWARD_CHIPS':
      return {
        ...state,
        player: {
          ...state.player,
          chips: state.player.chips + action.payload
        }
      };
    
    default:
      return state;
  }
};

interface GameContextProps {
  state: GameState;
  setActivePrompt: (prompt: PromptData | null) => void;
  addImageSubmission: (submission: ImageSubmission) => void;
  voteOnImage: (id: string, isAuthentic: boolean) => void;
  addRobotPart: (part: RobotPart) => void;
  assembleRobot: (robot: AssembledRobot) => void;
  setCurrentRobot: (id: string) => void;
  updateQuestProgress: (id: string, progress: number) => void;
  awardXp: (amount: number) => void;
  awardChips: (amount: number) => void;
  getRandomPrompt: () => PromptData;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);

  const setActivePrompt = (prompt: PromptData | null) => {
    dispatch({ type: 'SET_ACTIVE_PROMPT', payload: prompt });
  };

  const addImageSubmission = (submission: ImageSubmission) => {
    dispatch({ type: 'ADD_IMAGE_SUBMISSION', payload: submission });
  };

  const voteOnImage = (id: string, isAuthentic: boolean) => {
    dispatch({ type: 'VOTE_ON_IMAGE', payload: { id, isAuthentic } });
  };

  const addRobotPart = (part: RobotPart) => {
    dispatch({ type: 'ADD_ROBOT_PART', payload: part });
  };

  const assembleRobot = (robot: AssembledRobot) => {
    dispatch({ type: 'ASSEMBLE_ROBOT', payload: robot });
  };

  const setCurrentRobot = (id: string) => {
    dispatch({ type: 'SET_CURRENT_ROBOT', payload: id });
  };

  const updateQuestProgress = (id: string, progress: number) => {
    dispatch({ type: 'UPDATE_QUEST_PROGRESS', payload: { id, progress } });
  };

  const awardXp = (amount: number) => {
    dispatch({ type: 'AWARD_XP', payload: amount });
  };

  const awardChips = (amount: number) => {
    dispatch({ type: 'AWARD_CHIPS', payload: amount });
  };

  const getRandomPrompt = (): PromptData => {
    const randomIndex = Math.floor(Math.random() * MOCK_PROMPTS.length);
    return MOCK_PROMPTS[randomIndex];
  };

  return (
    <GameContext.Provider value={{
      state,
      setActivePrompt,
      addImageSubmission,
      voteOnImage,
      addRobotPart,
      assembleRobot,
      setCurrentRobot,
      updateQuestProgress,
      awardXp,
      awardChips,
      getRandomPrompt
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
