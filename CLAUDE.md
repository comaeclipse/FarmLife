# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FarmLife RPG is a text-based farm life simulation game built with Next.js 15, TypeScript, Prisma, and Neon Postgres. The game features crop management, livestock care, energy systems, XP progression, daily chores, and random events.

## Development Commands

### Basic Commands
- `npm install` - Install dependencies (automatically runs `npx prisma generate`)
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands
- `npx prisma generate` - Generate Prisma Client (runs automatically on install)
- `npx prisma migrate dev` - Create and apply new migration in development
- `npx prisma migrate deploy` - Apply migrations in production
- `npx prisma studio` - Open Prisma Studio database browser
- `npx prisma db push` - Push schema changes without migration (dev only)

## Architecture

### Project Structure

```
FarmLife/
├── app/                    # Next.js App Router
│   ├── actions/           # Server Actions (API layer)
│   ├── crops/             # Crop management page
│   ├── page.tsx           # Main dashboard (home)
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components (client & server)
├── lib/                   # Core game logic and utilities
│   ├── db/               # Database access layer (Prisma queries)
│   ├── prisma.ts         # Prisma Client singleton
│   ├── constants.ts      # Game configuration constants
│   └── game-logic.ts     # Core game mechanics (XP, energy, time)
└── prisma/
    └── schema.prisma     # Database schema
```

### Key Architectural Patterns

#### 1. Server Actions Pattern
All data mutations use Next.js Server Actions (`'use server'`) located in `app/actions/`:
- `player.ts` - Player initialization, daily updates, stat management
- `crops.ts` - Planting, watering, harvesting crops
- `livestock.ts` - Animal feeding, petting, product collection
- `shop.ts` - Purchasing seeds and animals

Server Actions call into the database layer and return results with `{ success, data?, error? }` structure.

#### 2. Database Layer Separation
All Prisma queries are abstracted into `lib/db/` modules:
- `player.ts` - Player CRUD operations
- `crops.ts` - Crop management queries
- `livestock.ts` - Livestock queries
- `inventory.ts` - Inventory management
- `gamestate.ts` - Time/season/day tracking
- `chores.ts` - Chore generation and completion
- `events.ts` - Random event logging

This separation keeps Server Actions clean and provides reusable database operations.

#### 3. Game State Management
- Player data is fetched server-side and passed to components
- Game state (day, season, time) is stored in the `GameState` table (1:1 with Player)
- Daily progression is time-based: `shouldAdvanceDay()` checks if 1 minute has passed (configurable to 24 hours)
- Energy regenerates daily; crops advance growth stages; animals produce products

#### 4. Component Architecture
- Most components are Server Components by default
- Client components use `'use client'` directive for interactivity
- Components receive server-fetched data as props
- Forms use Server Actions with `revalidatePath('/')` for cache updates

### Database Schema

The Prisma schema (`prisma/schema.prisma`) defines:
- **Player** - Main character stats (energy, coins, XP, level)
- **GameState** - Time tracking (day, season, year, timeOfDay)
- **Crop** - Planted crops with growth stages and plot positions
- **Livestock** - Animals with health, happiness, hunger, production states
- **InventoryItem** - Seeds, harvested crops, animal products, tools
- **ChoreLog** - Daily tasks with XP/coin rewards
- **GameEvent** - Random event history

All models use cascading deletes on Player for data integrity.

### Game Logic Layer

Core mechanics in `lib/game-logic.ts`:
- **XP System**: Exponential progression (`BASE_XP_FOR_LEVEL * XP_MULTIPLIER^(level-1)`)
- **Energy System**: Actions consume energy from `ENERGY_COSTS` constants
- **Growth Stages**: Crops progress through PLANTED → SEEDLING → GROWING → MATURE → READY
- **Time Progression**: Actions advance time of day (MORNING → AFTERNOON → EVENING → NIGHT)
- **Seasons**: 28-day seasons cycling through SPRING → SUMMER → FALL → WINTER

Game configuration lives in `lib/constants.ts` with data for:
- Energy costs per action
- XP rewards per activity
- Crop data (cost, sell price, growth days, emoji)
- Livestock data (cost, product type, production days, emoji)
- Season effects (growth bonuses/penalties)

### Prisma Configuration

The project uses standard Prisma Client (not Neon's adapter) with:
- Connection pooling via `DATABASE_URL` (for Vercel serverless)
- Direct connections via `DIRECT_URL` (for migrations)
- Singleton pattern in `lib/prisma.ts` to prevent connection exhaustion

## Important Implementation Details

### Daily Update System
The `processDailyUpdateAction()` in `app/actions/player.ts` handles:
1. Advancing game day
2. Resetting player energy to max
3. Growing watered crops by 1 day
4. Updating animal hunger/happiness/production
5. Generating random events (20% chance)
6. Creating new daily chores
7. Cleaning old events and chores

### Path Aliases
Use `@/*` imports (e.g., `@/lib/prisma`, `@/components/Shop`) defined in `tsconfig.json`.

### Dynamic Routes
Home page uses `export const dynamic = 'force-dynamic'` to prevent static generation and ensure fresh data on each visit.

### Vercel Deployment
- Build command includes `npx prisma generate` before `next build`
- Requires `DATABASE_URL` and `DIRECT_URL` environment variables
- Migrations should be run with `npx prisma migrate deploy` after deployment
- Full deployment guide available in DEPLOYMENT.md

## Common Development Tasks

### Adding a New Crop Type
1. Add enum value to `CropType` in `prisma/schema.prisma`
2. Add crop data to `CROP_DATA` in `lib/constants.ts`
3. Add seed type to `ResourceType` enum in schema
4. Run `npx prisma migrate dev --name add-new-crop`

### Adding a New Action
1. Define energy cost in `ENERGY_COSTS` (`lib/constants.ts`)
2. Create Server Action in appropriate `app/actions/*.ts` file
3. Add database query to corresponding `lib/db/*.ts` file
4. Check energy with `canPerformAction()` before executing
5. Update player energy with `updatePlayerStats()`
6. Call `revalidatePath('/')` to refresh UI

### Testing Database Changes
Use Prisma Studio to inspect/modify data:
```bash
npx prisma studio
```

### Debugging Prisma Queries
Set logging in `lib/prisma.ts` (already configured for development):
```typescript
log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
```

## Design Philosophy

- **Simple UI**: Stone-themed, text-focused interface inspired by Equine Acres
- **Server-First**: Leverage Next.js Server Components and Server Actions
- **No API Routes**: All mutations through Server Actions
- **Type Safety**: Full TypeScript with strict mode enabled
- **Database-Driven**: Prisma schema is source of truth for data models
- **Extensible**: Easy to add new crops, animals, chores, and events via constants
