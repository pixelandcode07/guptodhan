'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import BasicInfo from './BasicInfo';
import MediaUploads from './MediaUploads';
import Options from './Options';


export type CategoryInputs = {
    name: string;
    featureCategory: string;
    showOnNavbar: string;
    iconFile?: File;
    bannerFile?: File;
};

export default function CategoryForm() {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CategoryInputs>();

    const onSubmit: SubmitHandler<CategoryInputs> = async (data) => {
        try {
            const categoryId = data.name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');

            const formData = new FormData();
            formData.append('categoryId', categoryId);
            formData.append('name', data.name);
            formData.append('isFeatured', data.featureCategory === 'yes' ? 'true' : 'false');
            formData.append('isNavbar', data.showOnNavbar === 'yes' ? 'true' : 'false');
            formData.append('slug', categoryId);
            formData.append('status', 'active');
            if (data.iconFile) formData.append('categoryIcon', data.iconFile);
            if (data.bannerFile) formData.append('categoryBanner', data.bannerFile);

            await fetch('/api/v1/ecommerce-category/ecomCategory', {
                method: 'POST',
                body: formData,
            });
            window.location.href = '/general/view/all/category';
        } catch (e) {
            console.error('Create category failed:', e);
            alert('Failed to create category');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs space-y-5">
            <BasicInfo register={register} errors={errors} />
            <MediaUploads register={register} setValue={setValue} watch={watch} />
            <Options register={register} setValue={setValue} watch={watch} />
            <div className="text-center">
                <Button variant={'BlueBtn'} type="submit">
                    <Save />
                    Save Category
                </Button>
            </div>
        </form>
    );
}


