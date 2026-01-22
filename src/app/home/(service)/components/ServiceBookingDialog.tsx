// "use client";

// import * as React from "react";
// import Image from "next/image";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Calendar } from "@/components/ui/calendar";
// import { MapPin, Star } from "lucide-react";
// import { ServiceData } from "@/types/ServiceDataType";
// import { motion, AnimatePresence } from "framer-motion";

// interface Props {
//   service: ServiceData;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export default function ServiceBookingDialog({
//   service,
//   open,
//   onOpenChange,
// }: Props) {
//   const images = service.service_images?.length
//     ? service.service_images
//     : ["/placeholder-service.png"];

//   const [imageIndex, setImageIndex] = React.useState(0);
//   const [dates, setDates] = React.useState<Date[] | undefined>([]);
//   const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-3xl p-0 h-[90vh] overflow-hidden">
//         <div className="flex h-full flex-col overflow-y-auto overscroll-contain">
//           <DialogHeader className="p-6 pb-2">
//             <DialogTitle className="text-xl font-semibold">
//               {service.service_title}
//             </DialogTitle>

//             <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
//               <MapPin className="h-4 w-4 text-red-400" />
//               {service.service_area.thana}, {service.service_area.city}
//             </div>
//           </DialogHeader>

//           {/* Image Slider */}
//           <div className="relative h-56 w-full bg-muted">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={imageIndex}
//                 initial={{ opacity: 0.3 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0.3 }}
//                 transition={{ duration: 0.4 }}
//                 className="absolute inset-0"
//               >
//                 <Image
//                   src={images[imageIndex]}
//                   alt={service.service_title}
//                   fill
//                   className="object-cover"
//                 />
//               </motion.div>
//             </AnimatePresence>

//             {images.length > 1 && (
//               <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
//                 {images.map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setImageIndex(i)}
//                     className={`h-2 w-2 rounded-full ${i === imageIndex ? "bg-white" : "bg-white/50"
//                       }`}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Content */}
//           <div className="grid gap-6 p-6 md:grid-cols-2">
//             {/* Left */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-lg font-bold text-primary">
//                     ৳{service.base_price}
//                   </p>
//                   <p className="text-xs capitalize text-muted-foreground">
//                     {service.pricing_type} pricing
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-1 text-sm">
//                   <Star className="h-4 w-4 text-yellow-400" />
//                   {service.average_rating.toFixed(1)}
//                 </div>
//               </div>

//               {/* Time Slots */}
//               <div>
//                 <p className="mb-2 text-sm font-medium">Select Time Slot</p>
//                 <div className="flex flex-wrap gap-2">
//                   {service.available_time_slots.map((slot) => (
//                     <Badge
//                       key={slot}
//                       variant={selectedSlot === slot ? "default" : "outline"}
//                       className="cursor-pointer"
//                       onClick={() => setSelectedSlot(slot)}
//                     >
//                       {slot}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Right */}
//             <div>
//               <p className="mb-2 text-sm font-medium">Select Date(s)</p>
//               <Calendar
//                 mode="multiple"
//                 selected={dates}
//                 onSelect={setDates}
//                 disabled={(date) =>
//                   !service.working_days.includes(
//                     date.toLocaleDateString("en-US", { weekday: "long" })
//                   )
//                 }
//                 className="rounded-md border"
//               />
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="sticky bottom-0 border-t bg-background p-6 shrink-0">
//             <Button
//               className="w-full"
//               disabled={!dates?.length || !selectedSlot}
//             >
//               Confirm Booking
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, Star } from "lucide-react";
import { ServiceData } from "@/types/ServiceDataType";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  service: ServiceData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type BookingFormValues = {
  dates: Date[];
  timeSlot: string;
};

export default function ServiceBookingDialog({
  service,
  open,
  onOpenChange,
}: Props) {
  const images = service.service_images?.length
    ? service.service_images
    : ["/placeholder-service.png"];

  const [imageIndex, setImageIndex] = React.useState(0);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<BookingFormValues>({
    defaultValues: {
      dates: [],
      timeSlot: "",
    },
    mode: "onChange",
  });

  const selectedDates = watch("dates");
  const selectedSlot = watch("timeSlot");

  // ✅ LOG LIVE CHANGES (optional but helpful)
  // React.useEffect(() => {
  //   // console.log("Selected Slot:", selectedSlot);
  //   // console.log("Selected Dates:", selectedDates);
  // }, [selectedSlot, selectedDates]);

  // ✅ FINAL SUBMIT
  const onSubmit = (data: BookingFormValues) => {
    const payload = {
      service_id: service.service_id,
      service_title: service.service_title,
      price: service.base_price,
      location: service.service_area,
      rating: service.average_rating,
      ...data,
    };

    console.log("✅ BOOKING DATA:", payload);
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
          <div className="relative h-56 w-full">
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
            {/* Left */}
            <div className="space-y-4">
              <div className="flex justify-between">
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
                  {service.average_rating.toFixed(1)}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <p className="mb-2 font-medium text-sm">Select Time Slot</p>
                <div className="flex flex-wrap gap-2">
                  {service.available_time_slots.map((slot) => (
                    <Badge
                      key={slot}
                      variant={selectedSlot === slot ? "default" : "outline"}
                      className="cursor-pointer"
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

            {/* Right */}
            <div>
              <p className="mb-2 font-medium text-sm">Select Date(s)</p>
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={(dates) =>
                  setValue("dates", dates ?? [], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                // disabled={(date) =>
                //   !service.working_days.includes(
                //     date.toLocaleDateString("en-US", { weekday: "long" })
                //   )
                // }
                className="rounded-md border"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t bg-background p-6">
            <Button type="submit" className="w-full" disabled={!isValid}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
