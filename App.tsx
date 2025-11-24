import React from 'react';
import { useGameState } from '@/game/hooks/useGameState';
import { SetupScreen } from '@/game/components/SetupScreen';
import { GameScreen } from '@/game/components/GameScreen';

export default function App() {
  const {
    state,
    farmNameInput,
    setFarmNameInput,
    isProcessing,
    showTutorial,
    setShowTutorial,
    tutorialProgress,
    actions
  } = useGameState();

  if (state.gameStage === 'SETUP') {
    return (
      <SetupScreen 
        farmNameInput={farmNameInput}
        onFarmNameChange={setFarmNameInput}
        onGenerateFarmName={actions.handleGenerateFarmName}
        onStartGame={actions.startGame}
        isProcessing={isProcessing}
      />
    );
  }

  return (
    <GameScreen 
      state={state}
      tutorialProgress={tutorialProgress}
      showTutorial={showTutorial}
      onToggleTutorial={setShowTutorial}
      isProcessing={isProcessing}
      actions={actions}
    />
  );
}