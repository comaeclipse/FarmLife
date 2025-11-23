'use client';

import { useState } from 'react';
import { FlockType } from '@prisma/client';
import { toast } from 'sonner';
import { feedFlockAction, collectFlockProductsAction } from '@/app/actions/flocks';
import { FLOCK_DATA } from '@/lib/constants';
import { Heart, Sparkles, Utensils, Package } from 'lucide-react';

interface Flock {
  id: string;
  type: FlockType;
  count: number;
  maxCount: number;
  health: number;
  happiness: number;
  hunger: number;
  fedToday: boolean;
  productionReady: number;
  producedToday: boolean;
}

interface FlockListProps {
  playerId: string;
  flocks: Flock[];
}

export function FlockList({ playerId, flocks }: FlockListProps) {
  const [loading, setLoading] = useState(false);

  const handleFeed = async (flockId: string) => {
    setLoading(true);
    const result = await feedFlockAction(playerId, flockId);
    setLoading(false);

    if (result.success) {
      toast.success(`Fed ${result.fedCount} animals!`);
    } else {
      toast.error(result.error);
    }
  };

  const handleCollect = async (flockId: string, flockType: FlockType) => {
    setLoading(true);
    const result = await collectFlockProductsAction(playerId, flockId, flockType);
    setLoading(false);

    if (result.success) {
      toast.success(`Collected ${result.collected} products! Earned ${result.earned} coins`);
    } else {
      toast.error(result.error);
    }
  };

  const getHealthColor = (val: number) => {
    if (val > 80) return 'text-emerald-400';
    if (val > 40) return 'text-yellow-400';
    return 'text-red-500';
  };

  if (flocks.length === 0) {
    return (
      <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
        <h2 className="text-xl font-bold text-stone-300 mb-3">Flocks & Herds</h2>
        <div className="bg-stone-800/50 border border-dashed border-stone-700 rounded-lg p-8 text-center text-stone-500">
          <p className="mb-2">No flocks yet.</p>
          <p className="text-sm">Visit the shop to buy some animals!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
      <h2 className="text-xl font-bold text-stone-300 mb-4">Flocks & Herds</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flocks.map((flock) => {
          const data = FLOCK_DATA[flock.type];
          return (
            <div
              key={flock.id}
              className="bg-stone-800 border border-stone-700 rounded-lg p-4 shadow-md hover:border-stone-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{data.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold text-stone-100">
                      {data.namePlural}
                    </h3>
                    <p className="text-xs text-stone-400">
                      {flock.count} / {flock.maxCount} animals
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                <div className="flex flex-col items-center bg-stone-900/50 rounded p-2">
                  <Heart size={14} className={getHealthColor(flock.health)} />
                  <span className={`text-xs mt-1 ${getHealthColor(flock.health)}`}>
                    {flock.health}%
                  </span>
                  <span className="text-[10px] text-stone-500">Health</span>
                </div>
                <div className="flex flex-col items-center bg-stone-900/50 rounded p-2">
                  <Sparkles size={14} className="text-purple-400" />
                  <span className="text-xs text-stone-300 mt-1">{flock.happiness}%</span>
                  <span className="text-[10px] text-stone-500">Mood</span>
                </div>
                <div className="flex flex-col items-center bg-stone-900/50 rounded p-2">
                  <Utensils size={14} className={flock.hunger > 50 ? 'text-red-400' : 'text-stone-400'} />
                  <span className={`text-xs mt-1 ${flock.hunger > 50 ? 'text-red-400' : 'text-stone-300'}`}>
                    {flock.hunger}%
                  </span>
                  <span className="text-[10px] text-stone-500">Hunger</span>
                </div>
              </div>

              {/* Production Status */}
              {flock.productionReady > 0 && (
                <div className="mb-3 bg-green-900/20 border border-green-700 rounded p-2 text-xs text-green-300">
                  {flock.productionReady} {data.product}(s) ready to collect!
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleFeed(flock.id)}
                  disabled={loading || flock.fedToday}
                  className="flex flex-col items-center justify-center p-2 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-stone-300"
                >
                  <Utensils size={16} className="mb-1" />
                  Feed Flock
                </button>
                <button
                  onClick={() => handleCollect(flock.id, flock.type)}
                  disabled={loading || flock.productionReady === 0 || flock.producedToday}
                  className="flex flex-col items-center justify-center p-2 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-stone-300"
                >
                  <Package size={16} className="mb-1" />
                  Collect ({flock.productionReady})
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
