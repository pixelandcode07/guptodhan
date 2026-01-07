import { Button } from '@/components/ui/button';
import { HandCoins, HeartHandshake, House, SquareDashedMousePointer } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { IServiceCategory } from '@/types/ServiceCategoryType';
import { fetchAllPublicServiceCategories } from '@/lib/ServicePageApis/fetchAllPublicCategories';

export default async function HeroFooter() {
  let categories: IServiceCategory[] = [];

  try {
    categories = await fetchAllPublicServiceCategories();
  } catch (error) {
    console.error('Failed to load service categories in HeroFooter:', error);
  }

  return (
    <>
      {/* Desktop Version */}
      <div className="max-w-[90vw] mx-auto mt-5 px-4 hidden lg:flex justify-center items-center gap-6 py-0 rounded-md overflow-x-auto">
        {categories.length === 0 ? (
          <p className="py-8 text-gray-600">No service categories available</p>
        ) : (
          <>
            {categories.slice(0, 2).map((item) => (
              <Link
                key={item._id}
                href={`/services/${item.slug}`}
                className="group relative flex items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03] w-64 min-w-[16rem] flex-shrink-0"
              >
                {/* Fixed-size image container */}
                <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center bg-gray-50 rounded-l-xl transition-all duration-300 group-hover:bg-blue-50 group-hover:scale-110">
                  <Image
                    src={item.icon_url}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Text area - allows wrapping */}
                <div className="px-5 py-6 flex-1">
                  <h6 className="text-[#00005E] font-semibold text-base leading-snug line-clamp-3">
                    {item.name}
                  </h6>
                </div>

                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            ))}

            {/* Third item - visible on xl+ */}
            {categories[2] && (
              <Link
                href={`/services/${categories[2].slug}`}
                className="group relative flex items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03] w-64 min-w-[16rem] flex-shrink-0 hidden xl:flex"
              >
                <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center bg-gray-50 rounded-l-xl transition-all duration-300 group-hover:bg-blue-50 group-hover:scale-110">
                  <Image
                    src={categories[2].icon_url}
                    alt={categories[2].name}
                    width={60}
                    height={60}
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="px-5 py-6 flex-1">
                  <h6 className="text-[#00005E] font-semibold text-base leading-snug line-clamp-3">
                    {categories[2].name}
                  </h6>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            )}

            {/* See All Services Button */}
            <Link
              href="/home/service"
              className="group relative flex items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03] w-64 min-w-[16rem] flex-shrink-0"
            >
              <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center bg-gray-50 rounded-l-xl transition-all duration-300 group-hover:bg-purple-50 group-hover:scale-110">
                <SquareDashedMousePointer
                  size={60}
                  className="text-gray-600 transition-all duration-300 group-hover:text-purple-600 group-hover:scale-110"
                />
              </div>

              <div className="px-5 py-6 flex-1">
                <h6 className="text-[#00005E] font-semibold text-base leading-snug">
                  See All Services
                </h6>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Link>
          </>
        )}
      </div>

      {/* Mobile Version - unchanged */}
      <div className="lg:hidden flex justify-center items-center gap-3 py-3 px-4 bg-white rounded-md overflow-x-auto">
        <Link href={'/home/buyandsell'}>
          <Button variant={'HomeBuy'} size={'lg'} className="rounded-lg md:min-w-[120px]">
            <House size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Buy & Sale</span>
          </Button>
        </Link>
        <Link href={'/home/donation'}>
          <Button variant={'HomeDoante'} size={'lg'} className="rounded-lg md:min-w-[120px]">
            <HandCoins size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Donation</span>
          </Button>
        </Link>
        <Link href={'/home/service'}>
          <Button variant={'HomeServices'} size={'lg'} className="rounded-lg md:min-w-[120px]">
            <HeartHandshake size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Services</span>
          </Button>
        </Link>
      </div>
    </>
  );
}