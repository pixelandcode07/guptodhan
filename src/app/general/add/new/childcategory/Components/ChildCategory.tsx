'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import BasicInfo from './fields/BasicInfo';
import ChildMediaUpload from './fields/MediaUpload';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


export type ChildCategoryInputs = {
    category: string;
    subCategory: string;
    name: string;
    iconFile?: File;
};

export default function ChildCategory() {
    const router = useRouter();
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ChildCategoryInputs>();
    const [categories, setCategories] = useState<{ label: string, value: string }[]>([]);
    const [subCategories, setSubCategories] = useState<{ label: string, value: string }[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get('/api/v1/ecommerce-category/ecomCategory', { params: { _ts: Date.now() } });
                const items = (res.data?.data || []) as Array<{ _id: string; name: string }>;
                setCategories(items.map(it => ({ label: it.name, value: it._id })));
            } catch {}
        })();
    }, []);

    const selectedCategory = watch('category');
    useEffect(() => {
        if (selectedCategory) {
            (async () => {
                try {
                    const res = await axios.get(`/api/v1/ecommerce-category/ecomSubCategory/category/${selectedCategory}`, { params: { _ts: Date.now() } });
                    const items = (res.data?.data || []) as Array<{ _id: string; name: string }>;
                    setSubCategories(items.map(it => ({ label: it.name, value: it._id })));
                } catch {}
            })();
        } else {
            setSubCategories([]);
        }
    }, [selectedCategory]);

    const onSubmit: SubmitHandler<ChildCategoryInputs> = async (data) => {
        try {
            const childCategoryId = data.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

            const formData = new FormData();
            formData.append('childCategoryId', childCategoryId);
            formData.append('name', data.name);
            formData.append('slug', childCategoryId);
            formData.append('status', 'active');
            if (data.category) formData.append('category', data.category);
            if (data.subCategory) formData.append('subCategory', data.subCategory);
            if (data.iconFile) formData.append('childCategoryIcon', data.iconFile);

            console.log('📝 Form data being sent:', {
                childCategoryId,
                name: data.name,
                category: data.category,
                subCategory: data.subCategory,
                slug: childCategoryId,
                status: 'active'
            });

            const response = await fetch('/api/v1/ecommerce-category/ecomChildCategory', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', response.status, response.statusText, errorText);
                alert(`Failed to create child category: ${response.status} ${response.statusText}`);
                return;
            }

            const result = await response.json();
            console.log('Success:', result);
            router.replace('/general/view/all/childcategory');
        } catch (e) {
            console.error('Create child category failed:', e);
            alert(`Failed to create child category: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-3 sm:space-y-4">
                            <BasicInfo register={register} errors={errors} categories={categories} subCategories={subCategories} />
                        </div>

                        {/* Media Upload Section */}
                        <div className="space-y-3 sm:space-y-4">
                            <ChildMediaUpload setValue={setValue} />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center pt-3 sm:pt-4 border-t border-gray-200">
                            <Button 
                                variant={'BlueBtn'} 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                                {isSubmitting ? 'Saving...' : 'Save Child Category'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


