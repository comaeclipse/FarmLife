import { initializePlayerAction } from '../actions/player';
import { FarmGrid } from '@/components/FarmGrid';
import { NewsTicker } from '@/components/NewsTicker';
import { generateTickerItems } from '@/lib/ticker-items';
import { Sprout } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CropsPage() {
  const playerResult = await initializePlayerAction();

  if (!playerResult.success || !playerResult.player) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-stone-400">Failed to load game data</p>
        </div>
      </div>
    );
  }

  const player = playerResult.player;

  // Get ticker items from gameState or generate new ones
  let tickerItems: string[] = [];
  if (player.gameState?.tickerItems && Array.isArray(player.gameState.tickerItems)) {
    tickerItems = player.gameState.tickerItems as string[];
  } else if (player.gameState) {
    // Generate initial ticker items if not present
    tickerItems = generateTickerItems({
      day: player.gameState.day,
      season: player.gameState.season,
      year: player.gameState.year,
    });
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200">
      {/* Header */}
      <header className="bg-stone-950 border-b border-stone-800 p-4 flex items-center gap-4">
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link
            href="/"
            className="text-stone-400 hover:text-stone-200 transition-colors"
          >
            ← Back
          </Link>
          <div className="flex items-center gap-2">
            <Sprout size={20} className="text-emerald-500" />
            <h1 className="font-bold text-lg tracking-wide">Crop Manager</h1>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <NewsTicker items={tickerItems} />
        </div>
        <div className="text-sm text-stone-400 flex-shrink-0">
          {player.name}&apos;s Farm
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <FarmGrid
          playerId={player.id}
          crops={player.crops || []}
          inventory={player.inventory || []}
          farmRows={player.farmRows}
          farmCols={player.farmCols}
          playerLevel={player.level}
          playerCoins={player.coins}
          playerEnergy={player.energy}
        />
      </main>
    </div>
  );
}

