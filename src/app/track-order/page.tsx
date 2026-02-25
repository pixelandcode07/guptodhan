import React, { Suspense } from 'react'
import TrackOrderClient from './components/TrackOrderClient'
import TrackingSkeleton from '@/app/products/tracking/components/TrackingSkeleton'

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Suspense fallback={<TrackingSkeleton />}>
          <TrackOrderClient />
        </Suspense>
      </div>
    </div>
  )
}

