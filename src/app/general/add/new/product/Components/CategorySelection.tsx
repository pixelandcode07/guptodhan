'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategorySelectionProps {
  formData: {
    category: string;
    subcategory: string;
    childCategory: string;
  };
  handleInputChange: (field: string, value: unknown) => void;
}

export default function CategorySelection({ formData, handleInputChange }: CategorySelectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Category Selection
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <Label className="text-sm font-medium">
            Main Category<span className="text-red-500">*</span>
          </Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="automotive">Automotive</SelectItem>
              <SelectItem value="beauty">Beauty & Health</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Subcategory</Label>
          <Select value={formData.subcategory} onValueChange={(value) => handleInputChange('subcategory', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Subcategory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="smartphones">Smartphones</SelectItem>
              <SelectItem value="laptops">Laptops</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="mens-clothing">Men's Clothing</SelectItem>
              <SelectItem value="womens-clothing">Women's Clothing</SelectItem>
              <SelectItem value="kids-clothing">Kids Clothing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Child Category</Label>
          <Select value={formData.childCategory} onValueChange={(value) => handleInputChange('childCategory', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Child Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="android-phones">Android Phones</SelectItem>
              <SelectItem value="iphones">iPhones</SelectItem>
              <SelectItem value="gaming-laptops">Gaming Laptops</SelectItem>
              <SelectItem value="business-laptops">Business Laptops</SelectItem>
              <SelectItem value="shirts">Shirts</SelectItem>
              <SelectItem value="pants">Pants</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
