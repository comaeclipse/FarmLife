import React from 'react';
import { Circle } from 'lucide-react';

interface NewsTickerProps {
  news: string[];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ news }) => {
  return (
    <div className="bg-stone-950 border-y border-stone-800 h-8 flex items-center overflow-hidden relative select-none">
      {/* Gradient fades for smooth edges */}
      <div className="absolute top-0 left-0 h-full w-12 z-10 bg-gradient-to-r from-stone-950 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 h-full w-12 z-10 bg-gradient-to-l from-stone-950 to-transparent pointer-events-none"></div>
      
      <div className="whitespace-nowrap animate-marquee flex gap-12 text-stone-400 font-mono-game text-xs items-center">
        {news.map((item, i) => (
           <span key={i} className="inline-flex items-center gap-2">
             <Circle size={6} className="text-emerald-600 fill-emerald-600" /> <span className="tracking-wide">{item.toUpperCase()}</span>
           </span>
        ))}
        {/* Duplicate items to ensure continuity on wider screens before loop resets */}
        {news.map((item, i) => (
           <span key={`dup-${i}`} className="inline-flex items-center gap-2">
             <Circle size={6} className="text-emerald-600 fill-emerald-600" /> <span className="tracking-wide">{item.toUpperCase()}</span>
           </span>
        ))}
      </div>
    </div>
  );
};