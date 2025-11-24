import React from 'react';
import type { GameState } from '@/types';
import { Coins, Wheat, Activity, Zap, CloudSun, Fence, Egg, Milk } from 'lucide-react';

interface ResourceBarProps {
  state: GameState;
}

export const ResourceBar: React.FC<ResourceBarProps> = ({ state }) => {
  return (
    <div className="bg-stone-800 p-4 rounded-lg shadow-lg border border-stone-700 mb-6 space-y-4">
      
      {/* Top Row: Primary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="flex items-center gap-3 text-amber-400">
          <Coins size={20} />
          <div>
            <p className="text-xs text-stone-400 uppercase font-bold">Funds</p>
            <p className="text-xl font-mono-game">${state.money}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-yellow-600">
          <Wheat size={20} />
          <div>
            <p className="text-xs text-stone-400 uppercase font-bold">Feed</p>
            <p className="text-xl font-mono-game">{Math.floor(state.feed)} <span className="text-sm text-stone-500">bales</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-blue-400">
          <Zap size={20} />
          <div>
            <p className="text-xs text-stone-400 uppercase font-bold">Energy</p>
            <p className="text-xl font-mono-game">{state.energy} / {state.maxEnergy}</p>
          </div>
        </div>

         <div className="flex items-center gap-3 text-purple-400">
          <CloudSun size={20} />
          <div>
            <p className="text-xs text-stone-400 uppercase font-bold">Day {state.day}</p>
            <p className="text-sm text-stone-300">{state.weather}</p>
          </div>
        </div>

        {/* Inventory Mini-View (Visible on larger screens in this row) */}
        <div className="hidden md:flex items-center gap-4 text-stone-300 border-l border-stone-700 pl-4">
            <div className="flex items-center gap-2" title="Eggs">
                <Egg size={16} className="text-orange-200" />
                <span className="font-mono-game">{state.eggs}</span>
            </div>
            <div className="flex items-center gap-2" title="Milk">
                <Milk size={16} className="text-blue-100" />
                <span className="font-mono-game">{state.milk}</span>
            </div>
        </div>
      </div>

      {/* Second Row: Condition Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-700/50">
        <div className="flex items-center gap-3 text-emerald-500">
          <Activity size={18} />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-stone-400 uppercase font-bold mb-1">
                <span>Stable Hygiene</span>
                <span>{state.cleanliness}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${state.cleanliness > 50 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                style={{ width: `${state.cleanliness}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-stone-400">
          <Fence size={18} />
          <div className="flex-1">
             <div className="flex justify-between text-xs text-stone-400 uppercase font-bold mb-1">
                <span>Fences & Infrastructure</span>
                <span>{state.infrastructure}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${state.infrastructure > 50 ? 'bg-stone-400' : 'bg-red-500'}`} 
                style={{ width: `${state.infrastructure}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Inventory View */}
      <div className="md:hidden flex gap-6 pt-2 text-stone-300 text-sm">
         <div className="flex items-center gap-2">
                <Egg size={16} className="text-orange-200" />
                <span className="font-mono-game">{state.eggs} Eggs</span>
            </div>
            <div className="flex items-center gap-2">
                <Milk size={16} className="text-blue-100" />
                <span className="font-mono-game">{state.milk} Milk</span>
            </div>
      </div>

    </div>
  );
};