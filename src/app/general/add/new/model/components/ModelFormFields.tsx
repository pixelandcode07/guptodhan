"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Tag, Hash } from "lucide-react";

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

interface ModelFormFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  brands: Brand[];
  brandsLoading: boolean;
}

export default function ModelFormFields({
  formData,
  setFormData,
  brands,
  brandsLoading,
}: ModelFormFieldsProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Brand Field */}
      <div className="space-y-2 sm:space-y-3">
        <Label htmlFor="brand" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
          Brand *
        </Label>
        <div className="relative">
          <Select 
            value={formData.brand} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}
            disabled={brandsLoading}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors h-11 sm:h-12 text-sm sm:text-base">
              <SelectValue placeholder={brandsLoading ? "Loading brands..." : "Select a brand"} />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand._id} value={brand.name} className="py-2 sm:py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm sm:text-base">{brand.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Model Name Field */}
      <div className="space-y-2 sm:space-y-3">
        <Label htmlFor="modelName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Tag className="w-4 h-4 text-blue-600 flex-shrink-0" />
          Model Name *
        </Label>
        <div className="relative">
          <Input
            id="modelName"
            value={formData.modelName}
            onChange={(e) => setFormData(prev => ({ ...prev, modelName: e.target.value }))}
            placeholder="Enter model name"
            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors h-11 sm:h-12 text-sm sm:text-base"
            required
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 transition-opacity duration-200" 
                 style={{ opacity: formData.modelName ? 1 : 0 }}></div>
          </div>
        </div>
      </div>

      {/* Model Code Field */}
      <div className="space-y-2 sm:space-y-3">
        <Label htmlFor="modelCode" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Hash className="w-4 h-4 text-blue-600 flex-shrink-0" />
          Model Code *
        </Label>
        <div className="relative">
          <Input
            id="modelCode"
            value={formData.modelCode}
            onChange={(e) => setFormData(prev => ({ ...prev, modelCode: e.target.value }))}
            placeholder="Enter model code"
            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors h-11 sm:h-12 text-sm sm:text-base"
            required
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 transition-opacity duration-200" 
                 style={{ opacity: formData.modelCode ? 1 : 0 }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
