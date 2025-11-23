'use client';

import { Clock, MapPin, Phone, User, Shield, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ClassifiedAdListing } from '@/types/ClassifiedAdsType';

interface AdCardProps {
    ad: ClassifiedAdListing;
    index?: number;
}

export default function BuySellCard({ ad, index = 0 }: AdCardProps) {
    const isNegotiable = ad.isNegotiable;
    const hasImages = ad.images && ad.images.length > 0;
    const thumbnail = hasImages ? ad.images[0] : '/placeholder-ad.jpg';

    const timeAgo = formatDistanceToNow(new Date(ad.createdAt), { addSuffix: true });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group"
        >
            <Link href={`/home/buyandsell/ad-details/${ad._id}`}>
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                        <Image
                            src={thumbnail}
                            alt={ad.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {ad.condition === 'new' && (
                                <Badge className="bg-emerald-600 text-white shadow-md">
                                    <Shield className="w-3 h-3 mr-1" />
                                    New
                                </Badge>
                            )}
                            {isNegotiable && (
                                <Badge variant="secondary" className="bg-blue-600 text-white">
                                    <Tag className="w-3 h-3 mr-1" />
                                    Negotiable
                                </Badge>
                            )}
                        </div>

                        {/* Phone Hidden Indicator */}
                        {ad.contactDetails.isPhoneHidden && (
                            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                Hidden
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-grow space-y-3">
                        {/* Title */}
                        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {ad.title}
                        </h3>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-emerald-600">
                                ৳{ad.price.toLocaleString()}
                            </p>
                            {isNegotiable && (
                                <span className="text-sm text-gray-600 font-medium">Negotiable</span>
                            )}
                        </div>

                        {/* Category & Location */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Badge variant="outline" className="text-xs">
                                {ad.category.name}
                            </Badge>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="text-xs">
                                    {ad.district}, {ad.division}
                                </span>
                            </div>
                        </div>

                        {/* User & Time */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                    {ad.user.profilePicture ? (
                                        <Image
                                            src={ad.user.profilePicture}
                                            alt={ad.user.name}
                                            width={24}
                                            height={24}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                            <User className="w-4 h-4 text-gray-600" />
                                        </div>
                                    )}
                                </div>
                                <span className="font-medium">{ad.user.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {timeAgo}
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
}