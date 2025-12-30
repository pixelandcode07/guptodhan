'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { toast } from 'sonner';
import FancyLoadingPage from '@/app/general/loading';
import { useRouter } from 'next/navigation';

const createServiceCategoryValidationSchema = z.object({
    name: z.string().min(1, { message: 'Service category name is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    icon_url: z.string().min(1, { message: 'Please upload an icon image.' }), // preview URL থাকলে pass হবে
});

type FormData = z.infer<typeof createServiceCategoryValidationSchema>;

export default function CreateServiceCategory() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [previewUrl, setPreviewUrl] = React.useState<string>('');

    const form = useForm<FormData>({
        resolver: zodResolver(createServiceCategoryValidationSchema),
        defaultValues: {
            name: '',
            description: '',
            icon_url: '',
        },
    });

    const generatedSlug = form.watch('name')
        ? form.watch('name')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '')
        : '';

    const handleImageChange = (file: File | null) => {
        setUploadedFile(file);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        if (file) {
            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewUrl(newPreviewUrl);
            form.setValue('icon_url', newPreviewUrl, { shouldValidate: true });
        } else {
            setPreviewUrl('');
            form.setValue('icon_url', '');
        }
    };

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
        formData.append('icon_url', uploadedFile);

        try {
            const token = (session as any)?.accessToken || (session?.user as any)?.token;

            if (!token) {
                throw new Error('Authentication token missing');
            }

            await axios.post('/api/v1/service-section/service-category', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Service category created successfully!');
            // router.push('/general/(service)/(service-cetegory-part)/all-service-category');
            router.push('/general/all-service-category');
            form.reset();
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

    React.useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    if (status === 'loading') {
        return <FancyLoadingPage />
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className='py-5'>
                <h1 className="text-3xl font-bold border-l-2 border-blue-500">
                    <span className="pl-5">Create Service Category</span>
                </h1>
            </div>

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

                    {/* Slug Preview - Read only */}
                    {generatedSlug ? (
                        <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Slug (auto-generated):</span>{' '}
                            <code className="bg-muted px-2 py-1 rounded">{generatedSlug}</code>
                        </div>
                    ) : null}

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