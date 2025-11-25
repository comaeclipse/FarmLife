
import { useState, useCallback } from 'react';
import type {
  GameState, Horse, LogEntry, Breed, EquipmentId, CropType, FarmEvent
} from '@/types';
import {
  COST_FEED_UNIT, FEED_PER_UNIT, HORSE_BASE_COST, DAILY_UPKEEP_PER_HORSE,
  XP_THRESHOLDS, MAX_LEVEL,
  COST_CHICKEN_BATCH, COST_COW_DAIRY, COST_COW_BEEF, COST_GOAT, COST_PIG,
  FEED_CONSUMPTION_CHICKEN_CAGED, FEED_CONSUMPTION_CHICKEN_FREE_RANGE,
  FEED_CONSUMPTION_COW_DAIRY, FEED_CONSUMPTION_COW_BEEF, FEED_CONSUMPTION_GOAT, FEED_CONSUMPTION_PIG,
  SALE_PRICE_EGG_CAGED, SALE_PRICE_EGG_FREE_RANGE, SALE_PRICE_MILK, SALE_PRICE_CHICKEN_MEAT, SALE_PRICE_MANURE,
  EQUIPMENT_DETAILS, CROP_DETAILS,
  INITIAL_STATE
} from '@/config';
import {
  generateHorseBio, generateDailyReport,
  generateFarmName, generateNewsTicker, generateHorseName
} from '@/services/geminiService';
import { uid } from '@/utils';
import { useGameFlow } from './useGameFlow';
import { useAchievements } from './useAchievements';
import { useEvents } from './useEvents';
import { useToast } from '@/lib/contexts/ToastContext';

/**
 * Main game state hook - orchestrates all game logic and state
 * Refactored to use domain-specific hooks for better organization
 */
