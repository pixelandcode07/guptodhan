'use client';

import React, { useState, useEffect } from 'react';
import * as z from 'zod';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import CreateBrandPanel from './CreateBrandPanel';
import CreateModelPanel from './CreateModelPanel';
import CreateEditionPanel from './CreateEditionPanel';

export const createBrandSchema = z.object({
    name: z.string().min(1, 'Brand name is required'),
});

export type CreateBrandForm = z.infer<typeof createBrandSchema>;

export const createModelSchema = z.object({
    name: z.string().min(1, 'Model name is required'),
});

export type CreateModelForm = z.infer<typeof createModelSchema>;

export const createEditionSchema = z.object({
    name: z.string().min(1, 'Edition name is required'),
});

export type CreateEditionForm = z.infer<typeof createEditionSchema>;

export interface Brand {
    _id: string;
    name: string;
    logo?: string;
}

export interface Model {
    _id: string;
    name: string;
    brand: string;
}

export interface Edition {
    _id: string;
    name: string;
    productModel: string;
}

export default function BrandModelEditionManagement() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [completed, setCompleted] = useState(false);
    const { data: session } = useSession();
    const token = (session?.user as { accessToken?: string; role?: string })?.accessToken;
    const userRole = (session?.user as { role?: string })?.role;

    const fetchBrands = async () => {
        try {
            const response = await axios.get('/api/v1/public/brands');
            setBrands(response.data.data || []);
        } catch (err) {
            console.error('Error fetching brands');
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleBrandCreated = (newBrand: Brand) => {
        setSelectedBrand(newBrand);
        fetchBrands();
    };

    const handleModelCreated = (newModel: Model) => {
        setSelectedModel(newModel);
    };

    const handleEditionCreated = () => {
        setCompleted(true);
        // Optionally reset selections
        setSelectedModel(null);
        setSelectedBrand(null);
    };

    const activeStep = !selectedBrand ? 'brand' : !selectedModel ? 'model' : 'edition';

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Brand, Model & Edition Management</h1>

            {completed && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>All Brands</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {brands.map((brand) => (
                                <li key={brand._id} className="flex items-center p-3 border rounded-lg">
                                    {brand.logo && (
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 mr-3 rounded"
                                        />
                                    )}
                                    <span className="flex-1">{brand.name}</span>
                                </li>
                            ))}
                        </ul>
                        {brands.length === 0 && <p className="text-gray-500 text-center py-4">No brands found.</p>}
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={activeStep === 'brand' ? 'bg-white' : 'bg-gray-100'}>
                    <CreateBrandPanel
                        brands={brands}
                        selectedBrand={selectedBrand}
                        onBrandSelected={setSelectedBrand}
                        onBrandCreated={handleBrandCreated}
                        token={token}
                        userRole={userRole}
                        fetchBrands={fetchBrands}
                    />
                </div>
                <div className={activeStep === 'model' ? 'bg-white' : 'bg-gray-100'}>
                    <CreateModelPanel
                        selectedBrand={selectedBrand}
                        selectedModel={selectedModel}
                        onModelSelected={setSelectedModel}
                        onModelCreated={handleModelCreated}
                        token={token}
                        userRole={userRole}
                    />
                </div>
                <div className={activeStep === 'edition' ? 'bg-white' : 'bg-gray-100'}>
                    <CreateEditionPanel
                        selectedModel={selectedModel}
                        onEditionCreated={handleEditionCreated}
                        token={token}
                        userRole={userRole}
                    />
                </div>
            </div>
        </div>
    );
}