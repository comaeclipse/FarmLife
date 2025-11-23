'use server';

import { revalidatePath } from 'next/cache';
import { FlockType } from '@prisma/client';
import * as flockDb from '@/lib/db/flocks';
import * as playerDb from '@/lib/db/player';
import * as inventoryDb from '@/lib/db/inventory';
import * as eventsDb from '@/lib/db/events';
import { ENERGY_COSTS, XP_REWARDS, FLOCK_DATA } from '@/lib/constants';

/**
 * Buy flock animals (adds to existing flock or creates new one if at max)
 */
export async function buyFlockAnimalAction(
  playerId: string,
  flockType: FlockType,
  quantity: number = 1
) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    const flockData = FLOCK_DATA[flockType];
    const totalCost = flockData.costPerAnimal * quantity;

    if (player.coins < totalCost) {
      return { success: false, error: 'Not enough coins' };
    }

    // Try to find an existing flock that isn't at max capacity
    const existingFlock = await flockDb.getPlayerFlockByType(playerId, flockType);

    if (existingFlock) {
      // Add to existing flock (up to max)
      const spaceAvailable = existingFlock.maxCount - existingFlock.count;
      const toAdd = Math.min(quantity, spaceAvailable);

      if (toAdd > 0) {
        await flockDb.addToFlock(existingFlock.id, toAdd);
        await playerDb.updatePlayerCoins(playerId, player.coins - (flockData.costPerAnimal * toAdd));

        // Log event
        await eventsDb.createGameEvent(
          playerId,
          'PLAYER_ACTION',
          'Purchase',
          `Bought ${toAdd} ${toAdd === 1 ? flockData.name : flockData.namePlural} for ${flockData.costPerAnimal * toAdd} coins`
        );

        revalidatePath('/');
        return { success: true, added: toAdd, flockId: existingFlock.id };
      } else {
        return { success: false, error: `Flock is at maximum capacity (${existingFlock.maxCount})` };
      }
    } else {
      // Create new flock
      const newFlock = await flockDb.createFlock(
        playerId,
        flockType,
        quantity,
        flockData.maxFlockSize
      );

      await playerDb.updatePlayerCoins(playerId, player.coins - totalCost);

      // Log event
      await eventsDb.createGameEvent(
        playerId,
        'PLAYER_ACTION',
        'Purchase',
        `Started a new flock of ${quantity} ${quantity === 1 ? flockData.name : flockData.namePlural} for ${totalCost} coins`
      );

      revalidatePath('/');
      return { success: true, added: quantity, flockId: newFlock.id };
    }
  } catch (error) {
    console.error('Error buying flock animals:', error);
    return { success: false, error: 'Failed to buy animals' };
  }
}

/**
 * Feed a flock (entire group at once)
 */
export async function feedFlockAction(playerId: string, flockId: string) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.energy < ENERGY_COSTS.FEED_FLOCK) {
      return { success: false, error: 'Not enough energy' };
    }

    // Get the flock to check feed requirements
    const flocks = await flockDb.getPlayerFlocks(playerId);
    const flock = flocks.find(f => f.id === flockId);

    if (!flock) {
      return { success: false, error: 'Flock not found' };
    }

    if (flock.fedToday) {
      return { success: false, error: 'Flock already fed today' };
    }

    const flockData = FLOCK_DATA[flock.type];
    const feedNeeded = flock.count * flockData.feedPerAnimal;

    // Check if player has enough feed
    const hasFeed = await inventoryDb.hasItem(playerId, 'FEED', feedNeeded);
    if (!hasFeed) {
      return { success: false, error: `Not enough feed (need ${feedNeeded})` };
    }

    // Feed the flock
    await flockDb.feedFlock(flockId);
    await inventoryDb.removeInventoryItem(playerId, 'FEED', feedNeeded);
    await playerDb.updatePlayerStats(playerId, {
      energy: player.energy - ENERGY_COSTS.FEED_FLOCK,
      xp: XP_REWARDS.FEED_FLOCK,
    });

    revalidatePath('/');
    return { success: true, fedCount: flock.count };
  } catch (error) {
    console.error('Error feeding flock:', error);
    return { success: false, error: 'Failed to feed flock' };
  }
}

/**
 * Collect products from a flock
 */
export async function collectFlockProductsAction(
  playerId: string,
  flockId: string,
  flockType: FlockType
) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (player.energy < ENERGY_COSTS.COLLECT_FLOCK_PRODUCTS) {
      return { success: false, error: 'Not enough energy' };
    }

    // Get the flock
    const flocks = await flockDb.getPlayerFlocks(playerId);
    const flock = flocks.find(f => f.id === flockId);

    if (!flock) {
      return { success: false, error: 'Flock not found' };
    }

    if (flock.productionReady === 0) {
      return { success: false, error: 'No products ready to collect' };
    }

    if (flock.producedToday) {
      return { success: false, error: 'Already collected from this flock today' };
    }

    const flockData = FLOCK_DATA[flockType];
    const productsToCollect = flock.productionReady;
    const totalValue = productsToCollect * flockData.productValue;

    // Collect products
    await flockDb.collectFlockProducts(flockId);
    await inventoryDb.addInventoryItem(playerId, flockData.product as any, productsToCollect);
    await playerDb.updatePlayerStats(playerId, {
      energy: player.energy - ENERGY_COSTS.COLLECT_FLOCK_PRODUCTS,
      coins: player.coins + totalValue,
      xp: XP_REWARDS.COLLECT_FLOCK_PRODUCTS,
    });

    // Log event
    await eventsDb.createGameEvent(
      playerId,
      'PLAYER_ACTION',
      'Production',
      `Collected ${productsToCollect} ${flockData.product} from ${flockData.namePlural} for ${totalValue} coins`
    );

    revalidatePath('/');
    return { success: true, collected: productsToCollect, earned: totalValue };
  } catch (error) {
    console.error('Error collecting flock products:', error);
    return { success: false, error: 'Failed to collect products' };
  }
}
