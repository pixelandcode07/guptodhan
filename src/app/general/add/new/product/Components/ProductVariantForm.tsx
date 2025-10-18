'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

// ডেটার টাইপগুলো ডিফাইন করা
interface DropdownOption {
    _id: string;
    name?: string;
    warrantyName?: string;
    deviceCondition?: string; // ✅ পরিবর্তন: নতুন ফিল্ড যোগ করা হয়েছে
    colorName?: string;
    ram?: string;
    rom?: string;
}

export interface IProductOption {
    id: number;
    image?: File | null;
    imageUrl?: string;
    color?: string;
    size?: string;
    storage?: string;
    simType?: string;
    condition?: string;
    warranty?: string;
    stock: number;
    price: number;
    discountPrice?: number;
}

// Props এর ইন্টারফেস ডিফাইন করা
interface ProductVariantFormProps {
    variants: IProductOption[];
    setVariants: React.Dispatch<React.SetStateAction<IProductOption[]>>;
    variantData: {
        warranties: DropdownOption[];
        conditions: DropdownOption[];
        simTypes: DropdownOption[];
        colors: DropdownOption[];
        sizes: DropdownOption[];
        storageTypes: DropdownOption[];
    };
}

export default function ProductVariantForm({ variants, setVariants, variantData }: ProductVariantFormProps) {
    
    const handleVariantChange = (index: number, field: keyof IProductOption, value: any) => {
        const updatedVariants = [...variants];
        updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        setVariants(updatedVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { id: Date.now(), stock: 0, price: 0 }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    return (
        <div className="border p-4 rounded-lg bg-gray-50/50">
            <p className="text-red-500 text-sm mb-4 text-center font-semibold">Product Variant (Insert the Base Variant First)</p>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Image</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Color</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Size</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Storage</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">SIM Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Condition</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Warranty</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Stock*</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price*</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {variants.map((variant, index) => (
                            <tr key={variant.id} className="border-b">
                                <td className="p-2"><Input type="file" className="w-32" onChange={(e) => handleVariantChange(index, 'image', e.target.files?.[0] ?? null)} /></td>
                                
                                <td className="p-2 min-w-[120px]">
                                    <Select onValueChange={(v) => handleVariantChange(index, 'color', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select Color"/></SelectTrigger>
                                        <SelectContent>
                                            {/* ✅ পরিবর্তন: c.colorName ব্যবহার করা হয়েছে */}
                                            {variantData?.colors?.map(c => <SelectItem key={c._id} value={c._id}>{c.colorName}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </td>

                                <td className="p-2 min-w-[120px]">
                                    <Select onValueChange={(v) => handleVariantChange(index, 'size', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select Size"/></SelectTrigger>
                                        <SelectContent>
                                            {variantData?.sizes?.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </td>

                                <td className="p-2 min-w-[150px]">
                                    <Select onValueChange={(v) => handleVariantChange(index, 'storage', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select Storage"/></SelectTrigger>
                                        <SelectContent>
                                            {/* ✅ পরিবর্তন: `${st.ram} / ${st.rom}` ব্যবহার করা হয়েছে */}
                                            {variantData?.storageTypes?.map(st => <SelectItem key={st._id} value={st._id}>{`${st.ram} / ${st.rom}`}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </td>
                                
                                <td className="p-2 min-w-[120px]">
                                    <Select onValueChange={(v) => handleVariantChange(index, 'simType', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select SIM"/></SelectTrigger>
                                        <SelectContent>
                                            {variantData?.simTypes?.map(sim => <SelectItem key={sim._id} value={sim._id}>{sim.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </td>

                                <td className="p-2 min-w-[120px]">
                                    <Select onValueChange={(v) => handleVariantChange(index, 'condition', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select Condition"/></SelectTrigger>
                                        <SelectContent>
                                            {/* ✅ পরিবর্তন: cond.deviceCondition ব্যবহার করা হয়েছে */}
                                            {variantData?.conditions?.map(cond => <SelectItem key={cond._id} value={cond._id}>{cond.deviceCondition}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </td>

                                <td className="p-2 min-w-[120px]">
                                    <Select onValueChange={(v) => handleVariantChange(index, 'warranty', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select Warranty"/></SelectTrigger>
                                        <SelectContent>
                                            {/* ✅ পরিবর্তন: w.warrantyName ব্যবহার করা হয়েছে */}
                                            {variantData?.warranties?.map(w => <SelectItem key={w._id} value={w._id}>{w.warrantyName}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </td>
                                
                                <td className="p-2"><Input type="number" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))} required /></td>
                                <td className="p-2"><Input type="number" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))} required /></td>
                                <td className="p-2 text-center">
                                    <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => removeVariant(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-center">
                <Button type="button" className="bg-teal-500 hover:bg-teal-600 text-white" onClick={addVariant}>+ Add Another Variant</Button>
            </div>
        </div>
    );
}