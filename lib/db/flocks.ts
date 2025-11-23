import { prisma } from '@/lib/prisma';
import { FlockType } from '@prisma/client';

/**
 * Create a new flock for a player
 */
export async function createFlock(
  playerId: string,
  type: FlockType,
  initialCount: number = 1,
  maxCount: number = 50
) {
  return await prisma.flock.create({
    data: {
      playerId,
      type,
      count: initialCount,
      maxCount,
      health: 100,
      happiness: 100,
      hunger: 100,
    },
  });
}

/**
 * Add animals to an existing flock
 */
export async function addToFlock(flockId: string, count: number) {
  const flock = await prisma.flock.findUnique({
    where: { id: flockId },
  });

  if (!flock) {
    throw new Error('Flock not found');
  }

  const newCount = Math.min(flock.count + count, flock.maxCount);

  return await prisma.flock.update({
    where: { id: flockId },
    data: { count: newCount },
  });
}

/**
 * Feed a flock (entire group at once)
 */
export async function feedFlock(flockId: string) {
  return await prisma.flock.update({
    where: { id: flockId },
    data: {
      fedToday: true,
      hunger: 100,
      happiness: { increment: 5 },
    },
  });
}

/**
 * Collect products from a flock
 */
export async function collectFlockProducts(flockId: string) {
  return await prisma.flock.update({
    where: { id: flockId },
    data: {
      productionReady: 0,
      producedToday: true,
    },
  });
}

/**
 * Get all flocks for a player
 */
export async function getPlayerFlocks(playerId: string) {
  return await prisma.flock.findMany({
    where: { playerId },
    orderBy: { acquiredAt: 'asc' },
  });
}

/**
 * Reset daily status for all player flocks
 */
export async function resetDailyFlockStatus(playerId: string) {
  return await prisma.flock.updateMany({
    where: { playerId },
    data: {
      fedToday: false,
      producedToday: false,
    },
  });
}

/**
 * Update flock stats
 */
export async function updateFlockStats(
  flockId: string,
  updates: {
    health?: number;
    happiness?: number;
    hunger?: number;
    productionReady?: number;
  }
) {
  return await prisma.flock.update({
    where: { id: flockId },
    data: updates,
  });
}

/**
 * Get a specific flock by type for a player (for adding to existing flock)
 */
export async function getPlayerFlockByType(playerId: string, type: FlockType) {
  const flocks = await prisma.flock.findMany({
    where: { playerId, type },
    orderBy: { acquiredAt: 'asc' },
  });

  // Find the first flock that isn't at max capacity
  return flocks.find((flock) => flock.count < flock.maxCount) || null;
}
