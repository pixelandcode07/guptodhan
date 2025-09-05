'use client';
import { RichTextEditor } from '@/components/RichTextEditor/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export default function Page() {
  const [ctaImage, setCtaImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(
    'https://app-area.guptodhan.com/uploads/about_us/yMCRq1741755424.jpg'
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCtaImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setCtaImage(null);
    setPreview('');
  };
  return (
    <div className="bg-white p-5 ">
      <div className="grid grid-cols-6 gap-2">
        <div className=" col-span-2">
          <div className="space-y-4 w-full ">
            {/* CTA Image */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="cta_image">
                CTA Image <span className="text-red-500">*</span>
              </Label>
              <div className="relative border border-gray-300 rounded p-2 h-52 flex flex-col items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="CTA Preview"
                    className="object-contain h-full w-full"
                  />
                ) : (
                  <p className="text-gray-400 text-center">
                    Drag and drop a file here or click
                  </p>
                )}
                <input
                  type="file"
                  id="cta_image"
                  name="cta_image"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                {preview && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemove}>
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {/* CTA Button Text */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="btn_text">CTA Button Text</Label>
              <Input
                type="text"
                id="btn_text"
                name="btn_text"
                defaultValue="Visit Now"
                placeholder="Visit Our Store"
              />
            </div>

            {/* CTA Button Link */}
            <div className="flex flex-col space-y-2">
              <div className="">
                <Label htmlFor="btn_link">CTA Button Link</Label>
                <Input
                  type="text"
                  id="btn_link"
                  name="btn_link"
                  defaultValue="/guptodhan.com/"
                  placeholder="https://"
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" col-span-4">
          <div className=" pt-0 space-y-6">
            <div>
              <div className="mb-2">
                <Label htmlFor="title">
                  CTA Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value="Guptodhan.com কী?"
                  name="title"
                  maxLength={255}
                  placeholder="Enter Product Title Here"
                  required
                  className="mt-2"
                />
              </div>

              <p className="text-xs font-semibold mb-2">CTA Description</p>
              <RichTextEditor />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="1" required>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select One" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {/* Validation message */}
                <p className="text-sm text-red-500">
                  {/* error message here */}
                </p>
              </div>
            </div>

            <div className="flex justify-start items-center w-full">
              <div className="flex flex-wrap gap-2">
                <Button variant="destructive">Cancel</Button>
                <Button>Done</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
