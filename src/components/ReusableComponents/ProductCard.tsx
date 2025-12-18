
// 'use client';

// import {
//   Zap,
//   Clock,
//   Star,
//   Tag,
//   ShoppingBag,
//   PackageCheck
// } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import { Product } from '@/types/ProductType';
// import { useEffect, useState } from 'react';

// interface ProductCardProps {
//   product: Product;
//   index: number;
// }

// export default function ProductCard({ product, index }: ProductCardProps) {
//   const discountPct =
//     product.productPrice > product.discountPrice
//       ? Math.round(
//           ((product.productPrice - product.discountPrice) /
//             product.productPrice) *
//             100
//         )
//       : 0;

//   const hasOffer =
//     product.offerDeadline &&
//     new Date(product.offerDeadline) > new Date();

//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 24 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.95 }}
//       transition={{ delay: index * 0.05, type: 'spring', stiffness: 160 }}
//       whileHover={{ y: -6 }}
//       className="group"
//     >
//       <Link
//         href={`/products/${product._id}`}
//         className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:border-blue-200 hover:shadow-xl"
//       >
//         {/* Image */}
//         <div className="relative aspect-square bg-gray-50">
//           <Image
//             src={product.thumbnailImage || '/placeholder.png'}
//             alt={product.productTitle}
//             fill
//             className="object-cover transition-transform duration-500 group-hover:scale-110"
//           />

//           {/* Gradient Overlay */}
//           <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

//           {/* Top Badges */}
//           <div className="absolute left-3 top-3 flex flex-col gap-2">
//             {hasOffer && (
//               <motion.div
//                 animate={{ scale: [1, 1.15, 1] }}
//                 transition={{ repeat: Infinity, duration: 1.4 }}
//                 className="flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 to-pink-600 px-3 py-1 text-xs font-bold text-white shadow"
//               >
//                 <Zap className="h-3.5 w-3.5" />
//                 Flash Deal
//               </motion.div>
//             )}

//             {discountPct > 0 && (
//               <div className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow">
//                 <Tag className="h-3.5 w-3.5" />-{discountPct}%
//               </div>
//             )}
//           </div>

//           {/* Stock Warning */}
//           {product.stock > 0 && product.stock < 10 && (
//             <div className="absolute bottom-3 left-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow animate-pulse">
//               Only {product.stock} left
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div className="flex flex-grow flex-col space-y-3 p-4">
//           <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-blue-600">
//             {product.productTitle}
//           </h3>

//           {/* Brand & Flag */}
//           <div className="flex flex-wrap gap-1.5">
//             {product?.brand && (
//               <Badge variant="secondary" className="text-xs">
//                 {typeof product.brand === 'object'
//                   ? product.brand.name
//                   : product.brand}
//               </Badge>
//             )}
//             {product.flag?.name && (
//               <Badge
//                 className={cn(
//                   'text-xs text-white',
//                   product.flag.color || 'bg-indigo-600'
//                 )}
//               >
//                 {product.flag.name}
//               </Badge>
//             )}
//           </div>

//           {/* Rating */}
//           {product.totalReviews > 0 && (
//             <div className="flex items-center gap-2 text-sm">
//               <div className="flex items-center gap-1">
//                 <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                 <span className="font-medium">
//                   {product.averageRating.toFixed(1)}
//                 </span>
//               </div>
//               <span className="text-gray-500">
//                 ({product.totalReviews})
//               </span>
//             </div>
//           )}

//           {/* Sales */}
//           {product.sellCount > 0 && (
//             <div className="flex items-center gap-1 text-xs text-gray-600">
//               <ShoppingBag className="h-3.5 w-3.5" />
//               <span className="font-medium">
//                 {product.sellCount.toLocaleString()}
//               </span>{' '}
//               sold
//             </div>
//           )}

//           {/* Countdown */}
//           {hasOffer && (
//             <div className="flex items-center gap-1 text-xs font-medium text-red-600">
//               <Clock className="h-3.5 w-3.5" />
//               <Countdown deadline={product.offerDeadline} />
//             </div>
//           )}

//           {/* Price */}
//           <div className="mt-auto space-y-0.5">
//             <p className="text-lg font-bold text-blue-600">
//               ৳{product.discountPrice.toLocaleString()}
//             </p>
//             {product.productPrice > product.discountPrice && (
//               <p className="text-xs text-gray-400 line-through">
//                 ৳{product.productPrice.toLocaleString()}
//               </p>
//             )}
//           </div>

