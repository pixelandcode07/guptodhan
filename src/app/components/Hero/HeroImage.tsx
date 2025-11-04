import { EcommerceBannerType } from '@/types/ecommerce-banner-type';
import Image from 'next/image';
import Link from 'next/link';

interface HeroImageProps {
  leftBanners: EcommerceBannerType[];
  rightBanners: EcommerceBannerType[];
  bottomBanners: EcommerceBannerType[];
}

// ✅ Server Component (no 'use client')
export default async function HeroImage({
  leftBanners,
  rightBanners,
  bottomBanners,
}: HeroImageProps) {
  return (
    <div className="max-w-[80vw] mx-auto px-4 py-6 space-y-6">
      {/* 🔹 Top Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LEFT SIDE → Shows RIGHT banner on desktop */}
        <div className="md:col-span-2 order-2 md:order-1">
          {leftBanners.length > 0 ? (
            <Link
              key={leftBanners[0]._id}
              href={leftBanners[0].bannerLink || '#'}
              className="block w-full h-[250px] md:h-[350px] lg:h-[400px] relative rounded-lg overflow-hidden group"
            >
              <Image
                src={leftBanners[0].bannerImage}
                alt={leftBanners[0].bannerTitle}
                fill
                style={{ objectFit: 'cover' }}
                priority
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          ) : (
            <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Right Banner Not Found
            </div>
          )}
        </div>

        {/* RIGHT SIDE → Shows LEFT + BOTTOM banners stacked */}
        <div className="md:col-span-1 order-1 md:order-2 hidden md:flex flex-col gap-4">
          {/* Left Banner */}
          {rightBanners.length > 0 ? (
            <Link
              href={rightBanners[0].bannerLink || '#'}
              className="block w-full h-[180px] md:h-[190px] lg:h-[200px] relative rounded-lg overflow-hidden group"
            >
              <Image
                src={rightBanners[0].bannerImage}
                alt={rightBanners[0].bannerTitle}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          ) : (
            <div className="w-full h-[200px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Left Banner Not Found
            </div>
          )}

          {/* Bottom Banner */}
          {bottomBanners.length > 0 ? (
            <Link
              href={bottomBanners[0].bannerLink || '#'}
              className="block w-full h-[180px] md:h-[190px] lg:h-[200px] relative rounded-lg overflow-hidden group"
            >
              <Image
                src={bottomBanners[0].bannerImage}
                alt={bottomBanners[0].bannerTitle}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          ) : (
            <div className="w-full h-[200px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Bottom Banner Not Found
            </div>
          )}
        </div>

        {/* 🟩 Mobile-only LEFT banner */}
        <div className="md:hidden order-1">
          {leftBanners.length > 0 ? (
            <Link
              href={leftBanners[0].bannerLink || '#'}
              className="block w-full h-[200px] relative rounded-lg overflow-hidden group"
            >
              <Image
                src={leftBanners[0].bannerImage}
                alt={leftBanners[0].bannerTitle}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          ) : (
            <div className="w-full h-[200px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Left Banner Not Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
