import React from 'react';
import type { FarmEvent } from '@/types';
import { MessageCircle, AlertTriangle, Calendar } from 'lucide-react';

interface EventModalProps {
  event?: FarmEvent;
  onOptionSelect: (index: number) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onOptionSelect }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-600 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-amber-900/20 border-b border-stone-700 p-6 flex items-start gap-4">
          <div className="bg-amber-500/20 p-3 rounded-full border border-amber-500/50">
             <Calendar size={24} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-100 font-mono-game mb-1">{event.title}</h2>
            <div className="h-1 w-20 bg-amber-600/50 rounded"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-stone-300 text-lg leading-relaxed mb-8">
            {event.description}
          </p>

          <div className="space-y-3">
            {event.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onOptionSelect(idx)}
                className="w-full text-left p-4 rounded bg-stone-800 hover:bg-stone-700 border border-stone-600 hover:border-stone-500 transition-all group"
              >
                <div className="flex justify-between items-center">
                   <span className="font-bold text-stone-200 group-hover:text-emerald-400 transition-colors">{option.label}</span>
                   <span className="text-stone-500 text-xs">Select &rarr;</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-stone-950 p-2 text-center text-xs text-stone-500 uppercase tracking-widest border-t border-stone-800">
            Event Pending
        </div>

      </div>
    </div>
  );
};