
import React, { useState } from 'react';
import type { GameState, CropType } from '@/types';
import { CROP_DETAILS, EQUIPMENT_DETAILS } from '@/config';
import { Sprout, CloudRain, Bug, Scissors, Droplets, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface CropsScreenProps {
  state: GameState;
  isProcessing: boolean;
  actions: {
    plantCrop: (type: CropType) => void;
    waterCrops: () => void;
    treatPests: () => void;
    harvestCrop: () => void;
  };
}

export const CropsScreen: React.FC<CropsScreenProps> = ({ state, isProcessing, actions }) => {
  const [selectedCrop, setSelectedCrop] = useState<CropType>('hay');

  // Calculate grid representation of field
  // 100 blocks total. 
  const growthBlocks = Math.floor(state.cropGrowth);
  const blocks = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    isGrown: i < growthBlocks,
    isPest: state.fieldPests && i % 7 === 0 // Random visual scatter for pests
  }));

  const getMoistureColor = (val: number) => {
    if (val < 20) return 'bg-red-500';
    if (val < 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const activeCropDetails = state.activeCrop ? CROP_DETAILS[state.activeCrop] : null;
  const targetDetails = CROP_DETAILS[selectedCrop];
  
  // Check equipment requirements for planting
  const equipmentStatus = targetDetails.requires.map(id => ({
      name: EQUIPMENT_DETAILS[id].name,
      owned: state.equipment.includes(id)
  }));
  const canPlant = equipmentStatus.every(s => s.owned);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-y-auto">
      
      {/* Field Visualizer */}
      <div className="md:col-span-2 bg-stone-900 border border-stone-700 rounded-lg p-6 flex flex-col items-center">
        <div className="flex justify-between w-full mb-4">
            <h2 className={`text-xl font-bold flex items-center gap-2 ${activeCropDetails ? activeCropDetails.color : 'text-stone-300'}`}>
                <Sprout className={activeCropDetails ? activeCropDetails.color : 'text-stone-500'} /> 
                {activeCropDetails ? `${activeCropDetails.name} Field` : 'Empty Field'}
            </h2>
            <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-stone-500">Status:</span>
                    <span className={`font-mono-game font-bold ${state.fieldPests ? 'text-red-500' : 'text-emerald-400'}`}>
                        {state.fieldPests ? 'INFESTED' : 'HEALTHY'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                     <span className="text-stone-500">Growth:</span>
                     <span className="font-mono-game font-bold text-emerald-200">{state.cropGrowth}%</span>
                </div>
            </div>
        </div>
        
        {/* The Grid */}
        <div className="grid grid-cols-10 gap-1 w-full max-w-md aspect-square bg-stone-950 p-4 rounded border border-stone-800">
            {state.cropGrowth === 0 ? (
                 <div className="col-span-10 h-full flex items-center justify-center text-stone-600 italic">
                    Field is empty. Plant seeds to start.
                 </div>
            ) : (
                blocks.map(block => (
                    <div 
                        key={block.id} 
                        className={`rounded-sm transition-all duration-500 relative
                            ${block.isGrown 
                                ? (state.activeCrop === 'hay' ? 'bg-yellow-600' : state.activeCrop === 'corn' ? 'bg-emerald-600' : 'bg-stone-300') 
                                : 'bg-stone-800'
                            }
                        `}
                    >
                         {block.isPest && state.fieldPests && (
                             <Bug size={12} className="absolute inset-0 m-auto text-red-400 animate-pulse" />
                         )}
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Controls & Status */}
      <div className="space-y-6">
        
        {/* Soil Stats */}
        <div className="bg-stone-800 border border-stone-700 rounded-lg p-4">
             <h3 className="text-sm font-bold text-stone-400 uppercase mb-4 flex items-center gap-2">
                 <CloudRain size={16} /> Soil Conditions
             </h3>
             
             <div className="mb-4">
                <div className="flex justify-between text-xs text-stone-400 mb-1">
                    <span>Moisture</span>
                    <span>{state.fieldWater}%</span>
                </div>
                <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ${getMoistureColor(state.fieldWater)}`}
                        style={{ width: `${state.fieldWater}%` }}
                    ></div>
                </div>
                {state.fieldWater < 20 && (
                    <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertTriangle size={10} /> Crops are withering from drought!
                    </p>
                )}
             </div>

             {state.fieldPests && (
                 <div className="bg-red-900/20 border border-red-500/50 p-3 rounded text-red-200 text-xs flex gap-2 items-start mb-4">
                     <Bug size={16} className="shrink-0 mt-0.5" />
                     <p>Pests are eating the crop! Growth is halted until treated.</p>
                 </div>
             )}
        </div>

        {/* Actions */}
        <div className="bg-stone-800 border border-stone-700 rounded-lg p-4 space-y-3">
             <h3 className="text-sm font-bold text-stone-400 uppercase mb-2">Field Actions</h3>
             
             {state.cropGrowth === 0 ? (
                 <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                        {(['hay', 'corn', 'cotton'] as CropType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedCrop(type)}
                                className={`text-xs py-2 rounded font-bold border ${selectedCrop === type ? 'bg-emerald-900 border-emerald-500 text-emerald-400' : 'bg-stone-900 border-stone-700 text-stone-500 hover:border-stone-500'}`}
                            >
                                {type.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="bg-stone-900/50 p-3 rounded text-xs">
                        <p className="font-bold text-stone-300 mb-2">Requirements for {targetDetails.name}:</p>
                        <ul className="space-y-1 mb-3">
                            {equipmentStatus.map((eq, i) => (
                                <li key={i} className={`flex items-center gap-2 ${eq.owned ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {eq.owned ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                    {eq.name}
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between text-stone-400">
                             <span>Seed Cost: ${targetDetails.seedCost}</span>
                             <span>Energy: 40</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => actions.plantCrop(selectedCrop)}
                        disabled={isProcessing || !canPlant}
                        className="w-full bg-emerald-700 hover:bg-emerald-600 disabled:bg-stone-700 disabled:opacity-50 p-3 rounded flex items-center justify-between transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Sprout size={18} /> <span className="font-bold text-sm">Plant {targetDetails.name}</span>
                        </div>
                    </button>
                 </div>
             ) : (
                <>
                    <button 
                        onClick={actions.waterCrops}
                        disabled={isProcessing || state.fieldWater >= 90}
                        className="w-full bg-blue-900/40 hover:bg-blue-900/60 border border-blue-800 p-3 rounded flex items-center justify-between transition-colors disabled:opacity-50"
                    >
                        <div className="flex items-center gap-2 text-blue-200">
                            <Droplets size={18} /> <span className="font-bold text-sm">Water Field</span>
                        </div>
                        <div className="text-[10px] text-stone-400">-25 Energy</div>
                    </button>

                    {state.fieldPests && (
                         <button 
                            onClick={actions.treatPests}
                            disabled={isProcessing}
                            className="w-full bg-red-900/40 hover:bg-red-900/60 border border-red-800 p-3 rounded flex items-center justify-between transition-colors disabled:opacity-50"
                        >
                            <div className="flex items-center gap-2 text-red-200">
                                <Bug size={18} /> <span className="font-bold text-sm">Treat Pests</span>
                            </div>
                             <div className="text-right">
                                <div className="text-xs text-stone-300">-$50</div>
                            </div>
                        </button>
                    )}

                    {state.cropGrowth === 100 && (
                        <button 
                            onClick={actions.harvestCrop}
                            disabled={isProcessing}
                            className="w-full bg-amber-700 hover:bg-amber-600 p-3 rounded flex items-center justify-between transition-colors disabled:opacity-50 mt-4"
                        >
                            <div className="flex items-center gap-2 text-white">
                                <Scissors size={18} /> <span className="font-bold text-sm">Harvest {activeCropDetails?.name}</span>
                            </div>
                             <div className="text-[10px] text-stone-200">-25 Energy</div>
                        </button>
                    )}
                </>
             )}
        </div>

      </div>
    </div>
  );
};
