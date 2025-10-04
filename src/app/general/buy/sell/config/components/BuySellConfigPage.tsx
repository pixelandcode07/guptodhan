'use client';

import React from 'react'
import RichTextEditorPage from './RichTextEditorPage'
import UploadImageBtn from './UploadImageBtn'
import { Button } from '@/components/ui/button'
import { Controller, useForm } from 'react-hook-form'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

type FormValues = {
    image: File | null
    description: string
}

export default function BuySellConfigPage() {
    const { data: session } = useSession();
    const token = session?.accessToken;
    const adminRole = session?.user?.role === 'admin'
    const { handleSubmit, control } = useForm<FormValues>({
        defaultValues: {
            image: null,
            description: '',
        },
    })


    const onSubmit = async (data: FormValues) => {
        try {
            const formData = new FormData();
            if (data.image) {
                formData.append("bannerImage", data.image);
            }
            formData.append("bannerDescription", data.description);

            const res = await axios.post("/api/v1/classifieds-banners", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`, // attach token
                    "x-user-role": adminRole
                },
            });
            toast.success("Banner created!", {
                // description: "Saved successfully!",
                // className: "text-yellow-300 bg-gray-800",
                position: "top-center",
            });
            console.log("✅ Banner created successfully:", res.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("❌ Error creating banner:", error.response?.data || error.message);
            } else {
                console.error("❌ Error creating banner:", error);
            }
            toast.error(
                typeof error === "object" && error !== null && "message" in error
                    ? (error as { message: string }).message
                    : "An error occurred"
            );
        }
    };



    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            {/* <div className="space-y-5 md:flex md:gap-30"> */}
                <h1 className="text-gray-900 font-semibold ">Page Banner: </h1>
                <div className='w-full'>
                    <Controller
                        name="image"
                        control={control}
                        render={({ field }) => (
                            <UploadImageBtn value={field.value} onChange={field.onChange} />
                        )}
                    />
                </div>
            {/* </div> */}

            {/* Rich Text */}
            {/* <div className="space-y-5 md:flex md:gap-30"> */}
                <h1 className="text-gray-900 font-semibold ">Page Description: </h1>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditorPage value={field.value} onChange={field.onChange} />
                    )}
                />
            {/* </div> */}
            <div className='text-center'>
                <Button type="submit" variant={'BlueBtn'}><Save />Save Info</Button>
            </div>

        </form>
    )
}
