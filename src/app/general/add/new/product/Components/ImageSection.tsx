'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import MultipleImageUpload from './MultipleImageUpload';

interface ImageSectionProps {
  formData: {
    thumbnailImage: File | null;
    galleryImages: File[];
  };
  handleInputChange: (field: string, value: unknown) => void;
}

export default function ImageSection({ formData, handleInputChange }: ImageSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Product Images
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Product Thumbnail Image<span className="text-red-500">*</span>
          </Label>
          <UploadImage
            name="thumbnailImage"
            preview=""
            onChange={(name, file) => handleInputChange('thumbnailImage', file)}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">
            Product Gallery Images
          </Label>
          <MultipleImageUpload
            images={formData.galleryImages}
            setImages={(files) => handleInputChange('galleryImages', files)}
            maxImages={8}
          />
        </div>
      </div>
    </div>
  );
}
