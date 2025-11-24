import { useState, useCallback } from 'react';
import type { TutorialProgress } from '@/types';
import { INITIAL_TUTORIAL } from '@/config';

export function useGameFlow() {
  const [farmNameInput, setFarmNameInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialProgress, setTutorialProgress] = useState<TutorialProgress>(INITIAL_TUTORIAL);

  const updateTutorial = useCallback((key: keyof TutorialProgress) => {
    setTutorialProgress(prev => {
      if (prev[key]) return prev; // Already done
      return { ...prev, [key]: true };
    });
  }, []);

  const setTutorialDirectly = useCallback((progress: TutorialProgress) => {
    setTutorialProgress(progress);
  }, []);

  return {
    farmNameInput,
    setFarmNameInput,
    isProcessing,
    setIsProcessing,
    showTutorial,
    setShowTutorial,
    tutorialProgress,
    updateTutorial,
    setTutorialDirectly
  };
}
