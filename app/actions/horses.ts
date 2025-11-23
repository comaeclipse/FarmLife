'use server';

import { revalidatePath } from 'next/cache';
import * as horseDb from '@/lib/db/horses';
import * as playerDb from '@/lib/db/player';
import * as inventoryDb from '@/lib/db/inventory';
import * as eventsDb from '@/lib/db/events';
import { ENERGY_COSTS, XP_REWARDS, HORSE_DATA } from '@/lib/constants';

/**
 * Buy a horse (name is required)
 */
export async function buyHorseAction(playerId: string, name: string) {
  try {
    if (!name || name.trim().length === 0) {
      return { success: false, error: 'Horse name is required' };
    }

    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.coins < HORSE_DATA.cost) {
      return { success: false, error: `Not enough coins (need ${HORSE_DATA.cost})` };
    }

    // Create the horse
    const horse = await horseDb.addHorse(playerId, name.trim());
    await playerDb.updatePlayerCoins(playerId, player.coins - HORSE_DATA.cost);

    // Log event
    await eventsDb.createGameEvent(
      playerId,
      'PLAYER_ACTION',
      'Purchase',
      `Bought ${HORSE_DATA.emoji} ${name} for ${HORSE_DATA.cost} coins`
    );

    revalidatePath('/');
    return { success: true, horseId: horse.id };
  } catch (error) {
    console.error('Error buying horse:', error);
    return { success: false, error: 'Failed to buy horse' };
  }
}

/**
 * Feed a horse
 */
export async function feedHorseAction(playerId: string, horseId: string) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.energy < ENERGY_COSTS.FEED_HORSE) {
      return { success: false, error: 'Not enough energy' };
    }

    // Check if player has feed
    const hasFeed = await inventoryDb.hasItem(playerId, 'FEED', 1);
    if (!hasFeed) {
      return { success: false, error: 'No feed available' };
    }

    // Feed the horse
    await horseDb.feedHorse(horseId);
    await inventoryDb.removeInventoryItem(playerId, 'FEED', 1);
    await playerDb.updatePlayerEnergy(playerId, player.energy - ENERGY_COSTS.FEED_HORSE);

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error feeding horse:', error);
    return { success: false, error: 'Failed to feed horse' };
  }
}

/**
 * Groom a horse
 */
export async function groomHorseAction(playerId: string, horseId: string) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.energy < ENERGY_COSTS.GROOM_HORSE) {
      return { success: false, error: 'Not enough energy' };
    }

    // Groom the horse
    await horseDb.groomHorse(horseId);
    await playerDb.updatePlayerStats(playerId, {
      energy: player.energy - ENERGY_COSTS.GROOM_HORSE,
      xp: XP_REWARDS.GROOM_HORSE,
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error grooming horse:', error);
    return { success: false, error: 'Failed to groom horse' };
  }
}

/**
 * Train a horse
 */
export async function trainHorseAction(playerId: string, horseId: string) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.energy < ENERGY_COSTS.TRAIN_HORSE) {
      return { success: false, error: 'Not enough energy' };
    }

    // Train the horse
    await horseDb.trainHorse(horseId, HORSE_DATA.trainingGainPerSession);
    await playerDb.updatePlayerStats(playerId, {
      energy: player.energy - ENERGY_COSTS.TRAIN_HORSE,
      xp: XP_REWARDS.TRAIN_HORSE,
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error training horse:', error);
    return { success: false, error: 'Failed to train horse' };
  }
}

/**
 * Ride/bond with a horse
 */
export async function rideHorseAction(playerId: string, horseId: string) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.energy < ENERGY_COSTS.RIDE_HORSE) {
      return { success: false, error: 'Not enough energy' };
    }

    // Ride the horse
    await horseDb.rideHorse(horseId);
    await playerDb.updatePlayerStats(playerId, {
      energy: player.energy - ENERGY_COSTS.RIDE_HORSE,
      xp: XP_REWARDS.RIDE_HORSE,
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error riding horse:', error);
    return { success: false, error: 'Failed to ride horse' };
  }
}
