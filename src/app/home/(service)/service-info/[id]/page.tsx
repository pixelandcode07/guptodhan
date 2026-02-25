import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, DollarSign, Star } from "lucide-react";
import { getServiceById } from "@/lib/ServicePageApis/getServiceById";
import ServiceImages from "../../components/ServiceImages";
import ServicePricing from "../../components/ServicePricing";
import ServiceAvailability from "../../components/ServiceAvailability";
import BookNowBtn from "../components/BookNowBtn";


interface ServiceDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {

    const { id } = await params;

    const service = await getServiceById(id);

    if (!service) {
        notFound();
    }

    return (
        <main className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    <ServiceImages images={service.service_images} title={service.service_title} />

                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{service.service_title}</h1>
                            <Badge variant="outline" className="text-base px-4 py-1">
                                {service.service_category}
                            </Badge>
                            {service.service_status === "Active" ? (
                                <Badge variant="default" className="bg-green-600 hover:bg-green-600">
                                    Active
                                </Badge>
                            ) : (
                                <Badge variant="secondary">{service.service_status}</Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-6 text-muted-foreground text-sm">
                            <div className="flex items-center gap-1.5">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>
                                    {service.average_rating.toFixed(1)} ({service.total_bookings} bookings)
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                <span>
                                    {service.service_area.thana}, {service.service_area.city} • {service.service_area.district}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        <div className="prose max-w-none dark:prose-invert">
                            <h3 className="mt-0 text-xl font-semibold">Service Description</h3>
                            <p className="whitespace-pre-line leading-relaxed">{service.service_description}</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
                    <ServicePricing
                        pricingType={service.pricing_type}
                        basePrice={service.base_price}
                        minimumCharge={service.minimum_charge}
                    />

                    <ServiceAvailability
                        timeSlots={service.available_time_slots}
                        workingDays={service.working_days}
                        toolsProvided={service.tools_provided}
                    />

                    <Card className="border-primary/20 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Book this Service</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Contact the provider now to discuss your needs, confirm timing, and get a quote.
                            </p>
                            {/* Take Service Button */}
                            <BookNowBtn service={service} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
    const { id } = await params;
    const service = await getServiceById(id);

    return {
        title: service
            ? `${service.service_title} - ${service.service_category} | Service Details`
            : "Service Not Found",
        description: service?.service_description?.slice(0, 160) ?? "Service details page",
    };
}