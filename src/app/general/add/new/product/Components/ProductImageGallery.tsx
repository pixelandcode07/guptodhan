'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductImageGalleryProps {
  galleryImages: File[];
  setGalleryImages: React.Dispatch<React.SetStateAction<File[]>>;
  existingGalleryUrls: string[];
  onRemoveExisting: (url: string) => void;
}

export default function ProductImageGallery({
  galleryImages,
  setGalleryImages,
  existingGalleryUrls,
  onRemoveExisting,
}: ProductImageGalleryProps) {

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

  const filePreviews = useMemo(() => {
    return galleryImages.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
  }, [galleryImages]);

  useEffect(() => {
    return () => {
      filePreviews.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [filePreviews]);

  const totalImages = existingGalleryUrls.length + galleryImages.length;

  return (
    <Card className="shadow-sm border-gray-200 flex-1 flex flex-col min-h-0">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
          Product Image Gallery
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">Upload multiple product images</p>
      </CardHeader>
      <CardContent className="pt-6 space-y-4 flex-1 flex flex-col min-h-0">
        {totalImages === 0 ? (
          <div 
            {...getRootProps()} 
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors min-h-[300px] flex-1"
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-16 w-16 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-gray-700 font-medium text-lg">Drop the images here...</p>
            ) : (
              <div className="text-center">
                <p className="text-gray-700 font-medium text-lg mb-2">Drag & Drop images here</p>
                <p className="text-gray-500 text-sm">or click to browse and select multiple images</p>
                <p className="text-gray-400 text-xs mt-3">Supported formats: JPG, PNG, GIF</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingGalleryUrls.map((url, index) => (
                <div key={`existing-${index}`} className="relative aspect-square rounded-md overflow-hidden border group bg-white">
                  <Image
                    src={url}
                    alt={`Existing gallery image ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={(e) => { 
                      e.stopPropagation();
                      onRemoveExisting(url); 
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
              {filePreviews.map(({ preview }, index) => (
                <div key={`new-${index}`} className="relative aspect-square rounded-md overflow-hidden border group">
                  <Image
                    src={preview}
                    alt={`Gallery image ${existingGalleryUrls.length + index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={(e) => { 
                      e.stopPropagation();
                      removeImage(index); 
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {existingGalleryUrls.length + index + 1}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add More Images Section */}
            <div 
              {...getRootProps()} 
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50/50 hover:bg-gray-100 hover:border-blue-400 transition-colors mt-4"
            >
              <input {...getInputProps()} />
              <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
              {isDragActive ? (
                <p className="text-gray-600 text-sm font-medium">Drop more images here...</p>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium mb-1">Add more images</p>
                  <p className="text-gray-500 text-xs">Drag & drop or click to browse</p>
                  <p className="text-gray-400 text-xs mt-2">
                    Currently {totalImages} image{totalImages !== 1 ? 's' : ''} uploaded
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}