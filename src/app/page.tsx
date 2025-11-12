import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';
import Hero from './components/Hero/Hero';
import Feature from './components/Feature/Feature';
import FlashSell from './components/FlashSell/FlashSell';
import { BestSell } from './components/BestSell/BestSell';
import { JustForYou } from './components/JustForYou/JustForYou';
import { fetchLandingPageProducts } from '@/lib/MainHomePage/fetchLandingPageProducts';
import { fetchEcommerceBanners } from '@/lib/MainHomePage';
import { fetchFeaturedCategories } from '@/lib/MainHomePage/fetchFeaturedCategoryData';


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
      <FlashSell
        products={runningOffers}
        middleHomepage={middleHomepage}
      />

      {/* Best Selling Section */}
      <BestSell
        products={bestSelling}
        topShoppage={topShoppage}
      />

      {/* Just For You Section */}
      {/* <JustForYou products={randomProducts} /> */}
      <JustForYou initialProducts={randomProducts} />
    </div>
  );
}

