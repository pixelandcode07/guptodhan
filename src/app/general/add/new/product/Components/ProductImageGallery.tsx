'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductImageGalleryProps {
  galleryImages: File[];
  setGalleryImages: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function ProductImageGallery({ galleryImages, setGalleryImages }: ProductImageGalleryProps) {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setGalleryImages((prevImages: File[]) => [...prevImages, ...acceptedFiles]);
  }, [setGalleryImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.gif', '.jpg']
    },
    multiple: true,
  });

  const removeImage = (index: number) => {
    setGalleryImages((prevImages: File[]) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Image Gallery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          {...getRootProps()} 
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-12 w-12 text-gray-500 mb-2" />
          {isDragActive ? (
            <p className="text-gray-700">Drop the files here ...</p>
          ) : (
            <p className="text-gray-700">Drag & Drop files here or click to browse</p>
          )}
        </div>

        {galleryImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {galleryImages.map((file, index) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={(e) => { 
                    e.stopPropagation(); // Prevent the dropzone from opening on click
                    removeImage(index); 
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}