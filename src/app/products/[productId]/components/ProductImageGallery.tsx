'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { imageFade } from './constants';
import { Product } from './types';

interface ProductImageGalleryProps {
  product: Product;
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(product.thumbnailImage);

  return (
    <div className="p-3 sm:p-4 border-b md:border-b-0 md:border-r border-gray-100">
      <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full bg-white rounded-md flex items-center justify-center overflow-hidden mb-3 sm:mb-4 group">
        <AnimatePresence mode='wait'>
          <motion.div
            key={selectedImage}
            variants={imageFade}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full h-full"
          >
            <Image 
              src={selectedImage} 
              alt={product.productTitle} 
              fill 
              className="object-contain hover:scale-110 transition-transform duration-500 cursor-zoom-in"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 40vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
        {(product.photoGallery || [product.thumbnailImage]).map((img, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedImage(img)}
            className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 rounded-md cursor-pointer overflow-hidden shrink-0 ${selectedImage === img ? 'border-[#0099cc]' : 'border-gray-200'}`}
          >
            <Image src={img} alt="thumb" fill className="object-cover" sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

