// import { ProductCardType } from '@/types/ProductCardType';
// import { fetchFlashSaleData } from '@/lib/MainHomePage/fetchFlashSaleData';
import BestSell from './components/BestSell/BestSell';
import Feature from './components/Feature/Feature';
import FlashSale from './components/FlashSale/FlashSale';
import Hero from './components/Hero/Hero';
import JustForYou from './components/JustForYou/JustForYou';
import { fetchBestSellingData, fetchFlashSaleData, fetchJustForYouData } from '@/lib/MainHomePage';
// import axios from 'axios';

export default async function MainHomePage() {
  // const flashSaleData: ProductCardType[] = await fetchFlashSaleData();
  // const BestSellData: ProductCardType[] = await fetchBestSellingData();

  const [flashSaleData , bestSellingData, justForYouData] = await Promise.all([
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
