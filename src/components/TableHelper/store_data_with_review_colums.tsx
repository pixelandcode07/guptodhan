'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

export type VendorProductRow = {
    _id: string;
    productTitle: string;
    vendorName: string;
    thumbnailImage: string;
    productPrice: number;
    discountPrice: number;
    averageRating: number;
    totalReviews: number;
    reviews: Array<{
        _id: string;
        userName: string;
        rating: number;
        comment: string;
        uploadedTime: string;
        reviewImages: string[];
        userImage: string;
    }>;
};

export const store_data_with_review_columns: ColumnDef<VendorProductRow>[] = [
    {
        id: 'sl',
        header: 'SL',
        cell: ({ row }) => (
            <div className="text-center font-medium">{row.index + 1}</div>
        ),
    },
    {
        accessorKey: 'vendorName',
        header: 'Store Name',
        cell: ({ row }) => (
            <div className="font-medium">{row.original.vendorName}</div>
        ),
    },
    {
        accessorKey: 'productTitle',
        header: 'Product Title',
        cell: ({ row }) => (
            <div className="max-w-md truncate" title={row.original.productTitle}>
                {row.original.productTitle}
            </div>
        ),
    },
    {
        accessorKey: 'thumbnailImage',
        header: 'Image',
        cell: ({ row }) => (
            <Image
                src={row.original.thumbnailImage}
                alt={row.original.productTitle}
                width={80}
                height={80}
                className="rounded-md object-cover border"
            />
        ),
    },
    {
        accessorKey: 'discountPrice',
        header: 'Discount Price',
        cell: ({ row }) => {
            const price = row.original.discountPrice;
            return (
                <div className="font-bold text-green-600">
                    ৳{price.toLocaleString()}
                </div>
            );
        },
    },
    {
        accessorKey: 'productPrice',
        header: 'Original Price',
        cell: ({ row }) => {
            const { productPrice, discountPrice } = row.original;
            const hasDiscount = discountPrice < productPrice;
            return (
                <div className={hasDiscount ? 'line-through text-muted-foreground' : 'font-medium'}>
                    ৳{productPrice.toLocaleString()}
                </div>
            );
        },
    },
    {
        accessorKey: 'averageRating',
        header: 'Average Rating',
        cell: ({ row }) => {
            const rating = row.original.averageRating || 0;
            return (
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'totalReviews',
        header: 'Total Reviews',
        cell: ({ row }) => (
            <div className="text-center font-medium">
                {row.original.totalReviews}
            </div>
        ),
    },
    {
        id: 'reviews',
        header: 'Reviews',
        cell: ({ row }) => {
            const product = row.original;

            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            Check Review ({product.totalReviews})
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-center">
                                {product.vendorName}
                            </DialogTitle>
                            <div className="text-center mt-2">
                                <p className="text-3xl font-bold text-green-600">
                                    ৳{product.discountPrice.toLocaleString()}
                                </p>
                                {product.discountPrice < product.productPrice && (
                                    <p className="text-lg text-muted-foreground line-through">
                                        ৳{product.productPrice.toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </DialogHeader>

                        <div className="mt-6 flex justify-center">
                            <Image
                                src={product.thumbnailImage}
                                alt={product.productTitle}
                                width={300}
                                height={300}
                                className="rounded-lg object-cover border shadow-md"
                            />
                        </div>

                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                                Reviews ({product.totalReviews})
                                <span className="text-sm font-normal text-muted-foreground ml-2">
                                    Average: {product.averageRating.toFixed(1)} / 5
                                </span>
                            </h3>

                            {product.reviews.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No reviews yet.
                                </p>
                            ) : (
                                <div className="space-y-6">
                                    {product.reviews.map((review) => (
                                        <div
                                            key={review._id}
                                            className="border rounded-lg p-5 bg-muted/30"
                                        >
                                            <div className="flex items-start gap-4">
                                                <Image
                                                    src={review.userImage}
                                                    alt={review.userName}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-semibold">{review.userName}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(review.uploadedTime).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-1 mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${i < review.rating
                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                    : 'text-muted-foreground'
                                                                    }`}
                                                            />
                                                        ))}
                                                        <span className="ml-2 text-sm font-medium">
                                                            {review.rating}.0
                                                        </span>
                                                    </div>

                                                    <p className="mt-3 text-foreground">{review.comment}</p>

                                                    {review.reviewImages.length > 0 && (
                                                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                                                            {review.reviewImages.map((img, idx) => (
                                                                <Image
                                                                    key={idx}
                                                                    src={img}
                                                                    alt={`Review image ${idx + 1}`}
                                                                    width={200}
                                                                    height={200}
                                                                    className="rounded-md object-cover border shadow-sm"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            );
        },
    },
];