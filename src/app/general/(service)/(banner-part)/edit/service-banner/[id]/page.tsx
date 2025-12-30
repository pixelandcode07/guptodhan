'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import { IServiceBanner } from '@/types/ServiceBannerType';
import { toast } from 'sonner';
import FancyLoadingPage from '@/app/general/loading';

const editServiceBannerSchema = z.object({
    bannerTitle: z.string().min(1, 'Banner title is required'),
    subTitle: z.string().optional(),
    bannerDescription: z.string().optional(),
    bannerLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    status: z.enum(['active', 'inactive']),
    // bannerImage is handled separately as File or existing URL
});

type FormData = z.infer<typeof editServiceBannerSchema>;

export default function EditServiceBannerPage() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const { data: session, status } = useSession();

    const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isFetching, setIsFetching] = React.useState(true);

    const form = useForm<FormData>({
        resolver: zodResolver(editServiceBannerSchema),
        defaultValues: {
            bannerTitle: '',
            subTitle: '',
            bannerDescription: '',
            bannerLink: '',
            status: 'active',
        },
    });

    const getToken = () => {
        return (session as any)?.accessToken || (session?.user as any)?.token;
    };

    // Fetch existing banner data
    React.useEffect(() => {
        const fetchBanner = async () => {
            if (!id || status === 'loading') return;

            if (!session) {
                toast.error('You must be logged in.');
                router.push('/login');
                return;
            }

            const token = getToken();
            if (!token) {
                toast.error('Authentication token missing');
                return;
            }

            try {
                setIsFetching(true);
                const response = await axios.get(`/api/v1/service-section/service-banner/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const banner: IServiceBanner = response.data.data;

                form.reset({
                    bannerTitle: banner.bannerTitle,
                    subTitle: banner.subTitle || '',
                    bannerDescription: banner.bannerDescription || '',
                    bannerLink: banner.bannerLink || '',
                    status: banner.status,
                });

                setPreviewUrl(banner.bannerImage);
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to load banner');
                router.push('/general/all-service-banner');
            } finally {
                setIsFetching(false);
            }
        };

        fetchBanner();
    }, [id, session, status, form, router]);

    const handleImageChange = (name: string, file: File | null) => {
        setUploadedFile(file);

        // Revoke previous blob URL
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        if (file) {
            const newPreview = URL.createObjectURL(file);
            setPreviewUrl(newPreview);
        } else {
            // Revert to original server URL if no new file
            const originalUrl = form.getValues('bannerLink'); // not used, just placeholder
            const currentServerImage = (document.querySelector('img') as HTMLImageElement)?.src;
            if (previewUrl && previewUrl.startsWith('https://')) {
                setPreviewUrl(previewUrl);
            } else {
                setPreviewUrl('');
            }
        }
    };

    const onSubmit = async (data: FormData) => {
        if (!id || !session) return;

        const token = getToken();
        if (!token) {
            toast.error('Authentication token missing');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('bannerTitle', data.bannerTitle);
        if (data.subTitle) formData.append('subTitle', data.subTitle);
        if (data.bannerDescription) formData.append('bannerDescription', data.bannerDescription);
        if (data.bannerLink) formData.append('bannerLink', data.bannerLink);
        formData.append('status', data.status);

        if (uploadedFile) {
            formData.append('bannerImage', uploadedFile);
        }

        try {
            await axios.patch(`/api/v1/service-section/service-banner/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Service banner updated successfully!');
            router.push('/general/all-service-banner');
        } catch (error: any) {
            console.error('Update error:', error);
            const message =
                error.response?.data?.message ||
                'Failed to update banner';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    // Cleanup blob URLs on unmount
    React.useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    if (status === 'loading' || isFetching) {
        return <FancyLoadingPage />;
    }

    if (!session) {
        return <div className="p-6 text-center text-red-600">Please log in to edit.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Service Banner
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Banner Image */}
                    <FormItem>
                        <FormLabel>Banner Image</FormLabel>
                        <FormControl>
                            <UploadImage
                                name="bannerImage"
                                label="Recommended: 1920×600px"
                                preview={previewUrl}
                                onChange={handleImageChange}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>

                    {/* Banner Title */}
                    <FormField
                        control={form.control}
                        name="bannerTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Banner Title <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Find Trusted Professionals Near You" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Sub Title */}
                    <FormField
                        control={form.control}
                        name="subTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sub Title (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Quick • Reliable • Affordable" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="bannerDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        rows={4}
                                        placeholder="Brief description about the banner..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Banner Link */}
                    <FormField
                        control={form.control}
                        name="bannerLink"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Banner Link (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="https://example.com/promotion"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Status */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Actions */}
                    <div className="flex gap-4 pt-6">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => router.push('/general/all-service-banner')}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}