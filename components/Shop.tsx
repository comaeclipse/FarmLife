'use client';

import { useState } from 'react';
import { CropType, FlockType } from '@prisma/client';
import { toast } from 'sonner';
import { buySeedsAction, buyFeedAction } from '@/app/actions/shop';
import { buyFlockAnimalAction } from '@/app/actions/flocks';
import { buyHorseAction } from '@/app/actions/horses';
import { CROP_DATA, FLOCK_DATA, HORSE_DATA } from '@/lib/constants';

interface ShopProps {
  playerId: string;
  playerCoins: number;
}

export function Shop({ playerId, playerCoins }: ShopProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'seeds' | 'flocks' | 'horses' | 'supplies'>('seeds');
  const [showHorseDialog, setShowHorseDialog] = useState(false);
  const [horseName, setHorseName] = useState('');

  const handleBuySeeds = async (cropType: CropType, quantity: number) => {
    setLoading(true);
    const seedType = `${cropType}_SEEDS` as any;
    const result = await buySeedsAction(playerId, seedType, quantity);
    setLoading(false);

    if (result.success) {
      toast.success(`Bought ${quantity} seeds for ${result.spent} coins!`);
    } else {
      toast.error(result.error);
    }
  };

  const handleBuyFlockAnimal = async (flockType: FlockType, quantity: number) => {
    setLoading(true);
    const result = await buyFlockAnimalAction(playerId, flockType, quantity);
    setLoading(false);

    if (result.success) {
      const data = FLOCK_DATA[flockType];
      toast.success(`Bought ${quantity} ${quantity === 1 ? data.name : data.namePlural}!`);
    } else {
      toast.error(result.error);
    }
  };

  const handleBuyHorse = async () => {
    if (!horseName.trim()) {
      toast.error('Please enter a name for your horse');
      return;
    }

    setLoading(true);
    const result = await buyHorseAction(playerId, horseName.trim());
    setLoading(false);

    if (result.success) {
      toast.success(`Bought horse: ${horseName}!`);
      setShowHorseDialog(false);
      setHorseName('');
    } else {
      toast.error(result.error);
    }
  };

  const handleBuyFeed = async (quantity: number) => {
    setLoading(true);
    const result = await buyFeedAction(playerId, quantity);
    setLoading(false);

    if (result.success) {
      toast.success(`Bought ${quantity} feed for ${result.spent} coins!`);
    } else {
      toast.error(result.error);
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
          onClick={() => setActiveTab('flocks')}
          className={`px-3 py-1 rounded text-sm ${
            activeTab === 'flocks' ? 'bg-green-700' : 'bg-green-900/50 hover:bg-green-800/50'
          }`}
        >
          Flocks
        </button>
        <button
          onClick={() => setActiveTab('horses')}
          className={`px-3 py-1 rounded text-sm ${
            activeTab === 'horses' ? 'bg-green-700' : 'bg-green-900/50 hover:bg-green-800/50'
          }`}
        >
          Horses
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

      {activeTab === 'flocks' && (
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(FLOCK_DATA).map(([type, data]) => (
            <div key={type} className="border border-green-800 bg-green-900/30 p-3 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{data.emoji}</span>
                  <div>
                    <div className="font-bold text-green-300">{data.namePlural}</div>
                    <div className="text-xs text-gray-400">
                      Produces {data.product} every {data.productionDays}d (${data.productValue}) • Max {data.maxFlockSize}/flock
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleBuyFlockAnimal(type as FlockType, 1)}
                    disabled={loading || playerCoins < data.costPerAnimal}
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 rounded text-xs"
                  >
                    1 ({data.costPerAnimal})
                  </button>
                  <button
                    onClick={() => handleBuyFlockAnimal(type as FlockType, 5)}
                    disabled={loading || playerCoins < data.costPerAnimal * 5}
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 rounded text-xs"
                  >
                    5 ({data.costPerAnimal * 5})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'horses' && (
        <div className="grid grid-cols-1 gap-2">
          <div className="border border-green-800 bg-green-900/30 p-3 rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{HORSE_DATA.emoji}</span>
                <div>
                  <div className="font-bold text-green-300">Horse</div>
                  <div className="text-xs text-gray-400">
                    Premium companion animal • Grooming, training & bonding
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowHorseDialog(true)}
                disabled={loading || playerCoins < HORSE_DATA.cost}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 rounded text-sm"
              >
                {HORSE_DATA.cost} coins
              </button>
            </div>
          </div>

          {/* Horse Naming Dialog */}
          {showHorseDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-stone-800 border-2 border-green-700 rounded-lg p-6 max-w-md w-full m-4">
                <h3 className="text-xl font-bold text-green-400 mb-4">Name Your Horse</h3>
                <input
                  type="text"
                  value={horseName}
                  onChange={(e) => setHorseName(e.target.value)}
                  placeholder="Enter a name..."
                  className="w-full px-3 py-2 bg-stone-900 border border-green-700 rounded text-white mb-4"
                  maxLength={30}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleBuyHorse();
                    if (e.key === 'Escape') {
                      setShowHorseDialog(false);
                      setHorseName('');
                    }
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowHorseDialog(false);
                      setHorseName('');
                    }}
                    className="flex-1 px-4 py-2 bg-stone-700 hover:bg-stone-600 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBuyHorse}
                    disabled={loading || !horseName.trim()}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 rounded"
                  >
                    Buy Horse
                  </button>
                </div>
              </div>
            </div>
          )}
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
