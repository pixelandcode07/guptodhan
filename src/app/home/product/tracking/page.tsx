import React, { Suspense } from 'react' 
import SteadfastTracking from '@/app/home/product/shoppinginfo/components/SteadfastTracking'
import FancyLoadingPage from '@/app/general/loading'
import { HeroNav } from '@/app/components/Hero/HeroNav'

export default function TrackingPage() {
  return (
    <>
      <HeroNav />
      {/* 2. SteadfastTracking Suspense wrap */}
      <Suspense fallback={<FancyLoadingPage />}> 
        <SteadfastTracking />
      </Suspense>
    </>
  )
}