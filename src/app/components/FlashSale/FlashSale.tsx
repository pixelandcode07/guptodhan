'use client';

import PageHeader from '@/components/ReusableComponents/PageHeader';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCardType } from '@/types/ProductCardType';
import { EcommerceBannerType } from '@/types/ecommerce-banner-type';


interface FlashSaleProps {
  flashSaleData: ProductCardType[];
}

interface HeroImageProps {
  middleHomepage: EcommerceBannerType[];
}

export default function FlashSale({ flashSaleData, middleHomepage }: FlashSaleProps & HeroImageProps) {

  const [itemsToShow, setItemsToShow] = useState(6);

  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 640) setItemsToShow(2);
      else if (window.innerWidth < 1024) setItemsToShow(4);
      else setItemsToShow(6);
    };

    updateItems();
    window.addEventListener('resize', updateItems);
    return () => window.removeEventListener('resize', updateItems);
  }, []);

  return (
    <div className="bg-gray-100 max-w-[95vw] xl:max-w-[90vw] mx-auto px-4">
      <div className="">
        <PageHeader
          title="Flash Sale"
          buttonLabel="Shop All Products"
          // onButtonClick={() => router.push('/view/all/products')}
          buttonHref="/home/view/all/flash-sell/products"
        />

        <div className="grid justify-around items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-4">
          {flashSaleData.slice(0, itemsToShow).map((item) => (
            <Link href={`/products/${item._id}`} key={item._id}>
              <div className="bg-white rounded-md border-2 border-gray-200 hover:border-blue-300 overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer">
                <div className="w-full h-36 flex items-center justify-center overflow-hidden">
                  <Image
                    src={item.thumbnailImage}
                    alt={item.productTitle}
                    width={150}
                    height={150}
                    className="p-1 rounded-md w-full h-[20vh] border-b-2 border-gray-200"
                  />
                </div>

                <div className="p-2">
                  <h3 className="text-sm font-medium truncate">{item.productTitle}</h3>
                  <p className="text-[#0084CB] font-semibold text-base">₹{item.discountPrice}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500 line-through">₹{item.productPrice}</p>
                    <p className="text-xs text-red-500">
                      -{Math.round(((item.productPrice - item.discountPrice) / item.productPrice) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="banner pt-5 lg:py-10 px-4">
          {middleHomepage ? (
            <Link
              href={middleHomepage[0].bannerLink || '#'}
              className=""
            >
              <Image
                src={middleHomepage[0].bannerImage}
                alt={middleHomepage[0].bannerTitle}
                width={1000}
                height={300}
                className="w-full"
              />
            </Link>
          ) : (
            <div className="banner pt-5 lg:py-10 px-4">
              Left Banner Not Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
