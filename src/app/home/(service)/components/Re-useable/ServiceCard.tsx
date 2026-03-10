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
        }, 5000); // Changed to 5s for better UX, 10s is a bit too long
        return () => clearInterval(interval);
    }, [images.length]);

    const handleBookNow = (e: React.MouseEvent) => {
        e.preventDefault(); // Link click er sathe conflict na korar jonno
        if (!session) {
            const loginButton = document.getElementById('login-modal-btn-service');
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
        <div className="w-full"> {/* Parent wrapper jate alignment thik thake */}
            {/* ===================== */}
            {/* MOBILE: Vertical Card */}
            {/* ===================== */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="md:hidden flex w-full flex-col overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
                {/* Image */}
                <Link href={`/home/service-info/${service._id}`}>
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100 rounded-t-2xl group">
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
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Bookmark */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                toast.success("Added to bookmarks!");
                            }}
                            className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-sm"
                        >
                            <Bookmark className="w-4 h-4 text-gray-600 hover:text-orange-500 transition-colors" />
                        </button>

                        {/* Status */}
                        <span className={cn(
                            "absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
                            service.service_status === "Active"
                                ? "bg-green-500 text-white"
                                : service.service_status === "Under Review"
                                    ? "bg-amber-500 text-white"
                                    : "bg-red-500 text-white"
                        )}>
                            {service.service_status}
                        </span>
                    </div>
                </Link>

                {/* Content */}
                <div className="p-4 flex flex-col gap-3">
                    {/* Title + Rating */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight">
                                {service.service_title}
                            </h3>
                            <p className="text-xs text-orange-500 font-medium mt-1">
                                {service.service_category}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-bold text-gray-800">
                                {service.average_rating.toFixed(1)}
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gray-100" />

                    {/* Info */}
                    <div className="flex flex-col gap-2 text-xs text-gray-600 font-medium">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{service.service_area.thana}, {service.service_area.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{service.available_time_slots.join(", ")}</span>
                        </div>
                    </div>

                    {/* Price + Button */}
                    <div className="flex items-end justify-between mt-2 pt-2 border-t border-gray-50">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Starts from</p>
                            <p className="text-lg font-black text-gray-900">
                                ৳{service.base_price}
                                <span className="text-xs font-medium text-gray-500 ml-1">
                                    /{service.pricing_type === "hourly" ? "Hour" : "Fixed"}
                                </span>
                            </p>
                        </div>
                        <motion.button
                            onClick={handleBookNow}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-200"
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
                className="hidden md:flex w-full h-[220px] overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
                {/* Image - Left Side */}
                <Link
                    href={`/home/service-info/${service._id}`}
                    className="relative w-64 h-full flex-shrink-0 overflow-hidden bg-gray-100"
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
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                sizes="256px"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Bookmark */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            toast.success("Added to bookmarks!");
                        }}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:text-orange-500 transition-all shadow-sm"
                    >
                        <Bookmark className="w-4 h-4 text-gray-600 transition-colors" />
                    </button>
                    
                    {/* Status Badge */}
                    <span className={cn(
                        "absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
                        service.service_status === "Active"
                            ? "bg-green-500 text-white"
                            : service.service_status === "Under Review"
                                ? "bg-amber-500 text-white"
                                : "bg-red-500 text-white"
                    )}>
                        {service.service_status}
                    </span>
                </Link>

                {/* Content - Right Side */}
                <div className="flex flex-1 flex-col justify-between p-6 bg-white">
                    {/* Top: Title + Rating */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <Link href={`/home/service-info/${service._id}`}>
                                <h3 className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1">
                                    {service.service_title}
                                </h3>
                            </Link>
                            <p className="text-sm font-medium text-orange-500 mt-1">
                                {service.service_category}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold text-gray-800">
                                {service.average_rating.toFixed(1)}
                            </span>
                        </div>
                    </div>

                    {/* Middle: Info */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600 font-medium py-2">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>{service.service_area.thana}, {service.service_area.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>{service.available_time_slots.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>
                                {service.working_days.slice(0, 3).join(", ")}
                                {service.working_days.length > 3 && "..."}
                            </span>
                        </div>
                    </div>

                    {/* Bottom: Price + Button */}
                    <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Start from</p>
                            <p className="text-2xl font-black text-gray-900">
                                ৳{service.base_price}
                                <span className="text-sm font-medium text-gray-500 ml-1">
                                    /{service.pricing_type === "hourly" ? "Hour" : "Fixed"}
                                </span>
                            </p>
                        </div>
                        <motion.button
                            onClick={handleBookNow}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-orange-200/50"
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
        </div>
    );
}