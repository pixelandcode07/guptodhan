'use client';

import {
    Zap,
    Clock,
    Star,
    Tag,
    ShoppingBag,
    PackageCheck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Product } from '@/types/ProductType';
import { useEffect, useState } from 'react';

interface ProductCardProps {
    product: Product;
    index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
    // ✅ FIX 1: Price Logic Correction
    const originalPrice = product?.productPrice || 0;
    const discountPrice = product?.discountPrice || 0;

    // যদি discountPrice থাকে (0 এর বেশি) এবং সেটা originalPrice এর চেয়ে কম হয়, তাহলেই সেটা sellingPrice
    const hasValidDiscount = discountPrice > 0 && discountPrice < originalPrice;
    
    // বিক্রয় মূল্য নির্ধারণ
    const sellingPrice = hasValidDiscount ? discountPrice : originalPrice;

    // ✅ FIX 2: Discount Percentage Calculation Fix
    const discountPct = hasValidDiscount
        ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
        : 0;

    const hasOffer =
        product?.offerDeadline &&
        new Date(product.offerDeadline) > new Date();

    const averageRating = product?.averageRating || 0;
    const totalReviews = product?.totalReviews ?? 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.04, type: 'spring', stiffness: 160 }}
            whileHover={{ y: -4 }}
            className="group"
        >
            <Link
                href={`/products/${product?._id}`}
                className="flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border bg-white transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
            >
                {/* Image */}
                <div className="relative aspect-[1/1] bg-gray-50 overflow-hidden">
                    <Image
                        src={product?.thumbnailImage || '/placeholder.png'}
                        alt={product?.productTitle || 'Product'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="pointer-events-none absolute inset-0 hidden sm:block bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badges - Top */}
                    <div className="absolute left-2 top-2 sm:left-3 sm:top-3 right-2 sm:right-3 flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            {hasOffer && (
                                <motion.div
                                    animate={{ scale: [1, 1.12, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.6 }}
                                    className="flex items-center gap-0.5 rounded-full bg-gradient-to-r from-red-600 to-pink-600 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-sm"
                                >
                                    <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    Flash
                                </motion.div>
                            )}
                        </div>

                        {/* ✅ FIX 3: Only show discount badge if there is a valid discount */}
                        {discountPct > 0 && (
                            <div className="flex items-center gap-0.5 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-sm">
                                <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                -{discountPct}%
                            </div>
                        )}
                    </div>

                    {/* Low Stock */}
                    {product?.stock !== undefined && product.stock > 0 && product.stock < 10 && (
                        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow animate-pulse">
                            {product.stock} left
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-grow flex-col space-y-1.5 sm:space-y-2 p-2.5 sm:p-3">
                    {/* Title */}
                    <h3 className="line-clamp-2 text-[13px] sm:text-sm font-semibold leading-snug transition-colors group-hover:text-blue-600 h-10">
                        {product?.productTitle}
                    </h3>

                    {/* Brand & Flag */}
                    <div className="flex flex-wrap gap-1">
                        {product?.brand && (
                            <Badge variant="secondary" className="text-[10px] sm:text-xs py-0">
                                {typeof product.brand === 'object'
                                    ? (product.brand as any).name
                                    : product.brand}
                            </Badge>
                        )}
                        {product?.flag?.name && (
                            <Badge
                                className={cn(
                                    'text-[10px] sm:text-xs text-white py-0',
                                    (product.flag as any).color || 'bg-indigo-600'
                                )}
                            >
                                {product.flag.name}
                            </Badge>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-sm">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-gray-500">
                            ({totalReviews})
                        </span>
                    </div>

                    {/* Sold */}
                    {product?.sellCount !== undefined && product.sellCount > 0 && (
                        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-600">
                            <ShoppingBag className="h-3.5 w-3.5" />
                            {(product.sellCount || 0).toLocaleString()} sold
                        </div>
                    )}

                    {/* Price Section - ✅ FIX 4: Correct Display Logic */}
                    <div className="mt-auto">
                        <div className="flex items-baseline gap-2 flex-wrap">
                            {/* Always show the calculated selling price */}
                            <p className="text-base sm:text-lg font-bold text-blue-600">
                                ৳{(sellingPrice).toLocaleString()}
                            </p>
                            
                            {/* Only show crossed-out original price if there is a valid discount */}
                            {hasValidDiscount && (
                                <p className="text-[11px] sm:text-xs text-gray-400 line-through">
                                    ৳{(originalPrice).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Bottom: Countdown + Ready to ship */}
                    <div className="flex justify-between items-center pt-0.5">
                        {hasOffer ? (
                            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-red-600">
                                <Clock className="h-3.5 w-3.5" />
                                <Countdown deadline={product.offerDeadline!} />
                            </div>
                        ) : (
                             // Fixed logic for alignment when no offer
                            <div className="flex-1"></div>
                        )}

                        <div className={cn("flex items-center gap-1 text-xs text-gray-500")}>
                            <PackageCheck className="h-3.5 w-3.5" />
                            Ready to ship
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

/* Countdown */
function Countdown({ deadline }: { deadline: string }) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calc = () => {
            const diff = new Date(deadline).getTime() - Date.now();
            if (diff <= 0) return setTimeLeft('Ended');

            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);

            setTimeLeft(d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`);
        };

        calc();
        const t = setInterval(calc, 60000);
        return () => clearInterval(t);
    }, [deadline]);

    return <span>{timeLeft}</span>;
}