"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Inputs = {
  category: string;
  name: string;
  featureSubCategory: string;
  showOnNavbar: string;
  iconFile?: File;
  bannerFile?: File;
};

export default function SubCategoryForm() {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<Inputs>();
  const [categories, setCategories] = useState<{ label: string, value: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/v1/ecommerce-category/ecomCategory', { params: { _ts: Date.now() } });
        const items = (res.data?.data || []) as Array<{ _id: string; name: string; categoryId: string }>;
        setCategories(items.map(it => ({ label: it.name, value: it._id })));
      } catch {}
    })();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const subCategoryId = data.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

      const formData = new FormData();
      formData.append('subCategoryId', subCategoryId);
      formData.append('name', data.name);
      formData.append('isFeatured', data.featureSubCategory === 'yes' ? 'true' : 'false');
      formData.append('isNavbar', data.showOnNavbar === 'yes' ? 'true' : 'false');
      formData.append('slug', subCategoryId);
      console.log('📝 Form data being sent:', {
        subCategoryId,
        name: data.name,
        category: data.category,
        isFeatured: data.featureSubCategory === 'yes' ? 'true' : 'false',
        isNavbar: data.showOnNavbar === 'yes' ? 'true' : 'false',
        slug: subCategoryId,
        status: 'active'
      });

      formData.append('status', 'active');
      if (data.category) formData.append('category', data.category);
      if (data.iconFile) formData.append('subCategoryIcon', data.iconFile);
      if (data.bannerFile) formData.append('subCategoryBanner', data.bannerFile);

      // Get session data for authentication
      const session = await axios.get('/api/auth/session');
      const userRole = session?.data?.user?.role || 'user';
      
      const response = await fetch('/api/v1/ecommerce-category/ecomSubCategory', {
        method: 'POST',
        headers: {
          'x-user-role': userRole,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, response.statusText, errorText);
        alert(`Failed to create subcategory: ${response.status} ${response.statusText}`);
        return;
      }
      
      const result = await response.json();
      console.log('Success:', result);
      router.replace('/general/view/all/subcategory');
    } catch (e) {
      console.error('Create subcategory failed:', e);
      alert(`Failed to create subcategory: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  // Using UploadImage's internal preview; watch values are set via setValue

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 sm:px-6 py-4">
            <h1 className="text-lg sm:text-xl font-semibold text-white">Create Subcategory</h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">Add a new subcategory for your products</p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="border-l-4 border-blue-500 pl-3 sm:pl-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Basic Information</h3>
                <p className="text-xs sm:text-sm text-gray-600">Essential details for your subcategory</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Select Category
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select value={watch('category') || ''} onValueChange={(v) => setValue('category', v)}>
                    <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select One" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Name
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    {...register('name', { required: true })} 
                    placeholder="Subcategory Title"
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Feature Settings Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="border-l-4 border-blue-500 pl-3 sm:pl-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Feature Settings</h3>
                <p className="text-xs sm:text-sm text-gray-600">Configure visibility and promotional settings</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Feature Subcategory</Label>
                  <Select value={watch('featureSubCategory') || 'no'} onValueChange={(v) => setValue('featureSubCategory', v)}>
                    <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Not Featured" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Not Featured</SelectItem>
                      <SelectItem value="yes">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Show on Navbar</Label>
                  <Select value={watch('showOnNavbar') || 'no'} onValueChange={(v) => setValue('showOnNavbar', v)}>
                    <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Not on Navbar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Not on Navbar</SelectItem>
                      <SelectItem value="yes">Show on Navbar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Media Upload Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="border-l-4 border-blue-500 pl-3 sm:pl-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Media Upload</h3>
                <p className="text-xs sm:text-sm text-gray-600">Upload icon and image for better visual representation</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-3">
                  <UploadImage
                    name="subcat_icon"
                    label="Subcategory Icon"
                    onChange={(_name, file) => setValue('iconFile', file || undefined)}
                  />
                </div>

                <div className="space-y-3">
                  <UploadImage
                    name="subcat_banner"
                    label="Subcategory Image"
                    onChange={(_name, file) => setValue('bannerFile', file || undefined)}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center pt-4 sm:pt-6 border-t border-gray-200">
              <Button 
                variant={'BlueBtn'} 
                type="submit"
                disabled={isSubmitting}
                className="px-6 sm:px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'Saving...' : 'Save Subcategory'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


