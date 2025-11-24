'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const GameApp = dynamic(() => import('./GameApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-stone-950">
      <div className="text-stone-400 text-xl">Loading Equine Acres...</div>
    </div>
  ),
})

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameApp />
    </Suspense>
  )
}
