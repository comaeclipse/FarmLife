export enum Breed {
  THOROUGHBRED = 'Thoroughbred',
  ARABIAN = 'Arabian',
  CLYDESDALE = 'Clydesdale',
  MUSTANG = 'Mustang',
  QUARTER_HORSE = 'Quarter Horse'
}

export enum HorseState {
  IDLE = 'Idle',
  TRAINING = 'Training',
  RESTING = 'Resting',
  SICK = 'Sick'
}

export interface Horse {
  id: string;
  name: string;
  isNamed: boolean; // True if the horse has been given a real name
  breed: Breed;
  age: number; // in months
  health: number; // 0-100
  hunger: number; // 0-100 (100 is starving)
  happiness: number; // 0-100
  experience: number; // Cumulative XP
  level: number; // Current Level (1-5)
  stamina: number; // 0-100 (daily energy)
  bio: string;
  value: number;
}

export interface TutorialProgress {
  boughtFeed: boolean;
  boughtHorse: boolean;
  fedHorse: boolean;
  cleanedStable: boolean;
}

export type CropType = 'hay' | 'corn' | 'cotton';

export type EquipmentId = 'tractor' | 'harvester' | 'trailer' | 'mower' | 'baler' | 'wagon' | 'picker' | 'milker' | 'heater';

export interface GameStats {
  totalMoneyEarned: number;
  totalCropsHarvested: number;
  totalAnimalsPurchased: number;
  maxHorsesOwned: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'EARLY' | 'MID' | 'LATE';
  condition: (state: GameState) => boolean;
}

export interface GameState {
  farmName: string;
  day: number;
  money: number;
  feed: number; // units of hay
  cleanliness: number; // 0-100 (stable cleanliness)
  infrastructure: number; // 0-100 (fence quality)

  // Crop System
  cropGrowth: number; // 0 = unplanted, 1-99 = growing, 100 = ready
  activeCrop: CropType | null;
  fieldWater: number; // 0-100 (Soil Moisture)
  fieldPests: boolean; // True if infested

  energy: number; // Player's daily action points
  maxEnergy: number;

  // Livestock (Groups)
  chickens: number;
  isFreeRange: boolean; // false = Caged, true = Free Range
  dairyCows: number;
  beefCows: number;
  beefPrice: number; // Current market sell price for a beef cow
  goats: number;
  pigs: number;
  pigPrice: number; // Current market sell price for a pig

  // Daily Chore Flags
  hasCollectedEggs: boolean;
  hasMilkedCows: boolean;
  hasMilkedGoats: boolean;
  hasCollectedManure: boolean;

  // Inventory
  eggs: number;
  milk: number;
  manure: number;
  equipment: EquipmentId[];

  // Progression
  unlockedAchievements: string[];
  stats: GameStats;

  horses: Horse[];
  logs: LogEntry[];
  news: string[]; // Ticker headlines
  gameStage: 'SETUP' | 'PLAYING' | 'GAMEOVER';
  weather: string;
  activeEvent?: FarmEvent;
}

export interface FarmEvent {
  title: string;
  description: string;
  options: EventOption[];
}

export interface EventOption {
  label: string;
  action: (state: GameState) => Partial<GameState>;
  logMessage: string;
}

export interface LogEntry {
  id: string;
  day: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger' | 'flavor';
}
