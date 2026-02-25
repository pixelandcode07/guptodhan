"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Star, Clock, Calendar } from "lucide-react";
import { ServiceData } from "@/types/ServiceDataType";
import { cn } from "@/lib/utils";
import ServiceBookingDialog from "../ServiceBookingDialog";
import Link from "next/link";

interface ServiceCardProps {
    service: ServiceData;
}

export default function ServiceCard({ service }: ServiceCardProps) {
    const images = service.service_images?.length
        ? service.service_images
        : ["/placeholder-service.png"];

    const [currentImage, setCurrentImage] = useState(0);
    const [open, setOpen] = useState(false);

    // Auto image change every 30 seconds
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-all"
        >
            {/* Image Slider */}
            <Link href={`/home/service-info/${service._id}`} className="group relative flex flex-col overflow-hidden rounded-t-2xl border bg-white shadow-sm hover:shadow-lg transition-all">
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImage}
                            initial={{ opacity: 0.4 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0.4 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={images[currentImage]}
                                alt={service.service_title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Status Badge */}
                    <span
                        className={cn(
                            "absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide",
                            service.service_status === "Active"
                                ? "bg-green-100 text-green-700"
                                : service.service_status === "Under Review"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-700"
                        )}
                    >
                        {service.service_status}
                    </span>
                </div>
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-0.5 md:gap-3 p-1 md:p-4">
                <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
                    {service.service_title}
                </h3>

                <p className="text-xs text-gray-500">
                    {service.service_category}
                </p>

                <div className="flex items-center gap-1 text-xs text-gray-600">
                    <MapPin className="h-3.5 w-3.5 text-red-400" />
                    <span>
                        {service.service_area.thana}, {service.service_area.city}
                    </span>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {service.available_time_slots.join(", ")}
                    </div>

                    <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {service.working_days.slice(0, 3).join(", ")}
                        {service.working_days.length > 3 && "..."}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between pt-1 md:pt-4">
                    <div>
                        <p className="text-lg font-bold text-primary">
                            ৳{service.base_price}
                        </p>
                        <p className="text-[10px] capitalize text-gray-400">
                            {service.pricing_type} pricing
                        </p>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-400" />
                        {service.average_rating.toFixed(1)}
                    </div>
                </div>

                {/* Take Service Button */}
                <motion.button
                    onClick={() => setOpen(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative mt-1 md:mt-4 w-full overflow-hidden rounded-xl p-[2px]"
                >
                    {/* Animated Border */}
                    <motion.span
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-purple-500 to-primary"
                        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{ backgroundSize: "200% 200%" }}
                    />

                    <span className="relative z-10 flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary">
                        Book Now
                    </span>
                </motion.button>
                <ServiceBookingDialog
                    service={service}
                    open={open}
                    onOpenChange={setOpen}
                />
            </div>
        </motion.div>
    );
}
