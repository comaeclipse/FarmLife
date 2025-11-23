'use client';

import { useState } from 'react';
import { LivestockType } from '@prisma/client';
import { toast } from 'sonner';
import { feedAnimalAction, petAnimalAction, collectProductAction, feedAllAnimalsAction } from '@/app/actions/livestock';
import { LIVESTOCK_DATA } from '@/lib/constants';
import { Heart, Sparkles, Utensils, Hand, Package } from 'lucide-react';

interface Animal {
  id: string;
  type: LivestockType;
  name: string | null;
  health: number;
  happiness: number;
  hunger: number;
  fedToday: boolean;
  petToday: boolean;
  productionReady: boolean;
  producedToday: boolean;
}

interface LivestockListProps {
  playerId: string;
  livestock: Animal[];
}

export function LivestockList({ playerId, livestock }: LivestockListProps) {
  const [loading, setLoading] = useState(false);

  const handleFeed = async (animalId: string) => {
    setLoading(true);
    const result = await feedAnimalAction(playerId, animalId);
    setLoading(false);
    if (!result.success) toast.error(result.error);
  };

  const handleFeedAll = async () => {
    setLoading(true);
    const result = await feedAllAnimalsAction(playerId);
    setLoading(false);
    if (result.success) {
      toast.success(`Fed ${result.fed} animals!`);
    } else {
      toast.error(result.error);
    }
  };

  const handlePet = async (animalId: string) => {
    setLoading(true);
    const result = await petAnimalAction(playerId, animalId);
    setLoading(false);
    if (!result.success) toast.error(result.error);
  };

  const handleCollect = async (animalId: string, animalType: LivestockType) => {
    setLoading(true);
    const result = await collectProductAction(playerId, animalId, animalType);
    setLoading(false);
    if (result.success) {
      toast.success(`Collected! Earned ${result.earned} coins`);
    } else {
      toast.error(result.error);
    }
  };

  const getHealthColor = (val: number) => {
    if (val > 80) return 'text-emerald-400';
    if (val > 40) return 'text-yellow-400';
    return 'text-red-500';
  };

  if (livestock.length === 0) {
    return (
      <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
        <h2 className="text-xl font-bold text-stone-300 mb-3">Livestock</h2>
        <div className="bg-stone-800/50 border border-dashed border-stone-700 rounded-lg p-8 text-center text-stone-500">
          <p className="mb-2">No animals yet.</p>
          <p className="text-sm">Visit the shop to buy some!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-stone-300">Livestock ({livestock.length})</h2>
        <button
          onClick={handleFeedAll}
          disabled={loading}
          className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 disabled:bg-stone-900 disabled:text-stone-600 rounded text-sm transition-colors border border-stone-600"
        >
          Feed All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {livestock.map((animal) => {
          const data = LIVESTOCK_DATA[animal.type];
          return (
            <div
              key={animal.id}
              className="bg-stone-800 border border-stone-700 rounded-lg p-4 shadow-md hover:border-stone-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{data.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold text-stone-100">
                      {animal.name || data.name}
                    </h3>
                    <p className="text-xs text-stone-400">{animal.type}</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                <div className="flex flex-col items-center bg-stone-900/50 rounded p-2">
                  <Heart size={14} className={getHealthColor(animal.health)} />
                  <span className={`text-xs mt-1 ${getHealthColor(animal.health)}`}>
                    {animal.health}%
                  </span>
                  <span className="text-[10px] text-stone-500">Health</span>
                </div>
                <div className="flex flex-col items-center bg-stone-900/50 rounded p-2">
                  <Sparkles size={14} className="text-purple-400" />
                  <span className="text-xs text-stone-300 mt-1">{animal.happiness}%</span>
                  <span className="text-[10px] text-stone-500">Mood</span>
                </div>
                <div className="flex flex-col items-center bg-stone-900/50 rounded p-2">
                  <Utensils size={14} className={animal.hunger > 50 ? 'text-red-400' : 'text-stone-400'} />
                  <span className={`text-xs mt-1 ${animal.hunger > 50 ? 'text-red-400' : 'text-stone-300'}`}>
                    {animal.hunger}%
                  </span>
                  <span className="text-[10px] text-stone-500">Hunger</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleFeed(animal.id)}
                  disabled={loading || animal.fedToday}
                  className="flex flex-col items-center justify-center p-2 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-stone-300"
                >
                  <Utensils size={16} className="mb-1" />
                  Feed
                </button>
                <button
                  onClick={() => handlePet(animal.id)}
                  disabled={loading || animal.petToday}
                  className="flex flex-col items-center justify-center p-2 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-stone-300"
                >
                  <Hand size={16} className="mb-1" />
                  Pet
                </button>
                <button
                  onClick={() => handleCollect(animal.id, animal.type)}
                  disabled={loading || !animal.productionReady || animal.producedToday}
                  className="flex flex-col items-center justify-center p-2 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-stone-300"
                >
                  <Package size={16} className="mb-1" />
                  Collect
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
