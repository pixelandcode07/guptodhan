"use client";

// import * as React from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FeatureProps } from "@/types/FeaturedCategoryType";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ShopByCategory({ featuredData }: FeatureProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const total = featuredData?.length ?? 0;

  // If no data, render nothing
  if (!featuredData || featuredData.length === 0) {
    return null;
  }

  // Track active slide
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="w-full py-3">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {featuredData.map((category) => (
            <CarouselItem
              key={category._id}
              className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/5 lg:basis-[12.5%]"
            >
              <Link href={`/feature/${category.slug}`} className="group block">
                <div className="flex flex-col items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center justify-center w-20 h-20 rounded-lg  hover:border group-hover:bg-[#f0f9ff] transition-colors">
                    <Image
                      src={category.categoryIcon}
                      alt={category.name}
                      width={64}
                      height={64}
                      className="object-contain rounded-md"
                    />
                  </div>

                  <p className="text-sm font-medium text-center text-gray-800 group-hover:text-[#0084CB] transition-colors">
                    {category.name}
                  </p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Animated Indicator */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Showing <AnimatedNumber value={current} /> of{" "}
        <span className="font-semibold">{total}</span>
      </p>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => api?.scrollPrev()}
        >
          <ArrowLeft className="text-[#0084CB]" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => api?.scrollNext()}
        >
          <ArrowRight className="text-[#0084CB]" />
        </Button>
      </div>
    </section>
  );
}


function AnimatedNumber({ value }: { value: number }) {
  return (
    <span className="inline-block w-6 text-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="inline-block font-semibold"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
