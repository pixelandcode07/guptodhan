// src/components/HeroSlider.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EcommerceSliderBannerType } from '@/types/ecommerce-banner-type';

interface HeroSliderProps {
  sliders: EcommerceSliderBannerType[];
}

export default function HeroSlider({ sliders }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  // Auto-play (5 seconds)
  useEffect(() => {
    if (sliders.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliders.length]);

  // Arrow handlers
  const goPrev = useCallback(() => {
    if (sliders.length <= 1) return;
    setDirection(-1);
    setIndex((i) => (i - 1 + sliders.length) % sliders.length);
  }, [sliders.length]);

  const goNext = useCallback(() => {
    if (sliders.length <= 1) return;
    setDirection(1);
    setIndex((i) => (i + 1) % sliders.length);
  }, [sliders.length]);

  const current = sliders[index];

  if (!current) return null;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg group bg-gray-100">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) goNext();
            else if (swipe > swipeConfidenceThreshold) goPrev();
          }}
          className="absolute inset-0"
        >
          <Link
            href={current.buttonLink || '#'}
            className="block w-full h-full relative"
          >
            <Image
              src={current.image}
              alt={current.bannerTitleWithColor || 'Slider Banner'}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-fit md:object-cover"
              priority={index === 0}
              quality={85}
            />
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* ---- Arrow Buttons (visible on hover) ---- */}
      <button
        onClick={goPrev}
        className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 md:p-2.5 bg-white/70 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800 cursor-pointer" />
      </button>

      <button
        onClick={goNext}
        className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 md:p-2.5 bg-white/70 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800 cursor-pointer" />
      </button>

      {/* ---- Dots indicator ---- */}
      {sliders.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 md:gap-2 z-20">
          {sliders.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}