'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { feedHorseAction, groomHorseAction, trainHorseAction, rideHorseAction } from '@/app/actions/horses';
import { HORSE_DATA } from '@/lib/constants';
import { Heart, Sparkles, Utensils, Brush, GraduationCap, HeartHandshake } from 'lucide-react';

interface Horse {
  id: string;
  name: string;
  health: number;
  happiness: number;
  hunger: number;
  grooming: number;
  training: number;
  bonding: number;
  fedToday: boolean;
  groomedToday: boolean;
  trainedToday: boolean;
  riddenToday: boolean;
}

interface HorseListProps {
  playerId: string;
  horses: Horse[];
}

export function HorseList({ playerId, horses }: HorseListProps) {
  const [loading, setLoading] = useState(false);

  const handleFeed = async (horseId: string) => {
    setLoading(true);
    const result = await feedHorseAction(playerId, horseId);
    setLoading(false);
    if (!result.success) toast.error(result.error);
  };

  const handleGroom = async (horseId: string) => {
    setLoading(true);
    const result = await groomHorseAction(playerId, horseId);
    setLoading(false);
    if (!result.success) toast.error(result.error);
  };

  const handleTrain = async (horseId: string) => {
    setLoading(true);
    const result = await trainHorseAction(playerId, horseId);
    setLoading(false);
    if (!result.success) toast.error(result.error);
  };

  const handleRide = async (horseId: string) => {
    setLoading(true);
    const result = await rideHorseAction(playerId, horseId);
    setLoading(false);
    if (!result.success) toast.error(result.error);
  };

  const getHealthColor = (val: number) => {
    if (val > 80) return 'text-emerald-400';
    if (val > 40) return 'text-yellow-400';
    return 'text-red-500';
  };

  const getProgressColor = (val: number) => {
    if (val > 80) return 'bg-emerald-500';
    if (val > 50) return 'bg-blue-500';
    if (val > 20) return 'bg-yellow-500';
    return 'bg-stone-600';
  };

  if (horses.length === 0) {
    return (
      <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
        <h2 className="text-xl font-bold text-stone-300 mb-3">Horses</h2>
        <div className="bg-stone-800/50 border border-dashed border-stone-700 rounded-lg p-8 text-center text-stone-500">
          <p className="mb-2">No horses yet.</p>
          <p className="text-sm">Visit the shop to buy a horse!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
      <h2 className="text-xl font-bold text-stone-300 mb-4">Horses</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {horses.map((horse) => {
          return (
            <div
              key={horse.id}
              className="bg-stone-800 border border-stone-700 rounded-lg p-4 shadow-md hover:border-stone-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{HORSE_DATA.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold text-stone-100">{horse.name}</h3>
                    <p className="text-xs text-stone-400">Horse</p>
                  </div>
                </div>
              </div>

              {/* Basic Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                <div className="flex flex-col items-center bg-stone-900/50 rounded p-2">
                  <Heart size={14} className={getHealthColor(horse.health)} />
                  <span className={`text-xs mt-1 ${getHealthColor(horse.health)}`}>
                    {horse.health}%
                  </span>
                  <span className="text-[10px] text-stone-500">Health</span>
                </div>
                <div className="flex flex-col items-center bg-stone-900/50 rounded p-2">
                  <Sparkles size={14} className="text-purple-400" />
                  <span className="text-xs text-stone-300 mt-1">{horse.happiness}%</span>
                  <span className="text-[10px] text-stone-500">Mood</span>
                </div>
                <div className="flex flex-col items-center bg-stone-900/50 rounded p-2">
                  <Utensils size={14} className={horse.hunger > 50 ? 'text-red-400' : 'text-stone-400'} />
                  <span className={`text-xs mt-1 ${horse.hunger > 50 ? 'text-red-400' : 'text-stone-300'}`}>
                    {horse.hunger}%
                  </span>
                  <span className="text-[10px] text-stone-500">Hunger</span>
                </div>
              </div>

              {/* Horse-Specific Progress Bars */}
              <div className="space-y-2 mb-4">
                <div>
                  <div className="flex justify-between text-xs text-stone-400 mb-1">
                    <span>Grooming</span>
                    <span>{horse.grooming}%</span>
                  </div>
                  <div className="h-2 bg-stone-900 rounded-full overflow-hidden">
                    <div className={`h-full ${getProgressColor(horse.grooming)} transition-all`} style={{width: `${horse.grooming}%`}} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-stone-400 mb-1">
                    <span>Training</span>
                    <span>{horse.training}%</span>
                  </div>
                  <div className="h-2 bg-stone-900 rounded-full overflow-hidden">
                    <div className={`h-full ${getProgressColor(horse.training)} transition-all`} style={{width: `${horse.training}%`}} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-stone-400 mb-1">
                    <span>Bonding</span>
                    <span>{horse.bonding}%</span>
                  </div>
                  <div className="h-2 bg-stone-900 rounded-full overflow-hidden">
                    <div className={`h-full bg-pink-500 transition-all`} style={{width: `${horse.bonding}%`}} />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={() => handleFeed(horse.id)}
                  disabled={loading || horse.fedToday}
                  className="flex flex-col items-center justify-center p-2 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-stone-300"
                  title="Feed"
                >
                  <Utensils size={14} />
                </button>
                <button
                  onClick={() => handleGroom(horse.id)}
                  disabled={loading || horse.groomedToday}
                  className="flex flex-col items-center justify-center p-2 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-stone-300"
                  title="Groom"
                >
                  <Brush size={14} />
                </button>
                <button
                  onClick={() => handleTrain(horse.id)}
                  disabled={loading || horse.trainedToday}
                  className="flex flex-col items-center justify-center p-2 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-stone-300"
                  title="Train"
                >
                  <GraduationCap size={14} />
                </button>
                <button
                  onClick={() => handleRide(horse.id)}
                  disabled={loading || horse.riddenToday}
                  className="flex flex-col items-center justify-center p-2 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-stone-300"
                  title="Ride"
                >
                  <HeartHandshake size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
