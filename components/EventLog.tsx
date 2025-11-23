'use client';

import { useEffect, useRef } from 'react';
import { CloudRain, User, PawPrint, Sprout, DollarSign, Sparkles, FileText } from 'lucide-react';

interface Event {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: Date;
}

interface EventLogProps {
  events: Event[];
}

export function EventLog({ events }: EventLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'WEATHER':
        return <CloudRain size={14} className="text-blue-400" />;
      case 'VISITOR':
        return <User size={14} className="text-purple-400" />;
      case 'ANIMAL_EVENT':
        return <PawPrint size={14} className="text-amber-400" />;
      case 'CROP_EVENT':
        return <Sprout size={14} className="text-green-400" />;
      case 'MARKET':
        return <DollarSign size={14} className="text-yellow-400" />;
      case 'SPECIAL':
        return <Sparkles size={14} className="text-pink-400" />;
      default:
        return <FileText size={14} className="text-stone-400" />;
    }
  };

  const getEventStyle = (type: string) => {
    switch (type) {
      case 'WEATHER':
        return 'border-l-2 border-blue-500 bg-blue-900/10';
      case 'VISITOR':
        return 'border-l-2 border-purple-500 bg-purple-900/10';
      case 'ANIMAL_EVENT':
        return 'border-l-2 border-amber-500 bg-amber-900/10';
      case 'CROP_EVENT':
        return 'border-l-2 border-green-500 bg-green-900/10';
      case 'MARKET':
        return 'border-l-2 border-yellow-500 bg-yellow-900/10';
      case 'SPECIAL':
        return 'border-l-2 border-pink-500 bg-pink-900/10';
      default:
        return 'border-l-2 border-stone-600';
    }
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col h-full bg-stone-950 rounded-lg border border-stone-700 overflow-hidden">
        <div className="bg-stone-800 px-4 py-2 border-b border-stone-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Farm Log</h3>
        </div>
        <div className="flex-1 p-4">
          <p className="text-stone-600 italic text-sm">No events yet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-stone-950 rounded-lg border border-stone-700 overflow-hidden">
      <div className="bg-stone-800 px-4 py-2 border-b border-stone-700">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Farm Log</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono-game text-sm max-h-[400px]">
        {events.map((event) => (
          <div key={event.id} className={`py-2 px-3 ${getEventStyle(event.type)} rounded`}>
            <div className="flex items-center gap-2 mb-1">
              {getEventIcon(event.type)}
              <span className="font-bold text-stone-200 text-sm">{event.title}</span>
            </div>
            <p className="text-xs text-stone-400 pl-5">{event.description}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
