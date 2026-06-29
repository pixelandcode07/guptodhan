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

    // Image Carousel Logic
    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000); 
        return () => clearInterval(interval);
    }, [images.length]);

    const handleBookNow = (e: React.MouseEvent) => {
        e.preventDefault(); 
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
        <div className="w-full h-full flex flex-col">
            {/* =================================================== */}
            {/* UNIVERSAL RESPONSIVE CARD (Vertical for all grids)  */}
            {/* =================================================== */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex w-full h-full flex-col overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
                {/* Image Section - Fixed Aspect Ratio for uniformity */}
                <Link href={`/home/service-info/${service._id}`} className="block w-full relative aspect-[4/3] overflow-hidden bg-gray-100">
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
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Bookmark Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            toast.success("Added to bookmarks!");
                        }}
                        className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-md rounded-full hover:bg-white hover:text-[#0097E9] transition-colors shadow-sm"
                    >
                        <Bookmark className="w-4 h-4 text-gray-600 transition-colors" />
                    </button>

                    {/* Status Badge */}
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
                </Link>

                {/* Content Section */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    
                    {/* Header: Title, Category & Rating */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                            <Link href={`/home/service-info/${service._id}`}>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 leading-tight hover:text-[#0097E9] transition-colors">
                                    {service.service_title}
                                </h3>
                            </Link>
                            <p className="text-xs font-medium text-orange-500 mt-1.5 truncate">
                                {service.service_category}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-bold text-gray-800">
                                {service.average_rating.toFixed(1)}
                            </span>
                        </div>
                    </div>

                    {/* Meta Details: Location, Time, Days */}
                    <div className="flex flex-col gap-2.5 text-xs text-gray-600 font-medium flex-grow mb-4">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{service.service_area.thana}, {service.service_area.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{service.available_time_slots.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">
                                {service.working_days.slice(0, 3).join(", ")}
                                {service.working_days.length > 3 && "..."}
                            </span>
                        </div>
                    </div>

                    {/* Footer: Price & Book Now Button */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 gap-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Starts from</p>
                            <p className="text-lg sm:text-xl font-black text-gray-900 truncate">
                                ৳{service.base_price}
                                <span className="text-xs font-medium text-gray-500 ml-1">
                                    /{service.pricing_type === "hourly" ? "Hour" : "Fixed"}
                                </span>
                            </p>
                        </div>
                        <motion.button
                            onClick={handleBookNow}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex-shrink-0 whitespace-nowrap px-5 py-2.5 bg-[#ff6b00] hover:bg-[#e66000] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-orange-200"
                        >
                            Book Now
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Booking Dialog */}
            <ServiceBookingDialog
                service={service}
                open={open}
                onOpenChange={setOpen}
            />
        </div>
    );
}