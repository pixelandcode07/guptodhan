'use client';

import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import StoreInformation from './StoreInformation';
import StoreSocialLinks from './StoreSocialLinks';
import StoreMetaInfo from './StoreMetaInfo';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Inputs } from '@/types/Inputs';
import { toast } from 'sonner';

export default function CreateNewStoreFrom() {
    const { data: session } = useSession();
    const token = session?.accessToken as string | undefined;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            commission: 0,
            description: '',
            selectVendor: null,
            logo: null,
            banner: null,
        },
    });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const formData = new FormData();

        // Vendor ID
        if (data.selectVendor?.value) {
            formData.append('storeId', data.selectVendor.value);
        }

        // Files
        if (data.logo) formData.append('logo', data.logo);
        if (data.banner) formData.append('banner', data.banner);

        // Text fields
        const fields: Record<string, any> = {
            storeName: data.store_name,
            storeAddress: data.store_address,
            storePhone: data.store_phone,
            storeEmail: data.store_email,
            vendorShortDescription: data.short_description,
            fullDescription: data.description,
            commission: data.commission,
            storeMetaTitle: data.store_meta_title,
            storeMetaKeywords: data.store_meta_keywords
                .split(',')
                .map((k) => k.trim())
                .filter(Boolean),
            storeMetaDescription: data.store_meta_description,
        };

        Object.entries(fields).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        // Social Links
        const socials = {
            facebook: data.facebook_url,
            whatsapp: data.whatsapp_url,
            instagram: data.instagram_url,
            linkedIn: data.linkedin_url,
            twitter: data.twitter_url,
            tiktok: data.tiktok_url,
        };

        Object.entries(socials).forEach(([key, value]) => {
            if (value && value.trim() !== '') {
                formData.append(`storeSocialLinks[${key}]`, value.trim());
            }
        });

        try {
            const res = await axios.post('/api/v1/vendor-store', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            toast.success('Store created successfully!');
            console.log(res.data);
        } catch (err: any) {
            console.error('Error:', err);
            toast.error(err.response?.data?.message || 'Failed to create store');
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#f8f9fb] m-3 md:m-10 p-3 md:p-5 border border-[#e4e7eb] rounded-xs space-y-5"
        >
            <StoreInformation register={register} errors={errors} control={control} />
            <StoreSocialLinks register={register} errors={errors} />
            <StoreMetaInfo register={register} />

            <div className="text-center">
                <Button variant="BlueBtn" type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Creating...' : 'Create Store'}
                </Button>
            </div>
        </form>
    );
}