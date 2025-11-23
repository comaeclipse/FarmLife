'use server';

import { revalidatePath } from 'next/cache';
import * as playerDb from '@/lib/db/player';
import * as gamestateDb from '@/lib/db/gamestate';
import * as cropsDb from '@/lib/db/crops';
import * as livestockDb from '@/lib/db/livestock';
import * as flockDb from '@/lib/db/flocks';
import * as horseDb from '@/lib/db/horses';
import * as eventsDb from '@/lib/db/events';
import * as choresDb from '@/lib/db/chores';
import { generateRandomEvent, shouldAdvanceDay, getCropGrowthStage } from '@/lib/game-logic';
import { CROP_DATA, GAME_CONFIG, LIVESTOCK_DATA, FLOCK_DATA, HORSE_DATA } from '@/lib/constants';
import { generateTickerItems } from '@/lib/ticker-items';

/**
 * Initialize or get player
 */
export async function initializePlayerAction(name: string = 'Farmer') {
  try {
    const player = await playerDb.getOrCreatePlayer(name);
    return { success: true, player };
  } catch (error) {
    console.error('Error initializing player:', error);
    return { success: false, error: 'Failed to initialize player' };
  }
}

/**
 * Process daily updates (crops, animals, energy, etc.)
 */
export async function processDailyUpdateAction(playerId: string) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player || !player.gameState) {
      return { success: false, error: 'Player or game state not found' };
    }

    // Check if a new day should start
    if (!shouldAdvanceDay(player.gameState.lastPlayed)) {
      return { success: false, error: 'Not time for daily update yet' };
    }

    // Advance the day
    const updatedGameState = await gamestateDb.advanceDay(playerId);

    // Generate new ticker items for the day
    const tickerItems = generateTickerItems({
      day: updatedGameState.day,
      season: updatedGameState.season,
      year: updatedGameState.year,
    });
    await gamestateDb.updateGameState(playerId, { tickerItems });

    // Reset player energy
    await playerDb.updatePlayerEnergy(playerId, GAME_CONFIG.MAX_ENERGY);

    // Update crops
    const crops = await cropsDb.getPlayerCrops(playerId);
    for (const crop of crops) {
      const newDaysGrowing = crop.daysGrowing + (crop.wateredToday ? 1 : 0);
      const cropData = CROP_DATA[crop.type];
      const newStage = getCropGrowthStage(newDaysGrowing, cropData.growthDays) as any;

      await cropsDb.updateCropGrowth(crop.id, newStage, newDaysGrowing);
    }

    // Reset daily watering status
    await cropsDb.resetDailyWatering(playerId);

    // Update animals (DEPRECATED - old livestock system)
    const livestock = await livestockDb.getPlayerLivestock(playerId);
    for (const animal of livestock) {
      // Decrease hunger and happiness if not fed
      const hungerChange = animal.fedToday ? 0 : -20;
      const happinessChange = animal.petToday ? 0 : -10;

      // Check if animal should produce
      const daysSinceAcquired = Math.floor(
        (Date.now() - animal.acquiredAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      const animalData = LIVESTOCK_DATA[animal.type];
      const shouldProduce = daysSinceAcquired % animalData.productionDays === 0;

      await livestockDb.updateAnimalStats(animal.id, {
        hunger: Math.max(0, animal.hunger + hungerChange),
        happiness: Math.max(0, animal.happiness + happinessChange),
        productionReady: shouldProduce && animal.fedToday,
      });
    }

    // Reset daily animal status
    await livestockDb.resetDailyAnimalStatus(playerId);

    // Update flocks
    const flocks = await flockDb.getPlayerFlocks(playerId);
    for (const flock of flocks) {
      // Decrease hunger and happiness if not fed
      const hungerChange = flock.fedToday ? 0 : -20;
      const happinessChange = flock.fedToday ? 0 : -10;

      // Calculate production (each animal in flock produces individually)
      const daysSinceAcquired = Math.floor(
        (Date.now() - flock.acquiredAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      const flockData = FLOCK_DATA[flock.type];
      const shouldProduce = daysSinceAcquired % flockData.productionDays === 0;

      // Each animal that was fed can produce
      const animalsReady = shouldProduce && flock.fedToday ? flock.count : 0;

      await flockDb.updateFlockStats(flock.id, {
        hunger: Math.max(0, flock.hunger + hungerChange),
        happiness: Math.max(0, flock.happiness + happinessChange),
        productionReady: animalsReady,
      });
    }

    // Reset daily flock status
    await flockDb.resetDailyFlockStatus(playerId);

    // Update horses
    const horses = await horseDb.getPlayerHorses(playerId);
    for (const horse of horses) {
      // Decrease hunger if not fed
      const hungerChange = horse.fedToday ? 0 : -20;
      // Decrease happiness if not groomed
      const happinessChange = horse.groomedToday ? 0 : -10;
      // Grooming decays daily
      const groomingChange = horse.groomedToday ? 0 : -HORSE_DATA.groomingDecayPerDay;
      // Bonding decays slowly if not interacted with
      const bondingChange = (horse.riddenToday || horse.trainedToday || horse.groomedToday) ? 0 : -HORSE_DATA.bondingDecayPerDay;

      await horseDb.updateHorseStats(horse.id, {
        hunger: Math.max(0, horse.hunger + hungerChange),
        happiness: Math.max(0, horse.happiness + happinessChange),
        grooming: Math.max(0, horse.grooming + groomingChange),
        bonding: Math.max(0, horse.bonding + bondingChange),
      });
    }

    // Reset daily horse status
    await horseDb.resetDailyHorseStatus(playerId);

    // Generate random event
    const randomEvent = generateRandomEvent();
    if (randomEvent) {
      await eventsDb.createGameEvent(
        playerId,
        randomEvent.type as any,
        randomEvent.title,
        randomEvent.description,
        randomEvent.effect || undefined
      );
    }

    // Generate daily chores
    await choresDb.generateDailyChores(playerId);

    // Clean up old data
    await eventsDb.clearOldEvents(playerId);
    await choresDb.clearOldChores(playerId);

    revalidatePath('/');
    return { success: true, event: randomEvent };
  } catch (error) {
    console.error('Error processing daily update:', error);
    return { success: false, error: 'Failed to process daily update' };
  }
}

/**
 * Complete a chore
 */
export async function completeChoreAction(playerId: string, choreId: string) {
  try {
    const chore = await choresDb.completeChore(choreId);

    // Award rewards
    await playerDb.updatePlayerStats(playerId, {
      coins: (await playerDb.getPlayer(playerId))!.coins + chore.coinReward,
      xp: chore.xpReward,
    });

    revalidatePath('/');
    return { success: true, rewards: { coins: chore.coinReward, xp: chore.xpReward } };
  } catch (error) {
    console.error('Error completing chore:', error);
    return { success: false, error: 'Failed to complete chore' };
  }
}

/**
 * Rest (skip to next time period)
 */
export async function restAction(playerId: string) {
  try {
    const player = await playerDb.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    // Restore some energy
    const energyRestored = Math.min(30, GAME_CONFIG.MAX_ENERGY - player.energy);
    await playerDb.updatePlayerEnergy(playerId, player.energy + energyRestored);

    revalidatePath('/');
    return { success: true, energyRestored };
  } catch (error) {
    console.error('Error resting:', error);
    return { success: false, error: 'Failed to rest' };
  }
}
