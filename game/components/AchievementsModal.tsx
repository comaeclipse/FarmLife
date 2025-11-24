
import React from 'react';
import type { GameState } from '@/types';
import { ACHIEVEMENTS } from '@/config';
import { Trophy, Lock, X } from 'lucide-react';

interface AchievementsModalProps {
  state: GameState;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ state, onClose }) => {
  const categories = ['EARLY', 'MID', 'LATE'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-600 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col relative">
        
        {/* Header */}
        <div className="bg-amber-900/20 border-b border-stone-700 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-amber-500/20 p-2 rounded-full border border-amber-500/50">
                <Trophy size={20} className="text-amber-400" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-amber-100 font-mono-game">Achievements</h2>
                <p className="text-xs text-stone-400">
                    Unlocked: {state.unlockedAchievements.length} / {ACHIEVEMENTS.length}
                </p>
             </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {categories.map(category => (
                <div key={category}>
                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4 border-b border-stone-800 pb-2">
                        {category} Game
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ACHIEVEMENTS.filter(a => a.category === category).map(achievement => {
                            const isUnlocked = state.unlockedAchievements.includes(achievement.id);
                            return (
                                <div 
                                    key={achievement.id}
                                    className={`relative p-4 rounded border flex gap-3 items-start transition-all
                                        ${isUnlocked 
                                            ? 'bg-stone-800 border-amber-900/50 shadow-lg shadow-amber-900/10' 
                                            : 'bg-stone-900/50 border-stone-800 opacity-75'
                                        }
                                    `}
                                >
                                    {isUnlocked ? (
                                        <Trophy size={24} className="text-amber-400 shrink-0 mt-1" />
                                    ) : (
                                        <Lock size={24} className="text-stone-600 shrink-0 mt-1" />
                                    )}
                                    
                                    <div>
                                        <h4 className={`font-bold text-sm ${isUnlocked ? 'text-stone-200' : 'text-stone-500'}`}>
                                            {achievement.title}
                                        </h4>
                                        <p className="text-xs text-stone-400 mt-1">
                                            {achievement.description}
                                        </p>
                                    </div>

                                    {isUnlocked && (
                                        <div className="absolute top-2 right-2">
                                            <span className="flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};
