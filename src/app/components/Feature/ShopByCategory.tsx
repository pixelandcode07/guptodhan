"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { FeatureProps } from "@/types/FeaturedCategoryType";

export function ShopByCategory({ featuredData }: FeatureProps) {
  if (!featuredData || featuredData.length === 0) {
    return null;
  }

  return (
    <section className="w-full md:max-w-[95vw] xl:container mx-auto px-4 md:px-12 py-1">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {featuredData.map((category) => (
            <CarouselItem
              key={category._id}
              className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-[12.5%]"
            >
              <Link href={`/feature/${category.slug}`} className="group block">
                <div className="flex flex-col items-center gap-2 md:gap-3 rounded-xl border bg-white p-2 md:p-4 shadow-sm transition-all duration-300 hover:shadow-md md:hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-lg group-hover:bg-[#f0f9ff] transition-colors overflow-hidden">
                    <Image
                      src={category.categoryIcon}
                      alt={category.name}
                      width={64}
                      height={64}
                      className="object-contain p-1 md:p-0"
                    />
                  </div>

                  <p className="text-[10px] md:text-sm font-medium text-center text-gray-800 group-hover:text-[#0084CB] transition-colors line-clamp-1 w-full">
                    {category.name}
                  </p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4 lg:-left-12 border-[#0084CB] text-[#0084CB] hover:bg-[#0084CB] hover:text-white transition-all shadow-md" />
        <CarouselNext className="hidden md:flex -right-4 lg:-right-12 border-[#0084CB] text-[#0084CB] hover:bg-[#0084CB] hover:text-white transition-all shadow-md" />
      </Carousel>
    </section>
  );
}