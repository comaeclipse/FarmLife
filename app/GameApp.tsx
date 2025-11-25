'use client'

import React from 'react'
import { useGameState } from '@/lib/hooks/useGameState'
import { SetupScreen } from '@/game/components/SetupScreen'
import { GameScreen } from '@/game/components/GameScreen'
import { ToastProvider } from '@/lib/contexts/ToastContext'

export default function GameApp() {
  const {
    state,
    farmNameInput,
    setFarmNameInput,
    isProcessing,
    showTutorial,
    setShowTutorial,
    tutorialProgress,
    actions
  } = useGameState()

  if (state.gameStage === 'SETUP') {
    return (
      <ToastProvider>
        <SetupScreen
          farmNameInput={farmNameInput}
          onFarmNameChange={setFarmNameInput}
          onGenerateFarmName={actions.handleGenerateFarmName}
          onStartGame={actions.startGame}
          isProcessing={isProcessing}
        />
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <GameScreen
        state={state}
        tutorialProgress={tutorialProgress}
        showTutorial={showTutorial}
        onToggleTutorial={setShowTutorial}
        isProcessing={isProcessing}
        actions={actions}
      />
    </ToastProvider>
  )
}
