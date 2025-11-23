// Database operations for Crop management

import { prisma } from '../prisma';
import { CropType, GrowthStage } from '@prisma/client';

/**
 * Plant a crop at a specific location
 */
export async function plantCrop(
  playerId: string,
  type: CropType,
  plotX: number,
  plotY: number
) {
  return await prisma.crop.create({
    data: {
      playerId,
      type,
      plotX,
      plotY,
      stage: 'PLANTED',
      daysGrowing: 0,
      health: 100,
    },
  });
}

/**
 * Water a crop
 */
export async function waterCrop(cropId: string) {
  return await prisma.crop.update({
    where: { id: cropId },
    data: { wateredToday: true },
  });
}

/**
 * Water all crops for a player
 */
export async function waterAllCrops(playerId: string) {
  return await prisma.crop.updateMany({
    where: { playerId },
    data: { wateredToday: true },
  });
}

/**
 * Harvest a crop
 */
export async function harvestCrop(cropId: string) {
  return await prisma.crop.delete({
    where: { id: cropId },
  });
}

/**
 * Update crop growth (called during daily update)
 */
export async function updateCropGrowth(cropId: string, stage: GrowthStage, daysGrowing: number) {
  return await prisma.crop.update({
    where: { id: cropId },
    data: {
      stage,
      daysGrowing,
    },
  });
}

/**
 * Get all crops for a player
 */
export async function getPlayerCrops(playerId: string) {
  return await prisma.crop.findMany({
    where: { playerId },
    orderBy: [{ plotY: 'asc' }, { plotX: 'asc' }],
  });
}

/**
 * Check if a plot is occupied
 */
export async function isPlotOccupied(playerId: string, plotX: number, plotY: number) {
  const crop = await prisma.crop.findUnique({
    where: {
      playerId_plotX_plotY: {
        playerId,
        plotX,
        plotY,
      },
    },
  });

  return crop !== null;
}

/**
 * Reset all crops' watered status (for daily reset)
 */
export async function resetDailyWatering(playerId: string) {
  return await prisma.crop.updateMany({
    where: { playerId },
    data: { wateredToday: false },
  });
}
