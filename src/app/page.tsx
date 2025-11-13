import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';
import Hero from './components/Hero/Hero';
import Feature from './components/Feature/Feature';
import FlashSell from './components/FlashSell/FlashSell';
import { BestSell } from './components/BestSell/BestSell';
import { JustForYou } from './components/JustForYou/JustForYou';
import { fetchLandingPageProducts } from '@/lib/MainHomePage/fetchLandingPageProducts';
import { fetchEcommerceBanners } from '@/lib/MainHomePage';
import { fetchFeaturedCategories } from '@/lib/MainHomePage/fetchFeaturedCategoryData';
import { Suspense } from 'react';
import SectionSkeleton from '@/components/ReusableComponents/SectionSkeleton';


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
    landingPageData,
    ecommerceBanners,
    featuredData
  ] = await Promise.all([
    fetchLandingPageProducts(),
    fetchEcommerceBanners(),
    fetchFeaturedCategories()
  ]);

  // Destructure landing page data
  const { runningOffers, bestSelling, randomProducts } = landingPageData;
  const { middleHomepage, topShoppage } = ecommerceBanners;


  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Categories */}
      <Feature featuredData={featuredData} />

      {/* Flash Sale Section */}
      {/* <FlashSell
        products={runningOffers}
        middleHomepage={middleHomepage}
      /> */}

      {/* Best Selling Section */}
      {/* <BestSell
        products={bestSelling}
        topShoppage={topShoppage}
      /> */}

      {/* Just For You Section */}
      {/* <JustForYou initialProducts={randomProducts} /> */}
      {/* FlashSell - Loading + Skeleton */}
      <Suspense fallback={<SectionSkeleton title="Flash Sale" count={6} />}>
        <FlashSell products={runningOffers} middleHomepage={middleHomepage} />
      </Suspense>

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

