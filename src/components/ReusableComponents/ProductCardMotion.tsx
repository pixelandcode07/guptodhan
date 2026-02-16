'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Package, Shield, Zap, Star, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProductCardMotionProps {
    product: {
        _id: string;
        slug: string; // ✅ Added Slug
        productTitle: string;
        thumbnailImage: string;
        productPrice: number;
        discountPrice?: number | null;
        shortDescription?: string; // ✅ Changed to optional to fix TS error
        stock: number;
        flag?: { name: string } | null;
        warranty?: { warrantyName: string } | null;
        rewardPoints?: number;
        sellCount?: number;
        productOptions?: any[]; // ✅ Added to check for variants
    };
    index?: number;
}

export default function ProductCardMotion({ product, index = 0 }: ProductCardMotionProps) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);

    // ✅ FIXED: Using Slug for URL
    const productUrl = `/products/${product.slug || product._id}`;

    const discountPercent =
        product.discountPrice && product.discountPrice < product.productPrice
            ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)
            : 0;

    const hasVariants = product.productOptions && product.productOptions.length > 0;

    // ✅ Add to Cart Logic
    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.stock === 0) {
            toast.error("Out of stock!");
            return;
        }

        if (hasVariants) {
            toast.info("Select options first", {
                description: "This product has sizes/colors. Redirecting...",
            });
            router.push(productUrl);
            return;
        }

        setIsAdding(true);
        try {
            await addToCart(product._id, 1, { skipModal: false });
        } catch (error) {
            console.error(error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <Card className="group relative overflow-hidden rounded-xl border hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white">
                <Link href={productUrl} className="flex-1 flex flex-col">
                    {/* Badges */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        {product.flag && (
                            <Badge className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 border-none shadow-sm">
                                {product.flag.name}
                            </Badge>
                        )}
                        {discountPercent > 0 && (
                            <Badge className="text-[10px] px-2 py-0.5 bg-red-500 border-none shadow-sm">
                                -{discountPercent}%
                            </Badge>
                        )}
                    </div>

                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <Image
                            src={product.thumbnailImage || '/placeholder.jpg'}
                            alt={product.productTitle}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        
                        {/* ✅ Add to Cart Overlay Button */}
                        <div className="absolute bottom-3 right-3 z-20 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <Button
                                onClick={handleAddToCart}
                                disabled={isAdding || product.stock === 0}
                                size="icon"
                                className="h-10 w-10 rounded-full shadow-lg bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-50"
                            >
                                {isAdding ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <ShoppingCart className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 flex flex-col flex-1 space-y-2">
                        <h3 className="text-sm font-semibold line-clamp-2 leading-tight text-gray-800 group-hover:text-blue-600 transition-colors h-10">
                            {product.productTitle}
                        </h3>

                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-blue-600">
                                ৳{(product.discountPrice || product.productPrice).toLocaleString()}
                            </span>
                            {product.discountPrice && (
                                <span className="text-xs text-muted-foreground line-through">
                                    ৳{product.productPrice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Extra Info */}
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1.5 text-[10px]">
                                {product.warranty && (
                                    <div className="flex items-center gap-0.5 text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                        <Shield className="w-3 h-3" />
                                        <span>Warranty</span>
                                    </div>
                                )}
                                {product.stock > 0 ? (
                                    <div className="flex items-center gap-0.5 text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                                        <Package className="w-3 h-3" />
                                        <span>In Stock</span>
                                    </div>
                                ) : (
                                    <span className="text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Out of Stock</span>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            </Card>
        </motion.div>
    );
}