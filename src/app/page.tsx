import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';
import BestSell from './components/BestSell/BestSell';
import Feature from './components/Feature/Feature';
import FlashSale from './components/FlashSale/FlashSale';
import Hero from './components/Hero/Hero';
import JustForYou from './components/JustForYou/JustForYou';
import { fetchBestSellingData, fetchFlashSaleData, fetchJustForYouData } from '@/lib/MainHomePage';

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
  const [flashSaleData, bestSellingData, justForYouData] = await Promise.all([
    fetchFlashSaleData(),
    fetchBestSellingData(),
    fetchJustForYouData(),
  ]);


  return (
    <div className="bg-gray-100">
      <Hero />
      <Feature />
      <FlashSale flashSaleData={flashSaleData} />
      <BestSell bestSellingData={bestSellingData} />
      <JustForYou justForYouData={justForYouData} />
    </div>
  );
}
