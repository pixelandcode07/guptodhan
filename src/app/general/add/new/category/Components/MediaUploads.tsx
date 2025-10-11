'use client';

import { Label } from '@/components/ui/label';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { CategoryInputs } from './CategoryForm';
import FileUpload from '@/components/ReusableComponents/FileUpload';

export default function MediaUploads({
  setValue,
  watch,
}: {
  setValue: UseFormSetValue<CategoryInputs>;
  watch: UseFormWatch<CategoryInputs>;
}) {
  const iconFile = watch('iconFile') as File | undefined;
  const bannerFile = watch('bannerFile') as File | undefined;

  return (
    <>
      <Label>Category Icon</Label>
      <FileUpload
        label="Upload Icon"
        name="iconFile"
        preview={iconFile ? URL.createObjectURL(iconFile) : undefined}
        onUploadComplete={(_, url) => {
          // If you want to store File object instead of URL, adjust here
          setValue('iconFile', url as any);
        }}
      />

      <Label className="mt-4">Category Banner</Label>
      <FileUpload
        label="Upload Banner"
        name="bannerFile"
        preview={bannerFile ? URL.createObjectURL(bannerFile) : undefined}
        onUploadComplete={(_, url) => {
          setValue('bannerFile', url as any);
        }}
      />
    </>
  );
}
