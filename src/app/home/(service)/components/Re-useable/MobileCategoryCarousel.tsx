'use client';

import { Button } from "@/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { IServiceCategory } from "@/types/ServiceCategoryType";
import { ArrowLeft, ArrowRight, SquareDashedMousePointer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function MobileCategoryCarousel({ categories }: { categories: IServiceCategory[] }) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(1);

    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <div className="w-full">
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-3">
                    {categories.map((item) => (
                        <CarouselItem key={item._id} className="pl-3 basis-1/2 sm:basis-1/3">
                            <Link href={`/services/${item.slug}`} className="block">
                                <div className="flex flex-col items-center gap-3 rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                    <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-gray-50 border group-hover:bg-[#f0f9ff] transition-colors">
                                        <Image
                                            src={item.icon_url}
                                            alt={item.name}
                                            width={56}
                                            height={56}
                                            className="object-contain"
                                        />
                                    </div>
                                    <p className="text-sm font-medium text-center text-gray-800 line-clamp-2">
                                        {item.name}
                                    </p>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}

                    {/* See All in Carousel */}
                    <CarouselItem className="pl-3 basis-1/2 sm:basis-1/3">
                        <Link href="/home/service" className="block">
                            <div className="flex flex-col items-center gap-3 rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-gray-50 border hover:bg-purple-50 transition-colors">
                                    <SquareDashedMousePointer size={56} className="text-gray-600" />
                                </div>
                                <p className="text-sm font-medium text-center text-gray-800">
                                    See All Services
                                </p>
                            </div>
                        </Link>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>

            {/* Navigation Buttons (Mobile) */}
            <div className="flex items-center justify-center gap-4 mt-6">
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
        </div>
    );
}