// 'use client'


// import { Button } from '@/components/ui/button'
// import { Save } from 'lucide-react'
// import { SubmitHandler, useForm } from 'react-hook-form'
// import StoreInformation from './StoreInformation'
// import StoreSocialLinks from './StoreSocialLinks'
// import StoreMetaInfo from './StoreMetaInfo'



// export type Inputs = {
//     store_name: string
//     vendor_name: string
//     selectVendor: { label: string, value: string } | null
//     store_address: string
//     store_phone: string
//     store_email: string
//     short_description: string
//     description: string
//     commission: number
//     facebook_url: string
//     whatsapp_url: string
//     instagram_url: string
//     linkedin_url: string
//     twitter_url: string
//     tiktok_url: string
//     store_meta_title: string
//     store_meta_keywords: string
//     store_meta_descrip: string
// }


// export default function CreateNewStoreFrom() {

//     const {
//         register,
//         handleSubmit,
//         setValue,
//         control,
//         formState: { errors },
//     } = useForm<Inputs>()

//     // const onSubmit:  = (data) => 

//     const onSubmit: SubmitHandler<Inputs> = (data) => {
//         console.log(data)
//     }
//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className='bg-[#f8f9fb] m-3 md:m-10 p-3 md:p-5 border border-[#e4e7eb] rounded-xs space-y-5 '>
//             {/* StoreInformation */}
//             <StoreInformation register={register} errors={errors} setValue={setValue} control={control} />
//             {/* StoreSocialLinks */}
//             <StoreSocialLinks register={register} errors={errors} />
//             {/* StoreMetaInfo */}
//             <StoreMetaInfo register={register} />

//             <div className='text-center'>
//                 <Button variant={'BlueBtn'} type="submit"><Save />Create Vendor</Button>
//             </div>
//         </form>
//     )
// }


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

        // শুধু যেগুলো আছে, সেগুলো পাঠাও
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

            alert('Store created successfully!');
            console.log(res.data);
        } catch (err: any) {
            console.error('Error:', err);
            alert(err.response?.data?.message || 'Failed to create store');
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