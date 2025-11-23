// Game configuration constants

export const GAME_CONFIG = {
  // Energy system
  MAX_ENERGY: 100,
  ENERGY_REGEN_PER_DAY: 100,

  // XP and leveling
  BASE_XP_FOR_LEVEL: 100,
  XP_MULTIPLIER: 1.5,
  MAX_LEVEL: 20,

  // Starting resources
  STARTING_COINS: 500,
  STARTING_ENERGY: 100,

  // Farm dimensions
  FARM_ROWS: 5,
  FARM_COLS: 6,

  // Time system
  ACTIONS_PER_TIME_PERIOD: 10,
} as const;

// Energy costs for actions
export const ENERGY_COSTS = {
  PLANT_CROP: 5,
  WATER_CROP: 3,
  HARVEST_CROP: 5,
  FEED_ANIMAL: 4,
  PET_ANIMAL: 2,
  COLLECT_PRODUCT: 3,
  CLEAR_WEEDS: 10,
  REPAIR_FENCE: 15,
} as const;

// XP rewards
export const XP_REWARDS = {
  PLANT_CROP: 5,
  HARVEST_CROP: 10,
  WATER_ALL_CROPS: 20,
  FEED_ALL_ANIMALS: 15,
  COMPLETE_CHORE: 10,
  COLLECT_PRODUCT: 8,
} as const;

// Crop data
export const CROP_DATA = {
  WHEAT: {
    name: 'Wheat',
    seedCost: 10,
    sellPrice: 25,
    growthDays: 3,
    emoji: '🌾',
  },
  CORN: {
    name: 'Corn',
    seedCost: 15,
    sellPrice: 35,
    growthDays: 4,
    emoji: '🌽',
  },
  TOMATO: {
    name: 'Tomato',
    seedCost: 20,
    sellPrice: 45,
    growthDays: 5,
    emoji: '🍅',
  },
  CARROT: {
    name: 'Carrot',
    seedCost: 12,
    sellPrice: 28,
    growthDays: 3,
    emoji: '🥕',
  },
  POTATO: {
    name: 'Potato',
    seedCost: 18,
    sellPrice: 40,
    growthDays: 4,
    emoji: '🥔',
  },
  STRAWBERRY: {
    name: 'Strawberry',
    seedCost: 25,
    sellPrice: 60,
    growthDays: 5,
    emoji: '🍓',
  },
  PUMPKIN: {
    name: 'Pumpkin',
    seedCost: 30,
    sellPrice: 70,
    growthDays: 6,
    emoji: '🎃',
  },
  LETTUCE: {
    name: 'Lettuce',
    seedCost: 8,
    sellPrice: 20,
    growthDays: 2,
    emoji: '🥬',
  },
} as const;

// Livestock data
export const LIVESTOCK_DATA = {
  CHICKEN: {
    name: 'Chicken',
    cost: 100,
    product: 'EGG',
    productValue: 15,
    productionDays: 1,
    emoji: '🐔',
  },
  COW: {
    name: 'Cow',
    cost: 500,
    product: 'MILK',
    productValue: 50,
    productionDays: 2,
    emoji: '🐄',
  },
  SHEEP: {
    name: 'Sheep',
    cost: 300,
    product: 'WOOL',
    productValue: 40,
    productionDays: 3,
    emoji: '🐑',
  },
  PIG: {
    name: 'Pig',
    cost: 400,
    product: 'MEAT',
    productValue: 80,
    productionDays: 5,
    emoji: '🐷',
  },
  GOAT: {
    name: 'Goat',
    cost: 250,
    product: 'MILK',
    productValue: 35,
    productionDays: 2,
    emoji: '🐐',
  },
} as const;

// Season effects (for future expansion)
export const SEASON_EFFECTS = {
  SPRING: {
    cropGrowthBonus: 1.1,
    description: 'Crops grow 10% faster',
  },
  SUMMER: {
    cropGrowthBonus: 1.0,
    description: 'Normal growing season',
  },
  FALL: {
    cropGrowthBonus: 1.05,
    description: 'Harvest season, crops grow 5% faster',
  },
  WINTER: {
    cropGrowthBonus: 0.5,
    description: 'Harsh winter, crops grow 50% slower',
  },
} as const;

// Farm expansion tiers
export const FARM_EXPANSION_TIERS = [
  { level: 1, rows: 1, cols: 1, coinCost: 0, energyCost: 0 },       // Starting size
  { level: 2, rows: 2, cols: 2, coinCost: 100, energyCost: 10 },   // 4 plots
  { level: 4, rows: 3, cols: 3, coinCost: 100, energyCost: 10 },   // 9 plots
  { level: 7, rows: 4, cols: 4, coinCost: 200, energyCost: 20 },   // 16 plots
  { level: 11, rows: 5, cols: 5, coinCost: 200, energyCost: 20 },  // 25 plots
  { level: 16, rows: 5, cols: 6, coinCost: 400, energyCost: 40 },  // 30 plots (max)
] as const;
