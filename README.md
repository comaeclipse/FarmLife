# FarmLife RPG

A sleek, text-based farm life RPG game built with Next.js, TypeScript, and Prisma. Manage crops, raise livestock, complete chores, and experience random events in your farming adventure!

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Prisma** - ORM for database management
- **Neon Postgres** - Serverless PostgreSQL database
- **Tailwind CSS** - Utility-first styling
- **Vercel** - Deployment platform

## Features

### Core Systems
- **Energy Management** - Actions consume energy that regenerates daily
- **XP & Leveling** - Gain experience and level up your farmer
- **Currency System** - Earn and spend coins on seeds, animals, and upgrades
- **Resource Management** - Track seeds, harvested crops, and animal products

### Farming
- **Crop System** - Plant 8 different crop types
- **Growth Stages** - Crops progress through realistic growth stages
- **Watering Mechanic** - Keep crops healthy and watered
- **Plot Management** - Grid-based farm layout

### Livestock
- **5 Animal Types** - Chickens, cows, sheep, pigs, and goats
- **Animal Care** - Feed, pet, and maintain animal happiness
- **Production** - Collect eggs, milk, wool, and other products
- **Health System** - Monitor animal health and hunger

### Gameplay
- **Daily Chores** - Complete tasks for XP and coin rewards
- **Random Events** - Weather changes, visitors, and special occurrences
- **Seasons & Time** - Day/night cycle with seasonal changes
- **Shop System** - Buy seeds and animals
- **Inventory** - Manage resources and tools

## Database Schema

The game uses a comprehensive Postgres schema with:
- **Player** - Character stats, energy, coins, XP
- **Crops** - Planted crops with growth tracking
- **Livestock** - Animals with health and production states
- **Inventory** - Resource and item storage
- **ChoreLog** - Task tracking and completion
- **GameEvent** - Random event history
- **GameState** - Time, season, and day tracking

## Development Roadmap

### Phase 1: Foundation (Completed)
- [x] Initialize Next.js 15 project with TypeScript and Tailwind
- [x] Create .env file with Neon database credentials
- [x] Install and configure Prisma with Neon adapter
- [x] Design and create Prisma schema for all game entities
- [x] Run Prisma migration to create database tables
- [x] Initialize git repository and set up GitHub remote

### Phase 2: Core Systems (In Progress)
- [ ] Create core game logic utilities (time, energy, XP systems)
- [ ] Build database service layer with Prisma queries
- [ ] Create Server Actions for game mechanics
- [ ] Create player initialization and game state management

### Phase 3: UI Development
- [ ] Build main game UI components (dashboard, farm view, inventory)
- [ ] Implement crop planting and harvesting system
- [ ] Implement livestock management system
- [ ] Build shop interface for buying seeds and animals

### Phase 4: Game Features
- [ ] Create chore system with daily tasks
- [ ] Implement random event system
- [ ] Add seasonal effects and weather
- [ ] Balance game economy and progression

### Phase 5: Polish & Deployment
- [ ] Test all game mechanics and fix bugs
- [ ] Configure for Vercel deployment
- [ ] Add sound effects (optional)
- [ ] Performance optimization

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/comaeclipse/FarmLife.git
cd FarmLife
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with your Neon Postgres connection:
```env
DATABASE_URL="your_neon_connection_string"
DIRECT_URL="your_neon_direct_connection_string"
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

Visit `http://localhost:3000` to play the game!

## Project Structure

```
FarmLife/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utility functions and game logic
├── prisma/          # Database schema and migrations
├── public/          # Static assets
└── types/           # TypeScript type definitions
```

## Game Design Philosophy

FarmLife focuses on:
- **Simplicity** - Clean, text-focused interface
- **Progression** - Satisfying XP and leveling system
- **Resource Management** - Strategic planning of energy and resources
- **Replayability** - Random events and seasonal variety
- **Extensibility** - Easy to add new crops, animals, and features

## Contributing

This is a personal project, but suggestions and feedback are welcome! Open an issue or submit a pull request.

## License

MIT

---

Built with care by comaeclipse
