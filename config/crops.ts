import type { CropType, EquipmentId } from '@/types/core';

export const CROP_DETAILS: Record<CropType, { name: string, seedCost: number, sellPrice: number, requires: EquipmentId[], color: string }> = {
  hay: {
    name: "Hay",
    seedCost: 50,
    sellPrice: 3, // Per unit yield
    requires: ['harvester', 'trailer'],
    color: 'text-yellow-500'
  },
  corn: {
    name: "Corn",
    seedCost: 100,
    sellPrice: 8,
    requires: ['mower', 'baler', 'wagon'],
    color: 'text-emerald-500'
  },
  cotton: {
    name: "Cotton",
    seedCost: 200,
    sellPrice: 15,
    requires: ['picker', 'trailer'],
    color: 'text-stone-100'
  }
};
