"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Star, Clock, Calendar, Bookmark } from "lucide-react";
import { ServiceData } from "@/types/ServiceDataType";
import { cn } from "@/lib/utils";
import ServiceBookingDialog from "../ServiceBookingDialog";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ServiceCardProps {
    service: ServiceData;
}

export default function ServiceCard({ service }: ServiceCardProps) {
    const { data: session } = useSession();
    const images = service.service_images?.length
        ? service.service_images
        : ["/placeholder-service.png"];

    const [currentImage, setCurrentImage] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleBookNow = () => {
    if (!session) {
        const loginButton = document.getElementById('login-modal-btn');
        if (loginButton) {
            loginButton.click();
        } else {
            toast.info("Please click the Login button at the top.");
        }
        return;
    }
    setOpen(true);
    };

    return (
        <>
            {/* ===================== */}
            {/* MOBILE: Vertical Card */}
            {/* ===================== */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="md:hidden flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
                {/* Image */}
                <Link href={`/home/service-info/${service._id}`}>
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100 rounded-t-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={images[currentImage]}
                                    alt={service.service_title}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Bookmark */}
                        <button
                            onClick={(e) => e.preventDefault()}
                            className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                        >
                            <Bookmark className="w-4 h-4 text-gray-500" />
                        </button>

                        {/* Status */}
                        <span className={cn(
                            "absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-[10px] font-semibold",
                            service.service_status === "Active"
                                ? "bg-green-100 text-green-700"
                                : service.service_status === "Under Review"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-700"
                        )}>
                            {service.service_status}
                        </span>
                    </div>
                </Link>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2">
                    {/* Title + Rating */}
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                                {service.service_title}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {service.service_category}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold text-gray-700">
                                {service.average_rating.toFixed(1)}/5
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-100" />

                    {/* Info */}
                    <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span>{service.service_area.thana}, {service.service_area.city}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{service.available_time_slots.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">
                                {service.working_days.slice(0, 3).join(", ")}
                                {service.working_days.length > 3 && "..."}
                            </span>
                        </div>
                    </div>

                    {/* Price + Button */}
                    <div className="flex items-end justify-between mt-1">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Start from</p>
                            <p className="text-lg font-black text-gray-900">
                                ৳{service.base_price}
                                <span className="text-xs font-normal text-gray-400 ml-1">
                                    /{service.pricing_type === "hourly" ? "H" : "fixed"}
                                </span>
                            </p>
                        </div>
                        <motion.button
                            onClick={handleBookNow}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                            Book Now
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* ========================= */}
            {/* DESKTOP: Horizontal Card  */}
            {/* ========================= */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="hidden md:flex overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
                {/* Image - Left Side */}
                <Link
                    href={`/home/service-info/${service._id}`}
                    className="relative w-52 flex-shrink-0 overflow-hidden bg-gray-100 rounded-l-2xl"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={images[currentImage]}
                                alt={service.service_title}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                                sizes="208px"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Bookmark */}
                    <button
                        onClick={(e) => e.preventDefault()}
                        className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                    >
                        <Bookmark className="w-4 h-4 text-gray-500" />
                    </button>
                </Link>

                {/* Content - Right Side */}
                <div className="flex flex-1 flex-col justify-between p-5 gap-3">
                    {/* Top: Title + Rating */}
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <Link href={`/home/service-info/${service._id}`}>
                                <h3 className="text-base font-bold text-gray-900 hover:text-orange-500 transition-colors line-clamp-1">
                                    {service.service_title}
                                </h3>
                            </Link>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {service.service_category}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold text-gray-700">
                                {service.average_rating.toFixed(1)}/5
                            </span>
                        </div>
                    </div>

                    {/* Middle: Info */}
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span>{service.service_area.thana}, {service.service_area.city}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span>{service.available_time_slots.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span>
                                {service.working_days.slice(0, 3).join(", ")}
                                {service.working_days.length > 3 && "..."}
                            </span>
                        </div>
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                            service.service_status === "Active"
                                ? "bg-green-100 text-green-700"
                                : service.service_status === "Under Review"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-700"
                        )}>
                            {service.service_status}
                        </span>
                    </div>

                    {/* Bottom: Price + Button */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Start from</p>
                            <p className="text-xl font-black text-gray-900">
                                ৳{service.base_price}
                                <span className="text-sm font-normal text-gray-400 ml-1">
                                    /{service.pricing_type === "hourly" ? "H" : "fixed"}
                                </span>
                            </p>
                        </div>
                        <motion.button
                            onClick={handleBookNow}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-orange-200"
                        >
                            Book Now
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            <ServiceBookingDialog
                service={service}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
}