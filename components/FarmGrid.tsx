'use client';

import { useState } from 'react';
import { CropType } from '@prisma/client';
import { plantCropAction, waterCropAction, harvestCropAction } from '@/app/actions/crops';
import { CROP_DATA, GAME_CONFIG } from '@/lib/constants';

interface Crop {
  id: string;
  type: CropType;
  stage: string;
  plotX: number;
  plotY: number;
  wateredToday: boolean;
  daysGrowing: number;
}

interface FarmGridProps {
  playerId: string;
  crops: Crop[];
  inventory: Array<{ type: string; quantity: number }>;
}

export function FarmGrid({ playerId, crops, inventory }: FarmGridProps) {
  const [selectedPlot, setSelectedPlot] = useState<{ x: number; y: number } | null>(null);
  const [selectedCropType, setSelectedCropType] = useState<CropType | null>(null);
  const [loading, setLoading] = useState(false);

  const getCropAtPlot = (x: number, y: number) => {
    return crops.find((c) => c.plotX === x && c.plotY === y);
  };

  const handlePlotClick = (x: number, y: number) => {
    const crop = getCropAtPlot(x, y);
    if (crop) {
      setSelectedPlot({ x, y });
    } else {
      setSelectedPlot({ x, y });
    }
  };

  const handlePlant = async (cropType: CropType) => {
    if (!selectedPlot || loading) return;

    setLoading(true);
    const result = await plantCropAction(playerId, cropType, selectedPlot.x, selectedPlot.y);
    setLoading(false);

    if (result.success) {
      setSelectedPlot(null);
      setSelectedCropType(null);
    } else {
      alert(result.error);
    }
  };

  const handleWater = async (cropId: string) => {
    setLoading(true);
    const result = await waterCropAction(playerId, cropId);
    setLoading(false);

    if (!result.success) {
      alert(result.error);
    }
  };

  const handleHarvest = async (cropId: string, cropType: CropType) => {
    setLoading(true);
    const result = await harvestCropAction(playerId, cropId, cropType);
    setLoading(false);

    if (result.success) {
      setSelectedPlot(null);
    } else {
      alert(result.error);
    }
  };

  const selectedCrop = selectedPlot ? getCropAtPlot(selectedPlot.x, selectedPlot.y) : null;

  // Get available seeds
  const availableSeeds = inventory
    .filter((item) => item.type.endsWith('_SEEDS'))
    .map((item) => ({
      type: item.type.replace('_SEEDS', '') as CropType,
      quantity: item.quantity,
    }));

  return (
    <div className="border border-green-700 bg-green-950/30 p-4 rounded">
      <h2 className="text-xl font-bold text-green-400 mb-3">Farm</h2>

      <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: `repeat(${GAME_CONFIG.FARM_COLS}, minmax(0, 1fr))` }}>
        {Array.from({ length: GAME_CONFIG.FARM_ROWS }).map((_, y) =>
          Array.from({ length: GAME_CONFIG.FARM_COLS }).map((_, x) => {
            const crop = getCropAtPlot(x, y);
            const isSelected = selectedPlot?.x === x && selectedPlot?.y === y;

            return (
              <button
                key={`${x}-${y}`}
                onClick={() => handlePlotClick(x, y)}
                className={`aspect-square border-2 ${
                  isSelected ? 'border-yellow-400' : 'border-green-800'
                } bg-green-900/50 hover:bg-green-800/50 transition-colors text-2xl flex items-center justify-center`}
              >
                {crop ? (
                  <div className="text-center">
                    <div>{CROP_DATA[crop.type].emoji}</div>
                    {crop.stage === 'READY' && <div className="text-xs text-green-300">!</div>}
                    {!crop.wateredToday && crop.stage !== 'READY' && (
                      <div className="text-xs text-blue-400">💧</div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-600 text-sm">+</span>
                )}
              </button>
            );
          })
        )}
      </div>

      {selectedPlot && (
        <div className="border border-green-700 bg-green-950/50 p-3 rounded">
          {selectedCrop ? (
            <div>
              <h3 className="font-bold text-green-300 mb-2">
                {CROP_DATA[selectedCrop.type].emoji} {CROP_DATA[selectedCrop.type].name}
              </h3>
              <div className="text-sm text-gray-400 mb-3">
                Stage: {selectedCrop.stage}
                <br />
                Days Growing: {selectedCrop.daysGrowing}
                <br />
                Watered: {selectedCrop.wateredToday ? 'Yes' : 'No'}
              </div>
              <div className="flex gap-2">
                {selectedCrop.stage === 'READY' ? (
                  <button
                    onClick={() => handleHarvest(selectedCrop.id, selectedCrop.type)}
                    disabled={loading}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 rounded text-sm"
                  >
                    Harvest (+{CROP_DATA[selectedCrop.type].sellPrice} coins)
                  </button>
                ) : (
                  !selectedCrop.wateredToday && (
                    <button
                      onClick={() => handleWater(selectedCrop.id)}
                      disabled={loading}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded text-sm"
                    >
                      Water (-3 energy)
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-green-300 mb-2">Empty Plot</h3>
              <div className="text-sm text-gray-400 mb-3">Choose a crop to plant:</div>
              <div className="grid grid-cols-2 gap-2">
                {availableSeeds.map((seed) => (
                  <button
                    key={seed.type}
                    onClick={() => handlePlant(seed.type)}
                    disabled={loading || seed.quantity === 0}
                    className="px-3 py-2 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 rounded text-sm text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span>{CROP_DATA[seed.type].emoji}</span>
                      <span>
                        {CROP_DATA[seed.type].name} ({seed.quantity})
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
