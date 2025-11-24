
import React from 'react';
import { Home, Egg, Milk, Scale, Beef, Shovel, Hammer, Mountain, Trash2 } from 'lucide-react';
import type { GameState } from '@/types';
import { HorseCard } from './HorseCard';

interface LivestockScreenProps {
  state: GameState;
  isProcessing: boolean;
  actions: {
    feedHorse: (id: string) => void;
    groomHorse: (id: string) => void;
    trainHorse: (id: string) => void;
    revealHorseName: (id: string) => void;
    toggleCoopMode: () => void;
    cleanStable: () => void;
    repairFences: () => void;
    collectEggs: () => void;
    collectManure: () => void;
    milkCows: () => void;
    milkGoats: () => void;
    sellChicken: () => void;
  };
}

export const LivestockScreen: React.FC<LivestockScreenProps> = ({ state, isProcessing, actions }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto">
      {/* LEFT COLUMN: Stables & Horses */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-300 flex items-center gap-2">
            <Home size={20} /> Stables ({state.horses.length})
          </h2>

          {state.horses.length === 0 ? (
            <div className="bg-stone-800/50 border border-dashed border-stone-700 rounded-lg p-8 text-center text-stone-500">
              <p className="mb-2">Your stable is empty.</p>
              <p className="text-sm">Visit the Store to buy your first horse.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.horses.map(horse => (
                <HorseCard 
                  key={horse.id} 
                  horse={horse} 
                  onFeed={actions.feedHorse} 
                  onGroom={actions.groomHorse} 
                  onTrain={actions.trainHorse}
                  onRename={actions.revealHorseName}
                  disabled={isProcessing || !!state.activeEvent}
                />
              ))}
            </div>
          )}
        </div>

        {/* Livestock Herds */}
        <h2 className="text-xl font-bold text-stone-300 flex items-center gap-2 mt-8">
            <Beef size={20} /> Herds & Flocks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 items-stretch">
            {/* Chickens Card */}
            <div className="bg-stone-800 border border-stone-700 rounded p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="text-stone-400 text-xs font-bold uppercase mb-1 flex items-center gap-2 h-6">
                            Chickens
                            {state.isFreeRange ? (
                            <span className="text-[10px] bg-emerald-900 text-emerald-300 px-1 rounded border border-emerald-800">Free Range</span>
                            ) : (
                            <span className="text-[10px] bg-stone-700 text-stone-400 px-1 rounded border border-stone-600">Caged</span>
                            )}
                        </h4>
                        <p className="text-2xl font-mono-game text-stone-200">{state.chickens}</p>
                    </div>
                    <Egg className="text-stone-600" size={28} />
                </div>
                
                <div className="space-y-2 mt-auto">
                     <button 
                        onClick={actions.toggleCoopMode}
                        disabled={isProcessing || !!state.activeEvent}
                        className="w-full text-xs py-1.5 rounded bg-stone-700 hover:bg-stone-600 text-stone-300 flex items-center justify-center gap-2 transition-colors border border-stone-600 disabled:opacity-50"
                        title={state.isFreeRange ? "Switch to Caged (Cheaper feed, cheaper eggs)" : "Switch to Free Range (Higher feed cost, expensive eggs)"}
                    >
                        <Scale size={12} />
                        {state.isFreeRange ? "Cage Flock" : "Set Free Range"}
                    </button>
                    <button 
                         onClick={actions.sellChicken}
                         disabled={isProcessing || state.chickens === 0 || !!state.activeEvent}
                         className="w-full text-xs py-1.5 rounded bg-amber-900/30 hover:bg-amber-900/50 text-amber-500 border border-amber-800/50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Beef size={12} /> Sell (-1)
                    </button>
                </div>
            </div>

            {/* Dairy Cows Card */}
            <div className="bg-stone-800 border border-stone-700 rounded p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="text-stone-400 text-xs font-bold uppercase mb-1 h-6 flex items-center">Dairy Cows</h4>
                        <p className="text-2xl font-mono-game text-stone-200">{state.dairyCows}</p>
                    </div>
                    <Milk className="text-stone-600" size={28} />
                </div>
                <div className="h-[26px]"></div> {/* Spacer */}
            </div>

            {/* Beef Cattle Card */}
            <div className="bg-stone-800 border border-stone-700 rounded p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="text-stone-400 text-xs font-bold uppercase mb-1 h-6 flex items-center">Beef Cattle</h4>
                        <p className="text-2xl font-mono-game text-stone-200">{state.beefCows}</p>
                    </div>
                    <Beef className="text-stone-600" size={28} />
                </div>
                <div className="text-[10px] text-stone-500 mt-auto flex items-center justify-center h-[26px] bg-stone-900/30 rounded border border-stone-800">
                        Market: <span className="text-emerald-500 ml-1">${state.beefPrice}</span>
                </div>
            </div>

             {/* Goats Card */}
             <div className="bg-stone-800 border border-stone-700 rounded p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="text-stone-400 text-xs font-bold uppercase mb-1 h-6 flex items-center">Goats</h4>
                        <p className="text-2xl font-mono-game text-stone-200">{state.goats}</p>
                    </div>
                    <Mountain className="text-stone-600" size={28} />
                </div>
                <div className="h-[26px]"></div>
            </div>

            {/* Pigs Card */}
             <div className="bg-stone-800 border border-stone-700 rounded p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="text-stone-400 text-xs font-bold uppercase mb-1 h-6 flex items-center">Pigs</h4>
                        <p className="text-2xl font-mono-game text-stone-200">{state.pigs}</p>
                    </div>
                    <div className="text-stone-600 font-bold text-2xl">P</div> 
                </div>
                 <div className="text-[10px] text-stone-500 mt-auto flex items-center justify-center h-[26px] bg-stone-900/30 rounded border border-stone-800">
                        Market: <span className="text-emerald-500 ml-1">${state.pigPrice}</span>
                </div>
            </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Chores */}
      <div>
        <div className="bg-stone-800 border border-stone-700 rounded-lg p-4 sticky top-4">
            <h3 className="text-sm font-bold text-stone-400 uppercase mb-3 flex items-center gap-2">
                <Shovel size={16} /> Animal Chores
            </h3>
            
            <button 
                onClick={actions.cleanStable}
                disabled={isProcessing || state.cleanliness >= 100 || !!state.activeEvent}
                className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded mb-2 flex justify-between items-center group transition-colors disabled:opacity-50"
            >
                <div className="flex items-center gap-2">
                <Shovel size={14} className="text-stone-400" />
                <span className="text-sm">Muck Out Stables</span>
                </div>
                <span className="text-xs text-stone-400 bg-stone-900 px-2 py-0.5 rounded">-20 E</span>
            </button>

            <button 
                onClick={actions.repairFences}
                disabled={isProcessing || state.infrastructure >= 100 || !!state.activeEvent}
                className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded mb-2 flex justify-between items-center group transition-colors disabled:opacity-50"
            >
                <div className="flex items-center gap-2">
                <Hammer size={14} className="text-stone-400" />
                <span className="text-sm">Repair Fences</span>
                </div>
                <span className="text-xs text-stone-400 bg-stone-900 px-2 py-0.5 rounded">-30 E</span>
            </button>

            {state.chickens > 0 && (
                <>
                <button 
                    onClick={actions.collectEggs}
                    disabled={isProcessing || state.hasCollectedEggs || !!state.activeEvent}
                    className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded mb-2 flex justify-between items-center group transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-2">
                    <Egg size={14} className={`text-stone-400 ${state.hasCollectedEggs ? 'opacity-50' : ''}`} />
                    <span className={`text-sm ${state.hasCollectedEggs ? 'text-stone-500 line-through' : ''}`}>
                        {state.hasCollectedEggs ? 'Eggs Collected' : 'Collect Eggs'}
                    </span>
                    </div>
                    <span className="text-xs text-stone-400 bg-stone-900 px-2 py-0.5 rounded">-10 E</span>
                </button>
                 <button 
                    onClick={actions.collectManure}
                    disabled={isProcessing || state.hasCollectedManure || !!state.activeEvent}
                    className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded mb-2 flex justify-between items-center group transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-2">
                    <Trash2 size={14} className={`text-stone-400 ${state.hasCollectedManure ? 'opacity-50' : ''}`} />
                    <span className={`text-sm ${state.hasCollectedManure ? 'text-stone-500 line-through' : ''}`}>
                        {state.hasCollectedManure ? 'Manure Collected' : 'Collect Manure'}
                    </span>
                    </div>
                    <span className="text-xs text-stone-400 bg-stone-900 px-2 py-0.5 rounded">-10 E</span>
                </button>
                </>
            )}

            {state.dairyCows > 0 && (
                <button 
                    onClick={actions.milkCows}
                    disabled={isProcessing || state.hasMilkedCows || !!state.activeEvent}
                    className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded mb-2 flex justify-between items-center group transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-2">
                    <Milk size={14} className={`text-stone-400 ${state.hasMilkedCows ? 'opacity-50' : ''}`} />
                    <span className={`text-sm ${state.hasMilkedCows ? 'text-stone-500 line-through' : ''}`}>
                        {state.hasMilkedCows ? 'Cows Milked' : 'Milk Cows'}
                    </span>
                    </div>
                    <span className="text-xs text-stone-400 bg-stone-900 px-2 py-0.5 rounded">-15 E</span>
                </button>
            )}

            {state.goats > 0 && (
                <button 
                    onClick={actions.milkGoats}
                    disabled={isProcessing || state.hasMilkedGoats || !!state.activeEvent}
                    className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded mb-2 flex justify-between items-center group transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-2">
                    <Milk size={14} className={`text-stone-400 ${state.hasMilkedGoats ? 'opacity-50' : ''}`} />
                    <span className={`text-sm ${state.hasMilkedGoats ? 'text-stone-500 line-through' : ''}`}>
                        {state.hasMilkedGoats ? 'Goats Milked' : 'Milk Goats'}
                    </span>
                    </div>
                    <span className="text-xs text-stone-400 bg-stone-900 px-2 py-0.5 rounded">-10 E</span>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
