"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Dropzone from "@/components/ui/dropzone";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import axios from "axios";
import CategorySelection from "@/app/general/add/new/product/Components/CategorySelection";

type FormData = {
  name: string;
  brandLogo: File | null;
  brandBanner: File | null;
  category: string;
  subcategory: string;
  childCategory: string;
};

export default function BrandForm() {
  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    brandLogo: null,
    brandBanner: null,
    category: "",
    subcategory: "",
    childCategory: "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (files: FileList) => {
    const file = files[0] || null;
    setFormData(prev => ({ ...prev, brandLogo: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const handleBannerChange = (files: FileList) => {
    const file = files[0] || null;
    setFormData(prev => ({ ...prev, brandBanner: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBannerPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setBannerPreview(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("brandId", formData.name.toLowerCase().replace(/\s+/g, "-"));
      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("subCategory", formData.subcategory);
      formDataToSend.append("childCategory", formData.childCategory);
      
      if (formData.brandLogo) {
        formDataToSend.append("brandLogo", formData.brandLogo);
      }
      if (formData.brandBanner) {
        formDataToSend.append("brandBanner", formData.brandBanner);
      }

      await axios.post("/api/v1/product-config/brandName", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      toast.success("Brand created successfully!");
      
      // Redirect to brands table
      window.location.href = "/general/view/all/brands";
    } catch (error) {
      toast.error("Failed to create brand");
      console.error("Error creating brand:", error);
    }
  };

  return (
    <div className="m-5 p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Brand</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500"></div>
            Brand Create Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <div className="md:col-span-2">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Brand Name"
                  required
                />
              </div>
            </div>

            {/* Brand Logo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <Label className="text-right pt-2">Brand Logo</Label>
              <div className="md:col-span-2">
                <Dropzone
                  onFiles={handleLogoChange}
                  accept="image/*"
                />
                {logoPreview && (
                  <img src={logoPreview} alt="Logo preview" className="mt-4 max-h-20 max-w-20 object-contain" />
                )}
              </div>
            </div>

            {/* Brand Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <Label className="text-right pt-2">Brand Banner (545px*845px)</Label>
              <div className="md:col-span-2">
                <Dropzone
                  onFiles={handleBannerChange}
                  accept="image/*"
                />
                {bannerPreview && (
                  <img src={bannerPreview} alt="Banner preview" className="mt-4 max-h-32 max-w-32 object-contain" />
                )}
              </div>
            </div>

            {/* Category Selection */}
            <CategorySelection
              formData={{
                category: formData.category,
                subcategory: formData.subcategory,
                childCategory: formData.childCategory,
              }}
              handleInputChange={handleInputChange}
            />

            {/* Submit Button */}
            <div className="flex justify-start pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save Brand
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
