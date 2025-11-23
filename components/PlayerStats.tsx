'use client';

import { getXPProgress } from '@/lib/game-logic';

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

  return (
    <div className="border border-green-700 bg-green-950/30 p-4 rounded">
      <h2 className="text-xl font-bold text-green-400 mb-3">{player.name}&apos;s Farm</h2>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-gray-400">Level</div>
          <div className="text-lg font-bold text-green-300">{player.level}</div>
        </div>
        <div>
          <div className="text-gray-400">Coins</div>
          <div className="text-lg font-bold text-yellow-400">{player.coins}</div>
        </div>

        <div className="col-span-2">
          <div className="text-gray-400 mb-1">Energy</div>
          <div className="w-full bg-gray-800 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all"
              style={{ width: `${energyPercent}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {player.energy} / {player.maxEnergy}
          </div>
        </div>

        <div className="col-span-2">
          <div className="text-gray-400 mb-1">XP</div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all"
              style={{ width: `${xpProgress.percentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {xpProgress.current} / {xpProgress.needed}
          </div>
        </div>

        {gameState && (
          <div className="col-span-2 pt-2 border-t border-green-800">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Day {gameState.day}</span>
              <span className="text-gray-400">{gameState.season}</span>
              <span className="text-gray-400">{gameState.timeOfDay}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
