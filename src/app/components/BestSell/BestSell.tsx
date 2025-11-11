// 'use client';

// import PageHeader from '@/components/ReusableComponents/PageHeader';
// import Image from 'next/image';
// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { ProductCardType } from '@/types/ProductCardType';
// import { EcommerceBannerType } from '@/types/ecommerce-banner-type';

// interface BestSellProps {
//   bestSellingData: ProductCardType[];
// }

// interface HeroImageProps {
//   topShoppage: EcommerceBannerType[];
// }

// export default function BestSell({ bestSellingData, topShoppage }: BestSellProps & HeroImageProps) {
//   const [itemsToShow, setItemsToShow] = useState(6);

//   useEffect(() => {
//     const updateItems = () => {
//       if (window.innerWidth < 640) setItemsToShow(2);
//       else if (window.innerWidth < 1024) setItemsToShow(4);
//       else setItemsToShow(6);
//     };

//     updateItems();
//     window.addEventListener('resize', updateItems);
//     return () => window.removeEventListener('resize', updateItems);
//   }, []);

//   return (
//     <div className="bg-gray-100 max-w-[95vw] xl:max-w-[90vw] mx-auto px-4">
//       <div className="">
//         <PageHeader
//           title="Best Selling"
//           buttonLabel="Shop All Products"
//           buttonHref="/home/view/all/best-sell/products"
//         />

//         {/* Product Grid */}
//         <div className="grid justify-center items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-4">
//           {bestSellingData.slice(0, itemsToShow).map((item) => (
//             <Link href={`/products/${item._id}`} key={item._id}>
//               <div className="bg-white rounded-md border-2 border-gray-200 hover:border-blue-300 overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer">
//                 {/* Product Image */}
//                 <div className="w-full h-36 flex items-center justify-center overflow-hidden">
//                   <Image
//                     src={item.thumbnailImage}
//                     alt={item.productTitle}
//                     width={150}
//                     height={150}
//                     className="p-1 rounded-md w-full h-[20vh] border-b-2 border-gray-200"
//                   />
//                 </div>

//                 {/* Product Details */}
//                 <div className="p-2">
//                   <h3 className="text-sm font-medium truncate">{item.productTitle}</h3>
//                   <p className="text-[#0084CB] font-semibold text-base">
//                     ₹{item.discountPrice}
//                   </p>
//                   <div className="flex items-center gap-2">
//                     <p className="text-xs text-gray-500 line-through">
//                       ₹{item.productPrice}
//                     </p>
//                     <p className="text-xs text-red-500">
//                       -
//                       {Math.round(
//                         ((item.productPrice - item.discountPrice) / item.productPrice) *
//                         100
//                       )}
//                       %
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         {/* Banner */}
//         <div className="banner pt-5 lg:py-10 px-4">
//           {topShoppage ? (
//             <Link
//               href={topShoppage[0].bannerLink || '#'}
//               className=""
//             >
//               <Image
//                 src={topShoppage[0].bannerImage}
//                 alt={topShoppage[0].bannerTitle}
//                 width={1000}
//                 height={300}
//                 className="w-full"
//               />
//             </Link>
//           ) : (
//             <div className="banner pt-5 lg:py-10 px-4">
//               Left Banner Not Found
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import PageHeader from '@/components/ReusableComponents/PageHeader';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Clock, Zap } from 'lucide-react';
import { ProductCardType } from '@/types/ProductCardType';
import { EcommerceBannerType } from '@/types/ecommerce-banner-type';
import { formatDistanceToNowStrict } from 'date-fns';

interface BestSellProps {
  bestSellingData: ProductCardType[];
  topShoppage?: EcommerceBannerType[];
}
interface HeroImageProps {
  topShoppage: EcommerceBannerType[];
}

/* -------------------------------------------------------------
   Helper – live countdown
   ------------------------------------------------------------- */
function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const left = formatDistanceToNowStrict(new Date(deadline), {
        addSuffix: false,
      });
      setTimeLeft(left);
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (!deadline) return null;

  return (
    <div className="flex items-center gap-1 text-xs font-medium text-red-600">
      <Clock className="w-3 h-3" />
      {timeLeft}
    </div>
  );
}

/* -------------------------------------------------------------
   Main component
   ------------------------------------------------------------- */
export default function BestSell({
  bestSellingData,
  topShoppage,
}: BestSellProps & HeroImageProps) {
  const [itemsToShow, setItemsToShow] = useState(6);

  /* ---- responsive items ---- */
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setItemsToShow(2);
      else if (window.innerWidth < 1024) setItemsToShow(4);
      else setItemsToShow(6);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const visible = useMemo(
    () => bestSellingData.slice(0, itemsToShow),
    [bestSellingData, itemsToShow]
  );

  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4">
        {/* Header */}
        <PageHeader
          title="Best Selling"
          buttonLabel="Shop All Products"
          buttonHref="/home/view/all/best-sell/products"
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <AnimatePresence mode="popLayout">
            {visible.map((ad, idx) => {
              const discountPct = Math.round(
                ((ad.productPrice - ad.discountPrice) / ad.productPrice) * 100
              );

              return (
                <motion.div
                  key={ad._id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.06, type: 'spring', stiffness: 180 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Link
                    href={`/products/${ad._id}`}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                  >
                    {/* ---- Image + Badges ---- */}
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={ad.thumbnailImage || '/placeholder.png'}
                        alt={ad.productTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* BEST badge (pulsing) */}
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        BEST
                      </motion.div>

                      {/* Discount % */}
                      {discountPct > 0 && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                          -{discountPct}%
                        </div>
                      )}

                      {/* Low-stock warning */}
                      {ad.stock < 10 && ad.stock > 0 && (
                        <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                          Only {ad.stock} left
                        </div>
                      )}
                    </div>

                    {/* ---- Content ---- */}
                    <div className="p-3 flex flex-col flex-grow">
                      {/* Title */}
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition">
                        {ad.productTitle}
                      </h3>

                      {/* Brand + Flag Badges */}
                      <div className="flex gap-1 flex-wrap mb-1">
                        {ad.brand?.name && (
                          <Badge variant="secondary" className="text-xs">
                            {ad.brand.name}
                          </Badge>
                        )}
                        {ad.flag?.name && (
                          <Badge
                            className={`text-xs text-white ${ad.flag.color || 'bg-blue-600'}`}
                          >
                            {ad.flag.name}
                          </Badge>
                        )}
                      </div>

                      {/* Countdown (if offer) */}
                      {ad.offerDeadline && <Countdown deadline={ad.offerDeadline} />}

                      {/* Price */}
                      <div className="mt-auto pt-2">
                        <p className="text-lg font-bold text-[#0097E9]">
                          ৳{ad.discountPrice.toLocaleString()}
                        </p>
                        {ad.productPrice > ad.discountPrice && (
                          <p className="text-xs text-gray-500 line-through">
                            ৳{ad.productPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ---- Banner ---- */}
        <div className="mt-10">
          {topShoppage?.[0] ? (
            <Link href={topShoppage[0].bannerLink || '#'}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Image
                  src={topShoppage[0].bannerImage}
                  alt={topShoppage[0].bannerTitle || 'Best Sell Banner'}
                  width={1400}
                  height={320}
                  className="w-full rounded-xl shadow-md"
                />
              </motion.div>
            </Link>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Banner not available
            </div>
          )}
        </div>
      </div>
    </section>
  );
}