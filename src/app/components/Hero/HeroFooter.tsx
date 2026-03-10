import { Button } from '@/components/ui/button';
import { HandCoins, HeartHandshake, House, SquareDashedMousePointer, Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { IServiceCategory } from '@/types/ServiceCategoryType';
import { fetchAllPublicServiceCategories } from '@/lib/ServicePageApis/fetchAllPublicCategories';
import { TrainingModalButton } from './TrainingModalButton';

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
      {/* নেভবারের সাথে অ্যালাইনমেন্ট ঠিক রাখার জন্য w-full, max-w-[95vw] এবং xl:container ব্যবহার করা হয়েছে */}
      <div className="w-full md:max-w-[95vw] xl:container sm:px-8 mx-auto mt-5 hidden lg:flex flex-wrap justify-center items-center gap-4 py-2 rounded-md">
        
        {/* ১. Get Training Button (সবার বামে) */}
        <TrainingModalButton />

        {categories.length === 0 ? (
          <p className="py-8 text-gray-600">No service categories available</p>
        ) : (
          <>
            {/* সার্ভিস ক্যাটাগরিগুলো */}
            {categories.slice(0, 2).map((item) => (
              <Link
                key={item._id}
                href={`/services/${item.slug}`}
                className="group relative flex items-center gap-4 rounded-lg  border border-sky-900 bg-sky-300 px-2 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex h-8 w-8 items-center rounded-full justify-center bg-white transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={item.icon_url}
                    alt={item.name}
                    width={28}
                    height={28}
                    className="object-contain rounded-full"
                  />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wide text-black md:text-base">
                  {item.name}
                </span>
              </Link>
            ))}

            {categories[2] && (
              <Link
                href={`/services/${categories[2].slug}`}
                className="group relative flex items-center rounded-lg gap-4 border border-sky-900 bg-sky-300 px-2 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={categories[2].icon_url}
                    alt={categories[2].name}
                    width={28}
                    height={28}
                    className="object-contain w-full rounded-full"
                  />
                </div>
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
                <SquareDashedMousePointer
                  size={18}
                  className="text-gray-600 transition-all duration-300 group-hover:text-purple-600"
                />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wide text-black md:text-base">
                 See All Services
              </span>
            </Link>

            {/* ২. Jobs Button (সবার ডানে) */}
            <Link
              href={"/jobs"}
              className="group relative flex items-center rounded-lg gap-4 border border-sky-900 bg-sky-300 px-2 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
                <Briefcase
                  size={18}
                  className="text-gray-600 transition-all duration-300 group-hover:text-green-600"
                />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wide text-black md:text-base">
                 Jobs
              </span>
            </Link>

          </>
        )}
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden flex justify-start sm:justify-center items-center gap-3 py-3 px-4 bg-white rounded-md overflow-x-auto snap-x">
        <TrainingModalButton isMobile={true} />
        
        <Link href={'/buy-sell'} className="snap-center">
          <Button variant={'HomeBuy'} size={'lg'} className="rounded-lg md:min-w-[120px]">
            <House size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Buy & Sale</span>
          </Button>
        </Link>
        <Link href={'/donation'} className="snap-center">
          <Button variant={'HomeDoante'} size={'lg'} className="rounded-lg md:min-w-[120px]">
            <HandCoins size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Donation</span>
          </Button>
        </Link>
        <Link href={'/home/service'} className="snap-center">
          <Button variant={'HomeServices'} size={'lg'} className="rounded-lg md:min-w-[120px]">
            <HeartHandshake size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Services</span>
          </Button>
        </Link>
        
        <Link href={'/jobs'} className="snap-center">
          <Button variant={'outline'} size={'lg'} className="rounded-lg md:min-w-[120px] bg-sky-50 border-sky-900 hover:bg-sky-100">
            <Briefcase size={28} className="hidden md:block" />
            <span className="text-sm font-medium text-black">Jobs</span>
          </Button>
        </Link>
      </div>
    </>
  );
}