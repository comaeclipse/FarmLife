
import React, { useState } from 'react';
import {
  Home, Moon, ClipboardList, Egg, Milk,
  ShoppingBag, Beef, Sprout, Tractor, Wheat, LayoutDashboard, Store, PawPrint, Trophy, Sprout as ManureIcon,
  Shovel, Hammer, Trash2
} from 'lucide-react';
import type {
  GameState, Breed, TutorialProgress, EquipmentId, CropType
} from '@/types';
import {
  SALE_PRICE_EGG_CAGED, SALE_PRICE_EGG_FREE_RANGE, SALE_PRICE_MILK, SALE_PRICE_MANURE,
  CROP_DETAILS, EQUIPMENT_DETAILS
} from '@/config';
import { ResourceBar } from './ResourceBar';
import { ActionLog } from './ActionLog';
import { NewsTicker } from './NewsTicker';
import { TutorialModal } from './TutorialModal';
import { EventModal } from './EventModal';
import { CropsScreen } from './CropsScreen';
import { LivestockScreen } from './LivestockScreen';
import { StoreScreen } from './StoreScreen';
import { AchievementsModal } from './AchievementsModal';

interface GameScreenProps {
  state: GameState;
  tutorialProgress: TutorialProgress;
  showTutorial: boolean;
  onToggleTutorial: (isOpen: boolean) => void;
  isProcessing: boolean;
  actions: {
    handleEndDay: () => void;
    resolveEvent: (index: number) => void;
    toggleCoopMode: () => void;
    cleanStable: () => void;
    repairFences: () => void;
    harvestCrop: () => void;
    plantCrop: (type: CropType) => void;
    waterCrops: () => void;
    treatPests: () => void;
    collectEggs: () => void;
    collectManure: () => void;
    milkCows: () => void;
    milkGoats: () => void;
    buyFeed: () => void;
    buyChickenBatch: () => void;
    buyDairyCow: () => void;
    buyBeefCow: () => void;
    buyGoat: () => void;
    buyPig: () => void;
    buyEquipment: (id: EquipmentId) => void;
    sellProduce: () => void;
    sellBeefCow: () => void;
    sellPig: () => void;
    sellChicken: () => void;
    buyHorse: (breed: Breed) => void;
    feedHorse: (id: string) => void;
    groomHorse: (id: string) => void;
    trainHorse: (id: string) => void;
    revealHorseName: (id: string) => void;
  }
}

type Tab = 'dashboard' | 'livestock' | 'crops' | 'store';

