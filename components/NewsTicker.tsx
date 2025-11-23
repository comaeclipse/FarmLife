'use client';

interface NewsTickerProps {
  items: string[];
}

export function NewsTicker({ items }: NewsTickerProps) {
  if (!items || items.length === 0) {
    return null;
  }

  // Join items with separator
  const tickerText = items.join(' • ');

  // Duplicate for seamless infinite scroll
  const displayText = `${tickerText} • ${tickerText}`;

  return (
    <div className="hidden md:block overflow-hidden bg-stone-900/50 border border-stone-700 rounded px-3 py-1.5">
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {displayText}
        </div>
      </div>
      <style jsx>{`
        .ticker-wrapper {
          width: 100%;
          overflow: hidden;
        }

        .ticker-content {
          display: inline-block;
          white-space: nowrap;
          animation: scroll-left 60s linear infinite;
          font-size: 0.875rem;
          color: rgb(168 162 158); /* stone-400 */
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Pause animation on hover */
        .ticker-wrapper:hover .ticker-content {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
