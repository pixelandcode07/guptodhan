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

  // Common styles for desktop cards to ensure 100% same size
  const desktopCardClass = "group relative flex h-[54px] w-full items-center justify-start rounded-lg gap-2 xl:gap-3 border border-sky-900 bg-sky-300 px-2 xl:px-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg";
  const iconWrapperClass = "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110 overflow-hidden";
  const textClass = "text-[11px] xl:text-[13px] font-bold uppercase tracking-wide text-black truncate";

  return (
    <>
      {/* Desktop Version - Grid Layout for EXACT same sizing */}
      <div className="w-full md:max-w-[95vw] xl:container sm:px-8 mx-auto mt-5 hidden lg:grid lg:grid-cols-6 gap-3 xl:gap-4 py-2">
        
        {/* 1. Get Training Button */}
        <TrainingModalButton />

        {categories.length === 0 ? (
          <div className="col-span-3 py-3 text-gray-600">No service categories available</div>
        ) : (
          <>
            {/* 2 & 3. Service Categories */}
            {categories.slice(0, 2).map((item) => (
              <Link key={item._id} href={`/services/${item.slug}`} className={desktopCardClass}>
                <div className={iconWrapperClass}>
                  <Image src={item.icon_url} alt={item.name} width={28} height={28} className="object-contain rounded-full" />
                </div>
                <span className={textClass} title={item.name}>
                  {item.name}
                </span>
              </Link>
            ))}

            {/* 4. Third Service Category */}
            {categories[2] ? (
              <Link href={`/services/${categories[2].slug}`} className={desktopCardClass}>
                <div className={iconWrapperClass}>
                  <Image src={categories[2].icon_url} alt={categories[2].name} width={28} height={28} className="object-contain rounded-full" />
                </div>
                <span className={textClass} title={categories[2].name}>
                  {categories[2].name}
                </span>
              </Link>
            ) : (
                <div className="hidden lg:block"></div> /* Empty space fallback if < 3 categories */
            )}

            {/* 5. See All Services Button */}
            <Link href={"/home/service"} className={desktopCardClass}>
              <div className={iconWrapperClass}>
                <SquareDashedMousePointer size={18} className="text-gray-600 transition-all duration-300 group-hover:text-purple-600" />
              </div>
              <span className={textClass}>
                 See All Services
              </span>
            </Link>

            {/* 6. Jobs Button */}
            <Link href={"/jobs"} className={desktopCardClass}>
              <div className={iconWrapperClass}>
                <Briefcase size={18} className="text-gray-600 transition-all duration-300 group-hover:text-green-600" />
              </div>
              <span className={textClass}>
                 Jobs
              </span>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden flex justify-start sm:justify-center items-center gap-3 py-3 px-4 bg-white rounded-md overflow-x-auto snap-x no-scrollbar">
        <TrainingModalButton isMobile={true} />
        
        <Link href={'/buy-sell'} className="snap-center shrink-0">
          <Button variant={'HomeBuy'} size={'lg'} className="rounded-lg md:min-w-[120px]">
            <House size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Buy & Sale</span>
          </Button>
        </Link>
        <Link href={'/donation'} className="snap-center shrink-0">
          <Button variant={'HomeDoante'} size={'lg'} className="rounded-lg md:min-w-[120px]">
            <HandCoins size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Donation</span>
          </Button>
        </Link>
        <Link href={'/home/service'} className="snap-center shrink-0">
          <Button variant={'HomeServices'} size={'lg'} className="rounded-lg md:min-w-[120px]">
            <HeartHandshake size={28} className="hidden md:block" />
            <span className="text-sm font-medium">Services</span>
          </Button>
        </Link>
        
        <Link href={'/jobs'} className="snap-center shrink-0">
          <Button variant={'outline'} size={'lg'} className="rounded-lg md:min-w-[120px] bg-sky-50 border-sky-900 hover:bg-sky-100">
            <Briefcase size={28} className="hidden md:block" />
            <span className="text-sm font-medium text-black">Jobs</span>
          </Button>
        </Link>
      </div>
    </>
  );
}