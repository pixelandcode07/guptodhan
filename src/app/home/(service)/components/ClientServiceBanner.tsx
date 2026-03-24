'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { IServiceBanner } from '@/types/ServiceBannerType';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ClientServiceBannerProps {
  initialBanners: IServiceBanner[];
}

export default function ClientServiceBanner({ initialBanners }: ClientServiceBannerProps) {
  const banners = initialBanners;

  if (banners.length === 0) {
    return (
      <section className="w-full py-32 bg-gradient-to-r from-blue-50 to-purple-50 text-center">
        <p className="text-xl text-gray-600">No banners available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        loop={true}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        navigation={banners.length > 1}
        pagination={{ clickable: true }}
        speed={1000}
        className="w-full"
      >
        {banners.map((banner) => {
          const slideContent = (
            <div className="relative w-full aspect-[16/5] sm:aspect-[16/5] md:aspect-[16/4] lg:aspect-[16/4]">
              <Image
                src={banner.bannerImage}
                alt={banner.bannerTitle}
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          );

          return (
            <SwiperSlide key={banner._id}>
              {banner.bannerLink ? (
                <Link href={banner.bannerLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                  {slideContent}
                </Link>
              ) : (
                slideContent
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}