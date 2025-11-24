import React from 'react';
import { CheckCircle2, Circle, X } from 'lucide-react';
import type { TutorialProgress } from '@/types';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmName: string;
  progress: TutorialProgress;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, farmName, progress }) => {
  if (!isOpen) return null;

  const tasks = [
    { key: 'boughtFeed', label: 'Visit the Market and Buy Feed', done: progress.boughtFeed },
    { key: 'boughtHorse', label: 'Purchase your first Horse', done: progress.boughtHorse },
    { key: 'fedHorse', label: 'Feed a hungry Horse', done: progress.fedHorse },
    { key: 'cleanedStable', label: 'Perform Chores: Muck Out Stables', done: progress.cleanedStable },
  ];

  const allDone = tasks.every(t => t.done);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-600 rounded-lg shadow-2xl max-w-md w-full relative overflow-hidden">
        
        {/* Header */}
        <div className="bg-stone-800 p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-emerald-400 font-mono-game">Welcome Rancher!</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-stone-300 leading-relaxed">
            You are now the proud owner of <span className="font-bold text-amber-400">{farmName}</span>. 
            It's a humble beginning, but with hard work, you can build a legacy.
          </p>
          
          <div className="bg-stone-950/50 rounded-lg p-4 border border-stone-800">
            <h3 className="text-sm uppercase tracking-wider text-stone-500 font-bold mb-3">Getting Started Checklist</h3>
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li key={task.key} className={`flex items-center gap-3 ${task.done ? 'text-stone-500 line-through' : 'text-stone-200'}`}>
                  {task.done ? (
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Circle size={20} className="text-stone-600 shrink-0" />
                  )}
                  <span>{task.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {allDone && (
            <div className="bg-emerald-900/20 border border-emerald-800/50 rounded p-3 text-emerald-400 text-sm text-center animate-pulse">
              Checklist Complete! You are ready to run the farm.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-800/50 border-t border-stone-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition-colors"
          >
            {allDone ? "Let's Go!" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
};