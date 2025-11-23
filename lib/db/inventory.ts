// Database operations for Inventory management

import { prisma } from '../prisma';
import { ResourceType } from '@prisma/client';

/**
 * Add item to inventory
 */
export async function addInventoryItem(
  playerId: string,
  type: ResourceType,
  quantity: number
) {
  // Check if item already exists
  const existing = await prisma.inventoryItem.findUnique({
    where: {
      playerId_type: {
        playerId,
        type,
      },
    },
  });

  if (existing) {
    // Update quantity
    return await prisma.inventoryItem.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + quantity,
      },
    });
  } else {
    // Create new item
    return await prisma.inventoryItem.create({
      data: {
        playerId,
        type,
        quantity,
      },
    });
  }
}

/**
 * Remove item from inventory
 */
export async function removeInventoryItem(
  playerId: string,
  type: ResourceType,
  quantity: number
) {
  const existing = await prisma.inventoryItem.findUnique({
    where: {
      playerId_type: {
        playerId,
        type,
      },
    },
  });

  if (!existing) {
    throw new Error('Item not found in inventory');
  }

  const newQuantity = existing.quantity - quantity;

  if (newQuantity <= 0) {
    // Remove item entirely
    return await prisma.inventoryItem.delete({
      where: { id: existing.id },
    });
  } else {
    // Update quantity
    return await prisma.inventoryItem.update({
      where: { id: existing.id },
      data: { quantity: newQuantity },
    });
  }
}

/**
 * Get item quantity
 */
export async function getItemQuantity(playerId: string, type: ResourceType): Promise<number> {
  const item = await prisma.inventoryItem.findUnique({
    where: {
      playerId_type: {
        playerId,
        type,
      },
    },
  });

  return item?.quantity ?? 0;
}

/**
 * Check if player has enough of an item
 */
export async function hasItem(
  playerId: string,
  type: ResourceType,
  quantity: number
): Promise<boolean> {
  const currentQuantity = await getItemQuantity(playerId, type);
  return currentQuantity >= quantity;
}

/**
 * Get all inventory items for a player
 */
export async function getPlayerInventory(playerId: string) {
  return await prisma.inventoryItem.findMany({
    where: { playerId },
    orderBy: { type: 'asc' },
  });
}
