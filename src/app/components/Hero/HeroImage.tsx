// src/components/HeroImage.tsx
import Image from 'next/image';
import Link from 'next/link';
import { EcommerceBannerType } from '@/types/ecommerce-banner-type';
import { EcommerceSliderBannerType } from '@/types/ecommerce-banner-type';
import HeroSlider from './HeroSlider';

interface HeroImageProps {
  leftBanners: EcommerceSliderBannerType[];
  rightBanners: EcommerceBannerType[];
  bottomBanners: EcommerceBannerType[];
}

export default async function HeroImage({
  leftBanners,
  rightBanners,
  bottomBanners,
}: HeroImageProps) {
  return (
    <div className="w-full">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3">
        {/* LEFT SIDE – Slider (col-span-2 on md+) */}
        <div className="md:col-span-2 w-full">
          {leftBanners.length > 0 ? (
            <HeroSlider sliders={leftBanners} />
          ) : (
            <div className="w-full aspect-[1226/632] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm sm:text-base">
              Slider Not Found
            </div>
          )}
        </div>

        {/* RIGHT SIDE – Static banners (hidden on mobile) */}
        <div className="hidden md:flex flex-col gap-3 sm:gap-4 md:gap-4 lg:gap-6 w-full">
          {/* Top Right Banner - Aspect ratio: 2250/1125 = 2:1 */}
          {rightBanners[0] ? (
            <Link
              href={rightBanners[0].bannerLink || '#'}
              className="block w-full aspect-[2250/1125] relative rounded-lg overflow-hidden group"
            >
              <Image
                src={rightBanners[0].bannerImage}
                alt={rightBanners[0].bannerTitle || 'Banner'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                quality={85}
                priority
              />
            </Link>
          ) : (
            <div className="w-full aspect-[2250/1125] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs sm:text-sm">
              Right Banner Not Found
            </div>
          )}

          {/* Bottom Right Banner - Aspect ratio: 2250/1125 = 2:1 */}
          {bottomBanners[0] ? (
            <Link
              href={bottomBanners[0].bannerLink || '#'}
              className="block w-full aspect-[2250/1125] relative rounded-lg overflow-hidden group"
            >
              <Image
                src={bottomBanners[0].bannerImage}
                alt={bottomBanners[0].bannerTitle || 'Banner'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                quality={85}
              />
            </Link>
          ) : (
            <div className="w-full aspect-[2250/1125] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs sm:text-sm">
              Bottom Banner Not Found
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Banners (visible only on mobile) */}
      <div className="md:hidden grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4 w-full">
        {rightBanners[0] ? (
          <Link
            href={rightBanners[0].bannerLink || '#'}
            className="block w-full aspect-[2250/1125] relative rounded-lg overflow-hidden group"
          >
            <Image
              src={rightBanners[0].bannerImage}
              alt={rightBanners[0].bannerTitle || 'Banner'}
              fill
              sizes="(max-width: 640px) 50vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              quality={80}
            />
          </Link>
        ) : null}

        {bottomBanners[0] ? (
          <Link
            href={bottomBanners[0].bannerLink || '#'}
            className="block w-full aspect-[2250/1125] relative rounded-lg overflow-hidden group"
          >
            <Image
              src={bottomBanners[0].bannerImage}
              alt={bottomBanners[0].bannerTitle || 'Banner'}
              fill
              sizes="(max-width: 640px) 50vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              quality={80}
            />
          </Link>
        ) : null}
      </div>
      {/* </div> */}
    </div>
  );
}