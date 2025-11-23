'use server';

import { revalidatePath } from 'next/cache';
import { CropType } from '@prisma/client';
import * as cropDb from '@/lib/db/crops';
import * as playerDb from '@/lib/db/player';
import * as inventoryDb from '@/lib/db/inventory';
import { ENERGY_COSTS, XP_REWARDS, CROP_DATA } from '@/lib/constants';
import { getCropGrowthStage } from '@/lib/game-logic';

/**
 * Plant a crop
 */
export async function plantCropAction(
  playerId: string,
  cropType: CropType,
  plotX: number,
  plotY: number
) {
  try {
    // Check if plot is already occupied
    const occupied = await cropDb.isPlotOccupied(playerId, plotX, plotY);
    if (occupied) {
      return { success: false, error: 'Plot already occupied' };
    }

    // Get player
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    // Validate plot coordinates are within farm bounds
    if (plotX < 0 || plotX >= player.farmCols || plotY < 0 || plotY >= player.farmRows) {
      return { success: false, error: 'Plot is outside your farm. Expand your farm to unlock more plots!' };
    }

    // Check energy
    if (player.energy < ENERGY_COSTS.PLANT_CROP) {
      return { success: false, error: 'Not enough energy' };
    }

    // Check if player has seeds
    const seedType = `${cropType}_SEEDS` as any;
    const hasSeeds = await inventoryDb.hasItem(playerId, seedType, 1);
    if (!hasSeeds) {
      return { success: false, error: 'Not enough seeds' };
    }

    // Plant the crop
    await cropDb.plantCrop(playerId, cropType, plotX, plotY);

    // Remove seed from inventory
    await inventoryDb.removeInventoryItem(playerId, seedType, 1);

    // Update player stats
    await playerDb.updatePlayerStats(playerId, {
      energy: player.energy - ENERGY_COSTS.PLANT_CROP,
      xp: XP_REWARDS.PLANT_CROP,
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error planting crop:', error);
    return { success: false, error: 'Failed to plant crop' };
  }
}

/**
 * Water a crop
 */
export async function waterCropAction(playerId: string, cropId: string) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.energy < ENERGY_COSTS.WATER_CROP) {
      return { success: false, error: 'Not enough energy' };
    }

    await cropDb.waterCrop(cropId);
    await playerDb.updatePlayerEnergy(playerId, player.energy - ENERGY_COSTS.WATER_CROP);

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error watering crop:', error);
    return { success: false, error: 'Failed to water crop' };
  }
}

/**
 * Water all crops
 */
export async function waterAllCropsAction(playerId: string) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    const crops = await cropDb.getPlayerCrops(playerId);
    const energyNeeded = crops.length * ENERGY_COSTS.WATER_CROP;

    if (player.energy < energyNeeded) {
      return { success: false, error: 'Not enough energy' };
    }

    await cropDb.waterAllCrops(playerId);
    await playerDb.updatePlayerStats(playerId, {
      energy: player.energy - energyNeeded,
      xp: XP_REWARDS.WATER_ALL_CROPS,
    });

    revalidatePath('/');
    return { success: true, watered: crops.length };
  } catch (error) {
    console.error('Error watering all crops:', error);
    return { success: false, error: 'Failed to water crops' };
  }
}

/**
 * Harvest a crop
 */
export async function harvestCropAction(playerId: string, cropId: string, cropType: CropType) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.energy < ENERGY_COSTS.HARVEST_CROP) {
      return { success: false, error: 'Not enough energy' };
    }

    // Harvest the crop
    await cropDb.harvestCrop(cropId);

    // Add harvested crop to inventory
    await inventoryDb.addInventoryItem(playerId, cropType, 1);

    // Get sell price and add coins
    const cropData = CROP_DATA[cropType];
    await playerDb.updatePlayerStats(playerId, {
      energy: player.energy - ENERGY_COSTS.HARVEST_CROP,
      coins: player.coins + cropData.sellPrice,
      xp: XP_REWARDS.HARVEST_CROP,
    });

    revalidatePath('/');
    return { success: true, earned: cropData.sellPrice };
  } catch (error) {
    console.error('Error harvesting crop:', error);
    return { success: false, error: 'Failed to harvest crop' };
  }
}
