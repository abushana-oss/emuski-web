'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const BalloonDiagramInterface = dynamic(() => import('@/components/BalloonDiagramInterface'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading 2D Balloon Diagram Tool...</p>
      </div>
    </div>
  )
})

export default function DynamicBalloonAnalysis() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    }>
      <BalloonDiagramInterface />
    </Suspense>
  )
}