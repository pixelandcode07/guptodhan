'use client'
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ServiceBookingDialog from "../../components/ServiceBookingDialog";
import { ServiceData } from "@/types/ServiceDataType";

interface Props {
    service: ServiceData;
    // open: boolean;
    // onOpenChange: (open: boolean) => void;
}

export default function BookNowBtn({
    service,
    // open,
    // onOpenChange,
}: Props) {
    const [open, setOpen] = useState(false);
    return (
        <div>
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
    )
}
