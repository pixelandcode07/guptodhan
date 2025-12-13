"use client"

import * as React from "react"
import { type CarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { FeatureProps } from "@/types/FeaturedCategoryType"


export function ShopByCategory({ featuredData }: FeatureProps) {
    const [api, setApi] = React.useState<CarouselApi>()


    return (

        <section className="w-full py-10">

                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full "
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {featuredData.length > 0 ? (
                            featuredData.map((category) => (
                                <CarouselItem
                                    key={category._id}
                                    className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-[12.5%]"
                                >
                                    <div className="p-1">
                                        <Link
                                            href={`/home/view/all/${category.slug}/products`}
                                            className="flex flex-col items-center justify-center gap-2 group"
                                        >
                                            <div className="w-24 h-24 p-1 rounded-full transition-transform duration-300 group-hover:scale-110 bg-white shadow-sm border">
                                                <Image
                                                    src={category.categoryIcon}
                                                    alt={category.name}
                                                    width={200}
                                                    height={200}
                                                    className="rounded-full w-[92px] h-[92px] md:w-[95px] md:h-[92px] object-contain"
                                                />
                                            </div>
                                            <p className="text-sm font-medium text-center text-[#000000] transition-colors duration-300 group-hover:text-[#0084CB]">
                                                {category.name}
                                            </p>
                                        </Link>
                                    </div>
                                </CarouselItem>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-6 w-full">
                                No featured categories found
                            </p>
                        )}
                    </CarouselContent>
                </Carousel>

                <div className="flex items-center justify-center gap-4 mt-8">
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
    )
}