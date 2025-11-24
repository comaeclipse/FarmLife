import React, { useEffect, useRef } from 'react';
import type { LogEntry } from '@/types';

interface ActionLogProps {
  logs: LogEntry[];
}

export const ActionLog: React.FC<ActionLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogStyle = (type: LogEntry['type']) => {
    switch (type) {
      case 'danger': return 'text-red-400 border-l-2 border-red-500 pl-2 bg-red-900/10';
      case 'success': return 'text-emerald-400 border-l-2 border-emerald-500 pl-2 bg-emerald-900/10';
      case 'warning': return 'text-amber-400 border-l-2 border-amber-500 pl-2';
      case 'flavor': return 'text-purple-300 italic pl-2 border-l-2 border-purple-500/50';
      default: return 'text-stone-300 border-l-2 border-stone-600 pl-2';
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-950 rounded-lg border border-stone-700 overflow-hidden">
      <div className="bg-stone-800 px-4 py-2 border-b border-stone-700">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Farm Log</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono-game text-sm max-h-[300px] md:max-h-[600px]">
        {logs.length === 0 && <p className="text-stone-600 italic">No events yet...</p>}
        {logs.map((log) => (
          <div key={log.id} className={`py-1 ${getLogStyle(log.type)}`}>
            <span className="text-stone-600 text-xs mr-2">[Day {log.day}]</span>
            <span>{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
