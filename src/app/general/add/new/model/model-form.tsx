"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import ModelFormHeader from "./components/ModelFormHeader";
import ModelFormFields from "./components/ModelFormFields";
import ModelFormSubmit from "./components/ModelFormSubmit";

type FormData = {
  brand: string;
  modelName: string;
  modelCode: string;
};

type Brand = {
  _id: string;
  brandId: string;
  name: string;
  brandLogo: string;
  brandBanner: string;
  category: string;
  subCategory: string;
  childCategory: string;
  status: 'active' | 'inactive';
  featured: 'featured' | 'not_featured';
};

type ExistingModel = {
  _id: string;
  modelFormId: string;
  brand: string;
  brandName: string;
  modelName: string;
  modelCode: string;
  status: 'active' | 'inactive';
  createdAt: string;
};

export default function ModelForm() {
  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const [formData, setFormData] = useState<FormData>({
    brand: "",
    modelName: "",
    modelCode: "",
  });

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [existingModels, setExistingModels] = useState<ExistingModel[]>([]);

  // Fetch brands and existing models from API
  useEffect(() => {
    const fetchData = async () => {
      setBrandsLoading(true);
      try {
        // Fetch brands
        const brandsResponse = await axios.get("/api/v1/product-config/brandName");
        const brandsData: Brand[] = brandsResponse?.data?.data || [];
        setBrands(brandsData);

        // Fetch existing models for validation
        const modelsResponse = await axios.get("/api/v1/product-config/modelName");
        const modelsData = modelsResponse?.data?.data || [];
        setExistingModels(modelsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setBrandsLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Client-side validation for duplicates
    const isDuplicateCode = existingModels.some(model => 
      model.modelCode.toLowerCase() === formData.modelCode.toLowerCase()
    );
    const isDuplicateName = existingModels.some(model => 
      model.modelName.toLowerCase() === formData.modelName.toLowerCase()
    );

    if (isDuplicateCode) {
      toast.error("Model Code already exists. Please use a different code.");
      setLoading(false);
      return;
    }

    if (isDuplicateName) {
      toast.error("Model Name already exists. Please use a different name.");
      setLoading(false);
      return;
    }
    
    try {
      const payload = {
        brand: formData.brand,
        modelName: formData.modelName,
        modelCode: formData.modelCode,
        modelFormId: formData.modelName.toLowerCase().replace(/\s+/g, "-"),
        status: "active"
      };

      await axios.post("/api/v1/product-config/modelName", payload, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      toast.success("Model created successfully!");
      
      // Redirect to models table
      window.location.href = "/general/view/all/models";
    } catch (error: unknown) {
      console.error("Error creating model:", error);
      
      // Handle specific error cases
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          // Conflict - duplicate key error
          const errorMessage = error.response?.data?.message || "Duplicate entry";
          toast.error(errorMessage);
        } else if (error.response?.status === 500) {
          const errorMessage = error.response?.data?.message || "Server error";
          toast.error(`Failed to create model: ${errorMessage}`);
        } else if (error.response?.status === 400) {
          toast.error("Invalid data provided. Please check your inputs.");
        } else {
          toast.error("Failed to create model. Please try again.");
        }
      } else {
        toast.error("Failed to create model. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* Header */}
        <ModelFormHeader />

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
                {/* Form Fields */}
                <ModelFormFields
                  formData={formData}
                  setFormData={setFormData}
                  brands={brands}
                  brandsLoading={brandsLoading}
                />

                {/* Submit Section */}
                <ModelFormSubmit
                  loading={loading}
                  onSubmit={onSubmit}
                />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
