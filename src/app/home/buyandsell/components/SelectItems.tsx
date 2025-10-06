'use client'

import Image from 'next/image';
import { ChevronRight, MoveRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner'; 

interface Category {
  _id: string;
  name: string;
  icon?: string;
  status: 'active' | 'inactive';
}

interface SubCategory {
  _id: string;
  name: string;
  icon?: string;
  status: 'active' | 'inactive';
}

export default function SelectItems() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  const router = useRouter();

  // Fetch all public categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // get categories from public GET endpoint
      const response = await axios.get('/api/v1/public/classifieds-categories');
      setCategories(response.data.data || []);
      if (response.data.data?.length > 0) {
        toast.success('Categories loaded successfully!');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      setSubLoading(true);
      const response = await axios.get(`/api/v1/public/classifieds-categories/${categoryId}/subcategories`); // Your subcategory GET endpoint
      // Assuming response structure: { success: true, data: [...] }
      setSubCategories(response.data.data || []);
      toast.success('Subcategories loaded successfully!');
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to load subcategories. Please try again.');
      setSubCategories([]);
    } finally {
      setSubLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null); // Reset subcategory when switching category
    fetchSubCategories(category._id);
  };

  const handleSubcategoryClick = (subcategory: SubCategory) => {
    setSelectedSubcategory(subcategory);

    // After selecting category + subcategory, go to location page with IDs (better than names for uniqueness)
    router.push(
      `/home/buyandsell/location?category=${selectedCategory?._id}&subcategory=${subcategory._id}`
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading categories...</p>
      </div>
    );
  }

  return (
    <>
      <h1 className='font-medium text-2xl py-10 text-center'>Choose any option below</h1>

      <div className="flex max-w-[60vw] mx-auto mb-30">
        {/* Left side - Categories */}
        <div className="w-2/4 bg-gray-100 p-4 border-r">
          <h2 className="text-lg font-bold mb-3">Select Your Category</h2>
          <ul className="space-y-2">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <li
                  key={cat._id}
                  className={`w-full flex justify-between cursor-pointer p-2 rounded-md ${
                    selectedCategory?._id === cat._id
                      ? 'text-[#0097E9] bg-[#ffff]'
                      : 'hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat.icon && (
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      width={20}
                      height={20}
                      className="mr-2 rounded"
                    />
                  )}
                  <span className="flex-1 text-left">{cat.name}</span>
                  <ChevronRight className="ml-auto" />
                </li>
              ))
            ) : (
              <p className="text-gray-500">No categories available.</p>
            )}
          </ul>
        </div>

        {/* Right side - Subcategories */}
        <div className="flex-1 p-6">
          {selectedCategory ? (
            <>
              <h2 className="text-base font-medium mb-4 flex items-center text-[#000000]">
                Select Sub Category <MoveRight /> {selectedCategory.name}
              </h2>
              <ul className="grid grid-cols-1 gap-4">
                {subLoading ? (
                  <p className="text-gray-500">Loading subcategories...</p>
                ) : subCategories.length > 0 ? (
                  subCategories.map((sub) => (
                    <li
                      key={sub._id}
                      className={`justify-self-start w-full flex justify-between cursor-pointer p-3 border rounded-md text-center ${
                        selectedSubcategory?._id === sub._id
                          ? 'bg-green-500 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleSubcategoryClick(sub)}
                    >
                      {sub.icon && (
                        <Image
                          src={sub.icon}
                          alt={sub.name}
                          width={20}
                          height={20}
                          className="mr-2 rounded"
                        />
                      )}
                      <span className="flex-1 text-left">{sub.name}</span>
                      <ChevronRight className="ml-auto" />
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No subcategories available for this category.</p>
                )}
              </ul>
            </>
          ) : (
            <p className="text-gray-500">Please select a category from the left.</p>
          )}
        </div>
      </div>
    </>
  );
}