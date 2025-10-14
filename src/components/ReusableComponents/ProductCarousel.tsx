'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import PageHeader from './PageHeader';

interface Product {
  id: number;
  title: string;
  price: number;
  oldPrice: number;
  discount: string;
  image: string;
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export default function ProductCarousel({
  title,
  products,
}: ProductCarouselProps) {
  return (
    <div className="w-full py-6">
      {/* Heading */}
      <PageHeader title={title} />

      <div className="relative">
        <Carousel opts={{ align: 'start' }} className="w-full">
          {/* Product List */}
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map(product => (
              <CarouselItem
                key={product.id}
                className=" pl-2 md:pl-4
        basis-1/2            
        sm:basis-1/3       
        md:basis-1/4         
        lg:basis-1/5        
        xl:basis-1/6  ">
                <div className="bg-white rounded-lg shadow-sm border p-3 flex flex-col h-full">
                  {/* Image */}
                  <div className="w-full h-36 md:h-40 lg:h-44 relative">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm mt-2 font-medium line-clamp-2 flex-grow">
                    {product.title}
                  </h3>

                  {/* Price Section */}
                  <div className="mt-auto">
                    <p className="text-blue-700 font-semibold">
                      ৳ {product.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 line-through">
                        ৳ {product.oldPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600">
                        {product.discount}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Left/Right Buttons */}
          <CarouselPrevious className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 rounded-full bg-white shadow" />
          <CarouselNext className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 rounded-full bg-white shadow" />
        </Carousel>
      </div>
    </div>
  );
}
