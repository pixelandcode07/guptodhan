'use client';

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import axios from 'axios';

// --- Type Definitions ---
interface Category { _id: string; name: string; status: 'active' | 'inactive'; }
interface SubCategory extends Category { category: string; }
interface ChildCategory extends Category { subCategory: string; }

interface CategorySelectionProps {
    formData: {
        category: string;
        subcategory: string;
        childCategory: string;
    };
    handleInputChange: (field: string, value: string) => void;
    categories: Category[];
}

export default function CategorySelection({ formData, handleInputChange, categories = [] }: CategorySelectionProps) {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [childCategories, setChildCategories] = useState<ChildCategory[]>([]);
    const [loading, setLoading] = useState({ sub: false, child: false });

    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    // Fetch sub-categories when parent category changes
    useEffect(() => {
        const fetchSubCategories = async (categoryId: string) => {
            if (!categoryId || !token) return;
            setLoading(prev => ({ ...prev, sub: true }));
            try {
                const res = await axios.get(`/api/v1/ecommerce-category/ecomSubCategory/category/${categoryId}`, { headers: { Authorization: `Bearer ${token}` } });
                setSubCategories(res.data?.data?.filter((s: SubCategory) => s.status === 'active') || []);
            } catch (error) { console.error('Failed to fetch subcategories:', error); } 
            finally { setLoading(prev => ({ ...prev, sub: false })); }
        };

        if (formData.category) {
            fetchSubCategories(formData.category);
        }
    }, [formData.category, token]);

    // Fetch child-categories when sub-category changes
    useEffect(() => {
        const fetchChildCategories = async (subCategoryId: string) => {
            if (!subCategoryId || !token) return;
            setLoading(prev => ({ ...prev, child: true }));
            try {
                // Assuming you have an endpoint to get child categories by sub-category ID
                const res = await axios.get(`/api/v1/ecommerce-category/ecomChildCategory?subCategory=${subCategoryId}`, { headers: { Authorization: `Bearer ${token}` } });
                setChildCategories(res.data?.data?.filter((c: ChildCategory) => c.status === 'active') || []);
            } catch (error) { console.error('Failed to fetch child categories:', error); }
            finally { setLoading(prev => ({ ...prev, child: false })); }
        };

        if (formData.subcategory) {
            fetchChildCategories(formData.subcategory);
        }
    }, [formData.subcategory, token]);

    // ✅ FIX: Reset logic is now handled in these functions to prevent infinite loops
    const handleCategoryChange = (value: string) => {
        handleInputChange('category', value);
        handleInputChange('subcategory', '');
        handleInputChange('childCategory', '');
        setSubCategories([]);
        setChildCategories([]);
    };

    const handleSubCategoryChange = (value: string) => {
        handleInputChange('subcategory', value);
        handleInputChange('childCategory', '');
        setChildCategories([]);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">Category Selection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <Label>Main Category<span className="text-red-500">*</span></Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange} disabled={!categories}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder={!categories ? "Loading..." : "Select Category"} /></SelectTrigger>
                        <SelectContent>
                            {categories?.map((cat) => (<SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Subcategory</Label>
                    <Select value={formData.subcategory} onValueChange={handleSubCategoryChange} disabled={!formData.category || loading.sub}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder={!formData.category ? "Select category first" : loading.sub ? "Loading..." : "Select Subcategory"} /></SelectTrigger>
                        <SelectContent>
                            {subCategories.map((sub) => (<SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Child Category</Label>
                    <Select value={formData.childCategory} onValueChange={(v) => handleInputChange('childCategory', v)} disabled={!formData.subcategory || loading.child}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder={!formData.subcategory ? "Select subcategory first" : loading.child ? "Loading..." : "Select Child Category"} /></SelectTrigger>
                        <SelectContent>
                            {childCategories.map((child) => (<SelectItem key={child._id} value={child._id}>{child.name}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}