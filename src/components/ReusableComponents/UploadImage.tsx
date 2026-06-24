'use client';
import { Upload } from 'lucide-react'; // X বাটন রিমুভ করা হয়েছে
import Image from 'next/image';
import { useState } from 'react';

interface UploadImageBtnProps {
  name: string;
  label?: string;
  preview?: string;
  onChange: (name: string, file: File | null) => void;
}

export default function UploadImage({
  name,
  label,
  preview,
  onChange,
}: UploadImageBtnProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onChange(name, file);
  };

  const imageUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : preview || '';

  return (
    <div className="w-full">
      {label && <p className="text-sm font-medium mb-1">{label}</p>}
      <label
        htmlFor={name}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition h-48 overflow-hidden">
        {imageUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt="Preview"
              fill
              className="object-contain rounded-lg"
            />
            {/* লাল X বাটনটি এখান থেকে সম্পূর্ণ রিমুভ করা হয়েছে */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-500">Click to upload or drag & drop</p>
            <p className="text-xs text-gray-400">PNG, JPG (max 1MB)</p>
          </div>
        )}
      </label>

      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}