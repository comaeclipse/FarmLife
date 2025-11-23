'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { waterAllCropsAction } from '@/app/actions/crops';
import { restAction, processDailyUpdateAction } from '@/app/actions/player';
import { Droplets, Bed, Sunrise, Shovel } from 'lucide-react';

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
      toast.success(`Watered ${result.watered} crops!`);
    } else {
      toast.error(result.error);
    }
  };

  const handleRest = async () => {
    setLoading(true);
    const result = await restAction(playerId);
    setLoading(false);

    if (result.success) {
      toast.success(`Restored ${result.energyRestored} energy!`);
    } else {
      toast.error(result.error);
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
        toast.success(`New day started! Event: ${result.event.title} - ${result.event.description}`);
      } else {
        toast.success('New day started!');
      }
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
      <h3 className="text-sm font-bold text-stone-400 uppercase mb-3 flex items-center gap-2">
        <Shovel size={16} /> Quick Actions
      </h3>

      <div className="space-y-2">
        <button
          onClick={handleWaterAll}
          disabled={loading}
          className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded flex items-center gap-2 group transition-colors disabled:opacity-50"
        >
          <Droplets size={16} className="text-blue-400" />
          <span>Water All Crops</span>
        </button>

        <button
          onClick={handleRest}
          disabled={loading}
          className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded flex items-center gap-2 group transition-colors disabled:opacity-50"
        >
          <Bed size={16} className="text-purple-400" />
          <span>Rest</span>
          <span className="text-xs text-stone-400 bg-stone-900 px-2 py-0.5 rounded ml-auto">+30</span>
        </button>

        <button
          onClick={handleNewDay}
          disabled={loading}
          className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded flex items-center gap-2 group transition-colors disabled:opacity-50"
        >
          <Sunrise size={16} className="text-amber-400" />
          <span>Start New Day</span>
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-stone-700">
        <p className="text-xs text-stone-500 italic">
          Tip: Complete chores and tend your farm daily for maximum rewards!
        </p>
      </div>
    </div>
  );
}
