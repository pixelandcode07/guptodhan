'use client';

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import axios from 'axios';

// --- Type Definitions ---
interface Brand { _id: string; name: string; status: 'active' | 'inactive'; }
interface Model { _id: string; name: string; status: 'active' | 'inactive'; brand: string; }

interface BrandModelSelectionProps {
    formData: { brand: string; model: string; };
    handleInputChange: (field: string, value: string) => void;
    brands: Brand[];
}

export default function BrandModelSelection({ formData, handleInputChange, brands = [] }: BrandModelSelectionProps) {
    const [models, setModels] = useState<Model[]>([]);
    const [loadingModels, setLoadingModels] = useState(false);

    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    // Fetch models when brand changes
    useEffect(() => {
        const fetchModelsByBrand = async (brandId: string) => {
            if (!brandId || !token) return;
            setLoadingModels(true);
            try {
                const res = await axios.get(`/api/v1/product-config/modelName?brandId=${brandId}`, { headers: { Authorization: `Bearer ${token}` } });
                setModels(res.data?.data?.filter((m: Model) => m.status === 'active') || []);
            } catch (error) { console.error('Failed to fetch models:', error); } 
            finally { setLoadingModels(false); }
        };

        if (formData.brand) {
            fetchModelsByBrand(formData.brand);
        }
    }, [formData.brand, token]);

    // ✅ FIX: Reset logic is moved here
    const handleBrandChange = (value: string) => {
        handleInputChange('brand', value);
        handleInputChange('model', ''); // Reset model when brand changes
        setModels([]);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">Brand & Model Selection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <Label>Brand</Label>
                    <Select value={formData.brand} onValueChange={handleBrandChange} disabled={!brands}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder={!brands ? "Loading..." : "Select Brand"} /></SelectTrigger>
                        <SelectContent>
                            {brands?.map((brand) => (<SelectItem key={brand._id} value={brand._id}>{brand.name}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Model</Label>
                    <Select value={formData.model} onValueChange={(v) => handleInputChange('model', v)} disabled={!formData.brand || loadingModels}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder={!formData.brand ? "Select brand first" : loadingModels ? "Loading..." : "Select Model"} /></SelectTrigger>
                        <SelectContent>
                            {models.map((model) => (<SelectItem key={model._id} value={model._id}>{model.name}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}