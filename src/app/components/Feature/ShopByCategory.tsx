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
import { categories } from "@/data/categories_data"


export function ShopByCategory() {
    const [api, setApi] = React.useState<CarouselApi>()

    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])


    return (
        <section className="w-full">
            <div className="container mx-auto px-4 md:px-6">
                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-7xl mx-auto"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {categories.map((category, index) => (
                            <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-[12.5%]">
                                <div className="p-1">
                                    <a href={category.href} className="flex flex-col items-center justify-center gap-2 group">
                                        <div className="w-24 h-24 p-1 rounded-full border-2 border-transparent group-hover:border-primary/80 transition-all duration-300">
                                            <Image
                                                src={category.imageUrl}
                                                alt={`Image for ${category.name}`}
                                                width={200}
                                                height={200}
                                                className="rounded-full w-fit"
                                            />
                                        </div>
                                        <p className="text-sm font-medium text-center text-[#000000] group-hover:text-primary transition-colors">
                                            {category.name}
                                        </p>
                                    </a>
                                </div>
                            </CarouselItem>
                        ))}
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
                    {/* <div className="py-2 text-center text-sm text-muted-foreground">
                        Slide {current} of {count}
                    </div> */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => api?.scrollNext()}
                    >
                        <ArrowRight className="text-[#0084CB]" />
                    </Button>
                </div>

            </div>
        </section>
    )
}