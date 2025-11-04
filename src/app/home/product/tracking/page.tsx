import React, { Suspense } from 'react' // 1. Suspense import করুন
import HeroNav from '@/app/components/Hero/HeroNav'
import SteadfastTracking from '@/app/home/product/shoppinginfo/components/SteadfastTracking'
import FancyLoadingPage from '@/app/general/loading' // অথবা যেকোনো loading component

export default function TrackingPage() {
  return (
    <>
      <HeroNav />
      {/* 2. SteadfastTracking-কে Suspense দিয়ে wrap করুন */}
      <Suspense fallback={<FancyLoadingPage />}> 
        <SteadfastTracking />
      </Suspense>
    </>
  )
}