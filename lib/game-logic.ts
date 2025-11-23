// Core game logic utilities

import { GAME_CONFIG, XP_REWARDS, ENERGY_COSTS } from './constants';

/**
 * Calculate XP required for a specific level
 */
export function getXPForLevel(level: number): number {
  return Math.floor(GAME_CONFIG.BASE_XP_FOR_LEVEL * Math.pow(GAME_CONFIG.XP_MULTIPLIER, level - 1));
}

/**
 * Calculate what level a player should be based on their total XP
 */
export function getLevelFromXP(xp: number): number {
  let level = 1;
  let totalXPNeeded = 0;

  while (totalXPNeeded + getXPForLevel(level) <= xp) {
    totalXPNeeded += getXPForLevel(level);
    level++;
  }

  return level;
}

/**
 * Get XP progress towards next level
 */
export function getXPProgress(currentXP: number, currentLevel: number): {
  current: number;
  needed: number;
  percentage: number;
} {
  let totalXPForCurrentLevel = 0;
  for (let i = 1; i < currentLevel; i++) {
    totalXPForCurrentLevel += getXPForLevel(i);
  }

  const xpIntoCurrentLevel = currentXP - totalXPForCurrentLevel;
  const xpNeededForNextLevel = getXPForLevel(currentLevel);

  return {
    current: xpIntoCurrentLevel,
    needed: xpNeededForNextLevel,
    percentage: Math.floor((xpIntoCurrentLevel / xpNeededForNextLevel) * 100),
  };
}

/**
 * Check if player has enough energy for an action
 */
export function canPerformAction(currentEnergy: number, action: keyof typeof ENERGY_COSTS): boolean {
  return currentEnergy >= ENERGY_COSTS[action];
}

/**
 * Calculate new energy after performing an action
 */
export function performAction(currentEnergy: number, action: keyof typeof ENERGY_COSTS): number {
  return Math.max(0, currentEnergy - ENERGY_COSTS[action]);
}

/**
 * Calculate crop growth stage based on days growing
 */
export function getCropGrowthStage(daysGrowing: number, totalGrowthDays: number): string {
  const progress = daysGrowing / totalGrowthDays;

  if (progress >= 1) return 'READY';
  if (progress >= 0.8) return 'MATURE';
  if (progress >= 0.5) return 'GROWING';
  if (progress >= 0.2) return 'SEEDLING';
  return 'PLANTED';
}

/**
 * Generate random event
 */
export function generateRandomEvent(): {
  type: string;
  title: string;
  description: string;
  effect: string | null;
} | null {
  const chance = Math.random();

  // 20% chance of an event
  if (chance > 0.2) return null;

  const events = [
    {
      type: 'WEATHER',
      title: 'Sunny Day',
      description: 'The sun is shining bright! Your crops are happy.',
      effect: 'CROP_GROWTH_BOOST',
    },
    {
      type: 'WEATHER',
      title: 'Light Rain',
      description: 'A gentle rain waters all your crops.',
      effect: 'AUTO_WATER',
    },
    {
      type: 'VISITOR',
      title: 'Traveling Merchant',
      description: 'A merchant passes by and offers you a good deal!',
      effect: 'SHOP_DISCOUNT',
    },
    {
      type: 'ANIMAL_EVENT',
      title: 'Happy Animals',
      description: 'Your animals are particularly happy today!',
      effect: 'HAPPINESS_BOOST',
    },
    {
      type: 'MARKET',
      title: 'Market Boom',
      description: 'Crop prices are up! Great time to sell.',
      effect: 'PRICE_INCREASE',
    },
    {
      type: 'SPECIAL',
      title: 'Lucky Day',
      description: 'You found some coins while working!',
      effect: 'BONUS_COINS',
    },
  ];

  return events[Math.floor(Math.random() * events.length)];
}

/**
 * Calculate time of day based on actions performed
 */
export function getTimeOfDay(actionsToday: number): 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT' {
  const actionsPerPeriod = GAME_CONFIG.ACTIONS_PER_TIME_PERIOD;

  if (actionsToday < actionsPerPeriod) return 'MORNING';
  if (actionsToday < actionsPerPeriod * 2) return 'AFTERNOON';
  if (actionsToday < actionsPerPeriod * 3) return 'EVENING';
  return 'NIGHT';
}

/**
 * Calculate season based on day of year
 */
export function getSeasonFromDay(day: number): 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER' {
  const dayOfYear = ((day - 1) % 112) + 1; // 112 days per year (28 days per season)

  if (dayOfYear <= 28) return 'SPRING';
  if (dayOfYear <= 56) return 'SUMMER';
  if (dayOfYear <= 84) return 'FALL';
  return 'WINTER';
}

/**
 * Check if it's a new day and update game state
 */
export function shouldAdvanceDay(lastPlayed: Date): boolean {
  const now = new Date();
  const lastPlayedDate = new Date(lastPlayed);

  // For testing: advance day if 1 minute has passed
  // In production, you might want this to be 24 hours
  const timeDiff = now.getTime() - lastPlayedDate.getTime();
  const minutesPassed = timeDiff / (1000 * 60);

  return minutesPassed >= 1; // Change to 1440 for 24-hour days
}
