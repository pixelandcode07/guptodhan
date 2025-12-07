'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Package, Shield, Zap, Star } from 'lucide-react';

interface ProductCardMotionProps {
    product: {
        _id: string;
        productTitle: string;
        thumbnailImage: string;
        productPrice: number;
        discountPrice?: number | null;
        shortDescription: string;
        stock: number;
        flag?: { name: string } | null;
        warranty?: { warrantyName: string } | null;
        rewardPoints?: number;
        sellCount?: number;
    };
    index?: number;
}

export default function ProductCardMotion({ product, index = 0 }: ProductCardMotionProps) {
    const discountPercent =
        product.discountPrice && product.discountPrice < product.productPrice
            ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)
            : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="h-full"
        >
            <Card className="group relative overflow-hidden border rounded-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                {/* Flag Badge */}
                {product.flag && (
                    <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                        {product.flag.name}
                    </Badge>
                )}

                {/* Discount Badge */}
                {discountPercent > 0 && (
                    <Badge className="absolute top-3 right-3 z-10 bg-red-600 text-white border-0 animate-pulse">
                        -{discountPercent}% OFF
                    </Badge>
                )}

                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                        src={product.thumbnailImage}
                        alt={product.productTitle}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
                        {product.productTitle}
                    </h3>

                    {/* Short Specs */}
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {product.shortDescription}
                    </p>

                    {/* Price Section */}
                    <div className="mt-4 flex items-end gap-2">
                        {product.discountPrice ? (
                            <>
                                <span className="text-3xl font-bold text-primary">
                                    ৳{product.discountPrice.toLocaleString()}
                                </span>
                                <span className="text-lg text-muted-foreground line-through">
                                    ৳{product.productPrice.toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-primary">
                                ৳{product.productPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Features Row */}
                    <div className="mt-4 flex flex-wrap gap-3 text-xs">
                        {product.warranty && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-1 text-green-600">
                                            <Shield className="w-4 h-4" />
                                            <span>{product.warranty.warrantyName}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Warranty</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        {product.rewardPoints && product.rewardPoints > 0 && (
                            <div className="flex items-center gap-1 text-amber-600">
                                <Star className="star w-4 h-4 fill-current" />
                                <span>+{product.rewardPoints} Points</span>
                            </div>
                        )}

                        {product.stock > 0 ? (
                            <div className="flex items-center gap-1 text-blue-600">
                                <Package className="w-4 h-4" />
                                <span>In Stock</span>
                            </div>
                        ) : (
                            <span className="text-red-500 text-xs font-medium">Out of Stock</span>
                        )}
                    </div>

                    {/* Action Button */}
                    <Button
                        asChild
                        className="mt-5 w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    >
                        <Link href={`/products/${product._id}`}>
                            View Details
                            <Zap className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}