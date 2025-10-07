// 'use client';

import { useEffect, useState } from "react";
import { Brand, CreateModelForm, createModelSchema, Model } from "./BrandModelEditionManagement";

// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import axios from 'axios';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useSession } from 'next-auth/react';
// import CreateEdition from './CreateEdition';

// const createModelSchema = z.object({
//     name: z.string().min(1, 'Model name is required'),
// });

// type CreateModelForm = z.infer<typeof createModelSchema>;

// interface Model {
//     _id: string;
//     name: string;
//     brand: string;
// }

// interface Brand {
//     _id: string;
//     name: string;
//     logo?: string;
// }

// interface CreateModelProps {
//     selectedBrand: Brand;
// }

// export default function CreateModel({ selectedBrand }: CreateModelProps) {
//     const [models, setModels] = useState<Model[]>([]);
//     const [selectedModel, setSelectedModel] = useState<Model | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const { data: session } = useSession()
//     const token = (session?.user as { accessToken?: string; role?: string })?.accessToken
//     const userRole = (session?.user as { role?: string })?.role

//     const form = useForm<CreateModelForm>({
//         resolver: zodResolver(createModelSchema),
//         defaultValues: {
//             name: '',
//         },
//     });

//     // Fetch models by brand ID
//     const fetchModelsByBrand = async (brandId: string) => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`/api/v1/product-models?brandId=${brandId}`);
//             setModels(response.data.data || []);
//         } catch (err) {
//             setError('Error fetching models');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Create Model
//     const onSubmit = async (data: CreateModelForm) => {
//         if (!selectedBrand) return;

//         setLoading(true);
//         try {
//             await axios.post("/api/v1/product-models", { name: data.name, brand: selectedBrand._id }, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                     "x-user-role": userRole,
//                 },
//             });
//             form.reset();
//             fetchModelsByBrand(selectedBrand._id); // Refresh models
//             setError(null);
//         } catch (err) {
//             setError('Error creating model');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchModelsByBrand(selectedBrand._id);
//     }, [selectedBrand]);

//     const handleModelClick = (model: Model) => {
//         setSelectedModel(model);
//     };

//     if (loading && models.length === 0) return <div>Loading models...</div>;
//     if (error) return <div className="text-red-500">Error: {error}</div>;

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Models for {selectedBrand.name}</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 {/* Create Model Form */}
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6 p-4 border rounded-lg">
//                     <div>
//                         <Input
//                             {...form.register('name')}
//                             placeholder="Model Name"
//                             className="w-full"
//                         />
//                         {form.formState.errors.name && (
//                             <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
//                         )}
//                     </div>
//                     <Button type="submit" className="w-full" disabled={loading}>
//                         {loading ? 'Creating...' : 'Create Model'}
//                     </Button>
//                 </form>

//                 {/* Models List */}
//                 <ul className="space-y-2">
//                     {models.map((model) => (
//                         <li key={model._id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handleModelClick(model)}>
//                             <span className="flex-1 cursor-pointer hover:underline">{model.name}</span>
//                             {selectedModel?._id === model._id && <span className="text-sm text-blue-500 ml-2">Selected</span>}
//                         </li>
//                     ))}
//                 </ul>
//                 {models.length === 0 && <p className="text-gray-500 text-center py-4">No models found.</p>}

//                 {/* Editions Section */}
//                 {selectedModel && <CreateEdition selectedModel={selectedModel} />}
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



interface CreateModelPanelProps {
    selectedBrand: Brand | null;
    selectedModel: Model | null;
    onModelSelected: (model: Model) => void;
    onModelCreated: (newModel: Model) => void;
    token: string | undefined;
    userRole: string | undefined;
}

export default function CreateModelPanel({
    selectedBrand,
    selectedModel,
    onModelSelected,
    onModelCreated,
    token,
    userRole,
}: CreateModelPanelProps) {
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<CreateModelForm>({
        resolver: zodResolver(createModelSchema),
        defaultValues: {
            name: '',
        },
    });

    const fetchModelsByBrand = async (brandId: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/v1/product-models?brandId=${brandId}`);
            setModels(response.data.data || []);
        } catch (err) {
            setError('Error fetching models');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: CreateModelForm) => {
        if (!selectedBrand) return;

        setLoading(true);
        try {
            const res = await axios.post("/api/v1/product-models", { name: data.name, brand: selectedBrand._id }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "x-user-role": userRole,
                },
            });
            const newModel = res.data.data;
            form.reset();
            await fetchModelsByBrand(selectedBrand._id);
            onModelCreated(newModel);
            setError(null);
        } catch (err) {
            setError('Error creating model');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedBrand) {
            fetchModelsByBrand(selectedBrand._id);
        }
    }, [selectedBrand]);

    if (!selectedBrand) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Models</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500 text-center py-4">Select a brand first</p>
                </CardContent>
            </Card>
        );
    }

    if (loading && models.length === 0) return <div>Loading models...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Models for {selectedBrand.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6 p-4 border rounded-lg">
                    <div>
                        <Input
                            {...form.register('name')}
                            placeholder="Model Name"
                            className="w-full"
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Model'}
                    </Button>
                </form>

                <ul className="space-y-2">
                    {models.map((model) => (
                        <li
                            key={model._id}
                            className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                            onClick={() => onModelSelected(model)}
                        >
                            <span className="flex-1 cursor-pointer hover:underline">{model.name}</span>
                            {selectedModel?._id === model._id && <span className="text-sm text-blue-500 ml-2">Selected</span>}
                        </li>
                    ))}
                </ul>
                {models.length === 0 && <p className="text-gray-500 text-center py-4">No models found.</p>}
            </CardContent>
        </Card>
    );
}