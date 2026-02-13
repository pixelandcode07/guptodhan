"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Star, Loader2, Wrench, Clock, Info, Phone, User, CalendarDays, X } from "lucide-react"; // X icon imported
import { ServiceData } from "@/types/ServiceDataType";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  service: ServiceData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type BookingFormValues = {
  dates: Date[];
  timeSlot: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

// ✅ Generate Time Slots (9 AM to 8 PM)
const TIME_SLOTS = [
  "9 - 10 am", "10 - 11 am", "11 - 12 pm", "12 - 1 pm",
  "1 - 2 pm", "2 - 3 pm", "3 - 4 pm", "4 - 5 pm",
  "5 - 6 pm", "6 - 7 pm", "7 - 8 pm"
];

export default function ServiceBookingDialog({
  service,
  open,
  onOpenChange,
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const images = service.service_images?.length
    ? service.service_images
    : ["/placeholder-service.png"];

  const [imageIndex, setImageIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
    reset
  } = useForm<BookingFormValues>({
    defaultValues: {
      dates: [],
      timeSlot: "",
      contactName: session?.user?.name || "",
      contactPhone: "",
      contactEmail: session?.user?.email || "",
    },
    mode: "onChange",
  });

  const selectedDates = watch("dates");
  const selectedSlot = watch("timeSlot");

  const onSubmit = async (data: BookingFormValues) => {
    // @ts-ignore
    const token = session?.accessToken;

    if (!token) {
      toast.error("Please login to book a service");
      return;
    }

    setLoading(true);

    try {
      const bookingPromises = data.dates.map(async (date) => {
        const payload = {
          service_id: service._id,
          booking_date: date.toISOString(),
          time_slot: data.timeSlot,
          location_details: `${service.service_area.thana}, ${service.service_area.city}`,
          estimated_cost: Number(service.base_price),
          contact_info: {
            name: data.contactName,
            phone: data.contactPhone,
            email: data.contactEmail,
          }
        };

        const res = await fetch("/api/v1/public/service-section/service-provider-manage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Booking failed");
        }
        return res.json();
      });

      await Promise.all(bookingPromises);
      toast.success("Booking confirmed successfully!");
      onOpenChange(false);
      reset();
      router.refresh();

    } catch (error: any) {
      console.error("Booking Error:", error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-6xl h-[90vh] p-0 flex flex-col bg-white rounded-xl overflow-hidden shadow-2xl border-0 sm:max-w-[95vw]">

        {/* === CLOSE BUTTON (NEW) === */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 p-2 bg-white/80 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          type="button"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full w-full">

          {/* --- HEADER --- */}
          <DialogHeader className="px-6 py-4 border-b bg-white flex-shrink-0 z-20 flex flex-row justify-between items-start pr-12">
            <div className="space-y-1">
              <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                {service.service_title}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  <MapPin className="h-3.5 w-3.5 text-[#00005E] mr-1.5" />
                  <span className="font-medium text-xs md:text-sm">{service.service_area.thana}, {service.service_area.city}</span>
                </div>
                <div className="flex items-center gap-1 text-orange-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-bold text-gray-800 text-sm">
                    {service.average_rating ? service.average_rating.toFixed(1) : "New"}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Starting at</span>
              <span className="text-xl font-black text-[#00005E]">৳{service.base_price}</span>
            </div>
          </DialogHeader>

          {/* --- SCROLLABLE BODY --- */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="flex flex-col lg:flex-row min-h-full">

              {/* === LEFT SIDE: INFO === */}
              <div className="w-full lg:w-[35%] bg-white border-b lg:border-b-0 lg:border-r border-gray-200">
                <div className="relative aspect-video w-full bg-gray-200">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={imageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={images[imageIndex]}
                        alt={service.service_title}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="md:hidden absolute bottom-3 right-3 bg-white/95 px-3 py-1 rounded shadow-md">
                    <span className="text-sm font-bold text-[#00005E]">৳{service.base_price}</span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 font-bold text-gray-900 text-sm uppercase tracking-wide">
                      <Info className="w-4 h-4 text-blue-600" /> About Service
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed text-justify">
                      {service.service_description || "No detailed description available."}
                    </p>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex flex-col items-center">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Experience</span>
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        {service.experience_years ? `${service.experience_years} Years` : "N/A"}
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100 flex flex-col items-center">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Tools</span>
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-purple-600" />
                        {service.tools_provided ? "Provided" : "Not Provided"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* === RIGHT SIDE: FORM === */}
              <div className="w-full lg:w-[65%] p-6 lg:p-8 flex flex-col gap-8 pb-32">

                {/* 1. Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00005E]" /> Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-semibold text-gray-600">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your Name"
                        className="h-10 text-sm bg-white border-gray-200 focus:border-[#00005E] focus:ring-[#00005E]"
                        {...register("contactName", { required: true })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-semibold text-gray-600">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="017xxxxxxxx"
                        className="h-10 text-sm bg-white border-gray-200 focus:border-[#00005E] focus:ring-[#00005E]"
                        {...register("contactPhone", { required: true, minLength: 11 })}
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="email" className="text-xs font-semibold text-gray-600">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="h-10 text-sm bg-white border-gray-200 focus:border-[#00005E] focus:ring-[#00005E]"
                        {...register("contactEmail")}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Layout Grid: Time Slots & Calendar */}
                {/* FIX: Changed from lg:grid-cols-2 to xl:grid-cols-2 to prevent squashing on laptops */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">

                  {/* Time Slots */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#00005E]" /> Select Preferable Time *
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 w-full">
                      {TIME_SLOTS.map((slot) => (
                        <div
                          key={slot}
                          onClick={() => setValue("timeSlot", slot, { shouldDirty: true, shouldValidate: true })}
                          className={`
                                    relative cursor-pointer py-2.5 px-1 rounded border text-[13px] font-medium text-center transition-all duration-200 flex items-center justify-center select-none
                                    ${selectedSlot === slot
                              ? "bg-white border-[#e91e63] text-[#e91e63] shadow-md ring-1 ring-[#e91e63]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:shadow-sm hover:translate-y-[-1px] active:translate-y-[1px]"}
                                `}
                        >
                          {slot}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center xl:text-left">Expert will arrive by your selected time</p>
                  </div>

                  {/* Calendar */}
                  <div className="space-y-3 flex flex-col items-center xl:items-start">
                    <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide flex items-center gap-2 self-start">
                      <CalendarDays className="w-4 h-4 text-[#00005E]" /> Select Date(s) *
                    </h4>
                    <div className="border border-gray-200 rounded-xl p-3 bg-white shadow-sm flex justify-center w-full max-w-[350px]">
                      <Calendar
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={(dates) => setValue("dates", dates ?? [], { shouldDirty: true, shouldValidate: true })}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* --- FOOTER (Sticky) --- */}
          <div className="px-6 py-4 border-t bg-white flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-30">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Estimated Cost</span>
              <div className="flex items-baseline gap-2">
                <span className="font-black text-3xl text-[#00005E] leading-none tracking-tight">
                  ৳{(service.base_price * (selectedDates.length || 1)).toLocaleString()}
                </span>
                {selectedDates.length > 0 && (
                  <span className="text-xs font-semibold text-white bg-green-500 px-2 py-0.5 rounded-full shadow-sm">
                    {selectedDates.length} Days
                  </span>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="bg-[#00005E] hover:bg-[#000045] w-full sm:w-auto px-10 py-6 text-base md:text-lg font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={!isValid || loading || selectedDates.length === 0 || !selectedSlot}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}