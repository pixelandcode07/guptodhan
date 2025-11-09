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

interface FlashSaleProps {
  flashSaleData: ProductCardType[];
}
interface HeroImageProps {
  middleHomepage: EcommerceBannerType[];
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
export default function FlashSale({
  flashSaleData,
  middleHomepage,
}: FlashSaleProps & HeroImageProps) {
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
    () => flashSaleData.slice(0, itemsToShow),
    [flashSaleData, itemsToShow]
  );

  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4">
        {/* Header */}
        <PageHeader
          title="Flash Sale"
          buttonLabel="Shop All Products"
          buttonHref="/home/view/all/flash-sell/products"
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

                      {/* FLASH badge (pulsing) */}
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        FLASH
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

                      {/* Countdown */}
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
          {middleHomepage?.[0] ? (
            <Link href={middleHomepage[0].bannerLink || '#'}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Image
                  src={middleHomepage[0].bannerImage}
                  alt={middleHomepage[0].bannerTitle || 'Flash Sale Banner'}
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