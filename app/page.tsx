import { initializePlayerAction, restAction, processDailyUpdateAction } from './actions/player';
import { waterAllCropsAction } from './actions/crops';
import { PlayerStats } from '@/components/PlayerStats';
import { FarmGrid } from '@/components/FarmGrid';
import { LivestockList } from '@/components/LivestockList';
import { Inventory } from '@/components/Inventory';
import { Shop } from '@/components/Shop';
import { ChoresList } from '@/components/ChoresList';
import { EventLog } from '@/components/EventLog';
import { QuickActions } from '@/components/QuickActions';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Initialize or get player
  const playerResult = await initializePlayerAction();

  if (!playerResult.success || !playerResult.player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-gray-400">Failed to load game data</p>
        </div>
      </div>
    );
  }

  const player = playerResult.player;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-green-400 mb-2">🌾 FarmLife RPG 🌾</h1>
          <p className="text-gray-400 text-sm">Manage your farm, grow crops, raise animals, and prosper!</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Left Column - Player Stats & Quick Actions */}
          <div className="space-y-4">
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
            <EventLog events={player.events || []} />
          </div>

          {/* Middle Column - Farm */}
          <div className="lg:col-span-2 space-y-4">
            <FarmGrid playerId={player.id} crops={player.crops || []} inventory={player.inventory || []} />
            <LivestockList playerId={player.id} livestock={player.livestock || []} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chores */}
          <div>
            <ChoresList playerId={player.id} chores={player.chores || []} />
          </div>

          {/* Inventory */}
          <div>
            <Inventory inventory={player.inventory || []} />
          </div>

          {/* Shop */}
          <div>
            <Shop playerId={player.id} playerCoins={player.coins} />
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-600 text-xs">
          <p>FarmLife RPG v1.0 - Built with Next.js, Prisma, and Neon Postgres</p>
        </footer>
      </div>
    </main>
  );
}
