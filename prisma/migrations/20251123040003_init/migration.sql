-- CreateEnum
CREATE TYPE "CropType" AS ENUM ('WHEAT', 'CORN', 'TOMATO', 'CARROT', 'POTATO', 'STRAWBERRY', 'PUMPKIN', 'LETTUCE');

-- CreateEnum
CREATE TYPE "GrowthStage" AS ENUM ('PLANTED', 'SEEDLING', 'GROWING', 'MATURE', 'READY', 'WITHERED');

-- CreateEnum
CREATE TYPE "LivestockType" AS ENUM ('CHICKEN', 'COW', 'SHEEP', 'PIG', 'GOAT');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('WHEAT_SEEDS', 'CORN_SEEDS', 'TOMATO_SEEDS', 'CARROT_SEEDS', 'POTATO_SEEDS', 'STRAWBERRY_SEEDS', 'PUMPKIN_SEEDS', 'LETTUCE_SEEDS', 'WHEAT', 'CORN', 'TOMATO', 'CARROT', 'POTATO', 'STRAWBERRY', 'PUMPKIN', 'LETTUCE', 'EGG', 'MILK', 'WOOL', 'MEAT', 'WATER_CAN', 'HOE', 'FEED', 'FERTILIZER');

-- CreateEnum
CREATE TYPE "ChoreType" AS ENUM ('WATER_CROPS', 'FEED_ANIMALS', 'HARVEST_CROPS', 'COLLECT_PRODUCTS', 'CLEAR_WEEDS', 'REPAIR_FENCE');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('WEATHER', 'VISITOR', 'ANIMAL_EVENT', 'CROP_EVENT', 'MARKET', 'SPECIAL');

-- CreateEnum
CREATE TYPE "Season" AS ENUM ('SPRING', 'SUMMER', 'FALL', 'WINTER');

-- CreateEnum
CREATE TYPE "TimeOfDay" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'NIGHT');

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "energy" INTEGER NOT NULL DEFAULT 100,
    "maxEnergy" INTEGER NOT NULL DEFAULT 100,
    "coins" INTEGER NOT NULL DEFAULT 500,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crops" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "type" "CropType" NOT NULL,
    "stage" "GrowthStage" NOT NULL DEFAULT 'PLANTED',
    "plotX" INTEGER NOT NULL,
    "plotY" INTEGER NOT NULL,
    "plantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wateredToday" BOOLEAN NOT NULL DEFAULT false,
    "health" INTEGER NOT NULL DEFAULT 100,
    "daysGrowing" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "crops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livestock" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "type" "LivestockType" NOT NULL,
    "name" TEXT,
    "health" INTEGER NOT NULL DEFAULT 100,
    "happiness" INTEGER NOT NULL DEFAULT 100,
    "hunger" INTEGER NOT NULL DEFAULT 100,
    "fedToday" BOOLEAN NOT NULL DEFAULT false,
    "petToday" BOOLEAN NOT NULL DEFAULT false,
    "productionReady" BOOLEAN NOT NULL DEFAULT false,
    "producedToday" BOOLEAN NOT NULL DEFAULT false,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "livestock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chore_logs" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "type" "ChoreType" NOT NULL,
    "description" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "coinReward" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chore_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_events" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "effect" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_state" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "day" INTEGER NOT NULL DEFAULT 1,
    "season" "Season" NOT NULL DEFAULT 'SPRING',
    "year" INTEGER NOT NULL DEFAULT 1,
    "timeOfDay" "TimeOfDay" NOT NULL DEFAULT 'MORNING',
    "lastPlayed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_state_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "crops_playerId_plotX_plotY_key" ON "crops"("playerId", "plotX", "plotY");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_playerId_type_key" ON "inventory"("playerId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "game_state_playerId_key" ON "game_state"("playerId");

-- AddForeignKey
ALTER TABLE "crops" ADD CONSTRAINT "crops_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livestock" ADD CONSTRAINT "livestock_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chore_logs" ADD CONSTRAINT "chore_logs_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_events" ADD CONSTRAINT "game_events_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_state" ADD CONSTRAINT "game_state_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