export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  // Delegate orthogonal concerns to specialized hooks
  const {
    farmNameInput,
    setFarmNameInput,
    isProcessing,
    setIsProcessing,
    showTutorial,
    setShowTutorial,
    tutorialProgress,
    updateTutorial
  } = useGameFlow();

  const { unlockedAchievements, checkAchievements } = useAchievements(state.unlockedAchievements);
  const { activeEvent, triggerRandomEvent, clearEvent } = useEvents(state.activeEvent);
  const { showToast } = useToast();

  // ---- Logging System ----
  // Helper to add logs safely with a cap
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, { id: uid(), day: prev.day, message, type }].slice(-100)
    }));
  }, []);


  // ---- Game Loop: End Day ----
  const handleEndDay = async () => {
    setIsProcessing(true);
    addLog("Ending the day...", 'info');

    // Determine next weather first
    const nextWeather = ['Sunny', 'Rainy', 'Cloudy', 'Windy', 'Stormy'][Math.floor(Math.random() * 5)];

    setState(prev => {
      // Collect logs locally during calculation to avoid nested setState calls
      const dailyLogs: LogEntry[] = [];
      const log = (msg: string, type: LogEntry['type'] = 'info') => {
          dailyLogs.push({ id: uid(), day: prev.day + 1, message: msg, type });
      };

      // 1. Decay & Consumption
      const cleanlinessDecay = Math.floor(Math.random() * 10) + (prev.horses.length * 5);
      const newCleanliness = Math.max(0, prev.cleanliness - cleanlinessDecay);
      
      const livestockCount = prev.horses.length + prev.dairyCows + prev.beefCows + prev.goats + prev.pigs;
      const infraDecay = 2 + (Math.floor(livestockCount) / 2); 
      let newInfrastructure = Math.max(0, prev.infrastructure - infraDecay);

      // --- CROP MECHANICS ---
      let newCropGrowth = prev.cropGrowth;
      let newFieldWater = prev.fieldWater;
      let newFieldPests = prev.fieldPests;

      // 1. Water Evaporation / Rain
      if (prev.weather === 'Rainy' || prev.weather === 'Stormy') {
        newFieldWater = Math.min(100, newFieldWater + 40);
      } else if (prev.weather === 'Sunny') {
        newFieldWater = Math.max(0, newFieldWater - 25);
      } else {
        newFieldWater = Math.max(0, newFieldWater - 15);
      }

      // 2. Pest Spawn (Chance increased by high water or random bad luck)
      if (!newFieldPests && prev.cropGrowth > 0) {
        if (Math.random() < 0.05) newFieldPests = true; 
      }

      // 3. Growth
      if (prev.cropGrowth > 0 && prev.cropGrowth < 100) {
        let growthRate = 25 + Math.floor(Math.random() * 15);
        
        // Modifiers
        if (newFieldWater < 20) growthRate = Math.floor(growthRate * 0.2); // Too dry
        if (newFieldPests) growthRate = 0; // Pests stop growth
        
        newCropGrowth = Math.min(100, prev.cropGrowth + growthRate);
      }

      if (newFieldWater < 10 && prev.cropGrowth > 0) log("Crops are withering from drought!", 'warning');
      if (newFieldPests) log("Pests are attacking your crops!", 'danger');

      // Feed Consumption
      const chickenConsumptionRate = prev.isFreeRange ? FEED_CONSUMPTION_CHICKEN_FREE_RANGE : FEED_CONSUMPTION_CHICKEN_CAGED;
      
      const feedNeeded = 
        (prev.dairyCows * FEED_CONSUMPTION_COW_DAIRY) + 
        (prev.beefCows * FEED_CONSUMPTION_COW_BEEF) +
        (prev.goats * FEED_CONSUMPTION_GOAT) +
        (prev.pigs * FEED_CONSUMPTION_PIG) +
        (prev.chickens * chickenConsumptionRate);
      
      let newFeed = prev.feed - feedNeeded;
      
      let chickenLoss = 0;
      let dairyLoss = 0;
      let beefLoss = 0;
      let goatLoss = 0;
      let pigLoss = 0;

      // Feed Penalty
      if (newFeed < 0) {
          // If negative feed, animals are hungry. Small chance to die/leave if severe
          newFeed = 0;
          log("Ran out of feed! Your livestock is hungry.", 'danger');
      }

      // Infrastructure Penalty (Escapes)
      if (newInfrastructure < 20) {
          if (prev.chickens > 0 && Math.random() < 0.2) {
              chickenLoss = Math.floor(Math.random() * 3) + 1;
          }
          if ((prev.dairyCows + prev.beefCows) > 0 && Math.random() < 0.1) {
              if (prev.beefCows > 0) beefLoss = 1;
              else if (prev.dairyCows > 0) dairyLoss = 1;
          }
          if (prev.goats > 0 && Math.random() < 0.15) goatLoss = 1;
          if (prev.pigs > 0 && Math.random() < 0.1) pigLoss = 1;
      }

      const finalChickens = Math.max(0, prev.chickens - chickenLoss);
      const finalDairyCows = Math.max(0, prev.dairyCows - dairyLoss);
      const finalBeefCows = Math.max(0, prev.beefCows - beefLoss);
      const finalGoats = Math.max(0, prev.goats - goatLoss);
      const finalPigs = Math.max(0, prev.pigs - pigLoss);

      if (chickenLoss > 0) log(`${chickenLoss} chickens escaped through broken fences!`, 'danger');
      if (dairyLoss > 0) log("A dairy cow wandered off!", 'danger');
      if (beefLoss > 0) log("A beef steer escaped!", 'danger');
      if (goatLoss > 0) log("A goat jumped the fence and ran away!", 'danger');
      if (pigLoss > 0) log("A pig escaped into the woods!", 'danger');
      
      if (newCropGrowth === 100 && prev.cropGrowth < 100) {
        log(`Your ${prev.activeCrop ? CROP_DETAILS[prev.activeCrop].name : 'Crops'} are ready to harvest!`, 'success');
      }

      // Market Fluctuation: Beef Prices
      // Base around 200, swing between 150 and 350
      const beefVol = Math.floor(Math.random() * 100) - 50; 
      let nextBeefPrice = Math.max(150, Math.min(350, prev.beefPrice + beefVol));

      // Market Fluctuation: Pig Prices
      // Base around 120, swing between 80 and 200
      const pigVol = Math.floor(Math.random() * 60) - 30;
      let nextPigPrice = Math.max(80, Math.min(200, prev.pigPrice + pigVol));

      // Horse Updates
      const updatedHorses = prev.horses.map(horse => {
        let newHunger = Math.min(100, horse.hunger + 20);
        let newHealth = horse.health;
        let newHappiness = horse.happiness;
        let newStamina = 100; // Reset stamina
        let xpChange = 0;
        
        // --- Penalties & Neglect (Negative XP) ---
        if (newHunger >= 80) {
            newHealth -= 10;
            xpChange -= 10; 
        }
        if (newCleanliness < 30) {
            newHealth -= 5;
            newHappiness -= 10;
            xpChange -= 5;
        }
        if (newHappiness < 20) {
            xpChange -= 5; 
        }

        // Apply XP changes (prevent dropping below 0)
        const newExperience = Math.max(0, horse.experience + xpChange);

        // --- Dynamic Valuation Economy ---
        const xpValue = newExperience * 10;
        const levelValue = (horse.level - 1) * 500;
        const healthPenalty = (100 - newHealth) * 5;
        const newValue = Math.floor(Math.max(100, HORSE_BASE_COST + xpValue + levelValue - healthPenalty));

        return {
          ...horse,
          hunger: newHunger,
          health: Math.max(0, newHealth),
          happiness: Math.max(0, newHappiness),
          stamina: newStamina,
          experience: newExperience,
          value: newValue,
          age: horse.age + 1 
        };
      });

      // Upkeep
      const upkeepCost = prev.horses.length * DAILY_UPKEEP_PER_HORSE;

      // CHECK ACHIEVEMENTS (via hook)
      const unlockedNow = checkAchievements(prev, (title) => {
        log(`🏆 ACHIEVEMENT UNLOCKED: ${title}`, 'success');
      });

      return {
        ...prev,
        day: prev.day + 1,
        energy: prev.maxEnergy,
        cleanliness: newCleanliness,
        infrastructure: newInfrastructure,
        cropGrowth: newCropGrowth,
        fieldWater: newFieldWater,
        fieldPests: newFieldPests,
        money: prev.money - upkeepCost,
        feed: newFeed,
        horses: updatedHorses,
        chickens: finalChickens,
        dairyCows: finalDairyCows,
        beefCows: finalBeefCows,
        goats: finalGoats,
        pigs: finalPigs,
        beefPrice: nextBeefPrice,
        pigPrice: nextPigPrice,
        weather: nextWeather,
        hasCollectedEggs: false, 
        hasMilkedCows: false,
        hasMilkedGoats: false,
        hasCollectedManure: false,
        activeEvent: undefined, 
        unlockedAchievements: [...prev.unlockedAchievements, ...unlockedNow],
        stats: {
          ...prev.stats,
          maxHorsesOwned: Math.max(prev.stats.maxHorsesOwned, updatedHorses.length)
        },
        logs: [...prev.logs, ...dailyLogs].slice(-100) 
      };
    });

    // 2. Async Checks (AI & Events)
    try {
      const tickerNews = await generateNewsTicker(state.day + 1, nextWeather);
      setState(prev => ({ ...prev, news: tickerNews }));
      
      const tempNextState = { ...state, day: state.day + 1, weather: nextWeather };
      const report = await generateDailyReport(tempNextState);
      addLog(report, 'flavor');

      // Random Event Chance (via hook)
      const triggeredEvent = triggerRandomEvent();
      if (triggeredEvent) {
        setState(prev => ({ ...prev, activeEvent: triggeredEvent }));
      }

    } catch (e) {
      console.error("AI Generation Error", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const resolveEvent = (optionIndex: number) => {
    if (!activeEvent) return;

    const option = activeEvent.options[optionIndex];
    if (!option) return;

    setState(prev => {
      const changes = option.action(prev);
      return {
        ...prev,
        ...changes,
        activeEvent: undefined, // Close modal
        logs: [...prev.logs, { id: uid(), day: prev.day, message: option.logMessage, type: 'info' as const }].slice(-100)
      };
    });
    clearEvent(); // Clear event in hook
  };

  // ---- Actions ----

  const startGame = () => {
    if (!farmNameInput.trim()) return;
    setState(prev => ({
      ...prev,
      farmName: farmNameInput,
      gameStage: 'PLAYING',
      logs: [{ id: uid(), day: 1, message: `Welcome to ${farmNameInput}! Start by buying a horse.`, type: 'success' }]
    }));
    setShowTutorial(true);
  };

  const handleGenerateFarmName = async () => {
    setIsProcessing(true);
    try {
      const name = await generateFarmName();
      if (name) setFarmNameInput(name);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // -- Market Actions --

  const buyFeed = () => {
    if (state.money >= COST_FEED_UNIT) {
      setState(prev => ({
        ...prev,
        money: prev.money - COST_FEED_UNIT,
        feed: prev.feed + FEED_PER_UNIT
      }));
      addLog(`Bought ${FEED_PER_UNIT} feed for $${COST_FEED_UNIT}.`, 'success');
      updateTutorial('boughtFeed');
    } else {
      addLog("Not enough money for feed!", 'danger');
    }
  };

  const buyChickenBatch = () => {
    if (state.money >= COST_CHICKEN_BATCH) {
        setState(prev => ({
            ...prev,
            money: prev.money - COST_CHICKEN_BATCH,
            chickens: prev.chickens + 5,
            stats: {
              ...prev.stats,
              totalAnimalsPurchased: prev.stats.totalAnimalsPurchased + 5
            }
        }));
        addLog("Purchased a flock of 5 chickens.", 'success');
        showToast("✓ Purchased 5 chickens!", 'success');
    } else {
        addLog("Not enough money.", 'danger');
        showToast("Not enough money!", 'danger');
    }
  };

  const buyDairyCow = () => {
      if (state.money >= COST_COW_DAIRY) {
          setState(prev => ({
              ...prev,
              money: prev.money - COST_COW_DAIRY,
              dairyCows: prev.dairyCows + 1,
              stats: {
                ...prev.stats,
                totalAnimalsPurchased: prev.stats.totalAnimalsPurchased + 1
              }
          }));
          addLog("Purchased a Dairy Cow.", 'success');
      } else {
        addLog("Not enough money.", 'danger');
      }
  };

  const buyBeefCow = () => {
      if (state.money >= COST_COW_BEEF) {
          setState(prev => ({
              ...prev,
              money: prev.money - COST_COW_BEEF,
              beefCows: prev.beefCows + 1,
              stats: {
                ...prev.stats,
                totalAnimalsPurchased: prev.stats.totalAnimalsPurchased + 1
              }
          }));
          addLog(`Purchased a Beef Steer for $${COST_COW_BEEF}.`, 'success');
      } else {
        addLog("Not enough money.", 'danger');
      }
  };

  const buyGoat = () => {
    if (state.money >= COST_GOAT) {
        setState(prev => ({
            ...prev,
            money: prev.money - COST_GOAT,
            goats: prev.goats + 1,
            stats: {
              ...prev.stats,
              totalAnimalsPurchased: prev.stats.totalAnimalsPurchased + 1
            }
        }));
        addLog("Purchased a Goat.", 'success');
    } else {
      addLog("Not enough money.", 'danger');
    }
  };

  const buyPig = () => {
    if (state.money >= COST_PIG) {
        setState(prev => ({
            ...prev,
            money: prev.money - COST_PIG,
            pigs: prev.pigs + 1,
            stats: {
              ...prev.stats,
              totalAnimalsPurchased: prev.stats.totalAnimalsPurchased + 1
            }
        }));
        addLog("Purchased a Pig.", 'success');
    } else {
      addLog("Not enough money.", 'danger');
    }
  };

  const buyEquipment = (id: EquipmentId) => {
    if (state.equipment.includes(id)) {
        addLog("You already own this equipment!", 'warning');
        return;
    }
    const cost = EQUIPMENT_DETAILS[id].cost;
    if (state.money >= cost) {
        setState(prev => ({
            ...prev,
            money: prev.money - cost,
            equipment: [...prev.equipment, id]
        }));
        addLog(`Purchased ${EQUIPMENT_DETAILS[id].name}`, 'success');
    } else {
        addLog("Not enough money.", 'danger');
    }
  };

  const sellBeefCow = () => {
      if (state.beefCows > 0) {
          const price = state.beefPrice;
          setState(prev => ({
              ...prev,
              money: prev.money + price,
              beefCows: prev.beefCows - 1,
              stats: {
                ...prev.stats,
                totalMoneyEarned: prev.stats.totalMoneyEarned + price
              }
          }));
          addLog(`Sold a Beef Steer for market price: $${price}.`, 'success');
      } else {
          addLog("You don't have any beef cattle to sell.", 'warning');
      }
  };

  const sellPig = () => {
      if (state.pigs > 0) {
          const price = state.pigPrice;
          setState(prev => ({
              ...prev,
              money: prev.money + price,
              pigs: prev.pigs - 1,
              stats: {
                ...prev.stats,
                totalMoneyEarned: prev.stats.totalMoneyEarned + price
              }
          }));
          
          if (price >= 180 && !state.unlockedAchievements.includes('pig_trader')) {
              // Special immediate check for this tricky condition
               setState(prev => ({
                  ...prev,
                  unlockedAchievements: [...prev.unlockedAchievements, 'pig_trader'],
                  logs: [...prev.logs, { id: uid(), day: prev.day, message: "🏆 ACHIEVEMENT UNLOCKED: Market Timing", type: 'success' as const }].slice(-100)
               }));
          }

          addLog(`Sold a Pig for market price: $${price}.`, 'success');
      } else {
          addLog("You don't have any pigs to sell.", 'warning');
      }
  };

  const sellChicken = () => {
      if (state.chickens > 0) {
          setState(prev => ({
              ...prev,
              money: prev.money + SALE_PRICE_CHICKEN_MEAT,
              chickens: prev.chickens - 1,
              stats: {
                  ...prev.stats,
                  totalMoneyEarned: prev.stats.totalMoneyEarned + SALE_PRICE_CHICKEN_MEAT
              }
          }));
          addLog(`Sold a chicken for meat ($${SALE_PRICE_CHICKEN_MEAT}).`, 'success');
      } else {
          addLog("You don't have any chickens to sell.", 'warning');
      }
  };

  const sellProduce = () => {
      if (state.eggs === 0 && state.milk === 0 && state.manure === 0) {
          addLog("Nothing to sell.", 'warning');
          return;
      }
      
      const eggPrice = state.isFreeRange ? SALE_PRICE_EGG_FREE_RANGE : SALE_PRICE_EGG_CAGED;
      const earnings = (state.eggs * eggPrice) + (state.milk * SALE_PRICE_MILK) + (state.manure * SALE_PRICE_MANURE);
      
      setState(prev => ({
          ...prev,
          money: prev.money + earnings,
          eggs: 0,
          milk: 0,
          manure: 0,
          stats: {
            ...prev.stats,
            totalMoneyEarned: prev.stats.totalMoneyEarned + earnings
          }
      }));
      addLog(`Sold eggs, milk, and manure for $${earnings}.`, 'success');
  };

  const buyHorse = async (breed: Breed) => {
    if (state.money >= HORSE_BASE_COST) {
      setIsProcessing(true);
      const name = `Horse ${state.horses.length + 1}`; // Placeholder
      const bio = await generateHorseBio(name, breed);
      
      const newHorse: Horse = {
        id: uid(),
        name: `Steed ${Math.floor(Math.random() * 100)}`,
        isNamed: false,
        breed,
        age: 24,
        health: 100,
        hunger: 20,
        happiness: 50,
        experience: 0,
        level: 1,
        stamina: 100,
        bio,
        value: HORSE_BASE_COST
      };

      setState(prev => ({
        ...prev,
        money: prev.money - HORSE_BASE_COST,
        horses: [...prev.horses, newHorse],
        stats: {
          ...prev.stats,
          totalAnimalsPurchased: prev.stats.totalAnimalsPurchased + 1,
          maxHorsesOwned: Math.max(prev.stats.maxHorsesOwned, prev.horses.length + 1)
        }
      }));
      addLog(`Purchased a ${breed} (unnamed)! Train it to unlock its true potential.`, 'success');
      setIsProcessing(false);
      updateTutorial('boughtHorse');
    } else {
      addLog("Cannot afford this horse.", 'danger');
    }
  };

  // -- Chores --

  const toggleCoopMode = () => {
    if (state.chickens === 0) {
      addLog("You need chickens to set up a coop!", 'warning');
      return;
    }
    
    setState(prev => {
      const newMode = !prev.isFreeRange;
      return { ...prev, isFreeRange: newMode };
    });
    
    addLog(
      state.isFreeRange 
      ? "Coop converted to Caged mode. (Lower expenses, cheap eggs)" 
      : "Coop converted to Free Range. (Higher feed cost, premium eggs)", 
      'info'
    );
  };

  const cleanStable = () => {
    const cost = 20;
    if (state.energy >= cost) {
      setState(prev => ({
        ...prev,
        energy: prev.energy - cost,
        cleanliness: Math.min(100, prev.cleanliness + 30)
      }));
      addLog("You mucked out the stables. It smells better.", 'success');
      updateTutorial('cleanedStable');
    } else {
      addLog("Too tired to clean!", 'warning');
    }
  };

  const repairFences = () => {
      const cost = 30;
      if (state.energy >= cost) {
          setState(prev => ({
              ...prev,
              energy: prev.energy - cost,
              infrastructure: Math.min(100, prev.infrastructure + 25)
          }));
          addLog("Repaired the broken fences.", 'success');
      } else {
          addLog("Too tired to hammer nails.", 'warning');
      }
  };

  // -- Crop Logic --

  const plantCrop = (type: CropType) => {
    const cost = 40; // Energy cost
    const details = CROP_DETAILS[type];
    const seedCost = details.seedCost;

    // Validation
    if (state.money < seedCost) {
      addLog(`Not enough money for ${details.name} seeds ($${seedCost}).`, 'danger');
      return;
    }
    if (state.energy < cost) {
      addLog("Too tired to plant fields.", 'warning');
      return;
    }
    if (state.cropGrowth > 0) {
      addLog("Fields are already planted!", 'warning');
      return;
    }
    
    // Equipment Check
    const missingEquip = details.requires.filter(req => !state.equipment.includes(req));
    if (missingEquip.length > 0) {
        const names = missingEquip.map(id => EQUIPMENT_DETAILS[id].name).join(', ');
        addLog(`Cannot plant ${details.name}. Missing: ${names}`, 'danger');
        return;
    }

    setState(prev => ({
      ...prev,
      money: prev.money - seedCost,
      energy: prev.energy - cost,
      cropGrowth: 1,
      activeCrop: type,
      fieldWater: 50, // Reset water
      fieldPests: false // Reset pests
    }));
    addLog(`Planted ${details.name}.`, 'success');
  };

  const waterCrops = () => {
    const cost = 25;
    if (state.cropGrowth === 0) {
        addLog("Nothing planted to water.", 'warning');
        return;
    }
    if (state.fieldWater >= 90) {
        addLog("Field is already saturated.", 'warning');
        return;
    }
    if (state.energy >= cost) {
        setState(prev => ({
            ...prev,
            energy: prev.energy - cost,
            fieldWater: Math.min(100, prev.fieldWater + 40)
        }));
        addLog("Watered the crops.", 'success');
    } else {
        addLog("Too tired to haul water.", 'warning');
    }
  };

  const treatPests = () => {
      const cost = 50; // Money cost for pesticide/treatment
      if (!state.fieldPests) {
          addLog("No pests to treat.", 'warning');
          return;
      }
      if (state.money >= cost) {
          setState(prev => ({
              ...prev,
              money: prev.money - cost,
              fieldPests: false
          }));
          addLog("Treated the fields. Pests eliminated.", 'success');
      } else {
          addLog("Not enough money for pest treatment.", 'danger');
      }
  };

  const harvestCrop = () => {
      const cost = 25;
      if (state.energy < cost) {
          addLog("Too tired to harvest.", 'warning');
          return;
      }
      
      if (state.cropGrowth < 100 || !state.activeCrop) {
        addLog("The crops aren't ready to harvest yet.", 'warning');
        return;
      }

      const cropDetails = CROP_DETAILS[state.activeCrop];

      // Yield calculation
      const yieldAmount = 20 + Math.floor(Math.random() * 10);
      const marketValue = yieldAmount * cropDetails.sellPrice; 

      // If Hay, offer option to keep. If others, sell immediately (simplification for now, or use modal)
      if (state.activeCrop === 'hay') {
          // Create a temporary event to prompt the user
            const harvestEvent: FarmEvent = {
                title: "Harvest Complete",
                description: `You've harvested ${yieldAmount} bales of Hay.`,
                options: [
                {
                    label: `Keep for Feed (+${yieldAmount} bales)`,
                    logMessage: `Stored ${yieldAmount} bales of hay.`,
                    action: (curr) => ({
                      feed: curr.feed + yieldAmount,
                      cropGrowth: 0,
                      activeCrop: null,
                      stats: {
                         ...curr.stats,
                         totalCropsHarvested: curr.stats.totalCropsHarvested + 1
                      }
                    })
                },
                {
                    label: `Sell at Market (+$${marketValue})`,
                    logMessage: `Sold the harvest for $${marketValue}.`,
                    action: (curr) => ({
                      money: curr.money + marketValue,
                      cropGrowth: 0,
                      activeCrop: null,
                      stats: {
                        ...curr.stats,
                        totalCropsHarvested: curr.stats.totalCropsHarvested + 1,
                        totalMoneyEarned: curr.stats.totalMoneyEarned + marketValue
                      }
                    })
                }
                ]
            };
            setState(prev => ({ ...prev, energy: prev.energy - cost, activeEvent: harvestEvent }));
      } else {
          // Auto sell cash crops
          setState(prev => ({
              ...prev,
              energy: prev.energy - cost,
              money: prev.money + marketValue,
              cropGrowth: 0,
              activeCrop: null,
              stats: {
                ...prev.stats,
                totalCropsHarvested: prev.stats.totalCropsHarvested + 1,
                totalMoneyEarned: prev.stats.totalMoneyEarned + marketValue
              }
          }));
          addLog(`Harvested and sold ${cropDetails.name} for $${marketValue}.`, 'success');
      }
  };

  const collectEggs = () => {
      const cost = 10;
      if (state.chickens === 0) {
          addLog("You don't have any chickens!", 'warning');
          return;
      }
      if (state.hasCollectedEggs) {
          addLog("You have already collected eggs today.", 'warning');
          return;
      }

      if (state.energy >= cost) {
          // Calculation: Random between 0.5 and 1.1 eggs per chicken.
          // Capped explicitly at state.chickens to ensure valid logic.
          const rawAmount = state.chickens * (0.5 + Math.random() * 0.6); 
          const amount = Math.min(state.chickens, Math.floor(rawAmount));
          
          setState(prev => ({
              ...prev,
              energy: prev.energy - cost,
              eggs: prev.eggs + amount,
              hasCollectedEggs: true
          }));
          addLog(`Collected ${amount} eggs from the coop.`, 'success');
      } else {
        addLog("Too tired.", 'warning');
      }
  };

  const collectManure = () => {
      const cost = 10;
      if (state.chickens === 0) {
          addLog("You don't have any chickens to clean up after!", 'warning');
          return;
      }
      if (state.hasCollectedManure) {
          addLog("You have already collected manure today.", 'warning');
          return;
      }
      
      if (state.energy >= cost) {
          const amount = Math.max(1, Math.floor(state.chickens * 0.3)); // 1 bag per ~3 chickens
          setState(prev => ({
              ...prev,
              energy: prev.energy - cost,
              manure: prev.manure + amount,
              hasCollectedManure: true
          }));
          addLog(`Collected ${amount} bags of fertilizer.`, 'success');
      } else {
          addLog("Too tired to shovel manure.", 'warning');
      }
  };

  const milkCows = () => {
      const cost = 15;
      if (state.dairyCows === 0) {
          addLog("You don't have any Dairy Cows!", 'warning');
          return;
      }
      if (state.hasMilkedCows) {
          addLog("You have already milked the cows today.", 'warning');
          return;
      }

      if (state.energy >= cost) {
          // 6 to 7 gallons per cow (Updated)
          const amount = state.dairyCows * (6 + Math.floor(Math.random() * 2));
          setState(prev => ({
              ...prev,
              energy: prev.energy - cost,
              milk: prev.milk + amount,
              hasMilkedCows: true
          }));
          addLog(`Milked the herd for ${amount} gallons.`, 'success');
      } else {
        addLog("Too tired.", 'warning');
      }
  };

  const milkGoats = () => {
    const cost = 10;
    if (state.goats === 0) {
        addLog("You don't have any Goats!", 'warning');
        return;
    }
    if (state.hasMilkedGoats) {
        addLog("You have already milked the goats today.", 'warning');
        return;
    }

    if (state.energy >= cost) {
        // 0.5 to 1.5 gallons per goat
        const amount = Math.floor(state.goats * (0.5 + Math.random()));
        setState(prev => ({
            ...prev,
            energy: prev.energy - cost,
            milk: prev.milk + amount,
            hasMilkedGoats: true
        }));
        addLog(`Milked the goats for ${amount} gallons.`, 'success');
    } else {
      addLog("Too tired.", 'warning');
    }
  };

  // -- Horse Specific --

  const feedHorse = (id: string) => {
    if (state.feed < 1) {
      addLog("No feed left! Buy more at the market.", 'danger');
      return;
    }
    if (state.energy < 5) {
      addLog("Too tired.", 'warning');
      return;
    }

    setState(prev => {
      const horseIndex = prev.horses.findIndex(h => h.id === id);
      if (horseIndex === -1) return prev;

      const updatedHorses = [...prev.horses];
      const horse = { ...updatedHorses[horseIndex] };
      
      horse.hunger = Math.max(0, horse.hunger - 30);
      horse.health = Math.min(100, horse.health + 5);
      horse.experience += 1;

      updatedHorses[horseIndex] = horse;

      return {
        ...prev,
        feed: prev.feed - 1,
        energy: prev.energy - 5,
        horses: updatedHorses
      };
    });
    addLog("Fed the horse.", 'info');
    updateTutorial('fedHorse');
  };

  const groomHorse = (id: string) => {
    if (state.energy < 10) {
      addLog("Too tired.", 'warning');
      return;
    }
    setState(prev => {
      const idx = prev.horses.findIndex(h => h.id === id);
      if (idx === -1) return prev;
      const updatedHorses = [...prev.horses];
      const horse = { ...updatedHorses[idx] };
      
      horse.happiness = Math.min(100, horse.happiness + 15);
      horse.stamina = Math.max(0, horse.stamina - 5);
      horse.experience += 2;
      
      updatedHorses[idx] = horse;
      return { ...prev, energy: prev.energy - 10, horses: updatedHorses };
    });
    addLog("Groomed the horse. It looks shiny!", 'success');
  };

  const trainHorse = (id: string) => {
    const horse = state.horses.find(h => h.id === id);
    if (!horse) return;

    if (state.energy < 20) {
      addLog("Too tired to train.", 'warning');
      return;
    }
    
    if (horse.stamina < 20) {
        addLog(`${horse.name} is too tired to train.`, 'warning');
        return;
    }
    
    // Calculate logic upfront to avoid stale state read bugs
    const baseXP = 15;
    const moodMult = 1 + (horse.happiness / 200); 
    const healthMult = horse.health < 50 ? 0.5 : 1.0;
    const randomVar = Math.floor(Math.random() * 5); 
    const xpGain = Math.floor((baseXP * moodMult * healthMult) + randomVar);

    const newExperience = horse.experience + xpGain;
    const nextThreshold = XP_THRESHOLDS[horse.level] || Infinity;
    
    let newLevel = horse.level;
    let leveledUp = false;
    let newValue = horse.value;

    if (horse.level < MAX_LEVEL && newExperience >= nextThreshold) {
        newLevel += 1;
        leveledUp = true;
        newValue += 500;
    }

    setState(prev => {
      const idx = prev.horses.findIndex(h => h.id === id);
      if (idx === -1) return prev;
      const updatedHorses = [...prev.horses];
      
      updatedHorses[idx] = {
        ...updatedHorses[idx],
        experience: newExperience,
        level: newLevel,
        value: newValue,
        happiness: leveledUp ? 100 : Math.max(0, updatedHorses[idx].happiness - 5),
        stamina: Math.max(0, updatedHorses[idx].stamina - 20),
        hunger: updatedHorses[idx].hunger + 10
      };

      return { ...prev, energy: prev.energy - 20, horses: updatedHorses };
    });

    if (leveledUp) {
        addLog(`[LEVEL UP] ${horse.name} reached Level ${newLevel}! Value increased massively.`, 'success');
    } else {
        addLog(`Training complete. ${horse.name} gained experience.`, 'info');
    }
  };

  const revealHorseName = async (id: string) => {
    setIsProcessing(true);
    try {
      const horse = state.horses.find(h => h.id === id);
      if (!horse) return;

      const newName = await generateHorseName(horse.breed, horse.bio);
      
      setState(prev => {
        const updatedHorses = prev.horses.map(h => {
          if (h.id === id) {
            return { ...h, name: newName, isNamed: true };
          }
          return h;
        });
        return { ...prev, horses: updatedHorses };
      });
      
      addLog(`[NAMED] ${horse.name} has been officially registered as '${newName}'!`, 'success');
    } catch (e) {
      console.error(e);
      addLog("Failed to generate name. Try again.", 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  // Sync hook state back to GameState for components that expect it there
  const enhancedState = {
    ...state,
    activeEvent: activeEvent,
    unlockedAchievements: unlockedAchievements
  };

  return {
    state: enhancedState,
    farmNameInput,
    setFarmNameInput,
    isProcessing,
    showTutorial,
    setShowTutorial,
    tutorialProgress,
    actions: {
        startGame,
        handleGenerateFarmName,
        handleEndDay,
        resolveEvent,
        buyFeed,
        buyChickenBatch,
        buyDairyCow,
        buyBeefCow,
        buyGoat,
        buyPig,
        buyEquipment,
        sellBeefCow,
        sellPig,
        sellChicken,
        sellProduce,
        toggleCoopMode,
        cleanStable,
        repairFences,
        harvestCrop,
        plantCrop,
        waterCrops,
        treatPests,
        collectEggs,
        collectManure,
        milkCows,
        milkGoats,
        buyHorse,
        feedHorse,
        groomHorse,
        trainHorse,
        revealHorseName
    }
  };
}
