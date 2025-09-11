'use client';

import Image from 'next/image';
import { Upload } from 'lucide-react';

type Props = {
  image: File | null;
  setImage: (file: File | null) => void;
};

export default function MediaUpload({ image, setImage }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) setImage(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Banner Image<span className="text-red-500"> *</span></p>
      <div className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center h-[212px] mt-2 cursor-pointer relative overflow-hidden"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {!image ? (
          <label htmlFor="banner_image" className="flex flex-col items-center justify-center text-center cursor-pointer">
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">Drag & drop or click to upload</p>
          </label>
        ) : (
          <Image src={URL.createObjectURL(image)} alt="Preview" fill className="object-cover rounded-lg" />
        )}
        <input id="banner_image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  );
}


