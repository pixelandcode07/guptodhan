import UploadImage from '@/components/ReusableComponents/UploadImage';
// import { useState } from 'react';

interface AttachmentProps {
  onFileChange: (name: string, file: File | null) => void;
}

export default function Attachment({ onFileChange }: AttachmentProps) {
  return (
    <>
      <h1 className="border-b border-[#e4e7eb] pb-2 text-lg">Attachments:</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Owner NID */}
        <UploadImage
          name="ownerNid"
          label="Upload Owner NID card"
          onChange={onFileChange}
        />

        {/* Trade License */}
        <UploadImage
          name="tradeLicense"
          label="Upload Business Trade License"
          onChange={onFileChange}
        />
      </div>
    </>
  );
}