'use client';

import { useState } from 'react';
import { LivestockType } from '@prisma/client';
import { feedAnimalAction, petAnimalAction, collectProductAction, feedAllAnimalsAction } from '@/app/actions/livestock';
import { LIVESTOCK_DATA } from '@/lib/constants';

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
    if (!result.success) alert(result.error);
  };

  const handleFeedAll = async () => {
    setLoading(true);
    const result = await feedAllAnimalsAction(playerId);
    setLoading(false);
    if (result.success) {
      alert(`Fed ${result.fed} animals!`);
    } else {
      alert(result.error);
    }
  };

  const handlePet = async (animalId: string) => {
    setLoading(true);
    const result = await petAnimalAction(playerId, animalId);
    setLoading(false);
    if (!result.success) alert(result.error);
  };

  const handleCollect = async (animalId: string, animalType: LivestockType) => {
    setLoading(true);
    const result = await collectProductAction(playerId, animalId, animalType);
    setLoading(false);
    if (result.success) {
      alert(`Collected! Earned ${result.earned} coins`);
    } else {
      alert(result.error);
    }
  };

  if (livestock.length === 0) {
    return (
      <div className="border border-green-700 bg-green-950/30 p-4 rounded">
        <h2 className="text-xl font-bold text-green-400 mb-3">Livestock</h2>
        <p className="text-gray-400 text-sm">No animals yet. Visit the shop to buy some!</p>
      </div>
    );
  }

  return (
    <div className="border border-green-700 bg-green-950/30 p-4 rounded">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-green-400">Livestock ({livestock.length})</h2>
        <button
          onClick={handleFeedAll}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded text-sm"
        >
          Feed All
        </button>
      </div>

      <div className="space-y-2">
        {livestock.map((animal) => {
          const data = LIVESTOCK_DATA[animal.type];
          return (
            <div key={animal.id} className="border border-green-800 bg-green-900/30 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{data.emoji}</span>
                  <div>
                    <div className="font-bold text-green-300">
                      {animal.name || data.name}
                    </div>
                    <div className="text-xs text-gray-400">{animal.type}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {animal.health}❤️ {animal.happiness}😊 {animal.hunger}🍖
                </div>
              </div>

              <div className="flex gap-2">
                {!animal.fedToday && (
                  <button
                    onClick={() => handleFeed(animal.id)}
                    disabled={loading}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded text-xs"
                  >
                    Feed (-4 energy)
                  </button>
                )}
                {!animal.petToday && (
                  <button
                    onClick={() => handlePet(animal.id)}
                    disabled={loading}
                    className="px-2 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 rounded text-xs"
                  >
                    Pet (-2 energy)
                  </button>
                )}
                {animal.productionReady && !animal.producedToday && (
                  <button
                    onClick={() => handleCollect(animal.id, animal.type)}
                    disabled={loading}
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 rounded text-xs"
                  >
                    Collect {data.product} (-3 energy)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
