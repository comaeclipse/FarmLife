import type { EquipmentId } from '@/types/core';

export const EQUIPMENT_DETAILS: Record<EquipmentId, { name: string, cost: number, description: string, icon: string }> = {
  tractor: { name: "Farm Tractor", cost: 1000, description: "Heavy machinery for field work.", icon: "tractor" },
  harvester: { name: "Combine Harvester", cost: 2500, description: "Advanced harvesting tech (Hay).", icon: "scissors" },
  trailer: { name: "Utility Trailer", cost: 800, description: "Hauling crops (Hay/Cotton).", icon: "tractor" },
  mower: { name: "Field Mower", cost: 1200, description: "Cutting attachment (Corn).", icon: "scissors" },
  baler: { name: "Crop Baler", cost: 1500, description: "Compresses crops into bales (Corn).", icon: "box" },
  wagon: { name: "Harvest Wagon", cost: 600, description: "Transport for bales (Corn).", icon: "tractor" },
  picker: { name: "Cotton Picker", cost: 3000, description: "Specialized cotton harvester.", icon: "scissors" },
  milker: { name: "Auto-Milker System", cost: 500, description: "Industrial milking equipment.", icon: "milk" },
  heater: { name: "Coop Heater", cost: 300, description: "Keeps chickens productive in cold.", icon: "flame" }
};
