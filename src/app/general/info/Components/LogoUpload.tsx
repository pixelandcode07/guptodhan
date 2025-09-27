'use client';
import FileUpload from '@/components/ReusableComponents/FileUpload';
import React from 'react';

type LogoUploadProps = {
  previews: {
    logo?: string;
    logo_dark?: string;
    fav_icon?: string;
  };
  handleUploadedUrl: (name: string, url: string) => void; // <-- parent থেকে আসবে
};

export default function LogoUpload({
  previews,
  handleUploadedUrl,
}: LogoUploadProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="w-full h-48 rounded overflow-hidden">
        <FileUpload
          label="Primary Logo (Light)"
          name="logo"
          preview={previews.logo}
          onUploadComplete={handleUploadedUrl}
        />
      </div>

      <div className="w-full h-48   rounded overflow-hidden">
        <FileUpload
          label="Secondary Logo (Dark)"
          name="logo_dark"
          preview={previews.logo_dark}
          onUploadComplete={handleUploadedUrl}
        />
      </div>

      <div className="w-full h-48  rounded overflow-hidden">
        <FileUpload
          label="Favicon"
          name="fav_icon"
          preview={previews.fav_icon}
          onUploadComplete={handleUploadedUrl}
        />
      </div>
    </div>
  );
}
