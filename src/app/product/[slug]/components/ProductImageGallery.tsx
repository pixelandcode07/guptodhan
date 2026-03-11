'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { imageFade } from './constants';
import { ZoomIn } from 'lucide-react';

interface ProductImageGalleryProps {
  product: any;
  selectedColor?: string;
  selectedSize?: string;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: string) => void;
}

export default function ProductImageGallery({ 
  product, 
  selectedColor = '', 
  selectedSize = '', 
  onColorChange, 
  onSizeChange 
}: ProductImageGalleryProps) {
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [imageVariantMap, setImageVariantMap] = useState<Map<string, { color: string; size: string }>>(new Map());
  const [isZoomed, setIsZoomed] = useState(false);

  // 1. Variant Logic (অপরিবর্তিত রাখা হয়েছে)
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

  // 2. Click/Hover Handler
  const handleImageSelect = (img: string, index: number) => {
    setSelectedImageIndex(index);
    const variant = imageVariantMap.get(img);
    if (variant && (variant.color || variant.size)) {
      if (variant.color && onColorChange) onColorChange(variant.color);
      if (variant.size && onSizeChange) onSizeChange(variant.size);
    }
  };

  const mainImage = currentImages[selectedImageIndex] || product.thumbnailImage;

  // 3. Merged Layout Render
  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full sticky top-24">
      
      {/* --- Thumbnails Section ---
          Desktop: Vertical Left Sidebar
          Mobile: Horizontal Bottom Scroll
      */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[500px] scrollbar-hide py-1 px-1 shrink-0">
        {currentImages.map((img, idx) => (
          <div 
            key={idx} 
            onMouseEnter={() => handleImageSelect(img, idx)} // Desktop Hover
            onClick={() => handleImageSelect(img, idx)}      // Mobile Click
            className={`
              relative w-16 h-16 md:w-20 md:h-20 shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-200 bg-white
              ${selectedImageIndex === idx 
                ? 'border-[#00005E] shadow-sm ring-1 ring-[#00005E]/20' // Active Style
                : 'border-gray-100 hover:border-gray-300' // Inactive Style
              }
            `}
          >
            <Image 
              src={img} 
              alt={`View ${idx}`} 
              fill 
              className="object-cover" 
            />
          </div>
        ))}
      </div>

      {/* --- Main Image Section --- */}
      <div className="relative flex-1 bg-white border border-gray-100 rounded-xl overflow-hidden aspect-square md:aspect-auto md:h-[500px] group shadow-sm">
        
        {/* Zoom Hint Icon */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white/90 p-2 rounded-full shadow-sm backdrop-blur-sm">
                <ZoomIn className="w-5 h-5 text-gray-600" />
            </div>
        </div>

        <div 
          className="relative w-full h-full cursor-zoom-in" 
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={mainImage} 
              variants={imageFade} 
              initial="initial" 
              animate="animate" 
              exit="exit" 
              className="relative w-full h-full p-2"
            >
              {mainImage ? (
                <Image 
                  src={mainImage} 
                  alt={product.productTitle} 
                  fill 
                  className={`object-contain transition-transform duration-500 ease-in-out ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'}`} 
                  priority 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No image available
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}