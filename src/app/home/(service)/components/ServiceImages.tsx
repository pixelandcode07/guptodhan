"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface ServiceImagesProps {
    images: string[];
    title: string;
}

export default function ServiceImages({ images, title }: ServiceImagesProps) {
    if (!images.length) {
        return (
            <div className="aspect-video w-full rounded-xl bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No images available</p>
            </div>
        );
    }

    return (
        <Carousel className="w-full">
            <CarouselContent>
                {images.map((src, idx) => (
                    <CarouselItem key={idx}>
                        <div className="relative aspect-video overflow-hidden rounded-xl bg-black/5">
                            <Image
                                src={src}
                                alt={`${title} - image ${idx + 1}`}
                                fill
                                className="object-cover"
                                priority={idx === 0}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            {images.length > 1 && (
                <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                </>
            )}
        </Carousel>
    );
}