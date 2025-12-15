// 'use client';

// import { Zap, Clock } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import { Product } from '@/types/ProductType';
// import { useEffect, useState } from 'react';

// interface ProductCardProps {
//     product: Product;
//     index: number;
// }


// export default function ProductCard({ product, index }: ProductCardProps) {
//     const discountPct = product.productPrice > product.discountPrice
//         ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)
//         : 0;

//     return (
//         <motion.div
//             layout
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             transition={{ delay: index * 0.06, type: 'spring', stiffness: 180 }}
//             whileHover={{ y: -6, transition: { duration: 0.2 } }}
//             className="group"
//         >
//             <Link
//                 href={`/products/${product._id}`}
//                 className="block bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100"
//             >
//                 {/* Image */}
//                 <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
//                     <Image
//                         src={product.thumbnailImage || '/placeholder.png'}
//                         alt={product.productTitle}
//                         fill
//                         className="object-cover group-hover:scale-110 transition-transform duration-500"
//                     />

//                     {/* Badges */}
//                     <div className="absolute top-3 left-3 flex flex-col gap-2">
//                         {/* Flash Badge */}
//                         {product.offerDeadline && (
//                             <motion.div
//                                 animate={{ scale: [1, 1.15, 1] }}
//                                 transition={{ repeat: Infinity, duration: 1.5 }}
//                                 className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
//                             >
//                                 <Zap className="w-3.5 h-3.5" />
//                                 FLASH
//                             </motion.div>
//                         )}

//                         {/* Discount Badge */}
//                         {discountPct > 0 && (
//                             <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
//                                 -{discountPct}%
//                             </div>
//                         )}
//                     </div>

//                     {/* Stock Warning */}
//                     {product.stock > 0 && product.stock < 10 && (
//                         <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md animate-pulse">
//                             Only {product.stock} left
//                         </div>
//                     )}
//                 </div>

//                 {/* Content */}
//                 <div className="p-4 flex flex-col flex-grow space-y-3">
//                     <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
//                         {product.productTitle}
//                     </h3>

//                     {/* Brand & Flag */}
//                     <div className="flex gap-1.5 flex-wrap">
//                         {product?.brand && (
//                             <Badge variant="secondary" className="text-xs py-0">
//                                 {typeof product.brand === 'object' && product.brand !== null
//                                     ? product.brand.name
//                                     : product.brand}
//                             </Badge>
//                         )}
//                         {product.flag?.name && (
//                             <Badge
//                                 className={cn(
//                                     'text-xs text-white py-0',
//                                     product.flag.color || 'bg-indigo-600'
//                                 )}
//                             >
//                                 {product.flag.name}
//                             </Badge>
//                         )}
//                     </div>

//                     {/* Countdown */}
//                     {product.offerDeadline && (
//                         <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
//                             <Clock className="w-3.5 h-3.5" />
//                             <Countdown deadline={product.offerDeadline} />
//                         </div>
//                     )}

//                     {/* Price */}
//                     <div className="mt-auto space-y-1">
//                         <p className="text-lg font-bold text-[#0097E9]">
//                             ৳{product.discountPrice.toLocaleString()}
//                         </p>
//                         {product.productPrice > product.discountPrice && (
//                             <p className="text-xs text-gray-500 line-through">
//                                 ৳{product.productPrice.toLocaleString()}
//                             </p>
//                         )}
//                     </div>
//                 </div>
//             </Link>
//         </motion.div>
//     );
// }

// // Countdown Component
// function Countdown({ deadline }: { deadline: string }) {
//     'use client';
//     const [timeLeft, setTimeLeft] = useState('');

//     useEffect(() => {
//         const interval = setInterval(() => {
//             const diff = new Date(deadline).getTime() - Date.now();
//             if (diff <= 0) {
//                 setTimeLeft('Ended');
//                 clearInterval(interval);
//                 return;
//             }

//             const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//             const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//             const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

//             setTimeLeft(`${hours}h ${minutes}m left`);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [deadline]);

//     return <span>{timeLeft}</span>;
// }


'use client';

import { Zap, Clock, Star } from 'lucide-react';
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
    const discountPct = product.productPrice > product.discountPrice
        ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)
        : 0;

    const hasOffer = product.offerDeadline && new Date(product.offerDeadline) > new Date();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.06, type: 'spring', stiffness: 180 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group"
        >
            <Link
                href={`/products/${product._id}`}
                className="block bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100"
            >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <Image
                        src={product.thumbnailImage || '/placeholder.png'}
                        alt={product.productTitle}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {/* Flash Badge */}
                        {hasOffer && (
                            <motion.div
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                            >
                                <Zap className="w-3.5 h-3.5" />
                                FLASH
                            </motion.div>
                        )}

                        {/* Discount Badge */}
                        {discountPct > 0 && (
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                -{discountPct}%
                            </div>
                        )}
                    </div>

                    {/* Low Stock Warning */}
                    {product.stock > 0 && product.stock < 10 && (
                        <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md animate-pulse">
                            Only {product.stock} left
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow space-y-3">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.productTitle}
                    </h3>

                    {/* Brand & Flag */}
                    <div className="flex gap-1.5 flex-wrap">
                        {product?.brand && (
                            <Badge variant="secondary" className="text-xs py-0">
                                {typeof product.brand === 'object' && product.brand !== null
                                    ? product.brand.name
                                    : product.brand}
                            </Badge>
                        )}
                        {product.flag?.name && (
                            <Badge
                                className={cn(
                                    'text-xs text-white py-0',
                                    product.flag?.color || 'bg-indigo-600'
                                )}
                            >
                                {product.flag.name}
                            </Badge>
                        )}
                    </div>

                    {/* Rating & Reviews */}
                    {product.totalReviews > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{product.averageRating.toFixed(1)}</span>
                            </div>
                            <span className="text-gray-500">
                                ({product.totalReviews} {product.totalReviews === 1 ? 'review' : 'reviews'})
                            </span>
                        </div>
                    )}

                    {/* Sold Count */}
                    {product.sellCount > 0 && (
                        <div className="text-xs text-gray-600">
                            <span className="font-medium">{product.sellCount.toLocaleString()}</span> sold
                        </div>
                    )}

                    {/* Countdown */}
                    {hasOffer && (
                        <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <Countdown deadline={product.offerDeadline} />
                        </div>
                    )}

                    {/* Price */}
                    <div className="mt-auto space-y-1">
                        <p className="text-lg font-bold text-[#0097E9]">
                            ৳{product.discountPrice.toLocaleString()}
                        </p>
                        {product.productPrice > product.discountPrice && (
                            <p className="text-xs text-gray-500 line-through">
                                ৳{product.productPrice.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Countdown Component
function Countdown({ deadline }: { deadline: string }) {
    'use client';
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const diff = new Date(deadline).getTime() - Date.now();
            if (diff <= 0) {
                setTimeLeft('Offer Ended');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h left`);
            } else {
                setTimeLeft(`${hours}h ${minutes}m left`);
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [deadline]);

    return <span>{timeLeft}</span>;
}