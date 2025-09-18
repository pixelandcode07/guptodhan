'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const products = [
  {
    id: 1,
    title: 'Philips Satinelle Essential HP6420/00 Epilator',
    price: 4500,
    oldPrice: 5000,
    discount: '-10%',
    image: '/img/product/p-2.png',
  },
  {
    id: 2,
    title: 'Braun Face 810 Facial Epilator',
    price: 6000,
    oldPrice: 7200,
    discount: '-17%',
    image: '/img/product/p-4.png',
  },
  {
    id: 3,
    title: 'Panasonic ES-ED90-P Wet/Dry Epilator',
    price: 6800,
    oldPrice: 7500,
    discount: '-9%',
    image: '/img/product/p-5.png',
  },
  {
    id: 4,
    title: 'T3 Featherweight Luxe 2i Hair Dryer',
    price: 15000,
    oldPrice: 16500,
    discount: '-9%',
    image: '/img/product/p-1.png',
  },
  {
    id: 5,
    title: 'Conair Double Ceramic Curling Iron',
    price: 2750,
    oldPrice: 3200,
    discount: '-14%',
    image: '/img/product/p-2.png',
  },
  {
    id: 6,
    title: 'Revlon One-Step Hair Dryer and Volumizer',
    price: 4800,
    oldPrice: 5600,
    discount: '-13%',
    image: '/img/product/p-3.png',
  },
  {
    id: 7,
    title: 'Conair Double Ceramic Curling Iron',
    price: 2750,
    oldPrice: 3200,
    discount: '-14%',
    image: '/img/product/p-2.png',
  },
  {
    id: 8,
    title: 'Revlon One-Step Hair Dryer and Volumizer',
    price: 4800,
    oldPrice: 5600,
    discount: '-13%',
    image: '/img/product/p-3.png',
  },
];

export default function ProductCarousellllllll() {
  return (
    <div className="w-full py-6">
      <h2 className="text-xl font-semibold text-blue-900 mb-4">
        You may also like
      </h2>

      <div className="relative">
        <Carousel opts={{ align: 'start' }} className="w-full">
          {/* Product List */}
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map(product => (
              <CarouselItem
                key={product.id}
                className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
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
                    <div className="flex items-center gap-2 ">
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
