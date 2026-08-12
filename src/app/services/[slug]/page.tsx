import React from "react";
import { notFound } from "next/navigation";
import axios from "axios";
import PageHeader from "@/components/ReusableComponents/PageHeader";
import ServiceCard from "@/app/home/(service)/components/Re-useable/ServiceCard";
import { ServiceData } from "@/types/ServiceDataType";

// রেসপন্স টাইপ ইন্টারফেস
interface CategoryResponse {
  success: boolean;
  message: string;
  data: {
    category: {
      name: string;
      description: string;
    } | null;
    total: number;
    services: ServiceData[];
  };
}

// সার্ভার সাইড ডাটা ফেচিং ফাংশন
async function getServicesBySlug(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const res = await axios.get<CategoryResponse>(
      `${baseUrl}/api/v1/public/service-section/service-category/slug/${slug}`,
      {
        headers: {
          "Cache-Control": "no-store",
          Pragma: "no-cache",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return null;
  }
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await getServicesBySlug(slug);

  if (!response?.success || !response.data?.category) {
    return notFound();
  }

  const { category, services, total } = response.data;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* --- Page Header --- */}
      <div className="md:max-w-[95vw] xl:container mx-auto pt-6 px-4">
        <PageHeader
          title={category.name}
          subtitle={category.description}
        />
      </div>

      {/* --- Service List Section --- */}
      <div className="md:max-w-[95vw] xl:container mx-auto px-4 mt-8">
        
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-xl text-gray-500 font-medium">
              No services found in {category.name} category currently.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Please check back later or browse other categories.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Showing {services.length} services for <span className="font-semibold text-primary">"{category.name}"</span>
                </p>
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
              {services.map((service) => (
                <ServiceCard 
                    key={service._id || service.service_id} 
                    service={service} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}