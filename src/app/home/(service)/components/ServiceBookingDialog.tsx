"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, Star, Loader2 } from "lucide-react";
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

// ✅ Type Definition Fixed Here
type BookingFormValues = {
  dates: Date[];
  timeSlot: string;
};

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

  // ✅ useForm Hook Cleaned up
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
    reset
  } = useForm<BookingFormValues>({
    defaultValues: {
      dates: [],
      timeSlot: "",
    },
    mode: "onChange",
  });

  const selectedDates = watch("dates");
  const selectedSlot = watch("timeSlot");

  // ✅ FINAL SUBMIT FUNCTION
  const onSubmit = async (data: BookingFormValues) => {
    // ১. ইউজার লগইন আছে কিনা চেক করা
    // @ts-ignore
    const token = session?.accessToken; 

    if (!token) {
      toast.error("Please login to book a service");
      return;
    }

    setLoading(true);

    try {
      // প্রতিটি সিলেক্ট করা ডেটের জন্য আলাদা বুকিং রিকোয়েস্ট পাঠানো হবে
      const bookingPromises = data.dates.map(async (date) => {
        const payload = {
          service_id: service._id || service.service_id,
          service_name: service.service_title,
          booking_date: date,
          time_slot: data.timeSlot,
          location_details: `${service.service_area.thana}, ${service.service_area.city}`, 
          estimated_cost: service.base_price,
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
      reset(); // ফর্ম রিসেট
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
      <DialogContent className="max-w-3xl h-[90vh] overflow-hidden p-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full flex-col overflow-y-auto"
        >
          {/* Header */}
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-semibold">
              {service.service_title}
            </DialogTitle>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-red-400" />
              {service.service_area.thana}, {service.service_area.city}
            </div>
          </DialogHeader>

          {/* Image Slider */}
          <div className="relative h-56 w-full bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={imageIndex}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.3 }}
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
          </div>

          {/* Content */}
          <div className="grid gap-6 p-6 md:grid-cols-2">
            {/* Left - Info & Time */}
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-4">
                <div>
                  <p className="text-lg font-bold text-primary">
                    ৳{service.base_price}
                  </p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {service.pricing_type} pricing
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  {service.average_rating ? service.average_rating.toFixed(1) : "New"}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <p className="mb-2 font-medium text-sm">Select Time Slot</p>
                <div className="flex flex-wrap gap-2">
                  {service.available_time_slots?.map((slot) => (
                    <Badge
                      key={slot}
                      variant={selectedSlot === slot ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/90"
                      onClick={() =>
                        setValue("timeSlot", slot, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      {slot}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Calendar */}
            <div>
              <p className="mb-2 font-medium text-sm">Select Date(s)</p>
              <div className="flex justify-center border rounded-md p-2">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) =>
                    setValue("dates", dates ?? [], {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className="rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t bg-background p-6">
            <Button 
                type="submit" 
                className="w-full bg-[#00005E] hover:bg-[#000045]" 
                disabled={!isValid || loading}
            >
              {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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