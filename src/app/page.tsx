import React, { Suspense } from 'react';
import Hero from './components/Hero/Hero';
import Feature from './components/Feature/Feature';
import FlashSell from './components/FlashSell/FlashSell';
import StoryFeedWrapper from './components/StoryFeed/StoryFeedWrapper';
import BestSell from './components/BestSell/BestSell';
import JustForYouWrapper from './components/JustForYou/JustForYouWrapper';
// import { Skeleton } from "@/components/ui/skeleton";

function SkeletonHero() {
  return <div className="h-[320px] bg-gray-200 rounded-lg animate-pulse" />;
}
function SkeletonSectionHeader() {
  return (
    <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 py-8">
      <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function MainHomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero */}
      <Suspense fallback={<SkeletonHero />}>
        <Hero />
      </Suspense>

      {/* Featured */}
      <Suspense fallback={<SkeletonSectionHeader />}>
        <Feature />
      </Suspense>

      {/* Story */}
      <Suspense fallback={<SkeletonSectionHeader />}>
        {/* <StoryFeed /> */}
        <StoryFeedWrapper />
      </Suspense>

      {/* Flash Sell */}
      <Suspense fallback={<SkeletonSectionHeader />}>
        <FlashSell />
      </Suspense>

      {/* Best Selling */}
      <Suspense fallback={<SkeletonSectionHeader />}>
        <BestSell />
      </Suspense>

      {/* Just For You */}
      <Suspense fallback={<SkeletonSectionHeader />}>
        <JustForYouWrapper />
      </Suspense>
    </div>
  );
}
