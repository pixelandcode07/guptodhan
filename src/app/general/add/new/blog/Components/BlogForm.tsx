'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
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
import FileUpload from '@/components/ReusableComponents/FileUpload';
import { Loader2 } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import BlogFormLoadding from '@/app/general/view/all/blogs/edit/Components/BlocgFormLoadding';

// -------------------- Interfaces --------------------
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

interface CategoryType {
  _id: string;
  name: string;
  slug?: string;
  status?: string;
}

// -------------------- Component --------------------
export default function BlogForm({ formData, setFormData }: BlogFormProps) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // -------------------- Handlers --------------------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  // -------------------- Fetch Categories --------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setErrorMsg(null);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await axios.get(
          `${baseUrl}/api/v1/ecommerce-category/ecomCategory`
        );

        const dataArray = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];

        const activeCategories = dataArray.filter(
          (cat: any) =>
            String(cat.status || 'active').toLowerCase() === 'active'
        );

        setCategories(activeCategories);

        if (activeCategories.length === 0) {
          setErrorMsg('No active categories found from API.');
        }
      } catch (error: any) {
        setErrorMsg(error.message || 'Error fetching categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // -------------------- Conditional Render --------------------
  if (loading) {
    return <BlogFormLoadding />;
  }

  // -------------------- Render Form --------------------
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn">
      {/* Left: File Upload */}
      <div className="col-span-1">
        <Label htmlFor="coverImage">
          Cover Image <span className="text-red-500">*</span>
        </Label>
        <FileUpload
          label=""
          name="coverImage"
          preview={formData.coverImageUrl}
          onUploadComplete={(name, url) => {
            setFormData(prev => ({ ...prev, coverImageUrl: url }));
          }}
        />
      </div>

      {/* Right: Form Fields */}
      <div className="col-span-1 md:col-span-3 space-y-4">
        {/* Category Select */}
        <div>
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={handleCategoryChange}
            value={formData.category}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 ? (
                categories.map(cat => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  No active categories found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errorMsg && <p className="text-sm text-red-500 mt-2">{errorMsg}</p>}
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
