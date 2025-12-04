'use client';

import { Facebook, Instagram, Linkedin, MessageCircle, Store, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type VendorStore = {
    _id: string;
    storeName: string;
    storeLogo: string;
    storeBanner: string;
    storeAddress?: string | null;
    vendorShortDescription?: string | null;
    storeSocialLinks: {
        facebook?: string | null;
        instagram?: string | null;
        whatsapp?: string | null;
        linkedIn?: string | null;
        twitter?: string | null;
        tiktok?: string | null;
    };
};

export default function VendorStoreCard({ store }: { store: VendorStore }) {
    const hasSocial = Object.values(store.storeSocialLinks).some(link => link && link.trim() !== "");

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="group h-full"
        >
            <Card className="h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-0 flex flex-col">
                {/* Fixed Banner */}
                <div className="relative h-48 bg-gray-200">
                    <Image
                        src={store.storeBanner}
                        alt={`${store.storeName} banner`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="overlay absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                {/* Content Area */}
                <div className="relative flex-1 px-6 pb-8 flex flex-col">
                    {/* Logo - Overlapping Banner */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-16">
                        <div className="w-32 h-32 rounded-full overflow-hidden ring-8 ring-white shadow-2xl bg-white">
                            <Image
                                src={store.storeLogo}
                                alt={`${store.storeName} logo`}
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="mt-20 text-center space-y-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                            {/* Store Name */}
                            <h3 className="text-2xl font-bold text-gray-800 px-4">
                                {store.storeName}
                            </h3>

                            {/* Address */}
                            <div className="h-6 flex items-center justify-center">
                                {store.storeAddress ? (
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <Store size={16} />
                                        <span className="line-clamp-1">{store.storeAddress}</span>
                                    </p>
                                ) : (
                                    <span className="text-sm text-gray-400">Location not added</span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="h-12 px-6">
                                {store.vendorShortDescription ? (
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {store.vendorShortDescription}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No description yet</p>
                                )}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="h-12 flex items-center justify-center">
                            {hasSocial ? (
                                <div className="flex gap-5">
                                    {store.storeSocialLinks.facebook && (
                                        <a href={store.storeSocialLinks.facebook} target="_blank" className="text-blue-600 hover:scale-110 transition">
                                            <Facebook size={22} />
                                        </a>
                                    )}
                                    {store.storeSocialLinks.instagram && (
                                        <a href={store.storeSocialLinks.instagram} target="_blank" className="text-pink-600 hover:scale-110 transition">
                                            <Instagram size={22} />
                                        </a>
                                    )}
                                    {store.storeSocialLinks.linkedIn && (
                                        <a href={store.storeSocialLinks.linkedIn} target="_blank" className="text-blue-700 hover:scale-110 transition">
                                            <Linkedin size={22} />
                                        </a>
                                    )}
                                    {store.storeSocialLinks.whatsapp && (
                                        <a href={`https://wa.me/${store.storeSocialLinks.whatsapp}`} target="_blank" className="text-green-500 hover:scale-110 transition">
                                            <MessageCircle size={22} />
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <span className="text-sm text-gray-400">No social links</span>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <Link href={`/store/${store._id}`}>
                            <Button
                                size="lg"
                                variant={"VendorStoreBtn"}
                            >
                                <ExternalLink size={18} className="mr-2" />
                                Visit Store
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}