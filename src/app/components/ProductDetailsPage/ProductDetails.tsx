'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

// Product data (Static Object)
const productData = {
  title: 'Epilady Legend 4th Generation Epilator',
  price: 1850,
  oldPrice: 5500,
  discount: '-9%',
  rating: 5,
  reviews: 58,
  questions: 2,
  store: 'Store Name',
  colors: [
    { name: 'Beige', image: '/img/product/p-1.png' },
    { name: 'Red', image: '/img/product/p-1.png' },
    { name: 'Navy Blue', image: '/img/product/p-1.png' },
    { name: 'Black', image: '/img/product/p-1.png' },
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  images: [
    '/img/product/p-1.png',
    '/img/product/p-2.png',
    '/img/product/p-3.png',
    '/img/product/p-4.png',
    '/img/product/p-5.png',
  ],
};

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(productData.images[0]);
  const [selectedColor, setSelectedColor] = useState(
    productData.colors[2].name
  );
  const [selectedSize, setSelectedSize] = useState('XS');

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6 border rounded-lg bg-white shadow">
      {/* Left: Images */}
      <div>
        <div className="border rounded-md flex items-center justify-center">
          <Image
            src={selectedImage}
            alt={productData.title}
            width={400}
            height={400}
            className="w-[400px] h-[400px] object-contain"
          />
        </div>

        <div className="flex gap-3 mt-4">
          {productData.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`border rounded-md p-1 ${
                selectedImage === img ? 'border-blue-500' : 'border-gray-200'
              }`}>
              <Image src={img} alt={`thumb-${idx}`} width={60} height={60} />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Details */}
      <div>
        <h2 className="text-xl font-semibold">{productData.title}</h2>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          {Array.from({ length: productData.rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
          ))}
          <span className="text-sm text-gray-600">
            Rating {productData.reviews}
          </span>
          <span className="text-sm text-blue-600 underline cursor-pointer">
            {productData.questions} Answered Questions
          </span>
        </div>

        {/* Store */}
        <p className="text-sm mt-4">
          <div className="flex gap-2">
            <div className="">
              <Image
                src={productData.images[0]}
                alt={productData.store}
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col gap-1 justify-center">
              <span className="font-medium">{productData.store}</span>
              <span className="text-blue-600 underline ml-1 cursor-pointer">
                Explore All Products
              </span>
            </div>
          </div>
        </p>

        {/* Price */}
        <div className="mt-3">
          <p className="text-2xl font-bold text-blue-600">
            ৳ {productData.price.toLocaleString()}
          </p>
          <p className="text-sm line-through text-gray-400">
            ৳ {productData.oldPrice.toLocaleString()} {productData.discount}
          </p>
        </div>

        {/* Color */}
        <div className="mt-4">
          <p className="text-sm font-medium">
            Available Color:{' '}
            <span className="text-gray-600">{selectedColor}</span>
          </p>
          <div className="flex gap-3 mt-2">
            {productData.colors.map(color => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`border rounded-md p-1 ${
                  selectedColor === color.name
                    ? 'border-blue-500'
                    : 'border-gray-200'
                }`}>
                <Image
                  src={color.image}
                  alt={color.name}
                  width={40}
                  height={40}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mt-4">
          <p className="text-sm font-medium">Select Size: {selectedSize}</p>
          <div className="flex gap-2 mt-2">
            {productData.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 border rounded-md ${
                  selectedSize === size
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700'
                }`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
            Buy Now
          </Button>
          <Button variant="outline" className="flex-1">
            Add To Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
