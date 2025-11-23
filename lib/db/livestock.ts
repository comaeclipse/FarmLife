// Database operations for Livestock management

import { prisma } from '../prisma';
import { LivestockType } from '@prisma/client';

/**
 * Add a new animal to the farm
 */
export async function addLivestock(
  playerId: string,
  type: LivestockType,
  name?: string
) {
  return await prisma.livestock.create({
    data: {
      playerId,
      type,
      name,
      health: 100,
      happiness: 100,
      hunger: 100,
    },
  });
}

/**
 * Feed an animal
 */
export async function feedAnimal(livestockId: string) {
  return await prisma.livestock.update({
    where: { id: livestockId },
    data: {
      fedToday: true,
      hunger: 100,
      happiness: { increment: 5 },
    },
  });
}

/**
 * Feed all animals
 */
export async function feedAllAnimals(playerId: string) {
  return await prisma.livestock.updateMany({
    where: { playerId },
    data: {
      fedToday: true,
      hunger: 100,
    },
  });
}

/**
 * Pet an animal
 */
export async function petAnimal(livestockId: string) {
  return await prisma.livestock.update({
    where: { id: livestockId },
    data: {
      petToday: true,
      happiness: { increment: 10 },
    },
  });
}

/**
 * Collect product from an animal
 */
export async function collectProduct(livestockId: string) {
  return await prisma.livestock.update({
    where: { id: livestockId },
    data: {
      productionReady: false,
      producedToday: true,
    },
  });
}

/**
 * Get all livestock for a player
 */
export async function getPlayerLivestock(playerId: string) {
  return await prisma.livestock.findMany({
    where: { playerId },
    orderBy: { acquiredAt: 'asc' },
  });
}

/**
 * Reset daily animal status
 */
export async function resetDailyAnimalStatus(playerId: string) {
  return await prisma.livestock.updateMany({
    where: { playerId },
    data: {
      fedToday: false,
      petToday: false,
      producedToday: false,
    },
  });
}

/**
 * Update animal stats (for daily processing)
 */
export async function updateAnimalStats(livestockId: string, updates: {
  health?: number;
  happiness?: number;
  hunger?: number;
  productionReady?: boolean;
}) {
  return await prisma.livestock.update({
    where: { id: livestockId },
    data: updates,
  });
}
