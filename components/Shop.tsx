'use client';

import { useState } from 'react';
import { CropType, LivestockType } from '@prisma/client';
import { buySeedsAction, buyFeedAction } from '@/app/actions/shop';
import { buyAnimalAction } from '@/app/actions/livestock';
import { CROP_DATA, LIVESTOCK_DATA } from '@/lib/constants';

interface ShopProps {
  playerId: string;
  playerCoins: number;
}

export function Shop({ playerId, playerCoins }: ShopProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'seeds' | 'animals' | 'supplies'>('seeds');

  const handleBuySeeds = async (cropType: CropType, quantity: number) => {
    setLoading(true);
    const seedType = `${cropType}_SEEDS` as any;
    const result = await buySeedsAction(playerId, seedType, quantity);
    setLoading(false);

    if (result.success) {
      alert(`Bought ${quantity} seeds for ${result.spent} coins!`);
    } else {
      alert(result.error);
    }
  };

  const handleBuyAnimal = async (animalType: LivestockType) => {
    setLoading(true);
    const result = await buyAnimalAction(playerId, animalType);
    setLoading(false);

    if (result.success) {
      alert(`Bought ${LIVESTOCK_DATA[animalType].name}!`);
    } else {
      alert(result.error);
    }
  };

  const handleBuyFeed = async (quantity: number) => {
    setLoading(true);
    const result = await buyFeedAction(playerId, quantity);
    setLoading(false);

    if (result.success) {
      alert(`Bought ${quantity} feed for ${result.spent} coins!`);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="border border-green-700 bg-green-950/30 p-4 rounded">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-green-400">Shop</h2>
        <div className="text-sm text-yellow-400 font-bold">{playerCoins} coins</div>
      </div>

      <div className="flex gap-2 mb-4 border-b border-green-800 pb-2">
        <button
          onClick={() => setActiveTab('seeds')}
          className={`px-3 py-1 rounded text-sm ${
            activeTab === 'seeds' ? 'bg-green-700' : 'bg-green-900/50 hover:bg-green-800/50'
          }`}
        >
          Seeds
        </button>
        <button
          onClick={() => setActiveTab('animals')}
          className={`px-3 py-1 rounded text-sm ${
            activeTab === 'animals' ? 'bg-green-700' : 'bg-green-900/50 hover:bg-green-800/50'
          }`}
        >
          Animals
        </button>
        <button
          onClick={() => setActiveTab('supplies')}
          className={`px-3 py-1 rounded text-sm ${
            activeTab === 'supplies' ? 'bg-green-700' : 'bg-green-900/50 hover:bg-green-800/50'
          }`}
        >
          Supplies
        </button>
      </div>

      {activeTab === 'seeds' && (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(CROP_DATA).map(([type, data]) => (
            <div key={type} className="border border-green-800 bg-green-900/30 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{data.emoji}</span>
                <div>
                  <div className="font-bold text-sm text-green-300">{data.name}</div>
                  <div className="text-xs text-gray-400">{data.growthDays} days</div>
                </div>
              </div>
              <div className="text-xs text-gray-400 mb-2">
                Cost: {data.seedCost} coins
                <br />
                Sell: {data.sellPrice} coins
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleBuySeeds(type as CropType, 1)}
                  disabled={loading || playerCoins < data.seedCost}
                  className="flex-1 px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 rounded text-xs"
                >
                  Buy 1
                </button>
                <button
                  onClick={() => handleBuySeeds(type as CropType, 5)}
                  disabled={loading || playerCoins < data.seedCost * 5}
                  className="flex-1 px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 rounded text-xs"
                >
                  Buy 5
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'animals' && (
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(LIVESTOCK_DATA).map(([type, data]) => (
            <div key={type} className="border border-green-800 bg-green-900/30 p-3 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{data.emoji}</span>
                  <div>
                    <div className="font-bold text-green-300">{data.name}</div>
                    <div className="text-xs text-gray-400">
                      Produces {data.product} every {data.productionDays}d (${data.productValue})
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleBuyAnimal(type as LivestockType)}
                  disabled={loading || playerCoins < data.cost}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 rounded text-sm"
                >
                  {data.cost} coins
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'supplies' && (
        <div className="grid grid-cols-1 gap-2">
          <div className="border border-green-800 bg-green-900/30 p-3 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-green-300">Animal Feed</div>
                <div className="text-xs text-gray-400">Keep your animals happy and healthy</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBuyFeed(10)}
                  disabled={loading || playerCoins < 50}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 rounded text-sm"
                >
                  10 for 50
                </button>
                <button
                  onClick={() => handleBuyFeed(50)}
                  disabled={loading || playerCoins < 250}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 rounded text-sm"
                >
                  50 for 200
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
