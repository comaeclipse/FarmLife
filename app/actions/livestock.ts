'use server';

import { revalidatePath } from 'next/cache';
import { LivestockType } from '@prisma/client';
import * as livestockDb from '@/lib/db/livestock';
import * as playerDb from '@/lib/db/player';
import * as inventoryDb from '@/lib/db/inventory';
import * as eventsDb from '@/lib/db/events';
import { ENERGY_COSTS, XP_REWARDS, LIVESTOCK_DATA } from '@/lib/constants';

/**
 * Feed an animal
 */
export async function feedAnimalAction(playerId: string, livestockId: string) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.energy < ENERGY_COSTS.FEED_ANIMAL) {
      return { success: false, error: 'Not enough energy' };
    }

    // Check if player has feed
    const hasFeed = await inventoryDb.hasItem(playerId, 'FEED', 1);
    if (!hasFeed) {
      return { success: false, error: 'No feed available' };
    }

    await livestockDb.feedAnimal(livestockId);
    await inventoryDb.removeInventoryItem(playerId, 'FEED', 1);
    await playerDb.updatePlayerEnergy(playerId, player.energy - ENERGY_COSTS.FEED_ANIMAL);

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error feeding animal:', error);
    return { success: false, error: 'Failed to feed animal' };
  }
}

/**
 * Feed all animals
 */
export async function feedAllAnimalsAction(playerId: string) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    const livestock = await livestockDb.getPlayerLivestock(playerId);
    const unfedAnimals = livestock.filter(a => !a.fedToday);

    if (unfedAnimals.length === 0) {
      return { success: false, error: 'All animals already fed' };
    }

    const energyNeeded = unfedAnimals.length * ENERGY_COSTS.FEED_ANIMAL;
    const feedNeeded = unfedAnimals.length;

    if (player.energy < energyNeeded) {
      return { success: false, error: 'Not enough energy' };
    }

    const hasFeed = await inventoryDb.hasItem(playerId, 'FEED', feedNeeded);
    if (!hasFeed) {
      return { success: false, error: 'Not enough feed' };
    }

    await livestockDb.feedAllAnimals(playerId);
    await inventoryDb.removeInventoryItem(playerId, 'FEED', feedNeeded);
    await playerDb.updatePlayerStats(playerId, {
      energy: player.energy - energyNeeded,
      xp: XP_REWARDS.FEED_ALL_ANIMALS,
    });

    // Log event
    await eventsDb.createGameEvent(
      playerId,
      'PLAYER_ACTION',
      'Animal Care',
      `Fed all ${unfedAnimals.length} animals`
    );

    revalidatePath('/');
    return { success: true, fed: unfedAnimals.length };
  } catch (error) {
    console.error('Error feeding all animals:', error);
    return { success: false, error: 'Failed to feed animals' };
  }
}

/**
 * Pet an animal
 */
export async function petAnimalAction(playerId: string, livestockId: string) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.energy < ENERGY_COSTS.PET_ANIMAL) {
      return { success: false, error: 'Not enough energy' };
    }

    await livestockDb.petAnimal(livestockId);
    await playerDb.updatePlayerEnergy(playerId, player.energy - ENERGY_COSTS.PET_ANIMAL);

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error petting animal:', error);
    return { success: false, error: 'Failed to pet animal' };
  }
}

/**
 * Collect product from animal
 */
export async function collectProductAction(
  playerId: string,
  livestockId: string,
  livestockType: LivestockType
) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.energy < ENERGY_COSTS.COLLECT_PRODUCT) {
      return { success: false, error: 'Not enough energy' };
    }

    const animalData = LIVESTOCK_DATA[livestockType];

    await livestockDb.collectProduct(livestockId);
    await inventoryDb.addInventoryItem(playerId, animalData.product as any, 1);
    await playerDb.updatePlayerStats(playerId, {
      energy: player.energy - ENERGY_COSTS.COLLECT_PRODUCT,
      coins: player.coins + animalData.productValue,
      xp: XP_REWARDS.COLLECT_PRODUCT,
    });

    // Log event
    await eventsDb.createGameEvent(
      playerId,
      'PLAYER_ACTION',
      'Production',
      `Collected ${animalData.product} from ${animalData.name} for ${animalData.productValue} coins`
    );

    revalidatePath('/');
    return { success: true, earned: animalData.productValue };
  } catch (error) {
    console.error('Error collecting product:', error);
    return { success: false, error: 'Failed to collect product' };
  }
}

/**
 * Buy an animal
 */
export async function buyAnimalAction(
  playerId: string,
  animalType: LivestockType,
  name?: string
) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    const animalData = LIVESTOCK_DATA[animalType];

    if (player.coins < animalData.cost) {
      return { success: false, error: 'Not enough coins' };
    }

    await livestockDb.addLivestock(playerId, animalType, name);
    await playerDb.updatePlayerCoins(playerId, player.coins - animalData.cost);

    // Log event
    await eventsDb.createGameEvent(
      playerId,
      'PLAYER_ACTION',
      'Purchase',
      `Bought ${animalData.emoji} ${animalData.name} for ${animalData.cost} coins`
    );

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error buying animal:', error);
    return { success: false, error: 'Failed to buy animal' };
  }
}
