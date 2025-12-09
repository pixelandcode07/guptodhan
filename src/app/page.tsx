import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';
import Hero from './components/Hero/Hero';
import Feature from './components/Feature/Feature';
import FlashSell from './components/FlashSell/FlashSell';
import { BestSell } from './components/BestSell/BestSell';
import { JustForYou } from './components/JustForYou/JustForYou';
// import { fetchLandingPageProducts } from '@/lib/MainHomePage/fetchLandingPageProducts';
import { fetchEcommerceBanners } from '@/lib/MainHomePage';
import { fetchFeaturedCategories } from '@/lib/MainHomePage/fetchFeaturedCategoryData';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/ReusableComponents/SectionSkeleton';
import { fetchStory } from '@/lib/MainHomePage/fetchStory';
import StoryFeed from './components/StoryFeed/StoryFeed';
import { fetchFlashSaleData } from '@/lib/MainHomePage/fetchFlashSaleData';
import { fetchBestSellingData } from '@/lib/MainHomePage/fetchBestSellingData';
import { fetchJustForYouData } from '@/lib/MainHomePage/fetchJustForYouData';


export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return generateGuptodhanMetadata({
    title: "Guptodhan Marketplace | Explore Verified Listings",
    description:
      "Discover trusted listings and connect with local sellers and buyers easily — only on Guptodhan Marketplace.",
    urlPath: "/",
    imageUrl: "/og-images/guptodhan-marketplace-banner.jpg",
  });
}

export default async function MainHomePage() {
  const [
    // landingPageData,
    runningOffers,
    bestSelling,
    randomProducts,
    ecommerceBanners,
    featuredData,
    storyData
  ] = await Promise.all([
    fetchFlashSaleData(),
    fetchBestSellingData(),
    fetchJustForYouData(),
    // fetchLandingPageProducts(),
    fetchEcommerceBanners(),
    fetchFeaturedCategories(),
    fetchStory()
  ]);

  // Destructure landing page data
  // const { runningOffers, bestSelling, randomProducts } = landingPageData;
  const { middleHomepage, topShoppage } = ecommerceBanners;


  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Categories */}
      <Feature featuredData={featuredData} />

      {/* Story */}
      <Suspense fallback={<SectionSkeleton title="Best Selling" count={6} />}>
        <StoryFeed stories={storyData} />
      </Suspense>

      {/* Flash Sell Section - Only show if products exist */}
      {runningOffers && runningOffers.length > 0 && (
        <Suspense fallback={<SectionSkeleton title="Flash Sale" count={6} />}>
          <FlashSell products={runningOffers} middleHomepage={middleHomepage} />
        </Suspense>
      )}

      {/* BestSell - Loading + Skeleton */}
      <Suspense fallback={<SectionSkeleton title="Best Selling" count={6} />}>
        <BestSell products={bestSelling} topShoppage={topShoppage} />
      </Suspense>

      {/* JustForYou - Loading + Skeleton */}
      <Suspense fallback={<SectionSkeleton title="Just For You" count={6} />}>
        <JustForYou initialProducts={randomProducts} />
      </Suspense>
    </div>
  );
}

