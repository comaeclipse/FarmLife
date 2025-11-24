import React from 'react';
import type { Horse } from '@/types';
import { Heart, Utensils, Dumbbell, Brush, Sparkles, Battery, BadgeCheck, TrendingUp } from 'lucide-react';
import { XP_THRESHOLDS, MAX_LEVEL } from '@/config';

interface HorseCardProps {
  horse: Horse;
  onFeed: (id: string) => void;
  onGroom: (id: string) => void;
  onTrain: (id: string) => void;
  onRename: (id: string) => void;
  disabled: boolean;
}

export const HorseCard: React.FC<HorseCardProps> = ({ horse, onFeed, onGroom, onTrain, onRename, disabled }) => {
  
  const getHealthColor = (val: number) => {
    if (val > 80) return 'text-emerald-400';
    if (val > 40) return 'text-yellow-400';
    return 'text-red-500';
  };

  // Calculate XP Progress for the bar
  // If Level 1 (0 XP) -> Next is 100. Progress = current / 100
  // If Level 2 (120 XP) -> Prev Threshold 100, Next 300. Range 200. Progress = (120-100)/200
  const currentLevelBase = XP_THRESHOLDS[horse.level - 1] || 0;
  const nextLevelThreshold = XP_THRESHOLDS[horse.level] || XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
  const isMaxLevel = horse.level >= MAX_LEVEL;
  
  let xpProgress = 0;
  if (!isMaxLevel) {
    const range = nextLevelThreshold - currentLevelBase;
    const currentInLevel = horse.experience - currentLevelBase;
    xpProgress = Math.max(0, Math.min(100, (currentInLevel / range) * 100));
  } else {
    xpProgress = 100;
  }

  // Training threshold to unlock naming (Level 2)
  const NAMING_LEVEL_REQ = 2;
  const canName = !horse.isNamed && horse.level >= NAMING_LEVEL_REQ;

  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4 shadow-md hover:border-stone-500 transition-colors relative overflow-hidden group">
      {canName && (
        <div className="absolute top-0 right-0 p-2">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={`text-lg font-bold flex items-center gap-1 ${horse.isNamed ? 'text-amber-400' : 'text-stone-100'}`}>
            {horse.name} 
            {horse.isNamed && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
          </h3>
          <div className="flex items-center gap-2 text-xs">
             <span className="text-stone-400">{horse.breed}</span>
             <span className="text-stone-600">&bull;</span>
             <span className="text-stone-400">{Math.floor(horse.age / 12)}y {horse.age % 12}m</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
            <span className="px-2 py-1 text-xs rounded bg-stone-900 text-amber-400 border border-stone-700 font-mono-game mb-1">
            ${horse.value}
            </span>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider border border-emerald-900/30 bg-emerald-900/10 px-1 rounded">
                Lvl {horse.level}
            </span>
        </div>
      </div>

      <p className="text-xs italic text-stone-500 mb-4 border-l-2 border-stone-600 pl-2">
        "{horse.bio}"
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-stone-400 flex items-center gap-1"><Heart size={12} /> Health</span>
          <span className={getHealthColor(horse.health)}>{horse.health}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-stone-400 flex items-center gap-1"><Utensils size={12} /> Hunger</span>
          <span className={horse.hunger > 50 ? 'text-red-400' : 'text-stone-300'}>{horse.hunger}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-stone-400 flex items-center gap-1"><Sparkles size={12} /> Mood</span>
          <span className="text-stone-300">{horse.happiness}%</span>
        </div>
        
        {/* Stamina Bar */}
         <div className="flex justify-between items-center col-span-2">
           <span className="text-stone-400 flex items-center gap-1 w-20"><Battery size={12} /> Stamina</span>
           <div className="flex-1 ml-2 h-1.5 bg-stone-900 rounded-full overflow-hidden">
             <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${horse.stamina}%` }}></div>
           </div>
        </div>

        {/* XP Bar */}
        <div className="col-span-2 bg-stone-900/50 rounded p-2 border border-stone-700/50">
             <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-stone-400 flex items-center gap-1"><Dumbbell size={12} /> Experience</span>
                <span className="text-stone-500 font-mono-game">{Math.floor(horse.experience)} / {isMaxLevel ? 'MAX' : nextLevelThreshold}</span>
             </div>
             <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden relative">
                <div 
                    className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full transition-all duration-500" 
                    style={{ width: `${xpProgress}%` }}
                ></div>
             </div>
        </div>
      </div>

      {/* Naming CTA or Progress */}
      {!horse.isNamed && (
        <div className="mb-3">
          {canName ? (
            <button
              onClick={() => onRename(horse.id)}
              disabled={disabled}
              className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold rounded flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-[1.02]"
            >
              <Sparkles size={16} className="text-yellow-300" /> Reveal True Name
            </button>
          ) : (
            <div className="text-[10px] text-center text-stone-500 uppercase tracking-wider bg-stone-900/50 rounded py-1">
              Reach Level {NAMING_LEVEL_REQ} to unlock naming
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2 mt-auto">
        <button
          onClick={() => onFeed(horse.id)}
          disabled={disabled || horse.hunger === 0}
          className="flex flex-col items-center justify-center p-2 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-stone-300"
        >
          <Utensils size={16} className="mb-1" />
          Feed
        </button>
        <button
          onClick={() => onGroom(horse.id)}
          disabled={disabled || horse.happiness >= 100 || horse.stamina < 10}
          className="flex flex-col items-center justify-center p-2 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-stone-300"
        >
          <Brush size={16} className="mb-1" />
          Groom
        </button>
        <button
          onClick={() => onTrain(horse.id)}
          disabled={disabled || horse.stamina < 30 || horse.level >= MAX_LEVEL}
          className="flex flex-col items-center justify-center p-2 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-stone-300"
        >
          <TrendingUp size={16} className="mb-1" />
          Train
        </button>
      </div>
    </div>
  );
};