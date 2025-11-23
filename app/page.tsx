import { initializePlayerAction } from './actions/player';
import { PlayerStats } from '@/components/PlayerStats';
import { LivestockList } from '@/components/LivestockList';
import { Inventory } from '@/components/Inventory';
import { Shop } from '@/components/Shop';
import { ChoresList } from '@/components/ChoresList';
import { EventLog } from '@/components/EventLog';
import { QuickActions } from '@/components/QuickActions';
import { NewsTicker } from '@/components/NewsTicker';
import { generateTickerItems } from '@/lib/ticker-items';
import { Home as HomeIcon, Sprout, ShoppingBag, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Initialize or get player
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
    <div className="h-screen flex flex-col bg-stone-900 text-stone-200 overflow-hidden">
      {/* Header */}
      <header className="bg-stone-950 border-b border-stone-800 p-4 flex items-center gap-4 relative z-20">
        <div className="flex items-center gap-2 flex-shrink-0">
          <HomeIcon size={20} className="text-emerald-500" />
          <h1 className="font-bold text-lg tracking-wide">{player.name}&apos;s Farm</h1>
        </div>
        <div className="flex-1 min-w-0">
          <NewsTicker items={tickerItems} />
        </div>
        <nav className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/crops"
            className="flex items-center gap-2 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded transition-colors text-sm"
          >
            <Sprout size={16} />
            <span className="hidden md:inline">Crops</span>
          </Link>
        </nav>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar - Stats & Actions */}
        <aside className="w-full md:w-80 p-4 md:border-r border-stone-800 bg-stone-900 overflow-y-auto space-y-4">
          <PlayerStats
            player={{
              name: player.name,
              level: player.level,
              xp: player.xp,
              coins: player.coins,
              energy: player.energy,
              maxEnergy: player.maxEnergy,
              farmRows: player.farmRows,
              farmCols: player.farmCols,
            }}
            gameState={player.gameState}
          />
          <QuickActions playerId={player.id} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="space-y-6">
            <LivestockList playerId={player.id} livestock={player.livestock || []} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <ChoresList playerId={player.id} chores={player.chores || []} />
              <Inventory inventory={player.inventory || []} />
              <Shop playerId={player.id} playerCoins={player.coins} />
            </div>
          </div>
        </main>

        {/* Right Sidebar - Event Log */}
        <aside className="w-full md:w-80 p-4 md:border-l border-t md:border-t-0 border-stone-800 bg-stone-900">
          <EventLog events={player.events || []} />
        </aside>
      </div>
    </div>
  );
}
