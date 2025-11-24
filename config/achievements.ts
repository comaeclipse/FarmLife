import type { Achievement, GameState } from '@/types/core';

export const ACHIEVEMENTS: Achievement[] = [
  // EARLY GAME
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Purchase your first Horse.',
    category: 'EARLY',
    condition: (s) => s.horses.length > 0
  },
  {
    id: 'poultry_farmer',
    title: 'Poultry Farmer',
    description: 'Own a flock of at least 10 Chickens.',
    category: 'EARLY',
    condition: (s) => s.chickens >= 10
  },
  {
    id: 'haymaker',
    title: 'Haymaker',
    description: 'Harvest your first Hay field.',
    category: 'EARLY',
    condition: (s) => s.stats.totalCropsHarvested > 0
  },

  // MID GAME
  {
    id: 'goatherd',
    title: 'Goatherd',
    description: 'Own 5 Goats.',
    category: 'MID',
    condition: (s) => s.goats >= 5
  },
  {
    id: 'pig_trader',
    title: 'Market Timing',
    description: 'Sell a Pig when the price is over $180.',
    category: 'MID',
    condition: (s) => s.pigPrice >= 180 // Triggered manually in logic usually, but state check works if timing aligns
  },
  {
    id: 'stable_master',
    title: 'Stable Master',
    description: 'Own 3 Horses.',
    category: 'MID',
    condition: (s) => s.horses.length >= 3
  },

  // LATE GAME
  {
    id: 'cattle_baron',
    title: 'Cattle Baron',
    description: 'Own 10 Beef Cattle.',
    category: 'LATE',
    condition: (s) => s.beefCows >= 10
  },
  {
    id: 'cotton_king',
    title: 'High Cotton',
    description: 'Own a Cotton Picker and harvest Cotton.',
    category: 'LATE',
    condition: (s) => s.equipment.includes('picker') && s.stats.totalMoneyEarned > 5000
  },
  {
    id: 'tycoon',
    title: 'Tycoon',
    description: 'Accumulate $10,000 in funds.',
    category: 'LATE',
    condition: (s) => s.money >= 10000
  }
];
