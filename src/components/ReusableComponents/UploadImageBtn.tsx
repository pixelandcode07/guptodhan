'use client';

import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface UploadImageBtnProps {
  value: File | string | null;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
  fieldName: string; // নতুন প্রপ: logo বা banner
}

export default function UploadImageBtn({
  value,
  onChange,
  onRemove,
  fieldName,
}: UploadImageBtnProps) {
  const inputId = `upload-${fieldName}`; // প্রতি ফিল্ডের জন্য আলাদা ID

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="mt-2 relative">
      <label
        htmlFor={inputId} // আলাদা ID
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition"
      >
        {!value ? (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-500">Click to upload or drag & drop</p>
            <p className="text-xs text-gray-400">PNG, JPG (max 1MB)</p>
          </div>
        ) : (
          <div className="relative w-full">
            <Image
              src={typeof value === 'string' ? value : URL.createObjectURL(value)}
              alt="Preview"
              width={800}
              height={400}
              className="w-full h-[200px] object-contain rounded-lg"
            />
            {onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
      </label>

      <Input
        id={inputId}
        name={fieldName} // name ও আলাদা
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  );
}