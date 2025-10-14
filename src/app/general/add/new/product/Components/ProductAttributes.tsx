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

interface ProductAttributesProps {
  formData: {
    flag: string;
    warranty: string;
    unit: string;
  };
  handleInputChange: (field: string, value: unknown) => void;
}

export default function ProductAttributes({ formData, handleInputChange }: ProductAttributesProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Product Attributes
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <Label className="text-sm font-medium">Product Flag</Label>
          <Select value={formData.flag} onValueChange={(value) => handleInputChange('flag', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Flag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="sale">On Sale</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="bestseller">Bestseller</SelectItem>
              <SelectItem value="limited">Limited Edition</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Warranty Period</Label>
          <Select value={formData.warranty} onValueChange={(value) => handleInputChange('warranty', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Warranty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-warranty">No Warranty</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
              <SelectItem value="2year">2 Years</SelectItem>
              <SelectItem value="3year">3 Years</SelectItem>
              <SelectItem value="5year">5 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Unit of Measurement</Label>
          <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="piece">Piece</SelectItem>
              <SelectItem value="kg">Kilogram</SelectItem>
              <SelectItem value="gram">Gram</SelectItem>
              <SelectItem value="liter">Liter</SelectItem>
              <SelectItem value="ml">Milliliter</SelectItem>
              <SelectItem value="meter">Meter</SelectItem>
              <SelectItem value="cm">Centimeter</SelectItem>
              <SelectItem value="inch">Inch</SelectItem>
              <SelectItem value="box">Box</SelectItem>
              <SelectItem value="pack">Pack</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
