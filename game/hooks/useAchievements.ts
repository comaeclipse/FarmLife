import { useState, useCallback } from 'react';
import type { GameState } from '@/types';
import { ACHIEVEMENTS } from '@/config';

export function useAchievements(initialUnlocked: string[] = []) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(initialUnlocked);

  const checkAchievements = useCallback((state: GameState, onUnlock?: (title: string) => void) => {
    const newlyUnlocked: string[] = [];

    ACHIEVEMENTS.forEach(achievement => {
      if (!unlockedAchievements.includes(achievement.id) && achievement.condition(state)) {
        newlyUnlocked.push(achievement.id);
        if (onUnlock) {
          onUnlock(achievement.title);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
    }

    return newlyUnlocked;
  }, [unlockedAchievements]);

  const setAchievementsDirectly = useCallback((achievements: string[]) => {
    setUnlockedAchievements(achievements);
  }, []);

  return {
    unlockedAchievements,
    checkAchievements,
    setAchievementsDirectly
  };
}
