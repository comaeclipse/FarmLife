// Prisma client singleton for Next.js
import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configure for Vercel Edge/Serverless
// fetchConnectionCache is deprecated (now always true), so we don't need to set it manually.
// We explicitly set the WebSocket constructor to 'ws' to ensure compatibility in Node.js environments,
// preventing potential TypeErrors with the native WebSocket implementation in some runtimes.
neonConfig.webSocketConstructor = ws


const createPrismaClient = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaNeon(pool as any)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
