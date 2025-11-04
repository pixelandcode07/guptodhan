import React, { Suspense } from 'react' 
import HeroNav from '@/app/components/Hero/HeroNav'
import SteadfastTracking from '@/app/home/product/shoppinginfo/components/SteadfastTracking'
import FancyLoadingPage from '@/app/general/loading'

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