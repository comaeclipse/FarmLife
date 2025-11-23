// Database operations for Game Events

import { prisma } from '../prisma';
import { EventType } from '@prisma/client';

/**
 * Create a new game event
 */
export async function createGameEvent(
  playerId: string,
  type: EventType,
  title: string,
  description: string,
  effect?: string
) {
  return await prisma.gameEvent.create({
    data: {
      playerId,
      type,
      title,
      description,
      effect,
    },
  });
}

/**
 * Get recent events for a player
 */
export async function getRecentEvents(playerId: string, limit: number = 10) {
  return await prisma.gameEvent.findMany({
    where: { playerId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Clear old events (keep only last N)
 */
export async function clearOldEvents(playerId: string, keepLast: number = 50) {
  const events = await prisma.gameEvent.findMany({
    where: { playerId },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  if (events.length > keepLast) {
    const idsToDelete = events.slice(keepLast).map((e) => e.id);
    await prisma.gameEvent.deleteMany({
      where: {
        id: { in: idsToDelete },
      },
    });
  }
}
