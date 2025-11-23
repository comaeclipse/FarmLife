'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { completeChoreAction } from '@/app/actions/player';

interface Chore {
  id: string;
  type: string;
  description: string;
  xpReward: number;
  coinReward: number;
  completed: boolean;
}

interface ChoresListProps {
  playerId: string;
  chores: Chore[];
}

export function ChoresList({ playerId, chores }: ChoresListProps) {
  const [loading, setLoading] = useState(false);

  const handleComplete = async (choreId: string) => {
    setLoading(true);
    const result = await completeChoreAction(playerId, choreId);
    setLoading(false);

    if (result.success && result.rewards) {
      toast.success(`Completed! Earned ${result.rewards.coins} coins and ${result.rewards.xp} XP`);
    } else if (!result.success) {
      toast.error(result.error);
    }
  };

  const pendingChores = chores.filter((c) => !c.completed);

  return (
    <div className="border border-green-700 bg-green-950/30 p-4 rounded">
      <h2 className="text-xl font-bold text-green-400 mb-3">Daily Chores</h2>

      {pendingChores.length === 0 ? (
        <p className="text-gray-400 text-sm">No chores available. Check back tomorrow!</p>
      ) : (
        <div className="space-y-2">
          {pendingChores.map((chore) => (
            <div key={chore.id} className="border border-green-800 bg-green-900/30 p-3 rounded">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-green-300">{chore.description}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Rewards: {chore.coinReward} coins, {chore.xpReward} XP
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleComplete(chore.id)}
                disabled={loading}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 rounded text-sm w-full"
              >
                Complete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
