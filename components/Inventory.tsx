'use client';

import { ResourceType } from '@prisma/client';
import { CROP_DATA } from '@/lib/constants';

interface InventoryProps {
  inventory: Array<{
    type: ResourceType;
    quantity: number;
  }>;
}

const ITEM_NAMES: Record<string, string> = {
  WHEAT_SEEDS: '🌾 Wheat Seeds',
  CORN_SEEDS: '🌽 Corn Seeds',
  TOMATO_SEEDS: '🍅 Tomato Seeds',
  CARROT_SEEDS: '🥕 Carrot Seeds',
  POTATO_SEEDS: '🥔 Potato Seeds',
  STRAWBERRY_SEEDS: '🍓 Strawberry Seeds',
  PUMPKIN_SEEDS: '🎃 Pumpkin Seeds',
  LETTUCE_SEEDS: '🥬 Lettuce Seeds',
  WHEAT: '🌾 Wheat',
  CORN: '🌽 Corn',
  TOMATO: '🍅 Tomato',
  CARROT: '🥕 Carrot',
  POTATO: '🥔 Potato',
  STRAWBERRY: '🍓 Strawberry',
  PUMPKIN: '🎃 Pumpkin',
  LETTUCE: '🥬 Lettuce',
  EGG: '🥚 Egg',
  MILK: '🥛 Milk',
  WOOL: '🧶 Wool',
  MEAT: '🥩 Meat',
  WATER_CAN: '💧 Water Can',
  HOE: '🔨 Hoe',
  FEED: '🌾 Animal Feed',
  FERTILIZER: '💩 Fertilizer',
};

export function Inventory({ inventory }: InventoryProps) {
  // Group items by category
  const seeds = inventory.filter((i) => i.type.endsWith('_SEEDS'));
  const crops = inventory.filter((i) =>
    ['WHEAT', 'CORN', 'TOMATO', 'CARROT', 'POTATO', 'STRAWBERRY', 'PUMPKIN', 'LETTUCE'].includes(i.type)
  );
  const products = inventory.filter((i) =>
    ['EGG', 'MILK', 'WOOL', 'MEAT'].includes(i.type)
  );
  const tools = inventory.filter((i) =>
    ['WATER_CAN', 'HOE', 'FEED', 'FERTILIZER'].includes(i.type)
  );

  const renderCategory = (title: string, items: typeof inventory) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-3">
        <h3 className="text-sm font-bold text-green-400 mb-2">{title}</h3>
        <div className="space-y-1">
          {items.map((item) => (
            <div
              key={item.type}
              className="flex justify-between items-center text-sm bg-green-900/30 px-2 py-1 rounded"
            >
              <span className="text-gray-300">{ITEM_NAMES[item.type] || item.type}</span>
              <span className="text-green-400 font-bold">x{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="border border-green-700 bg-green-950/30 p-4 rounded">
      <h2 className="text-xl font-bold text-green-400 mb-3">Inventory</h2>

      {inventory.length === 0 ? (
        <p className="text-gray-400 text-sm">Inventory is empty</p>
      ) : (
        <>
          {renderCategory('Seeds', seeds)}
          {renderCategory('Harvested Crops', crops)}
          {renderCategory('Animal Products', products)}
          {renderCategory('Tools & Items', tools)}
        </>
      )}
    </div>
  );
}
