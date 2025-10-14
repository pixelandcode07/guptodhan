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

interface BrandModelSelectionProps {
  formData: {
    brand: string;
    model: string;
  };
  handleInputChange: (field: string, value: unknown) => void;
}

export default function BrandModelSelection({ formData, handleInputChange }: BrandModelSelectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Brand & Model Selection
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium">Brand</Label>
          <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="samsung">Samsung</SelectItem>
              <SelectItem value="xiaomi">Xiaomi</SelectItem>
              <SelectItem value="huawei">Huawei</SelectItem>
              <SelectItem value="dell">Dell</SelectItem>
              <SelectItem value="hp">HP</SelectItem>
              <SelectItem value="lenovo">Lenovo</SelectItem>
              <SelectItem value="asus">ASUS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Model</Label>
          <Select value={formData.model} onValueChange={(value) => handleInputChange('model', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="iphone-15">iPhone 15</SelectItem>
              <SelectItem value="galaxy-s24">Galaxy S24</SelectItem>
              <SelectItem value="redmi-note-13">Redmi Note 13</SelectItem>
              <SelectItem value="macbook-pro">MacBook Pro</SelectItem>
              <SelectItem value="inspiron-15">Inspiron 15</SelectItem>
              <SelectItem value="pavilion-14">Pavilion 14</SelectItem>
              <SelectItem value="thinkpad-x1">ThinkPad X1</SelectItem>
              <SelectItem value="zenbook-14">ZenBook 14</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
