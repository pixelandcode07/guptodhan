// import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';
// // import BestSell from './components/BestSell/BestSell';
// import Feature from './components/Feature/Feature';
// // import FlashSale from './components/FlashSell/FlashSale';
// import Hero from './components/Hero/Hero';
// // import JustForYou from './components/JustForYou/JustForYou';
// import { fetchBestSellingData, fetchEcommerceBanners, fetchFlashSaleData, fetchJustForYouData } from '@/lib/MainHomePage';
// import { fetchFeaturedCategories } from '@/lib/MainHomePage/fetchFeaturedCategoryData';
// import { fetchLandingPageProducts } from '@/lib/MainHomePage/fetchLandingPageProducts';
// import FlashSell from './components/FlashSell/FlashSell';
// import { BestSell } from './components/BestSell/BestSell';
// import { JustForYou } from './components/JustForYou/JustForYou';

// export async function generateMetadata() {
//   return generateGuptodhanMetadata({
//     title: "Guptodhan Marketplace | Explore Verified Listings",
//     description:
//       "Discover trusted listings and connect with local sellers and buyers easily — only on Guptodhan Marketplace.",
//     urlPath: "/",
//     imageUrl: "/og-images/guptodhan-marketplace-banner.jpg",
//   })
// }

// export default async function MainHomePage() {
//   // const [flashSaleData, bestSellingData, justForYouData, ecommerceBanners, featuredData] = await Promise.all([
//   //   fetchFlashSaleData(),
//   //   fetchBestSellingData(),
//   //   fetchJustForYouData(),
//   //   fetchEcommerceBanners(),
//   //   fetchFeaturedCategories()
//   // ]);
//   const [runningOffers, bestSelling, randomProducts, ecommerceBanners, featuredData] = await Promise.all([
//     fetchLandingPageProducts(),
//     fetchEcommerceBanners(),
//     fetchFeaturedCategories()
//   ]);
//   const { middleHomepage, topShoppage } = ecommerceBanners;


//   return (
//     <div className="bg-gray-100">
//       <Hero />
//       <Feature featuredData={featuredData} />
//       {/* <FlashSale
//         flashSaleData={flashSaleData}
//         middleHomepage={middleHomepage}
//       // topShoppage={topShoppage}
//       />
//       <BestSell bestSellingData={bestSellingData} topShoppage={topShoppage} />
//       <JustForYou justForYouData={justForYouData} /> */}
//       <FlashSell products={runningOffers} />
//       <BestSell products={bestSelling} />
//       <JustForYou products={randomProducts} />
//     </div>
//   );
// }


// app/page.tsx
import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';
import Hero from './components/Hero/Hero';
import Feature from './components/Feature/Feature';
import FlashSell from './components/FlashSell/FlashSell';
import { BestSell } from './components/BestSell/BestSell';
import { JustForYou } from './components/JustForYou/JustForYou';
import { fetchLandingPageProducts } from '@/lib/MainHomePage/fetchLandingPageProducts';
import { fetchEcommerceBanners } from '@/lib/MainHomePage';
import { fetchFeaturedCategories } from '@/lib/MainHomePage/fetchFeaturedCategoryData';

// ক্যাশিং বন্ধ করার জন্য অবশ্যই এই লাইনটা রাখো
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
  // Parallel fetching
  const [
    landingPageData,
    ecommerceBanners,
    featuredData
  ] = await Promise.all([
    fetchLandingPageProducts(),        // { runningOffers, bestSelling, randomProducts }
    fetchEcommerceBanners(),           // { middleHomepage, topShoppage }
    fetchFeaturedCategories()          // featured categories
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
      <JustForYou products={randomProducts} />
    </div>
  );
}

