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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* LEFT SIDE – Slider */}
        <div className="md:col-span-2 w-full h-[250px] sm:h-[350px] md:h-[400px]">
          {leftBanners.length > 0 ? (
            <HeroSlider sliders={leftBanners} />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              Slider Not Found
            </div>
          )}
        </div>

        {/* RIGHT SIDE – Static banners (Calculated to match slider height) */}
        {/* (Banner 1: 193.5px) + (Gap: 13px) + (Banner 2: 193.5px) = 400px */}
        <div className="hidden md:flex flex-col gap-3 w-full h-[400px]">
          {/* Top Right Banner */}
          {rightBanners[0] ? (
            <Link
              href={rightBanners[0].bannerLink || '#'}
              className="block w-full h-full relative rounded-lg overflow-hidden group"
            >
              <Image
                src={rightBanners[0].bannerImage}
                alt={rightBanners[0].bannerTitle || 'Banner'}
                fill
                sizes="33vw"
                className="object-fill transition-transform duration-300 group-hover:scale-105"
                quality={85}
                priority
              />
            </Link>
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
              Right Banner Not Found
            </div>
          )}

          {/* Bottom Right Banner */}
          {bottomBanners[0] ? (
            <Link
              href={bottomBanners[0].bannerLink || '#'}
              className="block w-full h-full relative rounded-lg overflow-hidden group"
            >
              <Image
                src={bottomBanners[0].bannerImage}
                alt={bottomBanners[0].bannerTitle || 'Banner'}
                fill
                sizes="33vw"
                className="object-fill transition-transform duration-300 group-hover:scale-105"
                quality={85}
              />
            </Link>
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
              Bottom Banner Not Found
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Banners (visible only on mobile) */}
      <div className="md:hidden grid grid-cols-2 gap-3 mt-3 w-full h-[120px] sm:h-[180px]">
        {rightBanners[0] ? (
          <Link
            href={rightBanners[0].bannerLink || '#'}
            className="block w-full aspect-2250/1125 relative rounded-lg overflow-hidden group"
          >
            <Image
              src={rightBanners[0].bannerImage}
              alt={rightBanners[0].bannerTitle || 'Banner'}
              fill
              sizes="(max-width: 640px) 50vw, 50vw"
              className="object-fill transition-transform duration-300 group-hover:scale-105"
              quality={80}
            />
          </Link>
        ) : null}

        {bottomBanners[0] ? (
          <Link
            href={bottomBanners[0].bannerLink || '#'}
            className="block w-full aspect-2250/1125 relative rounded-lg overflow-hidden group"
          >
            <Image
              src={bottomBanners[0].bannerImage}
              alt={bottomBanners[0].bannerTitle || 'Banner'}
              fill
              sizes="(max-width: 640px) 50vw, 50vw"
              className="object-fill transition-transform duration-300 group-hover:scale-105"
              quality={80}
            />
          </Link>
        ) : null}
      </div>
      {/* </div> */}
    </div>
  );
}