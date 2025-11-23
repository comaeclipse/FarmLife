// Prisma client singleton for Next.js
import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configure Neon based on environment
if (typeof WebSocket === 'undefined') {
  // Node.js environment (local dev) - use ws package
  neonConfig.webSocketConstructor = ws
} else {
  // Vercel serverless - use native WebSocket but configure it properly
  // Disable WebSocket pooling to avoid connection issues
  neonConfig.poolQueryViaFetch = true
  neonConfig.useSecureWebSocket = true
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
