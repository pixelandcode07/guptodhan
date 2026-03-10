"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Star, Clock, Calendar, Zap } from "lucide-react";
import { ServiceData } from "@/types/ServiceDataType";
import { cn } from "@/lib/utils";
import ServiceBookingDialog from "../ServiceBookingDialog";
import Link from "next/link";
import { useSession } from "next-auth/react";

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
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [images.length]);

    // ✅ Login না থাকলে NavMain এর login modal open করো
    const handleBookNow = () => {
        if (!session) {
            document.getElementById('login-modal-btn')?.click();
            return;
        }
        setOpen(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900 shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300"
            style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            }}
        >
            {/* Top scan-line effect */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20 pointer-events-none"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
            />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60 z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60 z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60 z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60 z-10 pointer-events-none" />

            {/* Image Slider */}
            <Link href={`/home/service-info/${service._id}`} className="block">
                <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImage}
                            initial={{ opacity: 0.3, scale: 1.04 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0.3, scale: 0.98 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={images[currentImage]}
                                alt={service.service_title}
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Dark overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    {/* Status Badge */}
                    <span
                        className={cn(
                            "absolute top-3 left-3 z-10 flex items-center gap-1 rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border",
                            service.service_status === "Active"
                                ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/50"
                                : service.service_status === "Under Review"
                                    ? "bg-amber-950/80 text-amber-300 border-amber-500/50"
                                    : "bg-red-950/80 text-red-300 border-red-500/50"
                        )}
                    >
                        <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            service.service_status === "Active" ? "bg-cyan-400 animate-pulse" : "bg-amber-400"
                        )} />
                        {service.service_status}
                    </span>

                    {/* Rating pill */}
                    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-yellow-500/30 rounded-sm px-2 py-0.5">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-[11px] font-bold text-yellow-300">
                            {service.average_rating.toFixed(1)}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">

                {/* Category tag */}
                <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-400/70 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" />
                    {service.service_category}
                </span>

                {/* Title */}
                <h3 className="line-clamp-1 text-sm font-bold text-slate-100 tracking-tight">
                    {service.service_title}
                </h3>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-cyan-500/30 via-slate-600/30 to-transparent" />

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="h-3 w-3 text-cyan-400/70 flex-shrink-0" />
                    <span className="truncate">
                        {service.service_area.thana}, {service.service_area.city}
                    </span>
                </div>

                {/* Time & Days */}
                <div className="flex flex-col gap-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{service.available_time_slots.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                            {service.working_days.slice(0, 3).join(", ")}
                            {service.working_days.length > 3 && "..."}
                        </span>
                    </div>
                </div>

                {/* Price */}
                <div className="mt-auto pt-2">
                    <p className="text-xs text-slate-500 uppercase tracking-widest">
                        {service.pricing_type}
                    </p>
                    <p className="text-xl font-black text-cyan-300 leading-tight">
                        ৳{service.base_price}
                    </p>
                </div>

                {/* Book Now Button */}
                <motion.button
                    onClick={handleBookNow}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative mt-1 w-full overflow-hidden rounded-sm py-2.5 text-xs font-bold uppercase tracking-widest border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-200 transition-all duration-200"
                >
                    <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -skew-x-12"
                        animate={hovered ? { x: ["-100%", "200%"] } : {}}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-1.5">
                        <Zap className="w-3 h-3" />
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