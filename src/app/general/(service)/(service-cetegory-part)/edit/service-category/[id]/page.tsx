'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react'; // added

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import UploadImageBtn from '@/components/ReusableComponents/UploadImageBtn';
import { IServiceCategory } from '@/types/ServiceCategoryType';
import { toast } from 'sonner';
import FancyLoadingPage from '@/app/general/loading';

const editServiceCategorySchema = z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    icon_url: z.string().min(1, { message: 'Please upload an icon.' }),
});

type FormData = z.infer<typeof editServiceCategorySchema>;

export default function ServiceCategoryEditPage() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const { data: session, status } = useSession();

    const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isFetching, setIsFetching] = React.useState(true);

    const form = useForm<FormData>({
        resolver: zodResolver(editServiceCategorySchema),
        defaultValues: {
            name: '',
            description: '',
            icon_url: '',
        },
    });

    const getToken = () => {
        return (session as any)?.accessToken || (session?.user as any)?.token;
    };

    // Fetch existing category data
    React.useEffect(() => {
        const fetchCategory = async () => {
            if (!id || status === 'loading') return;

            if (!session) {
                toast.error('You must be logged in.');
                router.push('/');
                return;
            }

            const token = getToken();
            if (!token) {
                toast.error('Authentication token missing');
                return;
            }

            try {
                setIsFetching(true);
                const response = await axios.get(`/api/v1/service-section/service-category/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const category: IServiceCategory = response.data.data;

                form.reset({
                    name: category.name,
                    description: category.description,
                    icon_url: category.icon_url,
                });

                setPreviewUrl(category.icon_url);
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to load category');
                router.push('/general/all-service-category');
            } finally {
                setIsFetching(false);
            }
        };

        fetchCategory();
    }, [id, session, status, form, router]);

    // Slug preview when name changes
    const generatedSlug = form.watch('name')
        ? form
            .watch('name')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '')
        : '';

    const handleImageChange = (file: File | null) => {
        setUploadedFile(file);

        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        if (file) {
            const newPreview = URL.createObjectURL(file);
            setPreviewUrl(newPreview);
            form.setValue('icon_url', newPreview, { shouldValidate: true });
        } else {
            const originalUrl = form.getValues('icon_url');
            if (originalUrl && originalUrl.startsWith('https://')) {
                setPreviewUrl(originalUrl);
                form.setValue('icon_url', originalUrl);
            } else {
                setPreviewUrl('');
                form.setValue('icon_url', '');
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
        formData.append('name', data.name);
        formData.append('description', data.description);

        if (uploadedFile) {
            formData.append('icon_url', uploadedFile);
        }

        try {
            await axios.patch(`/api/v1/service-section/service-category/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Service category updated successfully!');
            router.push('/general/all-service-category');
        } catch (error: any) {
            console.error('Update error:', error);
            const message =
                error.response?.data?.message ||
                'Failed to update service category';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    // Cleanup blob URLs
    React.useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    if (status === 'loading' || isFetching) {
        return <FancyLoadingPage />
    }

    if (!session) {
        return <div className="p-6 text-center text-red-600">Please log in to edit.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Edit Service Category</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Web Development" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {generatedSlug ? (
                        <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Slug (auto-generated):</span>{' '}
                            <code className="bg-muted px-2 py-1 rounded ml-2">{generatedSlug}</code>
                        </div>
                    ) : null}

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        rows={4}
                                        placeholder="Describe this category..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="icon_url"
                        render={() => (
                            <FormItem>
                                <FormLabel>Category Icon</FormLabel>
                                <FormControl>
                                    <UploadImageBtn
                                        value={uploadedFile || previewUrl}
                                        onChange={handleImageChange}
                                        onRemove={() => handleImageChange(null)}
                                        fieldName="icon_url"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-6 flex gap-4">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => router.push('/general/all-service-category')}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}