export const GameScreen: React.FC<GameScreenProps> = ({ 
  state, 
  tutorialProgress, 
  showTutorial, 
  onToggleTutorial, 
  isProcessing,
  actions 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showAchievements, setShowAchievements] = useState(false);

  const {
    handleEndDay, resolveEvent, 
    sellProduce, sellBeefCow, sellPig
  } = actions;

  const activeCropName = state.activeCrop ? CROP_DETAILS[state.activeCrop].name : 'Empty';

  return (
    <div className="h-screen flex flex-col bg-stone-900 text-stone-200 overflow-hidden">
      <TutorialModal 
        isOpen={showTutorial} 
        onClose={() => onToggleTutorial(false)} 
        farmName={state.farmName}
        progress={tutorialProgress}
      />

      <EventModal 
        event={state.activeEvent}
        onOptionSelect={resolveEvent}
      />

      {showAchievements && (
          <AchievementsModal 
            state={state}
            onClose={() => setShowAchievements(false)}
          />
      )}

      {/* Header */}
      <header className="bg-stone-950 border-b border-stone-800 p-4 flex flex-col md:flex-row justify-between items-center relative z-20 shrink-0 gap-4 md:gap-0">
        <div className="flex items-center gap-2">
          <Home size={20} className="text-emerald-500" />
          <h1 className="font-bold text-lg tracking-wide">{state.farmName}</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-stone-900 rounded p-1 border border-stone-800 overflow-x-auto max-w-full">
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-1.5 rounded text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-stone-700 text-white' : 'text-stone-500 hover:text-stone-300'}`}
            >
                <LayoutDashboard size={14} /> Dashboard
            </button>
            <button 
                onClick={() => setActiveTab('livestock')}
                className={`px-4 py-1.5 rounded text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'livestock' ? 'bg-stone-700 text-white' : 'text-stone-500 hover:text-stone-300'}`}
            >
                <PawPrint size={14} /> Livestock
            </button>
            <button 
                onClick={() => setActiveTab('crops')}
                className={`px-4 py-1.5 rounded text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'crops' ? 'bg-stone-700 text-white' : 'text-stone-500 hover:text-stone-300'}`}
            >
                <Sprout size={14} /> Crops
            </button>
            <button 
                onClick={() => setActiveTab('store')}
                className={`px-4 py-1.5 rounded text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'store' ? 'bg-stone-700 text-white' : 'text-stone-500 hover:text-stone-300'}`}
            >
                <Store size={14} /> Store
            </button>
        </div>

        <div className="flex gap-2">
            <button
              onClick={() => setShowAchievements(true)}
              className="bg-stone-800 hover:bg-stone-700 border border-stone-600 text-amber-400 p-1.5 rounded transition-colors relative"
              title="Achievements"
            >
              <Trophy size={16} />
              {/* Optional notification dot logic could go here */}
            </button>
            <button
              onClick={() => onToggleTutorial(true)}
              className="bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-300 p-1.5 rounded transition-colors"
              title="Show Checklist"
            >
              <ClipboardList size={16} />
            </button>
           <button 
            onClick={handleEndDay}
            disabled={isProcessing || !!state.activeEvent}
            className="bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-300 px-4 py-1.5 rounded flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
           >
             {isProcessing ? 'Processing...' : <><Moon size={14} /> End Day</>}
           </button>
        </div>
      </header>

      {/* Ticker */}
      <NewsTicker news={state.news} />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <ResourceBar state={state} />

        {activeTab === 'crops' && (
             <CropsScreen 
                state={state} 
                isProcessing={isProcessing} 
                actions={{ 
                    plantCrop: actions.plantCrop, 
                    waterCrops: actions.waterCrops, 
                    treatPests: actions.treatPests, 
                    harvestCrop: actions.harvestCrop 
                }} 
             />
        )}

        {activeTab === 'livestock' && (
            <LivestockScreen 
                state={state}
                isProcessing={isProcessing}
                actions={actions}
            />
        )}

        {activeTab === 'store' && (
            <StoreScreen 
                state={state}
                isProcessing={isProcessing}
                actions={actions}
            />
        )}

        {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN: Summary Widgets */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Welcome/Status Card */}
                    <div className="bg-stone-800 border border-stone-700 rounded-lg p-6">
                         <h2 className="text-xl font-bold text-stone-100 mb-2">Good Day, Rancher.</h2>
                         <p className="text-stone-400">
                             Check your livestock, tend to your crops, and visit the store to expand your operations. 
                             Don't forget to end the day when you've used your energy.
                         </p>
                    </div>

                    {/* Crops & Inventory Widget */}
                    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
                        <h3 className="text-sm font-bold text-stone-400 uppercase mb-4 flex items-center gap-2">
                            <Tractor size={16} /> Crops & Inventory
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Feed/Hay */}
                            <div className="bg-stone-950/40 p-3 rounded border border-stone-800">
                                <div className="flex items-center gap-2 text-yellow-600 mb-1">
                                    <Wheat size={16} />
                                    <span className="text-xs font-bold uppercase">Hay Bales</span>
                                </div>
                                <p className="text-xl font-mono-game">{Math.floor(state.feed)}</p>
                            </div>
                            
                            {/* Field Status */}
                            <div className="bg-stone-950/40 p-3 rounded border border-stone-800 cursor-pointer hover:border-emerald-500 transition-colors" onClick={() => setActiveTab('crops')}>
                                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                    <Sprout size={16} />
                                    <span className="text-xs font-bold uppercase">{activeCropName} Field</span>
                                </div>
                                <p className="text-lg font-mono-game">
                                    {state.cropGrowth === 0 ? 'Not Planted' : state.cropGrowth === 100 ? 'Ready' : `${state.cropGrowth}%`}
                                </p>
                                <span className="text-[9px] text-stone-500 uppercase tracking-widest">Manage &rarr;</span>
                            </div>

                            {/* Eggs */}
                            <div className="bg-stone-950/40 p-3 rounded border border-stone-800">
                                <div className="flex items-center gap-2 text-orange-200 mb-1">
                                    <Egg size={16} />
                                    <span className="text-xs font-bold uppercase">Eggs</span>
                                </div>
                                <p className="text-xl font-mono-game">{state.eggs}</p>
                            </div>

                            {/* Milk */}
                            <div className="bg-stone-950/40 p-3 rounded border border-stone-800">
                                <div className="flex items-center gap-2 text-blue-200 mb-1">
                                    <Milk size={16} />
                                    <span className="text-xs font-bold uppercase">Milk</span>
                                </div>
                                <p className="text-xl font-mono-game">{state.milk}</p>
                            </div>

                            {/* Manure */}
                             <div className="bg-stone-950/40 p-3 rounded border border-stone-800">
                                <div className="flex items-center gap-2 text-stone-400 mb-1">
                                    <ManureIcon size={16} />
                                    <span className="text-xs font-bold uppercase">Fertilizer</span>
                                </div>
                                <p className="text-xl font-mono-game">{state.manure}</p>
                            </div>
                        </div>
                    </div>

                    {/* Farm Log Widget */}
                    <div className="h-96">
                        <ActionLog logs={state.logs} />
                    </div>

                </div>

                {/* RIGHT COLUMN: Quick Actions / Market Summary */}
                <div className="space-y-6">

                    {/* Daily Chores */}
                    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
                        <h3 className="text-sm font-bold text-stone-400 uppercase mb-3 flex items-center gap-2">
                            <Shovel size={16} /> Daily Chores
                        </h3>

                        {/* Clean Stables */}
                        <button
                            onClick={actions.cleanStable}
                            disabled={isProcessing || state.cleanliness >= 100 || !!state.activeEvent}
                            className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded mb-2 flex justify-between items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center gap-2">
                                <Shovel size={14} className="text-stone-400" />
                                <span className="text-sm">Clean Stables</span>
                            </div>
                            <span className="text-xs text-stone-400 bg-stone-900 px-2 py-0.5 rounded">-20 E</span>
                        </button>

                        {/* Repair Fences */}
                        <button
                            onClick={actions.repairFences}
                            disabled={isProcessing || state.infrastructure >= 100 || !!state.activeEvent}
                            className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded mb-2 flex justify-between items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center gap-2">
                                <Hammer size={14} className="text-stone-400" />
                                <span className="text-sm">Repair Fences</span>
                            </div>
                            <span className="text-xs text-stone-400 bg-stone-900 px-2 py-0.5 rounded">-30 E</span>
                        </button>

                        {/* Collect Eggs - Only if chickens > 0 */}
                        {state.chickens > 0 && (
                            <button
                                onClick={actions.collectEggs}
                                disabled={isProcessing || state.hasCollectedEggs || !!state.activeEvent}
                                className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded mb-2 flex justify-between items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center gap-2">
                                    <Egg size={14} className={`text-stone-400 ${state.hasCollectedEggs ? 'opacity-50' : ''}`} />
                                    <span className={`text-sm ${state.hasCollectedEggs ? 'text-stone-500 line-through' : ''}`}>
                                        {state.hasCollectedEggs ? 'Eggs Collected' : 'Collect Eggs'}
                                    </span>
                                </div>
                                <span className="text-xs text-stone-400 bg-stone-900 px-2 py-0.5 rounded">-10 E</span>
                            </button>
                        )}

                        {/* Collect Manure - Only if chickens > 0 */}
                        {state.chickens > 0 && (
                            <button
                                onClick={actions.collectManure}
                                disabled={isProcessing || state.hasCollectedManure || !!state.activeEvent}
                                className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded mb-2 flex justify-between items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center gap-2">
                                    <Trash2 size={14} className={`text-stone-400 ${state.hasCollectedManure ? 'opacity-50' : ''}`} />
                                    <span className={`text-sm ${state.hasCollectedManure ? 'text-stone-500 line-through' : ''}`}>
                                        {state.hasCollectedManure ? 'Manure Collected' : 'Collect Manure'}
                                    </span>
                                </div>
                                <span className="text-xs text-stone-400 bg-stone-900 px-2 py-0.5 rounded">-10 E</span>
                            </button>
                        )}

                        {/* Milk Cows - Only if dairyCows > 0 */}
                        {state.dairyCows > 0 && (
                            <button
                                onClick={actions.milkCows}
                                disabled={isProcessing || state.hasMilkedCows || !!state.activeEvent}
                                className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded mb-2 flex justify-between items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                        {/* Milk Goats - Only if goats > 0 */}
                        {state.goats > 0 && (
                            <button
                                onClick={actions.milkGoats}
                                disabled={isProcessing || state.hasMilkedGoats || !!state.activeEvent}
                                className="w-full bg-stone-700 hover:bg-stone-600 text-left px-3 py-2 rounded mb-2 flex justify-between items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                    {/* Market Summary */}
                    <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
                        <h3 className="text-sm font-bold text-stone-400 uppercase mb-3 flex items-center gap-2">
                            <ShoppingBag size={16} /> Market Sales
                        </h3>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm p-2 bg-stone-900/50 rounded">
                                <span className="text-stone-400">Beef Price</span>
                                <span className="text-emerald-400 font-mono-game">${state.beefPrice}</span>
                            </div>
                             <div className="flex justify-between items-center text-sm p-2 bg-stone-900/50 rounded">
                                <span className="text-stone-400">Pig Price</span>
                                <span className="text-emerald-400 font-mono-game">${state.pigPrice}</span>
                            </div>

                            <div className="h-px bg-stone-700 my-2"></div>

                            <button 
                                onClick={sellProduce}
                                disabled={isProcessing || (state.eggs === 0 && state.milk === 0 && state.manure === 0) || !!state.activeEvent}
                                className="w-full bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-800 text-left px-3 py-2 rounded flex justify-between items-center transition-colors disabled:opacity-50 mb-1"
                            >
                                <span className="text-sm text-emerald-400">Sell Goods</span>
                                <span className="text-xs text-emerald-400 font-mono-game">+${
                                    (state.eggs * (state.isFreeRange ? SALE_PRICE_EGG_CAGED : SALE_PRICE_EGG_FREE_RANGE)) + (state.milk * SALE_PRICE_MILK) + (state.manure * SALE_PRICE_MANURE)
                                }</span>
                            </button>
                            <button 
                                onClick={sellBeefCow}
                                disabled={isProcessing || state.beefCows === 0 || !!state.activeEvent}
                                className="w-full bg-amber-900/30 hover:bg-amber-900/50 border border-amber-800 text-left px-3 py-2 rounded flex justify-between items-center transition-colors disabled:opacity-50"
                            >
                                <span className="text-sm text-amber-500">Sell 1 Beef Steer</span>
                                <span className="text-xs text-amber-400 font-mono-game">+${state.beefPrice}</span>
                            </button>
                             <button 
                                onClick={sellPig}
                                disabled={isProcessing || state.pigs === 0 || !!state.activeEvent}
                                className="w-full bg-rose-900/30 hover:bg-rose-900/50 border border-rose-800 text-left px-3 py-2 rounded flex justify-between items-center transition-colors disabled:opacity-50"
                            >
                                <span className="text-sm text-rose-400">Sell 1 Pig</span>
                                <span className="text-xs text-rose-300 font-mono-game">+${state.pigPrice}</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Equipment Status */}
                     <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
                        <h3 className="text-sm font-bold text-stone-400 uppercase mb-3 flex items-center gap-2">
                            <Tractor size={16} /> Equipment
                        </h3>
                        {state.equipment.length === 0 ? (
                            <p className="text-xs text-stone-500 italic">No heavy machinery owned.</p>
                        ) : (
                            <ul className="space-y-1">
                                {state.equipment.map(id => (
                                    <li key={id} className="text-xs text-emerald-400 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                        {EQUIPMENT_DETAILS[id] ? EQUIPMENT_DETAILS[id].name : id}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button 
                            onClick={() => setActiveTab('store')}
                            className="mt-4 w-full text-xs bg-stone-700 hover:bg-stone-600 p-2 rounded text-stone-300"
                        >
                            Browse Equipment
                        </button>
                    </div>

                </div>
            </div>
        )}

      </main>
    </div>
  );
};
