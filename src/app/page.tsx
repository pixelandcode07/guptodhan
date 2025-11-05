import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';
import BestSell from './components/BestSell/BestSell';
import Feature from './components/Feature/Feature';
import FlashSale from './components/FlashSale/FlashSale';
import Hero from './components/Hero/Hero';
import JustForYou from './components/JustForYou/JustForYou';
import { fetchBestSellingData, fetchEcommerceBanners, fetchFlashSaleData, fetchJustForYouData } from '@/lib/MainHomePage';

export async function generateMetadata() {
  return generateGuptodhanMetadata({
    title: "Guptodhan Marketplace | Explore Verified Listings",
    description:
      "Discover trusted listings and connect with local sellers and buyers easily — only on Guptodhan Marketplace.",
    urlPath: "/",
    imageUrl: "/og-images/guptodhan-marketplace-banner.jpg",
  })
}

export default async function MainHomePage() {
  const [flashSaleData, bestSellingData, justForYouData, ecommerceBanners] = await Promise.all([
    fetchFlashSaleData(),
    fetchBestSellingData(),
    fetchJustForYouData(),
    fetchEcommerceBanners()
  ]);


  const { middleHomepage, topShoppage } = ecommerceBanners;


  return (
    <div className="bg-gray-100">
      <Hero />
      <Feature />
      <FlashSale
        flashSaleData={flashSaleData}
        middleHomepage={middleHomepage}
        // topShoppage={topShoppage}
      />
      <BestSell bestSellingData={bestSellingData} topShoppage={topShoppage} />
      <JustForYou justForYouData={justForYouData} />
    </div>
  );
}
