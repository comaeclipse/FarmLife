# FarmLife RPG

A sleek, farm life RPG game built with Next.js, TypeScript, and Prisma. Manage crops, raise livestock flocks, train horses, complete chores, and experience random events in your farming adventure!

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Prisma** - ORM for database management
- **Neon Postgres** - Serverless PostgreSQL database
- **Tailwind CSS** - Utility-first styling
- **Sonner** - Toast notifications
- **Lucide Icons** - Icon library
- **Vercel** - Deployment platform

## Features

### 🌾 Core Systems
- **Energy Management** - Actions consume energy that regenerates daily
- **Exponential Leveling** - XP-based progression with level 20 cap
- **Currency System** - Earn and spend coins on seeds, animals, and upgrades
- **Resource Management** - Track seeds, harvested crops, and animal products
- **Toast Notifications** - Clean, non-intrusive feedback for all actions
- **Event Logging** - Track important player actions and random events
- **News Ticker** - Scrolling news feed with 200+ rotating messages

### 🌱 Farming System
- **8 Crop Types** - Wheat, corn, tomato, carrot, potato, strawberry, pumpkin, lettuce
- **Growth Stages** - Crops progress through 6 stages (planted → ready)
- **Watering Mechanic** - Daily watering advances growth
- **Progressive Farm Expansion** - Start with 1x1 plot, expand to 5x6 (30 plots)
  - Locked behind XP levels (2, 4, 7, 11, 16)
  - Costs coins and energy to expand
- **Dedicated Crop Manager** - Separate `/crops` page for planting/harvesting
- **Bounds Validation** - Can only plant on unlocked plots

### 🐔 Livestock System (Flocks & Herds)

**Group Animals** - Chickens, Cows, Sheep, Pigs, Goats
- **Flock Management** - Animals grouped into flocks, not individuals
- **Bulk Actions** - Feed entire flock at once (10 energy)
- **Flock Size Limits**:
  - Chickens: 50 per flock
  - Cows: 20 per flock
  - Sheep: 30 per flock
  - Pigs: 25 per flock
  - Goats: 30 per flock
- **Individual Production** - Each animal in flock produces separately
  - 10 chickens = up to 10 eggs per day
  - Production based on feeding and time cycles
- **Collective Stats** - Health, happiness, hunger tracked per flock
- **Scalable Feed Requirements** - Different animals need different amounts

### 🐴 Horse System (Individual Premium Animals)

- **Required Naming** - Every horse must have a unique name
- **Premium Care System**:
  - **Feed** (4 energy) - Satisfy hunger, restore happiness
  - **Groom** (6 energy) - Restore grooming to 100%, +10 happiness, +2 bonding
  - **Train** (10 energy) - Increase training level (0-100), +3 bonding
  - **Ride** (8 energy) - Build bonding (+5-10 based on training), +15 happiness
- **Advanced Stats**:
  - Grooming (decays 10 per day)
  - Training (permanent skill level, affects bonding gains)
  - Bonding (decays 2 per day if neglected)
- **No Production** - Horses are companions, not resource producers
- **High Cost** - 2,000 coins per horse

### 📋 Gameplay Features
- **Daily Chores** - Complete randomized tasks for XP and coins
- **Random Events** - Weather, visitors, market fluctuations, special events
- **Seasons & Time** - Day/night cycle with seasonal progression
- **Shop System** - Three tabs: Seeds, Flocks, Horses, Supplies
- **Inventory Management** - Track seeds, crops, feed, and products
- **Quick Actions** - Water all crops, rest, start new day, reset farm
- **Event History** - Last 10 events displayed in sidebar

## Database Schema

### Core Tables
- **Player** - Stats (energy, coins, XP, level), farm size (rows/cols)
- **GameState** - Day, season, year, time of day, ticker items
- **Inventory** - Resource types and quantities

### Farming Tables
- **Crop** - Type, growth stage, plot position, watering status

### Livestock Tables
- **Flock** - Type, count, maxCount, collective stats, production ready count
- **Horse** - Name, health, happiness, hunger, grooming, training, bonding
- **Livestock** (deprecated) - Old individual animal system (kept for compatibility)

### Activity Tables
- **ChoreLog** - Daily tasks with completion tracking
- **GameEvent** - Random events and player actions

## Recent Updates

### v1.3 - Livestock System Refactor (Latest)
- ✅ Split livestock into Flocks (group) vs Horses (individual)
- ✅ Flock system with size limits and bulk feeding
- ✅ Horse system with grooming, training, and bonding mechanics
- ✅ Updated shop with separate tabs for flocks and horses
- ✅ Horse naming dialog with required input
- ✅ Individual production tracking per flock animal
- ✅ Daily stat decay for horses (grooming, bonding)
- ✅ Reset farm function to clear old data

