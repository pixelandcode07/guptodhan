'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { imageFade } from './constants';
import { Product } from './types';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductImageGallery({ product, selectedColor = '', selectedSize = '' }: any) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    let newImages: string[] = [];
    const defaultImages = [product.thumbnailImage, ...(product.photoGallery || [])].filter(Boolean);

    if (selectedColor && product.productOptions) {
      const matchedVariant = product.productOptions.find((option: any) => {
        const optionColor = Array.isArray(option.color) ? option.color[0] : option.color;
        const optionSize = Array.isArray(option.size) ? option.size[0] : option.size;
        return optionColor === selectedColor && (selectedSize ? optionSize === selectedSize : true);
      });
      if (matchedVariant?.productImage) {
        newImages = [matchedVariant.productImage, ...defaultImages];
      } else {
        newImages = defaultImages;
      }
    } else {
      newImages = defaultImages;
    }
    setCurrentImages(Array.from(new Set(newImages)));
    setSelectedImageIndex(0);
  }, [selectedColor, selectedSize, product]);

  const mainImage = currentImages[selectedImageIndex] || product.thumbnailImage;

  return (
    <div className="sticky top-20 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white border-r">
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 group">
        <div className="relative aspect-square">
          <AnimatePresence mode="wait">
            <motion.div key={mainImage} variants={imageFade} initial="initial" animate="animate" exit="exit" className="relative w-full h-full">
              <Image 
                src={mainImage} alt={product.productTitle} fill 
                className={`object-contain transition-transform duration-700 ${isZoomed ? 'scale-150' : 'group-hover:scale-105'}`} 
                priority 
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {currentImages.map((img, idx) => (
          <div 
            key={idx} onClick={() => setSelectedImageIndex(idx)}
            className={`relative w-16 h-16 rounded-lg cursor-pointer border-2 ${selectedImageIndex === idx ? 'border-blue-500' : 'border-gray-200'}`}
          >
            <Image src={img} alt="thumb" fill className="object-cover rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}