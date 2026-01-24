'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { IServiceBanner } from '@/types/ServiceBannerType';

// Swiper styles
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
    <section className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        loop={true}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        navigation={banners.length > 1}
        pagination={{ clickable: true }}
        speed={1000}
        className="h-full"
      >
        {banners.map((banner) => {
          // Wrapper for clickable image on mobile
          const slideContent = (
            <div className="relative w-full h-full">
              {/* Banner Image */}
              <Image
                src={banner.bannerImage}
                alt={banner.bannerTitle}
                fill
                priority
                className="object-fill brightness-90"
              />

              {/* Gradient Overlay */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="hidden md:flex absolute inset-0 items-center justify-start max-w-7xl mx-auto px-6 md:px-12">
                <div className="max-w-2xl text-white">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-2xl">
                    {banner.bannerTitle}
                  </h1>
                  {banner.bannerDescription && (
                    <p className="text-lg md:text-xl mb-8 opacity-90 max-w-xl leading-relaxed drop-shadow-lg">
                      {banner.bannerDescription}
                    </p>
                  )}
                  
                </div>
              </div> */}
            </div>
          );

          // If there's a link → make whole slide clickable on mobile
          return (
            <SwiperSlide key={banner._id}>
              {banner.bannerLink ? (
                <Link href={banner.bannerLink} target="_blank" rel="noopener noreferrer" className="block h-full">
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