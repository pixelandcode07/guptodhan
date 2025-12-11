'use client';

import React, { useEffect, useState } from 'react';
import RichTextEditorPage from './RichTextEditorPage';
import { Button } from '@/components/ui/button';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Save } from 'lucide-react'; // X icon removed if not used
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
    
    // 🔥 ১. নতুন স্টেট: ছবি রিমুভ করা হয়েছে কিনা ট্র্যাক করার জন্য
    const [isImageRemoved, setIsImageRemoved] = useState(false);

    // Fetch latest banner
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
                    // ডাটা লোড হলে রিমুভ ফ্ল্যাগ ফলস থাকবে
                    setIsImageRemoved(false); 
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
        // 🔥 ২. যখন রিমুভ করবে, তখন ফ্ল্যাগ true হবে
        setIsImageRemoved(true); 
        toast.success('Image removed from form!');
    };

    // Submit handler
    const onSubmit = async (data: FormValues) => {
        try {
            const formData = new FormData();
            
            if (data.image) {
                formData.append('bannerImage', data.image);
                // যদি নতুন ছবি দেয়, তাহলে isImageRemoved পাঠানোর দরকার নেই (কারণ নতুনটাই রিপ্লেস করবে)
            } 
            
            // 🔥 ৩. যদি ছবি না থাকে এবং রিমুভ করা হয়ে থাকে, তবে ফ্ল্যাগ পাঠাব
            if (!data.image && isImageRemoved) {
                formData.append('isImageRemoved', 'true');
            }

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
            setValue('image', null);
            setIsImageRemoved(false); // ফ্ল্যাগ রিসেট

        } catch (error) {
            console.error('Error saving banner:', error);
            toast.error('Failed to save banner!');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h1 className="text-gray-900 font-semibold">Page Banner:</h1>
            <div className="w-full">
                <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                        <UploadImageBtn
                            value={field.value || existingImage}
                            onChange={(file) => {
                                field.onChange(file);
                                // নতুন ছবি আপলোড করলে রিমুভ ফ্ল্যাগ ফলস করে দিতে হবে
                                setIsImageRemoved(false); 
                            }}
                            onRemove={existingImage ? handleRemoveImage : undefined}
                        />
                    )}
                />
            </div>

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