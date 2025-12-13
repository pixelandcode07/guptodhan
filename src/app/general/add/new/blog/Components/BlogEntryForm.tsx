'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dispatch, SetStateAction } from 'react';
import FileUpload from '@/components/ReusableComponents/FileUpload';

export interface BlogData {
  category: string;
  title: string;
  shortDescription: string;
  coverImageUrl: string;
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

  const categoryOptions = [
    'Education',
    'Environment',
    'Human Rights',
    'E-commerce',
    'Donation',
    'Buy & Sale',
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCategoryChange = (e: { target: { value: any } }) => {
    console.log(e.target.value);
    setFormData(prev => ({ ...prev, category: e.target.value }));
  };

  console.log(formData); // ✅ category now shows "Education", "E-commerce", etc.

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left: File Upload */}
      <div className="col-span-1">
        <Label htmlFor="coverImage">
          Cover Image <span className="text-red-500">*</span>
        </Label>
        <FileUpload
          label=""
          name="coverImage"
          preview={formData.coverImageUrl}
          onUploadComplete={(_, url) =>
            setFormData(prev => ({ ...prev, coverImageUrl: url }))
          }
        />
      </div>

      {/* Right: Form Fields */}
      <div className="col-span-1 md:col-span-3 space-y-4">
        {/* Category */}
        <div>
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className="w-full mt-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option value="">Select One</option>
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
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
