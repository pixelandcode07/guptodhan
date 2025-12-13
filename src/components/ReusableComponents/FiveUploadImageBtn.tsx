'use client';

import { Input } from '@/components/ui/input';
import { ImageUp, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useId } from 'react';

interface UploadImageBtnProps {
  value: File | null;             // always File or null
  onChange: (file: File | null) => void;
  onRemove?: () => void;
}

export default function FiveUploadImageBtn({ value, onChange, onRemove }: UploadImageBtnProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const uniqueId = useId(); // unique ID for input

  // Update preview when value changes
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]); // pass File to parent
    }
  };

  const handleRemove = () => {
    onChange(null); // clear the file
    if (onRemove) onRemove();
  };

  return (
    <div className="mt-2 relative w-20 h-20">
      <label
        htmlFor={`image-${uniqueId}`}
        className="flex flex-col items-center justify-center w-full h-full bg-gray-200 rounded-lg cursor-pointer hover:border-gray-400 transition overflow-hidden"
      >
        {!preview ? (
          <div className="flex flex-col items-center justify-center text-center p-2">
            <ImageUp className="w-6 h-6 text-gray-400 mb-2" />
            <span className="text-xs text-gray-500">Upload</span>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image src={preview} alt="Preview" fill className="object-cover rounded-lg" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </label>

      <Input
        id={`image-${uniqueId}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
}
