// Database operations for Chore management

import { prisma } from '../prisma';
import { ChoreType } from '@prisma/client';

/**
 * Create a new chore
 */
export async function createChore(
  playerId: string,
  type: ChoreType,
  description: string,
  xpReward: number = 10,
  coinReward: number = 0
) {
  return await prisma.choreLog.create({
    data: {
      playerId,
      type,
      description,
      xpReward,
      coinReward,
    },
  });
}

/**
 * Complete a chore
 */
export async function completeChore(choreId: string) {
  return await prisma.choreLog.update({
    where: { id: choreId },
    data: {
      completed: true,
      completedAt: new Date(),
    },
  });
}

/**
 * Get pending chores for a player
 */
export async function getPendingChores(playerId: string) {
  return await prisma.choreLog.findMany({
    where: {
      playerId,
      completed: false,
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get completed chores for a player
 */
export async function getCompletedChores(playerId: string, limit: number = 20) {
  return await prisma.choreLog.findMany({
    where: {
      playerId,
      completed: true,
    },
    orderBy: { completedAt: 'desc' },
    take: limit,
  });
}

/**
 * Generate daily chores for a player
 */
export async function generateDailyChores(playerId: string) {
  const chores = [
    {
      type: 'WATER_CROPS' as ChoreType,
      description: 'Water all your crops',
      xpReward: 15,
      coinReward: 20,
    },
    {
      type: 'FEED_ANIMALS' as ChoreType,
      description: 'Feed all your animals',
      xpReward: 15,
      coinReward: 20,
    },
    {
      type: 'HARVEST_CROPS' as ChoreType,
      description: 'Harvest 3 ready crops',
      xpReward: 20,
      coinReward: 30,
    },
  ];

  // Create chores
  for (const chore of chores) {
    await createChore(
      playerId,
      chore.type,
      chore.description,
      chore.xpReward,
      chore.coinReward
    );
  }
}

/**
 * Clear old completed chores
 */
export async function clearOldChores(playerId: string) {
  // Delete completed chores older than 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  await prisma.choreLog.deleteMany({
    where: {
      playerId,
      completed: true,
      completedAt: {
        lt: sevenDaysAgo,
      },
    },
  });
}
