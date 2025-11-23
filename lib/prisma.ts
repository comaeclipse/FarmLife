// Prisma client singleton for Next.js
import { PrismaClient } from '@prisma/client'
import { neonConfig, Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configure Neon for serverless
if (typeof WebSocket !== 'undefined') {
  neonConfig.webSocketConstructor = WebSocket
}

const connectionString = process.env.DATABASE_URL

const createPrismaClient = () => {
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool as any)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
