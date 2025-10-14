'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dispatch, SetStateAction } from 'react';
import FileUpload from '@/components/ReusableComponents/FileUpload';

export interface BlogData {
  category: string;
  title: string;
  shortDescription: string;
  coverImageUrl: string; // URL instead of File
}

interface BlogFormProps {
  formData: BlogData;
  setFormData: Dispatch<SetStateAction<BlogData>>;
}

export default function BlogForm({ formData, setFormData }: BlogFormProps) {
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
        <Label htmlFor="coverImage">
          Cover Image <span className="text-red-500">*</span>
        </Label>
        <FileUpload
          name="coverImageUrl"
          label="Cover Image"
          preview={formData.coverImageUrl} // ✅ এই লাইনটা যোগ করো
          onUploadComplete={(name, url) =>
            setFormData(prev => ({ ...prev, [name]: url }))
          }
        />
      </div>

      {/* Right: Form Fields */}
      <div className="col-span-1 md:col-span-3 space-y-4">
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
