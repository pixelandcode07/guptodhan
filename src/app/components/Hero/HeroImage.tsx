import Image from 'next/image';
import Link from 'next/link';
import { EcommerceBannerType } from '@/types/ecommerce-banner-type';
import { EcommerceSliderBannerType } from '@/types/ecommerce-banner-type';
import HeroSlider from './HeroSlider';

interface HeroImageProps {
  leftBanners: EcommerceSliderBannerType[];   // will be the sliders
  rightBanners: EcommerceBannerType[];
  bottomBanners: EcommerceBannerType[];
}

export default async function HeroImage({
  leftBanners,
  rightBanners,
  bottomBanners,
}: HeroImageProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* LEFT SIDE – Slider */}
      <div className="md:col-span-2">
        {leftBanners.length > 0 ? (
          <HeroSlider sliders={leftBanners} />
        ) : (
          <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            Slider Not Found
          </div>
        )}
      </div>

      {/* RIGHT SIDE – static banners (unchanged) */}
      <div className="hidden md:flex flex-col gap-4">
        {rightBanners[0] ? (
          <Link
            href={rightBanners[0].bannerLink || '#'}
            // className="block w-full h-[190px] md:h-[250px] lg:h-[200px] 2xl:h-80 relative rounded-lg overflow-hidden group"
            className="block w-full h-[220px] relative rounded-lg overflow-hidden group"
          >
            <Image
              src={rightBanners[0].bannerImage}
              alt={rightBanners[0].bannerTitle}
              fill
              className="object-fill transition-transform group-hover:scale-105"
            />
          </Link>
        ) : (
          <div className="h-[190px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            Right Banner Not Found
          </div>
        )}

        {bottomBanners[0] ? (
          <Link
            href={bottomBanners[0].bannerLink || '#'}
            // className="block w-full h-[190px] md:h-[250px] lg:h-[200px] 2xl:h-80 relative rounded-lg overflow-hidden group"
            className="block w-full h-[220px] relative rounded-lg overflow-hidden group"
          >
            <Image
              src={bottomBanners[0].bannerImage}
              alt={bottomBanners[0].bannerTitle}
              fill
              className="object-fill transition-transform group-hover:scale-105"
            />
          </Link>
        ) : (
          <div className="h-[190px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            Bottom Banner Not Found
          </div>
        )}
      </div>
    </div>
  );
}