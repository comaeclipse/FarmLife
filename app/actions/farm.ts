'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import * as eventsDb from '@/lib/db/events';
import { FARM_EXPANSION_TIERS } from '@/lib/constants';

/**
 * Get the next available farm expansion tier for a player
 */
export async function getNextExpansionTierAction(playerId: string) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: { level: true, farmRows: true, farmCols: true },
    });

    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    // Find current tier based on farm size
    const currentTierIndex = FARM_EXPANSION_TIERS.findIndex(
      (tier) => tier.rows === player.farmRows && tier.cols === player.farmCols
    );

    if (currentTierIndex === -1) {
      return { success: false, error: 'Invalid farm size' };
    }

    // Check if already at max size
    if (currentTierIndex === FARM_EXPANSION_TIERS.length - 1) {
      return { success: true, atMaxSize: true, nextTier: null };
    }

    const nextTier = FARM_EXPANSION_TIERS[currentTierIndex + 1];

    return {
      success: true,
      atMaxSize: false,
      nextTier: {
        ...nextTier,
        canAfford: player.level >= nextTier.level,
        currentLevel: player.level,
      },
    };
  } catch (error) {
    console.error('Error getting next expansion tier:', error);
    return { success: false, error: 'Failed to get expansion information' };
  }
}

/**
 * Expand the player's farm to the next tier
 */
export async function expandFarmAction(playerId: string) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: {
        id: true,
        level: true,
        energy: true,
        coins: true,
        farmRows: true,
        farmCols: true,
      },
    });

    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    // Find current tier
    const currentTierIndex = FARM_EXPANSION_TIERS.findIndex(
      (tier) => tier.rows === player.farmRows && tier.cols === player.farmCols
    );

    if (currentTierIndex === -1) {
      return { success: false, error: 'Invalid farm size' };
    }

    // Check if already at max size
    if (currentTierIndex === FARM_EXPANSION_TIERS.length - 1) {
      return { success: false, error: 'Farm is already at maximum size' };
    }

    const nextTier = FARM_EXPANSION_TIERS[currentTierIndex + 1];

    // Validate level requirement
    if (player.level < nextTier.level) {
      return {
        success: false,
        error: `Level ${nextTier.level} required (currently level ${player.level})`,
      };
    }

    // Validate coin requirement
    if (player.coins < nextTier.coinCost) {
      return {
        success: false,
        error: `Not enough coins (need ${nextTier.coinCost}, have ${player.coins})`,
      };
    }

    // Validate energy requirement
    if (player.energy < nextTier.energyCost) {
      return {
        success: false,
        error: `Not enough energy (need ${nextTier.energyCost}, have ${player.energy})`,
      };
    }

    // Perform expansion
    await prisma.player.update({
      where: { id: playerId },
      data: {
        farmRows: nextTier.rows,
        farmCols: nextTier.cols,
        coins: player.coins - nextTier.coinCost,
        energy: player.energy - nextTier.energyCost,
      },
    });

    // Log event
    await eventsDb.createGameEvent(
      playerId,
      'PLAYER_ACTION',
      'Farm Expansion',
      `Expanded farm to ${nextTier.rows}x${nextTier.cols} (${nextTier.rows * nextTier.cols} plots)`
    );

    revalidatePath('/');
    revalidatePath('/crops');

    return {
      success: true,
      newSize: { rows: nextTier.rows, cols: nextTier.cols },
      totalPlots: nextTier.rows * nextTier.cols,
    };
  } catch (error) {
    console.error('Error expanding farm:', error);
    return { success: false, error: 'Failed to expand farm' };
  }
}
