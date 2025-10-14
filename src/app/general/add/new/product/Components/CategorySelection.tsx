'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface CategorySelectionProps {
  formData: {
    category: string;
    subcategory: string;
    childCategory: string;
  };
  handleInputChange: (field: string, value: unknown) => void;
}

interface Category {
  _id: string;
  categoryId: string;
  name: string;
  status: 'active' | 'inactive';
}

interface SubCategory {
  _id: string;
  subCategoryId: string;
  name: string;
  status: 'active' | 'inactive';
}

interface ChildCategory {
  _id: string;
  childCategoryId: string;
  category: string;
  subCategory: string | { _id: string };
  name: string;
  status: 'active' | 'inactive';
}

export default function CategorySelection({ formData, handleInputChange }: CategorySelectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [childCategories, setChildCategories] = useState<ChildCategory[]>([]);
  const [loading, setLoading] = useState({
    categories: false,
    subCategories: false,
    childCategories: false,
  });
  
  // Simple cache to avoid repeated API calls
  const subCategoryCacheRef = useRef<Record<string, SubCategory[]>>({});
  const handleInputChangeRef = useRef(handleInputChange);

  // Update ref when handleInputChange changes
  useEffect(() => {
    handleInputChangeRef.current = handleInputChange;
  }, [handleInputChange]);

  const { data: session } = useSession();
  type Session = {
    user?: { role?: string; id?: string };
    accessToken?: string;
  };
  const s = session as Session | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const response = await axios.get('/api/v1/ecommerce-category/ecomCategory', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      
      const activeCategories = response.data?.data?.filter((cat: Category) => cat.status === 'active') || [];
      setCategories(activeCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, [token, userRole]);

  // Fetch subcategories by category
  const fetchSubCategories = useCallback(async (categoryId: string) => {
    if (!categoryId) {
      setSubCategories([]);
      setChildCategories([]);
      return;
    }

    // Check cache first
    if (subCategoryCacheRef.current[categoryId]) {
      setSubCategories(subCategoryCacheRef.current[categoryId]);
      handleInputChangeRef.current('subcategory', '');
      handleInputChangeRef.current('childCategory', '');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, subCategories: true }));
      console.log('🔄 Fetching subcategories for category:', categoryId);
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await axios.get(`/api/v1/ecommerce-category/ecomSubCategory/category/${categoryId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log('✅ Subcategories fetched successfully:', response.data?.data?.length || 0, 'items');
      
      const activeSubCategories = response.data?.data?.filter((sub: SubCategory) => sub.status === 'active') || [];
      
      // Cache the result
      subCategoryCacheRef.current[categoryId] = activeSubCategories;
      setSubCategories(activeSubCategories);
      
      // Reset child category when subcategory changes
      handleInputChangeRef.current('subcategory', '');
      handleInputChangeRef.current('childCategory', '');
    } catch (error) {
      console.error('❌ Failed to fetch subcategories:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏰ Request timed out');
      }
    } finally {
      setLoading(prev => ({ ...prev, subCategories: false }));
    }
  }, [token, userRole]);

  // Fetch child categories by subcategory
  const fetchChildCategories = useCallback(async (subCategoryId: string) => {
    if (!subCategoryId) {
      setChildCategories([]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, childCategories: true }));
      console.log('🔄 Fetching child categories for subcategory:', subCategoryId);
      
      const response = await axios.get('/api/v1/ecommerce-category/ecomChildCategory', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      
      console.log('📦 All child categories:', response.data?.data);
      
      // Filter child categories by subcategory and status
      const allChildCategories = response.data?.data || [];
      const filteredChildCategories = allChildCategories.filter((child: ChildCategory) => {
        // Handle both string and ObjectId comparison
        const subCategoryMatch = child.subCategory === subCategoryId || 
                                (typeof child.subCategory === 'object' && child.subCategory?._id === subCategoryId) ||
                                child.subCategory?.toString() === subCategoryId;
        
        console.log('🔍 Checking child:', {
          childId: child._id,
          childSubCategory: child.subCategory,
          targetSubCategory: subCategoryId,
          status: child.status,
          subCategoryMatch,
          isActive: child.status === 'active',
          finalMatch: child.status === 'active' && subCategoryMatch
        });
        
        return child.status === 'active' && subCategoryMatch;
      });
      
      console.log('✅ Filtered child categories:', filteredChildCategories);
      setChildCategories(filteredChildCategories);
      
      // Reset child category when subcategory changes
      handleInputChangeRef.current('childCategory', '');
    } catch (error) {
      console.error('❌ Failed to fetch child categories:', error);
    } finally {
      setLoading(prev => ({ ...prev, childCategories: false }));
    }
  }, [token, userRole]);

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Load subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      fetchSubCategories(formData.category);
    }
  }, [formData.category, fetchSubCategories]);

  // Load child categories when subcategory changes
  useEffect(() => {
    if (formData.subcategory) {
      fetchChildCategories(formData.subcategory);
    }
  }, [formData.subcategory, fetchChildCategories]);

  const handleCategoryChange = (value: string) => {
    handleInputChange('category', value);
  };

  const handleSubCategoryChange = (value: string) => {
    handleInputChange('subcategory', value);
  };

  const handleChildCategoryChange = (value: string) => {
    handleInputChange('childCategory', value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Category Selection
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <Label className="text-sm font-medium">
            Main Category<span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.category} 
            onValueChange={handleCategoryChange}
            disabled={loading.categories}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={loading.categories ? "Loading..." : "Select Category"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Subcategory</Label>
          <Select 
            value={formData.subcategory} 
            onValueChange={handleSubCategoryChange}
            disabled={!formData.category || loading.subCategories}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={
                !formData.category 
                  ? "Select category first" 
                  : loading.subCategories 
                    ? "Loading subcategories..." 
                    : "Select Subcategory"
              } />
            </SelectTrigger>
            <SelectContent>
              {loading.subCategories ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                subCategories.map((subCategory) => (
                  <SelectItem key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {loading.subCategories && (
            <p className="text-xs text-blue-600 mt-1">Fetching subcategories...</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium">Child Category</Label>
          <Select 
            value={formData.childCategory} 
            onValueChange={handleChildCategoryChange}
            disabled={!formData.subcategory || loading.childCategories}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={
                !formData.subcategory 
                  ? "Select subcategory first" 
                  : loading.childCategories 
                    ? "Loading child categories..." 
                    : "Select Child Category"
              } />
            </SelectTrigger>
            <SelectContent>
              {loading.childCategories ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                childCategories.map((childCategory) => (
                  <SelectItem key={childCategory._id} value={childCategory._id}>
                    {childCategory.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {loading.childCategories && (
            <p className="text-xs text-blue-600 mt-1">Fetching child categories...</p>
          )}
        </div>
      </div>
    </div>
  );
}
