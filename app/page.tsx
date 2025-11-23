import { initializePlayerAction } from './actions/player';
import { PlayerStats } from '@/components/PlayerStats';
import { FarmGrid } from '@/components/FarmGrid';
import { LivestockList } from '@/components/LivestockList';
import { Inventory } from '@/components/Inventory';
import { Shop } from '@/components/Shop';
import { ChoresList } from '@/components/ChoresList';
import { EventLog } from '@/components/EventLog';
import { QuickActions } from '@/components/QuickActions';
import { Home, Moon } from 'lucide-react';

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

  return (
    <div className="h-screen flex flex-col bg-stone-900 text-stone-200 overflow-hidden">
      {/* Header */}
      <header className="bg-stone-950 border-b border-stone-800 p-4 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <Home size={20} className="text-emerald-500" />
          <h1 className="font-bold text-lg tracking-wide">{player.name}&apos;s Farm</h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-stone-400">
          <span className="hidden md:inline">FarmLife RPG</span>
        </div>
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
            }}
            gameState={player.gameState}
          />
          <QuickActions playerId={player.id} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="space-y-6">
            <FarmGrid playerId={player.id} crops={player.crops || []} inventory={player.inventory || []} />
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
