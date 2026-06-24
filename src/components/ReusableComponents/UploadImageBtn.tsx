'use client';

import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react'; // X বাদ দেওয়া হয়েছে
import Image from 'next/image';

interface UploadImageBtnProps {
  value: File | string | null; 
  onChange: (file: File | null) => void;
  onRemove?: () => void;
  fieldName: string;
}

export default function UploadImageBtn({
  value,
  onChange,
  onRemove,
  fieldName,
}: UploadImageBtnProps) {
  const inputId = `upload-${fieldName}`;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  // Determine image source
  const imageSrc = typeof value === 'string' 
    ? value 
    : value instanceof File 
      ? URL.createObjectURL(value) 
      : null;

  return (
    <div className="mt-2 relative">
      <label
        htmlFor={inputId}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition w-full h-48"
      >
        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <Upload className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600">Click to upload</p>
            <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={imageSrc}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
            />
            {/* লাল X বাটনটি এখান থেকে সম্পূর্ণ রিমুভ করা হয়েছে */}
          </div>
        )}
      </label>

      <Input
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
}