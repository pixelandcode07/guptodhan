'use client';

import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import StoreInformation from './StoreInformation';
import StoreSocialLinks from './StoreSocialLinks';
import StoreMetaInfo from './StoreMetaInfo';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Inputs } from '@/types/Inputs';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function VendorStoreFrom() {
    const { data: session } = useSession();
    const token = session?.accessToken as string | undefined;
    const vendorId = session?.user?.vendorId as string | undefined;

    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadedStore, setLoadedStore] = useState<any>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>();

    useEffect(() => {
        if (!vendorId || !token) {
            setLoading(false);
            return;
        }

        const loadStoreById = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/v1/vendor-store/vendorId/${vendorId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const store = data.data;
                setLoadedStore(store);
                reset({
                    store_name: store.storeName || '',
                    store_address: store.storeAddress || '',
                    store_phone: store.storePhone || '',
                    store_email: store.storeEmail || '',
                    short_description: store.vendorShortDescription || '',
                    description: store.fullDescription || '',
                    commission: store.commission || 0,
                    logo: store.storeLogo || null,
                    banner: store.storeBanner || null,
                    facebook_url: store.storeSocialLinks?.facebook || '',
                    whatsapp_url: store.storeSocialLinks?.whatsapp || '',
                    instagram_url: store.storeSocialLinks?.instagram || '',
                    linkedin_url: store.storeSocialLinks?.linkedIn || '',
                    twitter_url: store.storeSocialLinks?.twitter || '',
                    tiktok_url: store.storeSocialLinks?.tiktok || '',
                    // store_meta_title: store.storeMetaTitle || '',
                    // store_meta_keywords: Array.isArray(store.storeMetaKeywords)
                    //     ? store.storeMetaKeywords.join(', ')
                    //     : '',
                    store_meta_title: Array.isArray(store.storeMetaTitle)
                        ? store.storeMetaTitle
                        : store.storeMetaTitle
                            ? [store.storeMetaTitle]
                            : [],

                    store_meta_keywords: Array.isArray(store.storeMetaKeywords)
                        ? store.storeMetaKeywords
                        : [],
                    store_meta_description: store.storeMetaDescription || '',
                    selectVendor: {
                        label: store?.storeName || 'My Vendor',
                        value: vendorId,
                    },
                });

                setIsEditMode(true);
                toast.success('Store loaded for editing');
            } catch (err: any) {
                console.error(err);
                toast.error('No existing store found or failed to load');
                setIsEditMode(false);
            } finally {
                setLoading(false);
            }
        };

        loadStoreById();
    }, [vendorId, token, reset]);

    // Step 3: Submit handler (Create or Update)
    const onSubmit: SubmitHandler<Inputs> = async (data) => {

        const formData = new FormData();
        if (!data.selectVendor || !data.selectVendor.value) {
            toast.error("Please select a vendor");
            return;
        }
        formData.append('vendorId', data.selectVendor.value);

        if (data.logo && data.logo instanceof File) {
            formData.append('logo', data.logo);
        }
        if (data.banner && data.banner instanceof File) {
            formData.append('banner', data.banner);
        }


        const fields: Record<string, any> = {
            storeName: data.store_name,
            storeAddress: data.store_address,
            storePhone: data.store_phone,
            storeEmail: data.store_email,
            vendorShortDescription: data.short_description,
            fullDescription: data.description,
            commission: data.commission,
            storeMetaKeywords: data.store_meta_keywords || [],
            storeMetaTitle: data.store_meta_title || [],
            // storeMetaTitle: Array.isArray(data.store_meta_title)
            //     ? data.store_meta_title
            //     : [],
            // storeMetaKeywords: Array.isArray(data.store_meta_keywords)
            //     ? data.store_meta_keywords
            //     : [],

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
            if (isEditMode) {
                // Update
                await axios.patch(`/api/v1/vendor-store/${loadedStore._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success('Store updated successfully!');
            } else {
                // Create
                await axios.post('/api/v1/vendor-store', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success('Store created successfully!');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    // Show loading spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#f8f9fb] m-3 md:m-10 p-6 md:p-10 border border-[#e4e7eb] rounded-lg space-y-8"
        >
            <h1 className="text-2xl font-bold text-center">
                {isEditMode ? 'Update Your Store' : 'Create New Store'}
            </h1>

            <StoreInformation register={register} errors={errors} control={control} />
            <StoreSocialLinks register={register} errors={errors} />
            <StoreMetaInfo register={register} control={control} />

            <div className="text-center pt-6">
                <Button variant="BlueBtn" type="submit" disabled={isSubmitting} size="lg">
                    <Save className="mr-2 h-5 w-5" />
                    {isSubmitting
                        ? 'Saving...'
                        : isEditMode
                            ? 'Update Store'
                            : 'Create Store'}
                </Button>
            </div>
        </form>
    );
}