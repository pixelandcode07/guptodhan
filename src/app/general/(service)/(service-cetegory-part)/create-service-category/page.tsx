'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import axios from 'axios';

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
import { useSession } from 'next-auth/react';
import UploadImageBtn from '@/components/ReusableComponents/UploadImageBtn';
import { generateSlug } from '@/lib/utils';

// Use the SAME schema as backend (important for consistency)
const createServiceCategoryValidationSchema = z.object({
    name: z.string().min(1, { message: 'Service category name is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    slug: z.string().min(1, { message: 'Slug is required.' }),
    icon_url: z.string().min(1, { message: 'Icon URL is required.' }),
});

type FormData = z.infer<typeof createServiceCategoryValidationSchema>;

export default function CreateServiceCategory() {
    const { data: session, status } = useSession();
    const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(createServiceCategoryValidationSchema),
        defaultValues: {
            name: '',
            description: '',
            slug: '',
            icon_url: '',
        },
    });

    const handleImageChange = (file: File | null) => {
        setUploadedFile(file);

        if (file) {
            const previewUrl = URL.createObjectURL(file);
            form.setValue('icon_url', previewUrl, { shouldValidate: true });
        } else {
            form.setValue('icon_url', '');
        }
    };

    // Auto-generate slug when name changes
    React.useEffect(() => {
        const subscription = form.watch((value, { name: changedField }) => {
            if (changedField === 'name' && value.name) {
                const generatedSlug = value.name
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '');
                form.setValue('slug', generatedSlug, { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    //   const onSubmit = async (data: FormData) => {
    //     if (!uploadedFile) {
    //       toast.error('Please upload an icon image.');
    //       return;
    //     }

    //     if (status === 'loading') return;
    //     if (!session) {
    //       toast.error('You must be logged in.');
    //       return;
    //     }

    //     setIsLoading(true);

    //     const formData = new FormData();
    //     formData.append('name', data.name);
    //     formData.append('description', data.description);
    //     formData.append('slug', data.slug); // backend ignores it, but safe to send
    //     formData.append('icon_url', uploadedFile); // ← Critical: key must be 'icon_url'

    //     try {
    //       const token = (session as any)?.accessToken || (session?.user as any)?.token;

    //       if (!token) {
    //         throw new Error('Authentication token missing');
    //       }

    //       await axios.post('/api/v1/service-section/service-category', formData, {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //           // Let axios set Content-Type with boundary automatically
    //         },
    //       });

    //       toast.success('Service category created successfully!');
    //       form.reset();
    //       setUploadedFile(null);
    //       handleImageChange(null);

    //     } catch (error: any) {
    //       console.error('Submission error:', error);
    //       const message =
    //         error.response?.data?.message ||
    //         error.message ||
    //         'Failed to create service category';

    //       toast.error(message);
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };


    const onSubmit = async (data: FormData) => {
        if (!uploadedFile) {
            toast.error('Please upload an icon image.');
            return;
        }

        if (status === 'loading') return;
        if (!session) {
            toast.error('You must be logged in.');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('slug', data.slug || generateSlug(data.name)); // ← Ensure slug is always sent
        formData.append('icon_url', uploadedFile); // File sent as 'icon_url'

        try {
            const token = (session as any)?.accessToken || (session?.user as any)?.token;

            if (!token) {
                throw new Error('Authentication token missing');
            }

            await axios.post('/api/v1/service-section/service-category', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Service category created successfully!');
            form.reset();
            setUploadedFile(null);
            handleImageChange(null);

        } catch (error: any) {
            console.error('Submission error:', error);
            const message =
                error.response?.data?.message ||
                error.message ||
                'Failed to create service category';

            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading') {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Create Service Category</h1>

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

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea rows={4} placeholder="Describe this category..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug (auto-generated)</FormLabel>
                                <FormControl>
                                    <Input placeholder="web-development" {...field} />
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
                                        value={uploadedFile || form.watch('icon_url')}
                                        onChange={handleImageChange}
                                        onRemove={() => handleImageChange(null)}
                                        fieldName="icon_url"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-6">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full md:w-auto"
                            disabled={isLoading || !uploadedFile}
                        >
                            {isLoading ? 'Creating...' : 'Create Service Category'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}