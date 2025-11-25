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
    <div className="p-4 border-b md:border-b-0 md:border-r border-gray-100">
      <div className="relative h-[400px] w-full bg-white rounded-md flex items-center justify-center overflow-hidden mb-4 group">
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
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
        {(product.photoGallery || [product.thumbnailImage]).map((img, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedImage(img)}
            className={`relative w-16 h-16 border-2 rounded-md cursor-pointer overflow-hidden shrink-0 ${selectedImage === img ? 'border-[#0099cc]' : 'border-gray-200'}`}
          >
            <Image src={img} alt="thumb" fill className="object-cover" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

