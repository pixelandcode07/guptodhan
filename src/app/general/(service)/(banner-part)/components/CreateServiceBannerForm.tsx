'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Zod Schema (as provided)
const createServiceBannerValidationSchema = z.object({
    bannerImage: z.instanceof(File).refine((file) => file.size > 0, {
        message: 'Banner image is required',
    }),
    bannerLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    subTitle: z.string().optional(),
    bannerTitle: z.string().min(1, 'Banner title is required'),
    bannerDescription: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
});

type FormValues = z.infer<typeof createServiceBannerValidationSchema>;

export default function CreateServiceBannerForm() {
    const session = useSession()
    const token = (session as any)?.accessToken;
    const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(createServiceBannerValidationSchema),
        defaultValues: {
            status: 'active',
        },
    });

    const handleImageChange = (name: string, file: File | null) => {
        if (file) {
            setValue('bannerImage', file, { shouldValidate: true });
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setValue('bannerImage', undefined as any);
            setPreviewImage(undefined);
        }
    };

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);

        try {
            const formData = new FormData();

            formData.append('bannerImage', data.bannerImage);
            formData.append('bannerTitle', data.bannerTitle);
            if (data.subTitle) formData.append('subTitle', data.subTitle);
            if (data.bannerDescription) formData.append('bannerDescription', data.bannerDescription);
            if (data.bannerLink) formData.append('bannerLink', data.bannerLink);
            if (data.status) formData.append('status', data.status);

            await axios.post('/api/v1/service-section/service-banner', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Banner Created Successfully!', {
                description: 'Your service banner has been added.',
            });
            reset();
            router.push('/general/all-service-banner');
            setPreviewImage(undefined);
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                'Failed to create banner. Please try again.';

            toast.error('Error', {
                description: message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Create Service Banner
                    </CardTitle>
                    <CardDescription>
                        Add a new promotional banner for the service section
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Banner Image Upload */}
                        <div>
                            <Label>Banner Image <span className="text-red-500">*</span></Label>
                            <div className="mt-2">
                                <UploadImage
                                    name="bannerImage"
                                    label="Upload banner image (recommended: 1920x600)"
                                    preview={previewImage}
                                    onChange={handleImageChange}
                                />
                                {errors.bannerImage && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.bannerImage.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Banner Title */}
                        <div>
                            <Label htmlFor="bannerTitle">
                                Banner Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="bannerTitle"
                                {...register('bannerTitle')}
                                placeholder="e.g. Find Trusted Professionals Near You"
                                className="mt-1"
                            />
                            {errors.bannerTitle && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.bannerTitle.message}
                                </p>
                            )}
                        </div>

                        {/* Sub Title */}
                        <div>
                            <Label htmlFor="subTitle">Sub Title (Optional)</Label>
                            <Input
                                id="subTitle"
                                {...register('subTitle')}
                                placeholder="e.g. Quick • Reliable • Affordable"
                                className="mt-1"
                            />
                        </div>

                        {/* Banner Description */}
                        <div>
                            <Label htmlFor="bannerDescription">Description (Optional)</Label>
                            <Textarea
                                id="bannerDescription"
                                {...register('bannerDescription')}
                                rows={4}
                                placeholder="Brief description about the services..."
                                className="mt-1 resize-none"
                            />
                        </div>

                        {/* Banner Link */}
                        <div>
                            <Label htmlFor="bannerLink">Banner Link (Optional)</Label>
                            <Input
                                id="bannerLink"
                                type="url"
                                {...register('bannerLink')}
                                placeholder="https://example.com/services"
                                className="mt-1"
                            />
                            {errors.bannerLink && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.bannerLink.message}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select
                                onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}
                                defaultValue="active"
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full md:w-auto px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                {isSubmitting ? 'Creating Banner...' : 'Create Banner'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}