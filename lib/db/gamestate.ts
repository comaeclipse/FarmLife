// Database operations for Game State management

import { prisma } from '../prisma';
import { Season, TimeOfDay } from '@prisma/client';

/**
 * Get game state for a player
 */
export async function getGameState(playerId: string) {
  return await prisma.gameState.findUnique({
    where: { playerId },
  });
}

/**
 * Update game state
 */
export async function updateGameState(
  playerId: string,
  updates: {
    day?: number;
    season?: Season;
    year?: number;
    timeOfDay?: TimeOfDay;
    lastPlayed?: Date;
  }
) {
  return await prisma.gameState.update({
    where: { playerId },
    data: updates,
  });
}

/**
 * Advance to next day
 */
export async function advanceDay(playerId: string) {
  const state = await getGameState(playerId);
  if (!state) throw new Error('Game state not found');

  const newDay = state.day + 1;
  let newSeason = state.season;
  let newYear = state.year;

  // Calculate season (28 days per season)
  const dayOfYear = ((newDay - 1) % 112) + 1;
  if (dayOfYear <= 28) newSeason = 'SPRING';
  else if (dayOfYear <= 56) newSeason = 'SUMMER';
  else if (dayOfYear <= 84) newSeason = 'FALL';
  else newSeason = 'WINTER';

  // Increment year
  if (newDay % 112 === 1 && newDay > 1) {
    newYear++;
  }

  return await updateGameState(playerId, {
    day: newDay,
    season: newSeason,
    year: newYear,
    timeOfDay: 'MORNING',
    lastPlayed: new Date(),
  });
}

/**
 * Update time of day
 */
export async function updateTimeOfDay(playerId: string, timeOfDay: TimeOfDay) {
  return await updateGameState(playerId, { timeOfDay });
}

/**
 * Update last played timestamp
 */
export async function updateLastPlayed(playerId: string) {
  return await updateGameState(playerId, { lastPlayed: new Date() });
}
