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
      <div className="max-w-[90vw] mx-auto mt-5 px-4 hidden lg:flex justify-center items-center gap-6 py-0 rounded-md">
        {categories.length === 0 ? (
          <p className="py-8 text-gray-600">No service categories available</p>
        ) : (
          <>
            {categories.slice(0, 2).map((item) => (

              <Link
                href={`/services/${item.slug}`}
                className="group relative flex items-center gap-4 rounded-lg  border border-sky-900 bg-sky-300 px-2 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {/* Icon Circle */}
                <div className="flex h-8 w-8 items-center rounded-full justify-center bg-white transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={item.icon_url}
                    alt={item.name}
                    width={28}
                    height={28}
                    className="object-contain rounded-full"
                  />
                </div>

                {/* Text */}
                <span className="text-sm font-semibold uppercase tracking-wide text-black md:text-base">
                  {item.name}
                </span>
              </Link>
            ))}

            {/* Third item - visible on xl+ */}
            {categories[2] && (
              <Link
                href={`/services/${categories[2].slug}`}
                className="group relative flex items-center rounded-lg gap-4 border border-sky-900 bg-sky-300 px-2 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {/* Icon Circle */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={categories[2].icon_url}
                    alt={categories[2].name}
                    width={28}
                    height={28}
                    className="object-contain w-full rounded-full"
                  />
                </div>

                {/* Text */}
                <span className="text-sm font-semibold uppercase tracking-wide text-black md:text-base">
                  {categories[2].name}
                </span>
              </Link>
            )}

            {/* See All Services Button */}
            <Link
              href={"/home/service"}
              className="group relative flex items-center rounded-lg gap-4 border border-sky-900 bg-sky-300 px-2 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {/* Icon Circle */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
                <SquareDashedMousePointer
                  size={28}
                  className="text-gray-600 transition-all duration-300 group-hover:text-purple-600 group-hover:scale-110"
                />
              </div>

              {/* Text */}
              <span className="text-sm font-semibold uppercase tracking-wide text-black md:text-base">
                 See All Services
              </span>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Version - unchanged */}
      <div className="lg:hidden flex justify-center items-center gap-3 py-3 px-4 bg-white rounded-md overflow-x-auto">
        <Link href={'/buy-sell'}>
          <Button variant={'HomeBuy'} size={'lg'} className="rounded-lg md:min-w-[120px]">
            <House size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Buy & Sale</span>
          </Button>
        </Link>
        <Link href={'/donation'}>
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