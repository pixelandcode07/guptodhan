import React, { Suspense } from 'react' 
import SteadfastTracking from '@/app/home/products/shoppinginfo/components/SteadfastTracking'
import { HeroNav } from '@/app/components/Hero/HeroNav'
import { MainCategory } from '@/types/navigation-menu'
import TrackingSkeleton from './components/TrackingSkeleton'

export default function TrackingPage() {
  const categoryData: MainCategory[]=[]
  return (
    <>
      <HeroNav categories={categoryData} />
      {/* 2. SteadfastTracking Suspense wrap */}
      <Suspense fallback={<TrackingSkeleton />}> 
        <SteadfastTracking />
      </Suspense>
    </>
  )
}