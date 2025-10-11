'use client';

import { Upload } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export interface BlogData {
  category: string;
  title: string;
  shortDescription: string;
  coverImage: File | null;
}

interface BlogFormProps {
  formData: BlogData;
  setFormData: Dispatch<SetStateAction<BlogData>>;
}

export default function BlogForm({ formData, setFormData }: BlogFormProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (formData.coverImage) {
      const url = URL.createObjectURL(formData.coverImage);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [formData.coverImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, coverImage: selectedFile }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left: File Upload */}
      <div className="col-span-1">
        <Label htmlFor="image">
          Cover Image <span className="text-red-500">*</span>
        </Label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center h-[212px] mt-2 cursor-pointer relative overflow-hidden">
          {!preview ? (
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center text-center cursor-pointer">
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">
                Drag & drop or click to upload
              </p>
            </label>
          ) : (
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
            />
          )}
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Right: Form Fields */}
      <div className="col-span-1 md:col-span-3 space-y-4">
        {/* Category */}
        <div>
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={handleCategoryChange}
            value={formData.category}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select One" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">Buy & Sale</SelectItem>
              <SelectItem value="5">Donation</SelectItem>
              <SelectItem value="4">E-commerce</SelectItem>
              <SelectItem value="1">Education</SelectItem>
              <SelectItem value="2">Environment</SelectItem>
              <SelectItem value="3">Human Rights</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Blog Title */}
        <div>
          <Label htmlFor="title">
            Blog Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter Blog Title Here"
            className="mt-2"
          />
        </div>

        {/* Short Description */}
        <div>
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            placeholder="Enter Short Description Here"
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}
