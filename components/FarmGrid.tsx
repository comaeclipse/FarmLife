'use client';

import { useState, useEffect } from 'react';
import { CropType } from '@prisma/client';
import { toast } from 'sonner';
import { plantCropAction, waterCropAction, harvestCropAction } from '@/app/actions/crops';
import { expandFarmAction, getNextExpansionTierAction } from '@/app/actions/farm';
import { CROP_DATA, GAME_CONFIG, FARM_EXPANSION_TIERS } from '@/lib/constants';

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
  farmRows: number;
  farmCols: number;
  playerLevel: number;
  playerCoins: number;
  playerEnergy: number;
}

export function FarmGrid({ playerId, crops, inventory, farmRows, farmCols, playerLevel, playerCoins, playerEnergy }: FarmGridProps) {
  const [selectedPlot, setSelectedPlot] = useState<{ x: number; y: number } | null>(null);
  const [selectedCropType, setSelectedCropType] = useState<CropType | null>(null);
  const [loading, setLoading] = useState(false);
  const [nextTier, setNextTier] = useState<any>(null);
  const [showExpansion, setShowExpansion] = useState(false);

  // Fetch next expansion tier info
  useEffect(() => {
    getNextExpansionTierAction(playerId).then((result) => {
      if (result.success && !result.atMaxSize) {
        setNextTier(result.nextTier);
      }
    });
  }, [playerId, farmRows, farmCols]);

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
      toast.error(result.error);
    }
  };

  const handleWater = async (cropId: string) => {
    setLoading(true);
    const result = await waterCropAction(playerId, cropId);
    setLoading(false);

    if (!result.success) {
      toast.error(result.error);
    }
  };

  const handleHarvest = async (cropId: string, cropType: CropType) => {
    setLoading(true);
    const result = await harvestCropAction(playerId, cropId, cropType);
    setLoading(false);

    if (result.success) {
      setSelectedPlot(null);
    } else {
      toast.error(result.error);
    }
  };

  const handleExpandFarm = async () => {
    setLoading(true);
    const result = await expandFarmAction(playerId);
    setLoading(false);

    if (result.success && result.newSize) {
      setShowExpansion(false);
      toast.success(`Farm expanded to ${result.newSize.rows}x${result.newSize.cols} (${result.totalPlots} plots)!`);
    } else {
      toast.error(result.error || 'Failed to expand farm');
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
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-green-400">
          Farm ({farmRows}x{farmCols} - {farmRows * farmCols} plots)
        </h2>
        {nextTier && (
          <button
            onClick={() => setShowExpansion(!showExpansion)}
            className="px-3 py-1 bg-amber-700 hover:bg-amber-600 rounded text-sm"
          >
            Expand Farm
          </button>
        )}
      </div>

      {showExpansion && nextTier && (
        <div className="mb-3 p-3 border border-amber-600 bg-amber-950/50 rounded">
          <h3 className="font-bold text-amber-400 mb-2">Farm Expansion</h3>
          <p className="text-sm text-gray-300 mb-2">
            Expand to {nextTier.rows}x{nextTier.cols} ({nextTier.rows * nextTier.cols} plots)
          </p>
          <div className="text-sm text-gray-400 mb-3">
            <div>Required Level: {nextTier.level} {playerLevel >= nextTier.level ? '✓' : `(you are level ${playerLevel})`}</div>
            <div>Cost: {nextTier.coinCost} coins {playerCoins >= nextTier.coinCost ? '✓' : `(you have ${playerCoins})`}</div>
            <div>Energy: {nextTier.energyCost} {playerEnergy >= nextTier.energyCost ? '✓' : `(you have ${playerEnergy})`}</div>
          </div>
          <button
            onClick={handleExpandFarm}
            disabled={loading || playerLevel < nextTier.level || playerCoins < nextTier.coinCost || playerEnergy < nextTier.energyCost}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded text-sm"
          >
            {loading ? 'Expanding...' : 'Expand Farm'}
          </button>
        </div>
      )}

      <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: `repeat(${GAME_CONFIG.FARM_COLS}, minmax(0, 1fr))` }}>
        {Array.from({ length: GAME_CONFIG.FARM_ROWS }).map((_, y) =>
          Array.from({ length: GAME_CONFIG.FARM_COLS }).map((_, x) => {
            const crop = getCropAtPlot(x, y);
            const isSelected = selectedPlot?.x === x && selectedPlot?.y === y;
            const isLocked = x >= farmCols || y >= farmRows;

            return (
              <button
                key={`${x}-${y}`}
                onClick={() => !isLocked && handlePlotClick(x, y)}
                disabled={isLocked}
                className={`aspect-square border-2 ${
                  isLocked
                    ? 'border-stone-700 bg-stone-900/80 cursor-not-allowed'
                    : isSelected
                      ? 'border-yellow-400'
                      : 'border-green-800'
                } ${!isLocked ? 'bg-green-900/50 hover:bg-green-800/50' : ''} transition-colors text-2xl flex items-center justify-center`}
              >
                {isLocked ? (
                  <span className="text-stone-600 text-lg">🔒</span>
                ) : crop ? (
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
