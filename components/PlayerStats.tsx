'use client';

import { getXPProgress } from '@/lib/game-logic';
import { Coins, Zap, TrendingUp, CloudSun, Sunrise, Sunset, Moon, Sun } from 'lucide-react';

interface PlayerStatsProps {
  player: {
    name: string;
    level: number;
    xp: number;
    coins: number;
    energy: number;
    maxEnergy: number;
  };
  gameState: {
    day: number;
    season: string;
    timeOfDay: string;
  } | null;
}

export function PlayerStats({ player, gameState }: PlayerStatsProps) {
  const xpProgress = getXPProgress(player.xp, player.level);
  const energyPercent = (player.energy / player.maxEnergy) * 100;

  const getTimeIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'MORNING':
        return <Sunrise size={16} className="text-amber-400" />;
      case 'AFTERNOON':
        return <Sun size={16} className="text-yellow-400" />;
      case 'EVENING':
        return <Sunset size={16} className="text-orange-400" />;
      case 'NIGHT':
        return <Moon size={16} className="text-blue-300" />;
      default:
        return <CloudSun size={16} />;
    }
  };

  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4 shadow-lg">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Coins */}
        <div className="flex items-center gap-3">
          <Coins size={24} className="text-amber-400" />
          <div>
            <p className="text-xs text-stone-400 uppercase font-bold">Coins</p>
            <p className="text-xl font-mono-game text-amber-400">{player.coins}</p>
          </div>
        </div>

        {/* Level */}
        <div className="flex items-center gap-3">
          <TrendingUp size={24} className="text-emerald-500" />
          <div>
            <p className="text-xs text-stone-400 uppercase font-bold">Level</p>
            <p className="text-xl font-mono-game text-emerald-400">{player.level}</p>
          </div>
        </div>

        {/* Energy Bar */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-blue-400" />
            <p className="text-xs text-stone-400 uppercase font-bold">Energy</p>
            <span className="text-sm text-stone-300 font-mono-game ml-auto">
              {player.energy} / {player.maxEnergy}
            </span>
          </div>
          <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${energyPercent}%` }}
            />
          </div>
        </div>

        {/* XP Bar */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-purple-400" />
            <p className="text-xs text-stone-400 uppercase font-bold">Experience</p>
            <span className="text-sm text-stone-300 font-mono-game ml-auto">
              {xpProgress.current} / {xpProgress.needed}
            </span>
          </div>
          <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full transition-all duration-300"
              style={{ width: `${xpProgress.percentage}%` }}
            />
          </div>
        </div>

        {/* Game State */}
        {gameState && (
          <div className="col-span-2 pt-3 border-t border-stone-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudSun size={16} className="text-stone-400" />
                <div>
                  <p className="text-xs text-stone-500 uppercase font-bold">Day {gameState.day}</p>
                  <p className="text-xs text-stone-400">{gameState.season}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getTimeIcon(gameState.timeOfDay)}
                <span className="text-xs text-stone-400">{gameState.timeOfDay}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
