'use client';

import { Input } from '@/components/ui/input';
import { ImageUp, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useId } from 'react';

interface UploadImageBtnProps {
  value: File | string | null;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
}

export default function FiveUploadImageBtn({ value, onChange, onRemove }: UploadImageBtnProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const uniqueId = useId(); // ✅ unique ID for each upload button

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === 'string') {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="mt-2 relative w-20 h-20">
      <label
        htmlFor={`image-${uniqueId}`} // ✅ unique per button
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
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </label>

      {/* ✅ Each input gets its own unique ID */}
      <Input
        id={`image-${uniqueId}`}
        name={`image-${uniqueId}`}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  );
}
