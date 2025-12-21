'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductBasicDetailsProps {
  formData: {
    productCode: string;
    videoUrl: string;
  };
  handleInputChange: (field: string, value: unknown) => void;
}

export default function ProductBasicDetails({ formData, handleInputChange }: ProductBasicDetailsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Basic Product Details
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="productCode" className="text-sm font-medium">Product Code</Label>
          <Input
            id="productCode"
            placeholder="Enter product code"
            value={formData.productCode}
            onChange={(e) => handleInputChange('productCode', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="videoUrl" className="text-sm font-medium">Product Video URL</Label>
          <Input
            id="videoUrl"
            placeholder="https://youtube.com/watch?v=..."
            value={formData.videoUrl}
            onChange={(e) => handleInputChange('videoUrl', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
