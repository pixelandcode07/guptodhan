'use client';

import React, { useEffect, useState } from 'react';
import RichTextEditorPage from './RichTextEditorPage';
import { Button } from '@/components/ui/button';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import UploadImageBtn from '@/components/ReusableComponents/UploadImageBtn';

type FormValues = {
    image: File | null;
    description: string;
};

export default function BuySellConfigPage() {
    const { data: session } = useSession();
    const token = session?.accessToken;
    const adminRole = session?.user?.role === 'admin';

    const { handleSubmit, control, setValue } = useForm<FormValues>({
        defaultValues: { image: null, description: '' },
    });

    const [latestBannerId, setLatestBannerId] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);

    // Fetch latest banner and prefill form
    useEffect(() => {
        async function fetchLatestBanner() {
            if (!token) return;
            try {
                const res = await axios.get('/api/v1/public/classifieds-banners', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const banners = res.data.data;
                if (banners.length > 0) {
                    const latest = banners[banners.length - 1];
                    setLatestBannerId(latest._id);
                    setExistingImage(latest.bannerImage);
                    setValue('description', latest.bannerDescription);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        }

        fetchLatestBanner();
    }, [token, setValue]);

    // Remove image locally
    const handleRemoveImage = () => {
        setExistingImage(null);
        setValue('image', null);
        toast.success('Image removed from form!');
    };

    // Submit handler: Create or Update
    const onSubmit = async (data: FormValues) => {
        try {
            const formData = new FormData();
            if (data.image) formData.append('bannerImage', data.image);
            formData.append('bannerDescription', data.description);

            let res;

            if (latestBannerId) {
                // PATCH update
                res = await axios.patch(
                    `/api/v1/classifieds-banners/${latestBannerId}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                            'x-user-role': adminRole,
                        },
                    }
                );
                toast.success('Banner updated!');
            } else {
                // POST create
                res = await axios.post('/api/v1/classifieds-banners', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                        'x-user-role': adminRole,
                    },
                });
                setLatestBannerId(res.data.data._id);
                toast.success('Banner created!');
            }

            // Update form with latest saved data
            setExistingImage(res.data.data.bannerImage);
            setValue('description', res.data.data.bannerDescription);
            setValue('image', null); // clear file input
        } catch (error) {
            console.error('Error saving banner:', error);
            toast.error('Failed to save banner!');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <h1 className="text-gray-900 font-semibold">Page Banner:</h1>
            <div className="w-full">
                <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                        <UploadImageBtn
                            value={field.value || existingImage}
                            onChange={field.onChange}
                            onRemove={existingImage ? handleRemoveImage : undefined}
                        />
                    )}
                />
            </div>

            {/* Description */}
            <h1 className="text-gray-900 font-semibold">Page Description:</h1>
            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <RichTextEditorPage value={field.value} onChange={field.onChange} />
                )}
            />

            <div className="text-center">
                <Button type="submit" variant="BlueBtn">
                    <Save /> Save Info
                </Button>
            </div>
        </form>
    );
}
