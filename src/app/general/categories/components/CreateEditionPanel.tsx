// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import axios from 'axios';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useSession } from 'next-auth/react';

// const createEditionSchema = z.object({
//     name: z.string().min(1, 'Edition name is required'),
// });

// type CreateEditionForm = z.infer<typeof createEditionSchema>;

// interface Edition {
//     _id: string;
//     name: string;
//     productModel: string;
// }

// interface Model {
//     _id: string;
//     name: string;
//     brand: string;
// }

// interface CreateEditionProps {
//     selectedModel: Model;
// }

// export default function CreateEdition({ selectedModel }: CreateEditionProps) {
//     const [editions, setEditions] = useState<Edition[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const { data: session } = useSession()
//     const token = (session?.user as { accessToken?: string; role?: string })?.accessToken
//     const userRole = (session?.user as { role?: string })?.role

//     const form = useForm<CreateEditionForm>({
//         resolver: zodResolver(createEditionSchema),
//         defaultValues: {
//             name: '',
//         },
//     });

//     // Fetch editions by model ID
//     const fetchEditionsByModel = async (modelId: string) => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`/api/v1/editions?modelId=${modelId}`);
//             setEditions(response.data.data || []);
//         } catch (err) {
//             setError('Error fetching editions');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Create Edition
//     const onSubmit = async (data: CreateEditionForm) => {
//         if (!selectedModel) return;

//         setLoading(true);
//         try {
//             await axios.post("/api/v1/editions", { name: data.name, productModel: selectedModel._id }, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                     "x-user-role": userRole,
//                 },
//             });
//             form.reset();
//             fetchEditionsByModel(selectedModel._id); // Refresh editions
//             setError(null);
//         } catch (err) {
//             setError('Error creating edition');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchEditionsByModel(selectedModel._id);
//     }, [selectedModel]);

//     if (loading && editions.length === 0) return <div>Loading editions...</div>;
//     if (error) return <div className="text-red-500">Error: {error}</div>;

//     return (
//         <Card className="mt-6">
//             <CardHeader>
//                 <CardTitle>Editions for {selectedModel.name}</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 {/* Create Edition Form */}
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6 p-4 border rounded-lg">
//                     <div>
//                         <Input
//                             {...form.register('name')}
//                             placeholder="Edition Name"
//                             className="w-full"
//                         />
//                         {form.formState.errors.name && (
//                             <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
//                         )}
//                     </div>
//                     <Button type="submit" className="w-full" disabled={loading}>
//                         {loading ? 'Creating...' : 'Create Edition'}
//                     </Button>
//                 </form>

//                 {/* Editions List */}
//                 <ul className="space-y-2">
//                     {editions.map((edition) => (
//                         <li key={edition._id} className="flex items-center p-3 border rounded-lg">
//                             <span className="flex-1">{edition.name}</span>
//                         </li>
//                     ))}
//                 </ul>
//                 {editions.length === 0 && <p className="text-gray-500 text-center py-4">No editions found.</p>}
//             </CardContent>
//         </Card>
//     );
// };

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreateEditionForm, createEditionSchema, Edition, Model } from './BrandModelEditionManagement';
import { useEffect, useState } from 'react';


interface CreateEditionPanelProps {
    selectedModel: Model | null;
    onEditionCreated: () => void;
    token: string | undefined;
    userRole: string | undefined;
}

export default function CreateEditionPanel({
    selectedModel,
    onEditionCreated,
    token,
    userRole,
}: CreateEditionPanelProps) {
    const [editions, setEditions] = useState<Edition[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<CreateEditionForm>({
        resolver: zodResolver(createEditionSchema),
        defaultValues: {
            name: '',
        },
    });

    const fetchEditionsByModel = async (modelId: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/v1/editions?modelId=${modelId}`);
            setEditions(response.data.data || []);
        } catch (err) {
            setError('Error fetching editions');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: CreateEditionForm) => {
        if (!selectedModel) return;

        setLoading(true);
        try {
            await axios.post("/api/v1/editions", { name: data.name, productModel: selectedModel._id }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "x-user-role": userRole,
                },
            });
            form.reset();
            await fetchEditionsByModel(selectedModel._id);
            onEditionCreated();
            setError(null);
        } catch (err) {
            setError('Error creating edition');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedModel) {
            fetchEditionsByModel(selectedModel._id);
        }
    }, [selectedModel]);

    if (!selectedModel) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Editions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500 text-center py-4">Select a model first</p>
                </CardContent>
            </Card>
        );
    }

    if (loading && editions.length === 0) return <div>Loading editions...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Editions for {selectedModel.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6 p-4 border rounded-lg">
                    <div>
                        <Input
                            {...form.register('name')}
                            placeholder="Edition Name"
                            className="w-full"
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Edition'}
                    </Button>
                </form>

                <ul className="space-y-2">
                    {editions.map((edition) => (
                        <li key={edition._id} className="flex items-center p-3 border rounded-lg">
                            <span className="flex-1">{edition.name}</span>
                        </li>
                    ))}
                </ul>
                {editions.length === 0 && <p className="text-gray-500 text-center py-4">No editions found.</p>}
            </CardContent>
        </Card>
    );
}