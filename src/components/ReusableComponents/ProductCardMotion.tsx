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
        <Link href={`/products/${product._id}`}>
            <motion.div

                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                whileHover={{ y: -3 }}
                className="h-full"
            >
                <Card className="group relative overflow-hidden rounded border hover:shadow transition-shadow h-full flex flex-col">
                    {/* Tiny Badges */}
                    {product.flag && (
                        <Badge className="absolute top-1 left-1 z-10 text-[10px] px-1 py-0 bg-gradient-to-r from-purple-600 to-pink-600">
                            {product.flag.name}
                        </Badge>
                    )}

                    {discountPercent > 0 && (
                        <Badge className="absolute top-1 right-1 z-10 text-[10px] px-1 py-0 bg-red-600">
                            -{discountPercent}%
                        </Badge>
                    )}

                    {/* Image */}
                    <div className="relative aspect-[1/1] overflow-hidden bg-gray-50">
                        <Image
                            src={product.thumbnailImage}
                            alt={product.productTitle}
                            fill
                            className="object-cover transition-transform duration-400 group-hover:scale-105"
                        />
                    </div>

                    {/* Ultra-minimal Content */}
                    <div className="p-2 flex flex-col space-y-1">
                        {/* Tiny Title */}
                        <h3 className="text-xs font-medium line-clamp-2 leading-tight text-gray-800">
                            {product.productTitle}
                        </h3>

                        {/* Price */}
                        <div className="flex items-end gap-1">
                            {product.discountPrice ? (
                                <>
                                    <span className="text-lg font-bold text-primary">
                                        ৳{product.discountPrice.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground line-through">
                                        ৳{product.productPrice.toLocaleString()}
                                    </span>
                                </>
                            ) : (
                                <span className="text-lg font-bold text-primary">
                                    ৳{product.productPrice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Minimal Features */}
                        <div className="flex items-center gap-2 text-[10px]">
                            {product.warranty && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-0.5 text-green-600">
                                                <Shield className="w-2.5 h-2.5" />
                                                <span>{product.warranty.warrantyName}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>Warranty</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            {product.rewardPoints && product.rewardPoints > 0 && (
                                <div className="flex items-center gap-0.5 text-amber-600">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    <span>+{product.rewardPoints}</span>
                                </div>
                            )}

                            {product.stock > 0 ? (
                                <div className="flex items-center gap-0.5 text-blue-600">
                                    <Package className="w-2.5 h-2.5" />
                                </div>
                            ) : (
                                <span className="text-red-500">Out</span>
                            )}
                        </div>

                        {/* Tiny Button */}
                        <Button
                            asChild
                            size="sm"
                            variant={'BlueBtn'}
                            className="mt-1 w-full text-xs h-7"
                        >
                            <Link href={`/products/${product._id}`}>
                                View
                                <Zap className="ml-1 w-2.5 h-2.5" />
                            </Link>
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </Link>
    );
}