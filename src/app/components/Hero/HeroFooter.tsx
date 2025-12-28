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
      {/* Desktop Version - Responsive */}
      <div className="max-w-[90vw] mx-auto mt-5 px-4 hidden lg:flex justify-center items-center gap-4 py-2 rounded-md overflow-x-auto bg-gray-100">
        {categories.length === 0 ? (
          <p className="py-8 text-gray-600">No service categories available</p>
        ) : (
          <>
            {/* Show 2 items on lg (1024px+), 3 items on xl (1440px+) */}
            {categories.slice(0, 2).map((item) => (
              <Link
                key={item._id}
                href={`/services/${item.slug}`}
                className="flex bg-white items-center justify-center gap-3 py-5 px-8 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex-shrink-0"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={item.icon_url}
                    alt={item.name}
                    width={44}
                    height={44}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h6 className="text-[#00005E] font-semibold text-sm tracking-tight whitespace-nowrap">
                    {item.name}
                  </h6>
                </div>
              </Link>
            ))}

            {/* Third item: visible only on ≥1440px */}
            {categories[2] && (
              <Link
                href={`/services/${categories[2].slug}`}
                className="flex bg-white items-center justify-center gap-3 py-5 px-8 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex-shrink-0 hidden xl:flex"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={categories[2].icon_url}
                    alt={categories[2].name}
                    width={44}
                    height={44}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h6 className="text-[#00005E] font-semibold text-sm tracking-tight whitespace-nowrap">
                    {categories[2].name}
                  </h6>
                </div>
              </Link>
            )}

            {/* See All Services Button */}
            <Link
              href="/home/service"
              className="flex bg-white items-center justify-center gap-3 py-5 px-8 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex-shrink-0"
            >
              <div className="flex-shrink-0">
                {/* <Image
                  src={'/img/all-service.png'}
                  alt={'all services'}
                  width={44}
                  height={44}
                  className="object-contain"
                /> */}
                <SquareDashedMousePointer size={44} className="text-gray-600" />
              </div>
              <div>
                <h6 className="text-[#00005E] font-semibold text-sm tracking-tight whitespace-nowrap">
                  See All Services
                </h6>
              </div>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Version - Unchanged */}
      <div className="lg:hidden flex justify-center items-center gap-3 py-3 px-4 bg-white rounded-md overflow-x-auto">
        <Link href={'/home/buyandsell'}>
          <Button variant={'HomeBuy'} size={'lg'} className="rounded-lg min-w-[120px]">
            <House size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Buy & Sale</span>
          </Button>
        </Link>
        <Link href={'/home/donation'}>
          <Button variant={'HomeDoante'} size={'lg'} className="rounded-lg min-w-[120px]">
            <HandCoins size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Donation</span>
          </Button>
        </Link>
        <Button variant={'HomeServices'} size={'lg'} className="rounded-lg min-w-[120px]">
          <HeartHandshake size={28} className="hidden md:block" />
          <span className="text-sm font-medium">Services</span>
        </Button>
      </div>
    </>
  );
}