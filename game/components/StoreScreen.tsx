
import React, { useState } from 'react';
import { ShoppingBag, Wheat, Egg, Milk, Beef, Tractor, Scissors, Flame, Check, Mountain, Box } from 'lucide-react';
import type { GameState, Breed, EquipmentId } from '@/types';
import {
    COST_FEED_UNIT, FEED_PER_UNIT, HORSE_BASE_COST,
    COST_CHICKEN_BATCH, COST_COW_DAIRY, COST_COW_BEEF, COST_GOAT, COST_PIG,
    EQUIPMENT_DETAILS
} from '@/config';

interface StoreScreenProps {
  state: GameState;
  isProcessing: boolean;
  actions: {
    buyFeed: () => void;
    buyChickenBatch: () => void;
    buyDairyCow: () => void;
    buyBeefCow: () => void;
    buyGoat: () => void;
    buyPig: () => void;
    buyHorse: (breed: Breed) => void;
    buyEquipment: (id: EquipmentId) => void;
  };
}

type StoreTab = 'supplies' | 'animals' | 'equine' | 'equipment';

export const StoreScreen: React.FC<StoreScreenProps> = ({ state, isProcessing, actions }) => {
  const [activeTab, setActiveTab] = useState<StoreTab>('supplies');

  return (
    <div className="h-full flex flex-col">
       <div className="flex border-b border-stone-700 mb-6">
            <button 
                onClick={() => setActiveTab('supplies')}
                className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'supplies' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
            >
                Supplies
            </button>
            <button 
                onClick={() => setActiveTab('animals')}
                className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'animals' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
            >
                Livestock
            </button>
            <button 
                onClick={() => setActiveTab('equine')}
                className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'equine' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
            >
                Equine
            </button>
            <button 
                onClick={() => setActiveTab('equipment')}
                className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'equipment' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
            >
                Equipment
            </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4">
            
            {activeTab === 'supplies' && (
                <div className="bg-stone-800 border border-stone-700 rounded-lg p-4 flex flex-col justify-between hover:border-stone-500 transition-colors">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-stone-200">Standard Feed</h3>
                            <Wheat className="text-yellow-600" />
                        </div>
                        <p className="text-xs text-stone-400 mb-4">
                            High quality hay bales. Essential for feeding all livestock.
                            <br/><span className="text-emerald-500">Contains {FEED_PER_UNIT} bales.</span>
                        </p>
                    </div>
                    <button 
                        onClick={actions.buyFeed}
                        disabled={isProcessing || !!state.activeEvent}
                        className="w-full bg-stone-700 hover:bg-stone-600 p-2 rounded flex justify-between items-center transition-colors"
                    >
                        <span className="text-sm font-bold text-stone-300">Buy Batch</span>
                        <span className="text-xs text-amber-400 font-mono-game">${COST_FEED_UNIT}</span>
                    </button>
                </div>
            )}

            {activeTab === 'animals' && (
                <>
                    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4 flex flex-col justify-between hover:border-stone-500 transition-colors">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-stone-200">Chicken Flock</h3>
                                <Egg className="text-stone-400" />
                            </div>
                            <p className="text-xs text-stone-400 mb-4">
                                A starter flock of 5 laying hens. Produce eggs daily.
                            </p>
                        </div>
                        <button 
                            onClick={actions.buyChickenBatch}
                            disabled={isProcessing || state.money < COST_CHICKEN_BATCH || !!state.activeEvent}
                            className="w-full bg-stone-700 hover:bg-stone-600 p-2 rounded flex justify-between items-center transition-colors disabled:opacity-50"
                        >
                            <span className="text-sm font-bold text-stone-300">Purchase (5)</span>
                            <span className="text-xs text-amber-400 font-mono-game">${COST_CHICKEN_BATCH}</span>
                        </button>
                    </div>

                    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4 flex flex-col justify-between hover:border-stone-500 transition-colors">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-stone-200">Dairy Cow</h3>
                                <Milk className="text-stone-400" />
                            </div>
                            <p className="text-xs text-stone-400 mb-4">
                                A mature Holstein cow. Produces milk daily if fed well.
                            </p>
                        </div>
                        <button 
                            onClick={actions.buyDairyCow}
                            disabled={isProcessing || state.money < COST_COW_DAIRY || !!state.activeEvent}
                            className="w-full bg-stone-700 hover:bg-stone-600 p-2 rounded flex justify-between items-center transition-colors disabled:opacity-50"
                        >
                            <span className="text-sm font-bold text-stone-300">Purchase</span>
                            <span className="text-xs text-amber-400 font-mono-game">${COST_COW_DAIRY}</span>
                        </button>
                    </div>

                    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4 flex flex-col justify-between hover:border-stone-500 transition-colors">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-stone-200">Beef Steer</h3>
                                <Beef className="text-stone-400" />
                            </div>
                            <p className="text-xs text-stone-400 mb-4">
                                Raise for meat. Sell price fluctuates with the market.
                            </p>
                        </div>
                        <button 
                            onClick={actions.buyBeefCow}
                            disabled={isProcessing || state.money < COST_COW_BEEF || !!state.activeEvent}
                            className="w-full bg-stone-700 hover:bg-stone-600 p-2 rounded flex justify-between items-center transition-colors disabled:opacity-50"
                        >
                            <span className="text-sm font-bold text-stone-300">Purchase</span>
                            <span className="text-xs text-amber-400 font-mono-game">${COST_COW_BEEF}</span>
                        </button>
                    </div>

                    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4 flex flex-col justify-between hover:border-stone-500 transition-colors">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-stone-200">Goat</h3>
                                <Mountain className="text-stone-400" />
                            </div>
                            <p className="text-xs text-stone-400 mb-4">
                                Hardy animal that produces milk. Cheaper upkeep.
                            </p>
                        </div>
                        <button 
                            onClick={actions.buyGoat}
                            disabled={isProcessing || state.money < COST_GOAT || !!state.activeEvent}
                            className="w-full bg-stone-700 hover:bg-stone-600 p-2 rounded flex justify-between items-center transition-colors disabled:opacity-50"
                        >
                            <span className="text-sm font-bold text-stone-300">Purchase</span>
                            <span className="text-xs text-amber-400 font-mono-game">${COST_GOAT}</span>
                        </button>
                    </div>

                    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4 flex flex-col justify-between hover:border-stone-500 transition-colors">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-stone-200">Pig</h3>
                                <div className="text-stone-400 font-bold">P</div>
                            </div>
                            <p className="text-xs text-stone-400 mb-4">
                                Raise for market. Voracious eater, decent profit.
                            </p>
                        </div>
                        <button 
                            onClick={actions.buyPig}
                            disabled={isProcessing || state.money < COST_PIG || !!state.activeEvent}
                            className="w-full bg-stone-700 hover:bg-stone-600 p-2 rounded flex justify-between items-center transition-colors disabled:opacity-50"
                        >
                            <span className="text-sm font-bold text-stone-300">Purchase</span>
                            <span className="text-xs text-amber-400 font-mono-game">${COST_PIG}</span>
                        </button>
                    </div>
                </>
            )}

            {activeTab === 'equine' && (
                 (Object.values(Breed) as Breed[]).map(breed => (
                    <div key={breed} className="bg-stone-800 border border-stone-700 rounded-lg p-4 flex flex-col justify-between hover:border-stone-500 transition-colors">
                        <div>
                            <h3 className="font-bold text-stone-200 mb-1">{breed}</h3>
                            <p className="text-xs text-stone-400 mb-4">
                                A fine specimen of the {breed} lineage. Untrained.
                            </p>
                        </div>
                        <button 
                            onClick={() => actions.buyHorse(breed)}
                            disabled={isProcessing || state.money < HORSE_BASE_COST || !!state.activeEvent}
                            className="w-full bg-stone-700 hover:bg-stone-600 p-2 rounded flex justify-between items-center transition-colors disabled:opacity-50"
                        >
                            <span className="text-sm font-bold text-stone-300">Purchase</span>
                            <span className="text-xs text-amber-400 font-mono-game">${HORSE_BASE_COST}</span>
                        </button>
                    </div>
                ))
            )}

            {activeTab === 'equipment' && (
                Object.entries(EQUIPMENT_DETAILS).map(([key, item]) => {
                    const id = key as EquipmentId;
                    const owned = state.equipment.includes(id);
                    
                    const Icon = {
                        tractor: Tractor,
                        scissors: Scissors,
                        milk: Milk,
                        flame: Flame,
                        box: Box
                    }[item.icon] || Tractor;

                    return (
                        <div key={id} className={`bg-stone-800 border ${owned ? 'border-emerald-800 bg-emerald-900/10' : 'border-stone-700'} rounded-lg p-4 flex flex-col justify-between hover:border-stone-500 transition-colors`}>
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-stone-200">{item.name}</h3>
                                    <Icon className={owned ? "text-emerald-500" : "text-stone-500"} />
                                </div>
                                <p className="text-xs text-stone-400 mb-4">
                                    {item.description}
                                </p>
                            </div>
                            
                            {owned ? (
                                <div className="w-full bg-emerald-900/30 border border-emerald-800 p-2 rounded flex justify-center items-center gap-2 text-emerald-500 text-sm font-bold">
                                    <Check size={16} /> Owned
                                </div>
                            ) : (
                                <button 
                                    onClick={() => actions.buyEquipment(id)}
                                    disabled={isProcessing || state.money < item.cost || !!state.activeEvent}
                                    className="w-full bg-stone-700 hover:bg-stone-600 p-2 rounded flex justify-between items-center transition-colors disabled:opacity-50"
                                >
                                    <span className="text-sm font-bold text-stone-300">Purchase</span>
                                    <span className="text-xs text-amber-400 font-mono-game">${item.cost}</span>
                                </button>
                            )}
                        </div>
                    );
                })
            )}

       </div>
    </div>
  );
};
