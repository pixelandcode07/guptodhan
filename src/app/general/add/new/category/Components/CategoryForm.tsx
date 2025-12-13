'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
    const router = useRouter();
    const { data: session } = useSession();
    const s = session as (undefined | { accessToken?: string; user?: { role?: string } });
    const token = s?.accessToken;
    const userRole = s?.user?.role;
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CategoryInputs>();

    // Security check - only allow admin users
    if (userRole !== 'admin') {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 font-semibold mb-2">Access Denied</div>
                <p className="text-red-500">You need admin privileges to create categories.</p>
            </div>
        );
    }

    const onSubmit: SubmitHandler<CategoryInputs> = async (data) => {
        try {
            // Basic client-side validation to match server expectations
            if (!data.iconFile) {
                alert('Category icon is required.');
                return;
            }
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

            const res = await fetch('/api/v1/ecommerce-category/ecomCategory', {
                method: 'POST',
                body: formData,
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    ...(userRole ? { 'x-user-role': userRole } : {}),
                }
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(json?.message || 'Failed to create category');
            }
            router.replace('/general/view/all/category');
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
                <Button variant={'BlueBtn'} type="submit" disabled={isSubmitting}>
                    <Save />
                    {isSubmitting ? 'Saving...' : 'Save Category'}
                </Button>
            </div>
        </form>
    );
}


