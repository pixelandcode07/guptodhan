'use client';

import UploadImage from '@/components/ReusableComponents/UploadImage';
import { useState } from 'react';

export default function LogoUpload({ previews }: { previews: any }) {
  const [files, setFiles] = useState<Record<string, File | string | null>>({
    logo: previews.logo || null,
    logo_dark: previews.logo_dark || null,
    fav_icon: previews.fav_icon || null,
  });

  const handleFileChange = (name: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(files).forEach(([key, value]) => {
      if (value instanceof File) formData.append(key, value);
      else if (typeof value === 'string') formData.append(key, value);
    });

    const res = await fetch('http://localhost:3000/api/v1/settings', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    console.log(result);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UploadImage
          name="logo"
          label="Primary Logo (Light)"
          preview={files.logo as string}
          onChange={handleFileChange}
        />
        <UploadImage
          name="logo_dark"
          label="Secondary Logo (Dark)"
          preview={files.logo_dark as string}
          onChange={handleFileChange}
        />
        <UploadImage
          name="fav_icon"
          label="Favicon"
          preview={files.fav_icon as string}
          onChange={handleFileChange}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </div>
  );
}
