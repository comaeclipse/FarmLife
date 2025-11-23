import { prisma } from '@/lib/prisma';

/**
 * Add a new horse for a player (name is required)
 */
export async function addHorse(playerId: string, name: string) {
  return await prisma.horse.create({
    data: {
      playerId,
      name,
      health: 100,
      happiness: 100,
      hunger: 100,
      grooming: 100,
      training: 0,
      bonding: 0,
    },
  });
}

/**
 * Feed a horse
 */
export async function feedHorse(horseId: string) {
  return await prisma.horse.update({
    where: { id: horseId },
    data: {
      fedToday: true,
      hunger: 100,
      happiness: { increment: 5 },
    },
  });
}

/**
 * Groom a horse
 */
export async function groomHorse(horseId: string) {
  return await prisma.horse.update({
    where: { id: horseId },
    data: {
      groomedToday: true,
      grooming: 100,
      happiness: { increment: 10 },
      bonding: { increment: 2 },
    },
  });
}

/**
 * Train a horse
 */
export async function trainHorse(horseId: string, trainingGain: number = 5) {
  const horse = await prisma.horse.findUnique({
    where: { id: horseId },
  });

  if (!horse) {
    throw new Error('Horse not found');
  }

  const newTraining = Math.min(100, horse.training + trainingGain);

  return await prisma.horse.update({
    where: { id: horseId },
    data: {
      trainedToday: true,
      training: newTraining,
      bonding: { increment: 3 },
    },
  });
}

/**
 * Ride/bond with a horse
 */
export async function rideHorse(horseId: string) {
  const horse = await prisma.horse.findUnique({
    where: { id: horseId },
  });

  if (!horse) {
    throw new Error('Horse not found');
  }

  const bondingGain = 5 + Math.floor(horse.training / 20); // Better trained horses bond faster
  const newBonding = Math.min(100, horse.bonding + bondingGain);

  return await prisma.horse.update({
    where: { id: horseId },
    data: {
      riddenToday: true,
      bonding: newBonding,
      happiness: { increment: 15 },
    },
  });
}

/**
 * Get all horses for a player
 */
export async function getPlayerHorses(playerId: string) {
  return await prisma.horse.findMany({
    where: { playerId },
    orderBy: { acquiredAt: 'asc' },
  });
}

/**
 * Reset daily status for all player horses
 */
export async function resetDailyHorseStatus(playerId: string) {
  return await prisma.horse.updateMany({
    where: { playerId },
    data: {
      fedToday: false,
      groomedToday: false,
      trainedToday: false,
      riddenToday: false,
    },
  });
}

/**
 * Update horse stats (for daily decay, etc.)
 */
export async function updateHorseStats(
  horseId: string,
  updates: {
    health?: number;
    happiness?: number;
    hunger?: number;
    grooming?: number;
    training?: number;
    bonding?: number;
  }
) {
  return await prisma.horse.update({
    where: { id: horseId },
    data: updates,
  });
}
