'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import axios from 'axios';

interface FileUploadProps {
  label?: string; // optional
  name: string;
  preview?: string; // initial preview URL from Cloudinary
  onUploadComplete: (name: string, url: string) => void;
}

export default function FileUpload({
  label,
  name,
  preview,
  onUploadComplete,
}: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(preview);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/v1/image/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: event => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      if (response.data.secure_url) {
        setUploadedUrl(response.data.secure_url);
        onUploadComplete(name, response.data.secure_url);
        setProgress(100);
      } else {
        console.error('Upload failed:', response.data);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (uploadedUrl) {
      try {
        // Extract public_id properly including folder if present
        const publicId = uploadedUrl
          .split('/upload/')[1] // after /upload/
          .split('.')[0]; // remove extension

        await axios.post('/api/v1/image/delete', { public_id: publicId });
      } catch (err) {
        console.error('Failed to delete from Cloudinary:', err);
      }
    }

    setUploadedUrl(undefined);
    onUploadComplete(name, '');
    setProgress(0);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {label && <p className="text-sm font-medium mb-1">{label}</p>}

      <label
        htmlFor={name}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="flex mt-1 flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition h-48 overflow-hidden relative">
        {loading ? (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-2 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 mt-2">
              Uploading {progress}%
            </span>
          </div>
        ) : uploadedUrl ? (
          <div className="relative w-full h-full">
            <img
              src={uploadedUrl}
              alt="Uploaded Preview"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
              <X size={16} />
            </button>
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
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          handleFileChange(e.target.files?.[0] || null);
          e.currentTarget.value = ''; // reset input to allow re-upload of same file
        }}
      />
    </div>
  );
}
