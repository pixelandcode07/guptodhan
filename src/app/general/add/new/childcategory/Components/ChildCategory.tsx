'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import BasicInfo from './fields/BasicInfo';
import ChildMediaUpload from './fields/MediaUpload';
import { useState, useEffect } from 'react';
import axios from 'axios';


export type ChildCategoryInputs = {
    category: string;
    subCategory: string;
    name: string;
    iconFile?: FileList;
};

export default function ChildCategory() {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ChildCategoryInputs>();
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
            if (data.iconFile && data.iconFile[0]) formData.append('childCategoryIcon', data.iconFile[0]);

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
            window.location.href = '/general/view/all/childcategory';
        } catch (e) {
            console.error('Create child category failed:', e);
            alert(`Failed to create child category: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs space-y-5">
            <BasicInfo register={register} errors={errors} categories={categories} subCategories={subCategories} />
            <ChildMediaUpload setValue={setValue} />
            <div className="text-center">
                <Button variant={'BlueBtn'} type="submit">
                    <Save />
                    Save Child Category
                </Button>
            </div>
        </form>
    );
}


