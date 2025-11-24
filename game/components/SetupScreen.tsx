import React from 'react';
import { Home, Play, Sparkles, Loader2 } from 'lucide-react';

interface SetupScreenProps {
  farmNameInput: string;
  onFarmNameChange: (val: string) => void;
  onGenerateFarmName: () => void;
  onStartGame: () => void;
  isProcessing: boolean;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ 
  farmNameInput, 
  onFarmNameChange, 
  onGenerateFarmName, 
  onStartGame, 
  isProcessing 
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-900 p-4">
      <div className="max-w-md w-full bg-stone-800 p-8 rounded-lg shadow-2xl border border-stone-700 text-center">
        <Home size={48} className="mx-auto text-emerald-500 mb-4" />
        <h1 className="text-3xl font-bold text-stone-100 mb-2 font-mono-game">Equine Acres</h1>
        <p className="text-stone-400 mb-6">A text-based stable management simulation.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-left text-sm font-bold text-stone-300 mb-1">Name your Farm</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={farmNameInput}
                onChange={(e) => onFarmNameChange(e.target.value)}
                className="flex-1 bg-stone-900 border border-stone-600 rounded p-3 text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="e.g. Green Valley Ranch"
                maxLength={30}
              />
              <button 
                onClick={onGenerateFarmName}
                disabled={isProcessing}
                className="bg-stone-700 hover:bg-stone-600 disabled:opacity-50 text-emerald-400 p-3 rounded transition-colors border border-stone-600"
                title="Generate Random Name with AI"
              >
                {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              </button>
            </div>
          </div>
          <button 
            onClick={onStartGame}
            disabled={!farmNameInput.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-700 disabled:text-stone-500 text-white font-bold py-3 rounded transition-all flex items-center justify-center gap-2"
          >
            <Play size={18} /> Start Journey
          </button>
        </div>
      </div>
    </div>
  );
};