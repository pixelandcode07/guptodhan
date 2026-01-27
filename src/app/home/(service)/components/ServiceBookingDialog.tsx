"use client";

import * as React from "react";
import Image from "next/image";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { MapPin, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { ServiceData } from "@/types/ServiceDataType";
import { CreateBookingFormValues, createBookingValidationSchema } from "./validation/bookingvalidations";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Props {
  service: ServiceData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ServiceBookingDialog({
  service,
  open,
  onOpenChange,
}: Props) {
  const images = service.service_images?.length
    ? service.service_images
    : ["/placeholder-service.png"];

  const [imageIndex, setImageIndex] = React.useState(0);
  const { data: session } = useSession();
  const serviceToken = (session as any)?.accessToken;

  const toastStyle = {
    style: {
      background: '#ffffff',
      color: '#000000',
      border: '1px solid #e2e8f0'
    }
  };

  const form = useForm<CreateBookingFormValues>({
    resolver: zodResolver(createBookingValidationSchema),
    mode: "onChange",
    defaultValues: {
      // customer_id: "", // set from auth/session
      service_id: service.service_id,
      booking_date: [],
      time_slot: "",
      location_details: `${service.service_area.thana}, ${service.service_area.city}`,
      estimated_cost: service.base_price,
      customer_notes: "",
    },
  });

  const onSubmit = async (data: CreateBookingFormValues) => {
    try {
      await axios.post(
        "/api/v1/public/service-section/service-provider-manage",
        data, {
        headers: {
          Authorization: `Bearer ${serviceToken}`,
        },
      }
      );
      toast.success("Booking successful!", {
        ...toastStyle,
        description: "Thank you for booking this service.",
      });
      onOpenChange(false);
    } catch (error) {
      toast.error("Booking Unsuccessful!", {
        ...toastStyle,
        description: "Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] overflow-hidden p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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

                {/* Time Slot */}
                <FormField
                  control={form.control}
                  name="time_slot"
                  render={({ field }) => (
                    <FormItem>
                      <p className="mb-2 font-medium text-sm">
                        Select Time Slot
                      </p>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {service.available_time_slots.map((slot) => (
                            <Badge
                              key={slot}
                              variant={
                                field.value === slot
                                  ? "default"
                                  : "outline"
                              }
                              className="cursor-pointer"
                              onClick={() => field.onChange(slot)}
                            >
                              {slot}
                            </Badge>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right */}
              <FormField
                control={form.control}
                name="booking_date"
                render={({ field }) => (
                  <FormItem>
                    <p className="mb-2 font-medium text-sm">Select Date(s)</p>
                    <FormControl>
                      <Calendar
                        mode="multiple"
                        selected={field?.value.map((d) => new Date(d))}
                        onSelect={(dates) => {
                          if (!dates) return field.onChange([]);

                          const formattedDates = dates.map((date) =>
                            new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              date.getDate()
                            ).toLocaleDateString("en-CA")
                          );

                          field.onChange(formattedDates);
                        }}
                        className="rounded-md border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t bg-background p-6">
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid}
              >
                Confirm Booking
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
