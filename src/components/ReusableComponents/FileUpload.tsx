'use client';

import { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';

interface FileUploadProps {
  label: string;
  name: string;
  preview?: string; // initial preview url (optional)
  onUploadComplete: (name: string, url: string) => void; // parent receives uploaded url
}

export default function FileUpload({
  label,
  name,
  preview,
  onUploadComplete,
}: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localPreview, setLocalPreview] = useState<string | undefined>(preview);

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;

    setLoading(true);
    setProgress(0);

    // show local preview first
    setLocalPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
      );

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          setLoading(false);
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.secure_url) {
              onUploadComplete(name, response.secure_url);
            }
          } else {
            console.error('Upload failed:', xhr.responseText);
          }
        }
      };

      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
      );
      xhr.send(formData);
    } catch (err) {
      console.error('Upload failed:', err);
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <div
        onClick={() => document.getElementById(name)?.click()}
        className=" border-gray-300 rounded border p-2 cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-center relative">
        <input
          id={name}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFileChange(e.target.files?.[0])}
        />

        {loading ? (
          <div className="flex flex-col min-h-20 items-center justify-center">
            <Loader2 className=" animate-spin text-gray-500 mb-2" />
            <span className="text-sm text-gray-600">{progress}%</span>
            <div className=" bg-gray-200 rounded-full mt-1">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        ) : localPreview ? (
          <img
            src={localPreview}
            alt={label}
            className="w-full h-auto max-h-40  object-cover" // ✅ সবসময় দেখাবে
          />
        ) : (
          <Upload className=" text-gray-400" />
        )}
      </div>
    </div>
  );
}
