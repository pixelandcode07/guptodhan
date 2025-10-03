'use client';

import { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';

interface FileUploadProps {
  label: string;
  name: string;
  preview?: string;
  onUploadComplete: (name: string, url: string) => void;
}

export default function FileUpload({
  label,
  name,
  preview,
  onUploadComplete,
}: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | undefined>(preview);

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;

    setLoading(true);
    setLocalPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        onUploadComplete(name, data.secure_url);
      } else {
        console.error('Upload failed:', data);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <div
        onClick={() => document.getElementById(name)?.click()}
        className="border-gray-300 rounded border p-2 cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-center relative">
        <input
          id={name}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFileChange(e.target.files?.[0])}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-20">
            <Loader2 className="animate-spin text-gray-500 mb-2" />
            <span className="text-sm text-gray-600">Uploading...</span>
          </div>
        ) : localPreview ? (
          <img
            src={localPreview}
            alt={label}
            className="w-full h-auto max-h-40 object-cover"
          />
        ) : (
          <Upload className="text-gray-400" />
        )}
      </div>
    </div>
  );
}
