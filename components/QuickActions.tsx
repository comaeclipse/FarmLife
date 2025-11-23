'use client';

import { useState } from 'react';
import { waterAllCropsAction } from '@/app/actions/crops';
import { restAction, processDailyUpdateAction } from '@/app/actions/player';

interface QuickActionsProps {
  playerId: string;
}

export function QuickActions({ playerId }: QuickActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleWaterAll = async () => {
    setLoading(true);
    const result = await waterAllCropsAction(playerId);
    setLoading(false);

    if (result.success) {
      alert(`Watered ${result.watered} crops!`);
    } else {
      alert(result.error);
    }
  };

  const handleRest = async () => {
    setLoading(true);
    const result = await restAction(playerId);
    setLoading(false);

    if (result.success) {
      alert(`Restored ${result.energyRestored} energy!`);
    } else {
      alert(result.error);
    }
  };

  const handleNewDay = async () => {
    if (!confirm('Start a new day? This will reset daily tasks and update your farm.')) {
      return;
    }

    setLoading(true);
    const result = await processDailyUpdateAction(playerId);
    setLoading(false);

    if (result.success) {
      if (result.event) {
        alert(`New day started! Event: ${result.event.title} - ${result.event.description}`);
      } else {
        alert('New day started!');
      }
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="border border-green-700 bg-green-950/30 p-4 rounded">
      <h2 className="text-xl font-bold text-green-400 mb-3">Quick Actions</h2>

      <div className="space-y-2">
        <button
          onClick={handleWaterAll}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded text-sm font-bold"
        >
          💧 Water All Crops
        </button>

        <button
          onClick={handleRest}
          disabled={loading}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 rounded text-sm font-bold"
        >
          😴 Rest (+30 Energy)
        </button>

        <button
          onClick={handleNewDay}
          disabled={loading}
          className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 rounded text-sm font-bold"
        >
          🌅 Start New Day
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-green-800">
        <p className="text-xs text-gray-400">
          Tip: Complete chores and tend your farm daily for maximum rewards!
        </p>
      </div>
    </div>
  );
}
