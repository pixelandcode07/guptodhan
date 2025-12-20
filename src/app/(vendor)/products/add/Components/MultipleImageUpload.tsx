'use client';

import React from 'react';
import Image from 'next/image';
import UploadImage from '@/components/ReusableComponents/UploadImage';

interface MultipleImageUploadProps {
  images: File[];
  setImages: (files: File[]) => void;
  maxImages?: number;
}

export default function MultipleImageUpload({ 
  images, 
  setImages, 
  maxImages = 8 
}: MultipleImageUploadProps) {
  const handleImageChange = (name: string, file: File | null) => {
    if (file) {
      const newImages = [...images, file].slice(0, maxImages);
      setImages(newImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* Existing Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square border-2 border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add More Images */}
        {canAddMore && (
          <div>
            <UploadImage
              name={`gallery-upload-${images.length}`}
              onChange={handleImageChange}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              {images.length} of {maxImages} images uploaded
            </p>
          </div>
        )}

        {/* Max Images Reached */}
        {!canAddMore && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              Maximum {maxImages} images reached
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
