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
    storeSocialLinks?: {
        facebook?: string | null;
        instagram?: string | null;
        whatsapp?: string | null;
        linkedIn?: string | null;
        twitter?: string | null;
        tiktok?: string | null;
    } | null;
};

export default function VendorStoreCard({ store }: { store: VendorStore }) {
    // ✅ FIXED: Safe check for social links
    const socialLinks = store?.storeSocialLinks || {};
    const hasSocial = Object.values(socialLinks).some(link => link && typeof link === 'string' && link.trim() !== "");

    // ✅ Guard: Check if store exists and has required fields
    if (!store || !store._id || !store.storeName) {
        console.warn("⚠️ VendorStoreCard: Invalid store data", store);
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="group h-full"
        >
            <Card className="h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-0 flex flex-col">
                {/* Banner - Image already fixed */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <Image
                        src={store.storeBanner || '/default-banner.jpg'}
                        alt={`${store.storeName} banner`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                            e.currentTarget.src = '/default-banner.jpg';
                        }}
                    />
                    <div className="overlay absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                {/* Content Area - Even tighter padding */}
                <div className="relative flex-1 px-3 pb-4 flex flex-col">
                    {/* Logo - Smaller & less overlap */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-12">
                        <div className="w-26 h-26 rounded-full overflow-hidden ring-6 ring-white shadow-xl bg-white">
                            <Image
                                src={store.storeLogo || '/default-logo.jpg'}
                                alt={`${store.storeName} logo`}
                                width={104}
                                height={104}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    e.currentTarget.src = '/default-logo.jpg';
                                }}
                            />
                        </div>
                    </div>

                    {/* Info Section - Very compact */}
                    <div className="mt-14 text-center space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                            {/* Store Name */}
                            <h3 className="text-xl font-bold text-gray-800 pt-2 line-clamp-1">
                                {store.storeName}
                            </h3>

                            {/* Address */}
                            <div className="h-4 flex items-center justify-center">
                                {store.storeAddress && store.storeAddress.trim() !== "" ? (
                                    <p className="text-xs text-gray-600 flex items-center gap-1">
                                        <Store size={14} />
                                        <span className="line-clamp-1">{store.storeAddress}</span>
                                    </p>
                                ) : (
                                    <span className="text-xs text-gray-400">Location not added</span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="h-8 px-3">
                                {store.vendorShortDescription && store.vendorShortDescription.trim() !== "" ? (
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                        {store.vendorShortDescription}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">No description yet</p>
                                )}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="h-8 flex items-center justify-center">
                            {hasSocial ? (
                                <div className="flex gap-3">
                                    {socialLinks.facebook && socialLinks.facebook.trim() !== "" && (
                                        <a 
                                            href={socialLinks.facebook} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-600 hover:scale-110 transition"
                                            title="Facebook"
                                        >
                                            <Facebook size={18} />
                                        </a>
                                    )}
                                    {socialLinks.instagram && socialLinks.instagram.trim() !== "" && (
                                        <a 
                                            href={socialLinks.instagram} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-pink-600 hover:scale-110 transition"
                                            title="Instagram"
                                        >
                                            <Instagram size={18} />
                                        </a>
                                    )}
                                    {socialLinks.linkedIn && socialLinks.linkedIn.trim() !== "" && (
                                        <a 
                                            href={socialLinks.linkedIn} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-700 hover:scale-110 transition"
                                            title="LinkedIn"
                                        >
                                            <Linkedin size={18} />
                                        </a>
                                    )}
                                    {socialLinks.whatsapp && socialLinks.whatsapp.trim() !== "" && (
                                        <a 
                                            href={`https://wa.me/${socialLinks.whatsapp}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-green-500 hover:scale-110 transition"
                                            title="WhatsApp"
                                        >
                                            <MessageCircle size={18} />
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400">No social links</span>
                            )}
                        </div>
                    </div>

                    {/* Visit Button - Minimal top margin */}
                    <div className="mt-4">
                        <Link href={`/home/visit-store/${store._id}`}>
                            <Button
                                size="default"
                                variant={"VendorStoreBtn"}
                                className="w-full text-sm py-2"
                            >
                                <ExternalLink size={16} className="mr-2" />
                                Visit Store
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}