import type { GameState, TutorialProgress } from '@/types/core';

export const INITIAL_STATE: GameState = {
  farmName: '',
  day: 1,
  money: 1000,
  feed: 30,
  cleanliness: 100,
  infrastructure: 100,
  cropGrowth: 0,
  activeCrop: null,
  fieldWater: 50,
  fieldPests: false,
  energy: 100,
  maxEnergy: 100,
  horses: [],
  chickens: 0,
  isFreeRange: false,
  dairyCows: 0,
  beefCows: 0,
  beefPrice: 200, // Initial market price for beef cattle
  goats: 0,
  pigs: 0,
  pigPrice: 120, // Initial market price for pigs
  hasCollectedEggs: false,
  hasMilkedCows: false,
  hasMilkedGoats: false,
  hasCollectedManure: false,
  eggs: 0,
  milk: 0,
  manure: 0,
  equipment: [],

  unlockedAchievements: [],
  stats: {
    totalMoneyEarned: 0,
    totalCropsHarvested: 0,
    totalAnimalsPurchased: 0,
    maxHorsesOwned: 0
  },

  logs: [],
  news: [
    "Welcome to Equine Acres Market Watch",
    "Hay prices stable at $5/bale",
    "Local weather: Clear skies ahead"
  ],
  gameStage: 'SETUP',
  weather: 'Sunny',
};

export const INITIAL_TUTORIAL: TutorialProgress = {
  boughtFeed: false,
  boughtHorse: false,
  fedHorse: false,
  cleanedStable: false,
};
