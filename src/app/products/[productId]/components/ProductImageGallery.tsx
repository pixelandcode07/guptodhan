'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { imageFade } from './constants';
import { Product } from './types';
import { ZoomIn } from 'lucide-react';

interface ProductImageGalleryProps {
  product: any;
  selectedColor?: string;
  selectedSize?: string;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: string) => void;
}

export default function ProductImageGallery({ product, selectedColor = '', selectedSize = '', onColorChange, onSizeChange }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [imageVariantMap, setImageVariantMap] = useState<Map<string, { color: string; size: string }>>(new Map());
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    let newImages: string[] = [];
    const variantMap = new Map<string, { color: string; size: string }>();
    const defaultImages = [product.thumbnailImage, ...(product.photoGallery || [])].filter(Boolean);

    if (product.productOptions && product.productOptions.length > 0) {
      product.productOptions.forEach((option: any) => {
        if (option.productImage) {
          const optionColor = Array.isArray(option.color) ? option.color[0] : option.color;
          const optionSize = Array.isArray(option.size) ? option.size[0] : option.size;
          variantMap.set(option.productImage, {
            color: optionColor || '',
            size: optionSize || ''
          });
        }
      });
    }

    setImageVariantMap(variantMap);

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

  const handleImageClick = (img: string, index: number) => {
    setSelectedImageIndex(index);
    
    const variant = imageVariantMap.get(img);
    if (variant && (variant.color || variant.size)) {
      if (variant.color && onColorChange) {
        onColorChange(variant.color);
      }
      if (variant.size && onSizeChange) {
        onSizeChange(variant.size);
      }
    }
  };

  const mainImage = currentImages[selectedImageIndex] || product.thumbnailImage;

  return (
    <div className="sticky top-20 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white border-r">
      <div className="relative rounded-2xl overflow-hidden  border border-gray-100 group">
        <div className="relative aspect-square">
          <AnimatePresence mode="wait">
            <motion.div key={mainImage} variants={imageFade} initial="initial" animate="animate" exit="exit" className="relative w-full h-full flex items-center justify-center">
              {mainImage ? (
                <Image 
                  src={mainImage} alt={product.productTitle} fill 
                  className={`object-contain transition-transform duration-700 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105 cursor-zoom-in'}`} 
                  priority 
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              ) : (
                <div className="text-gray-400">No image available</div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
        {currentImages.map((img, idx) => (
          <div 
            key={idx} onClick={() => handleImageClick(img, idx)}
            className={`relative w-16 h-16 rounded-lg cursor-pointer flex-shrink-0 border-2 transition-all ${selectedImageIndex === idx ? 'border-blue-500 shadow-md' : 'border-gray-200'}`}
          >
            <Image src={img} alt="thumb" fill className="object-cover rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}