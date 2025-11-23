// Prisma client singleton for Next.js
import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configure for Vercel Edge/Serverless
if (process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview') {
  // Use fetch for Vercel serverless
  neonConfig.fetchConnectionCache = true
} else {
  // Use WebSocket for local development
  neonConfig.webSocketConstructor = ws
}

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
