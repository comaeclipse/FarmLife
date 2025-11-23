'use server';

import { revalidatePath } from 'next/cache';
import { ResourceType } from '@prisma/client';
import * as playerDb from '@/lib/db/player';
import * as inventoryDb from '@/lib/db/inventory';
import { CROP_DATA } from '@/lib/constants';

/**
 * Buy seeds
 */
export async function buySeedsAction(
  playerId: string,
  seedType: ResourceType,
  quantity: number
) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    // Extract crop type from seed type (e.g., "WHEAT_SEEDS" -> "WHEAT")
    const cropType = seedType.replace('_SEEDS', '') as keyof typeof CROP_DATA;
    const cropData = CROP_DATA[cropType];

    if (!cropData) {
      return { success: false, error: 'Invalid seed type' };
    }

    const totalCost = cropData.seedCost * quantity;

    if (player.coins < totalCost) {
      return { success: false, error: 'Not enough coins' };
    }

    await inventoryDb.addInventoryItem(playerId, seedType, quantity);
    await playerDb.updatePlayerCoins(playerId, player.coins - totalCost);

    revalidatePath('/');
    return { success: true, spent: totalCost };
  } catch (error) {
    console.error('Error buying seeds:', error);
    return { success: false, error: 'Failed to buy seeds' };
  }
}

/**
 * Buy feed
 */
export async function buyFeedAction(playerId: string, quantity: number) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    const feedCost = 5; // Cost per feed
    const totalCost = feedCost * quantity;

    if (player.coins < totalCost) {
      return { success: false, error: 'Not enough coins' };
    }

    await inventoryDb.addInventoryItem(playerId, 'FEED', quantity);
    await playerDb.updatePlayerCoins(playerId, player.coins - totalCost);

    revalidatePath('/');
    return { success: true, spent: totalCost };
  } catch (error) {
    console.error('Error buying feed:', error);
    return { success: false, error: 'Failed to buy feed' };
  }
}

/**
 * Sell items from inventory
 */
export async function sellItemAction(
  playerId: string,
  itemType: ResourceType,
  quantity: number
) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    // Check if player has enough items
    const hasItems = await inventoryDb.hasItem(playerId, itemType, quantity);
    if (!hasItems) {
      return { success: false, error: 'Not enough items to sell' };
    }

    // Calculate sell price (simplified - could be enhanced)
    let pricePerItem = 10; // default

    // If it's a crop, use crop data
    if (itemType in CROP_DATA) {
      pricePerItem = CROP_DATA[itemType as keyof typeof CROP_DATA].sellPrice;
    }

    const totalEarned = pricePerItem * quantity;

    await inventoryDb.removeInventoryItem(playerId, itemType, quantity);
    await playerDb.updatePlayerCoins(playerId, player.coins + totalEarned);

    revalidatePath('/');
    return { success: true, earned: totalEarned };
  } catch (error) {
    console.error('Error selling item:', error);
    return { success: false, error: 'Failed to sell item' };
  }
}
