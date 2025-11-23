// Database operations for Player management

import { prisma } from '../prisma';
import { GAME_CONFIG, CROP_DATA } from '../constants';
import { getLevelFromXP } from '../game-logic';

/**
 * Create a new player with initial game state
 */
export async function createPlayer(name: string) {
  return await prisma.player.create({
    data: {
      name,
      energy: GAME_CONFIG.STARTING_ENERGY,
      maxEnergy: GAME_CONFIG.MAX_ENERGY,
      coins: GAME_CONFIG.STARTING_COINS,
      farmRows: 1,
      farmCols: 1,
      gameState: {
        create: {
          day: 1,
          season: 'SPRING',
          year: 1,
          timeOfDay: 'MORNING',
        },
      },
      inventory: {
        create: [
          { type: 'WHEAT_SEEDS', quantity: 5 },
          { type: 'WATER_CAN', quantity: 1 },
          { type: 'HOE', quantity: 1 },
          { type: 'FEED', quantity: 10 },
        ],
      },
    },
    include: {
      gameState: true,
      inventory: true,
    },
  });
}

/**
 * Get player by ID with all related data
 */
export async function getPlayer(playerId: string) {
  return await prisma.player.findUnique({
    where: { id: playerId },
    include: {
      crops: true,
      livestock: true,
      inventory: true,
      chores: {
        where: { completed: false },
        orderBy: { createdAt: 'desc' },
      },
      events: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      gameState: true,
    },
  });
}

/**
 * Get or create a player (useful for development/demo)
 */
export async function getOrCreatePlayer(name: string = 'Farmer') {
  // Try to find existing player
  const existing = await prisma.player.findFirst({
    where: { name },
    include: {
      crops: true,
      livestock: true,
      inventory: true,
      chores: {
        where: { completed: false },
        orderBy: { createdAt: 'desc' },
      },
      events: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      gameState: true,
    },
  });

  if (existing) return existing;

  // Create new player and fetch with all relations
  const newPlayer = await createPlayer(name);
  return await prisma.player.findUnique({
    where: { id: newPlayer.id },
    include: {
      crops: true,
      livestock: true,
      inventory: true,
      chores: {
        where: { completed: false },
        orderBy: { createdAt: 'desc' },
      },
      events: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      gameState: true,
    },
  });
}

/**
 * Update player energy
 */
export async function updatePlayerEnergy(playerId: string, energy: number) {
  return await prisma.player.update({
    where: { id: playerId },
    data: { energy },
  });
}

/**
 * Update player coins
 */
export async function updatePlayerCoins(playerId: string, coins: number) {
  return await prisma.player.update({
    where: { id: playerId },
    data: { coins },
  });
}

/**
 * Add XP to player and handle leveling
 */
export async function addPlayerXP(playerId: string, xp: number) {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (!player) throw new Error('Player not found');

  const newXP = player.xp + xp;

  // Use exponential leveling formula with max level cap
  const calculatedLevel = getLevelFromXP(newXP);
  const newLevel = Math.min(calculatedLevel, GAME_CONFIG.MAX_LEVEL);

  return await prisma.player.update({
    where: { id: playerId },
    data: {
      xp: newXP,
      level: newLevel,
    },
  });
}

/**
 * Update player stats (energy, coins, XP) in one transaction
 */
export async function updatePlayerStats(
  playerId: string,
  updates: {
    energy?: number;
    coins?: number;
    xp?: number;
  }
) {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (!player) throw new Error('Player not found');

  const newXP = updates.xp !== undefined ? player.xp + updates.xp : player.xp;

  // Use exponential leveling formula with max level cap
  const calculatedLevel = getLevelFromXP(newXP);
  const newLevel = Math.min(calculatedLevel, GAME_CONFIG.MAX_LEVEL);

  return await prisma.player.update({
    where: { id: playerId },
    data: {
      energy: updates.energy !== undefined ? updates.energy : undefined,
      coins: updates.coins !== undefined ? updates.coins : undefined,
      xp: newXP,
      level: newLevel,
    },
  });
}