### v1.2 - UI/UX Improvements
- ✅ Replaced browser alerts with toast notifications
- ✅ Added event logging for player actions
- ✅ Scrolling news ticker in header (200+ messages)
- ✅ Progressive farm expansion system (1x1 → 5x6)
- ✅ Level-based unlock system with level 20 cap
- ✅ Redesigned interface with stone theme

### v1.1 - Core Systems
- ✅ Crop planting, watering, and harvesting
- ✅ Energy and XP systems
- ✅ Shop and inventory management
- ✅ Daily chores and random events
- ✅ Seasons and time progression

## Development Roadmap

### ✅ Phase 1: Foundation (Completed)
- [x] Next.js 15 project with TypeScript and Tailwind
- [x] Neon Postgres database setup
- [x] Prisma ORM configuration
- [x] Database schema and migrations
- [x] Git repository and GitHub integration

### ✅ Phase 2: Core Systems (Completed)
- [x] Game logic utilities (time, energy, XP, leveling)
- [x] Database service layer with Prisma
- [x] Server Actions for all game mechanics
- [x] Player initialization and game state

### ✅ Phase 3: UI Development (Completed)
- [x] Main dashboard with sidebar layout
- [x] Crop planting and harvesting system
- [x] Livestock/flock/horse management
- [x] Shop interface with tabs
- [x] Toast notification system
- [x] News ticker component

### ✅ Phase 4: Game Features (Completed)
- [x] Daily chore system
- [x] Random event system
- [x] Seasonal effects
- [x] Event logging
- [x] Progressive farm expansion
- [x] Economy balancing

### 🚧 Phase 5: Future Enhancements
- [ ] Horse racing/competitions
- [ ] Breeding system for horses
- [ ] Craftable items from resources
- [ ] Trading/market system
- [ ] Achievements and milestones
- [ ] Multi-player features (leaderboards)
- [ ] Sound effects and music
- [ ] Mobile optimization
- [ ] Save game export/import

## Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/comaeclipse/FarmLife.git
cd FarmLife
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file with your Neon Postgres credentials:
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

4. **Push database schema**
```bash
npx prisma db push
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to play the game!

## Deployment to Vercel

FarmLife is optimized for Vercel's serverless platform with Neon Postgres.

**Quick deploy:**

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables:
   - `DATABASE_URL` - Neon pooled connection string
   - `DIRECT_URL` - Neon direct connection string
4. Deploy!

Your game will be live at `your-project.vercel.app` in minutes.

## Project Structure

```
FarmLife/
├── app/
│   ├── actions/         # Server Actions (crops, flocks, horses, player, shop)
│   ├── crops/          # Crop manager page
│   ├── layout.tsx      # Root layout with Toaster
│   └── page.tsx        # Main dashboard
├── components/
│   ├── ChoresList.tsx
│   ├── EventLog.tsx
│   ├── FarmGrid.tsx
│   ├── FlockList.tsx   # Group animal management
│   ├── HorseList.tsx   # Individual horse care
│   ├── Inventory.tsx
│   ├── LivestockList.tsx (deprecated)
│   ├── NewsTicker.tsx
│   ├── PlayerStats.tsx
│   ├── QuickActions.tsx
│   └── Shop.tsx
├── lib/
│   ├── constants.ts    # Game data (crops, flocks, horses)
│   ├── db/            # Database functions
│   ├── game-logic.ts  # Core mechanics
│   ├── prisma.ts      # Prisma client
│   └── ticker-items.ts # News ticker messages
├── prisma/
│   └── schema.prisma  # Database schema
└── public/            # Static assets
```

## Game Design Philosophy

FarmLife focuses on:
- **Simplicity** - Clean, focused interface without clutter
- **Progression** - Satisfying XP system with exponential leveling
- **Strategic Depth** - Balance energy, coins, and time efficiently
- **Two Playstyles**:
  - **Resource Farming** - Manage flocks for eggs, milk, wool, meat production
  - **Horse Care** - Train and bond with individual premium horses
- **Replayability** - Random events, seasonal variety, daily chores
- **Extensibility** - Modular design, easy to add features

## Tips for Players

- **Start small** - Buy chickens first (100 coins, produce daily)
- **Expand gradually** - Unlock farm plots as you level up
- **Feed flocks daily** - Unfed animals don't produce
- **Save for a horse** - Premium experience, requires dedication
- **Complete chores** - Easy XP and coins
- **Use the Reset button** - Start fresh if you want to try the new flock/horse system

## Contributing

This is a personal project, but suggestions and feedback are welcome! Open an issue or submit a pull request.

## License

MIT

---

Built with care by comaeclipse | Powered by Claude Code