//           {/* Footer Hint */}
//           <div className="flex items-center gap-1 pt-1 text-xs text-gray-500">
//             <PackageCheck className="h-3.5 w-3.5" />
//             Ready to ship
//           </div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// }

// /* Countdown Component */
// function Countdown({ deadline }: { deadline: string }) {
//   const [timeLeft, setTimeLeft] = useState('');

//   useEffect(() => {
//     const calculate = () => {
//       const diff = new Date(deadline).getTime() - Date.now();
//       if (diff <= 0) return setTimeLeft('Ended');

//       const d = Math.floor(diff / 86400000);
//       const h = Math.floor((diff % 86400000) / 3600000);
//       const m = Math.floor((diff % 3600000) / 60000);

//       setTimeLeft(d > 0 ? `${d}d ${h}h left` : `${h}h ${m}m left`);
//     };

//     calculate();
//     const t = setInterval(calculate, 60000);
//     return () => clearInterval(t);
//   }, [deadline]);

//   return <span>{timeLeft}</span>;
// }




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
    const discountPct =
        product.productPrice > product.discountPrice
            ? Math.round(
                ((product.productPrice - product.discountPrice) /
                    product.productPrice) *
                100
            )
            : 0;

    const hasOffer =
        product.offerDeadline &&
        new Date(product.offerDeadline) > new Date();

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
                href={`/products/${product._id}`}
                className="flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border bg-white transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
            >
                {/* Image */}
                <div className="relative aspect-[1/1] bg-gray-50">
                    <Image
                        src={product.thumbnailImage || '/placeholder.png'}
                        alt={product.productTitle}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Hover Overlay (desktop only) */}
                    <div className="pointer-events-none absolute inset-0 hidden sm:block bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

                    {/* Badges */}
                    <div className="absolute left-2 top-2 sm:left-3 sm:top-3 flex flex-col gap-1 sm:gap-2">
                        {hasOffer && (
                            <motion.div
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ repeat: Infinity, duration: 1.4 }}
                                className="flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 to-pink-600 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow"
                            >
                                <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                Flash
                            </motion.div>
                        )}

                        {discountPct > 0 && (
                            <div className="flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow">
                                <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />-{discountPct}%
                            </div>
                        )}
                    </div>

                    {/* Low Stock */}
                    {product.stock > 0 && product.stock < 10 && (
                        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow animate-pulse">
                            {product.stock} left
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-grow flex-col space-y-2 sm:space-y-3 p-3 sm:p-4">
                    <h3 className="line-clamp-2 text-[13px] sm:text-sm font-semibold leading-snug transition-colors group-hover:text-blue-600">
                        {product.productTitle}
                    </h3>

                    {/* Brand & Flag */}
                    <div className="flex flex-wrap gap-1">
                        {product?.brand && (
                            <Badge variant="secondary" className="text-[10px] sm:text-xs py-0">
                                {typeof product.brand === 'object'
                                    ? product.brand.name
                                    : product.brand}
                            </Badge>
                        )}
                        {product.flag?.name && (
                            <Badge
                                className={cn(
                                    'text-[10px] sm:text-xs text-white py-0',
                                    product.flag.color || 'bg-indigo-600'
                                )}
                            >
                                {product.flag.name}
                            </Badge>
                        )}
                    </div>

                    {/* Rating */}
                    {product.totalReviews > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-sm">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">
                                {product.averageRating.toFixed(1)}
                            </span>
                            <span className="text-gray-500">
                                ({product.totalReviews})
                            </span>
                        </div>
                    )}

                    {/* Sold */}
                    {product.sellCount > 0 && (
                        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-600">
                            <ShoppingBag className="h-3.5 w-3.5" />
                            {product.sellCount.toLocaleString()} sold
                        </div>
                    )}

                    {/* Countdown */}
                    {hasOffer && (
                        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-red-600">
                            <Clock className="h-3.5 w-3.5" />
                            <Countdown deadline={product.offerDeadline} />
                        </div>
                    )}

                    {/* Price */}
                    <div className="mt-auto space-y-0.5">
                        <p className="text-base sm:text-lg font-bold text-blue-600">
                            ৳{product.discountPrice.toLocaleString()}
                        </p>
                        {product.productPrice > product.discountPrice && (
                            <p className="text-[11px] sm:text-xs text-gray-400 line-through">
                                ৳{product.productPrice.toLocaleString()}
                            </p>
                        )}
                    </div>

                    {/* Footer (desktop only) */}
                    <div className="hidden sm:flex items-center gap-1 pt-1 text-xs text-gray-500">
                        <PackageCheck className="h-3.5 w-3.5" />
                        Ready to ship
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
