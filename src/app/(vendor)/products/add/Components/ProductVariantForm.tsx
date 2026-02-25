'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

interface DropdownOption {
    _id: string;
    name?: string;
    warrantyName?: string;
    deviceCondition?: string;
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

// ✅ empty string কে undefined বানায় — Shadcn Select placeholder দেখানোর জন্য
const toSelectValue = (value?: string): string | undefined =>
    value && value.trim() !== '' ? value.trim() : undefined;

export default function ProductVariantForm({ variants, setVariants, variantData }: ProductVariantFormProps) {

    const handleVariantChange = (index: number, field: keyof IProductOption, value: string | number | File | null) => {
        const updatedVariants = [...variants];
        updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        setVariants(updatedVariants);
    };

    const addVariant = () => {
        setVariants([...variants, {
            id: Date.now(),
            stock: 0,
            price: 0,
            color: '',
            size: '',
            storage: '',
            simType: '',
            condition: '',
            warranty: '',
            discountPrice: 0,
        }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    return (
        <div className="border p-4 rounded-lg bg-gray-50/50">
            <div className="mb-4">
                <p className="text-blue-600 text-sm font-semibold text-center">Product Variants</p>
                <p className="text-gray-600 text-xs text-center mt-1">Add different variations of your product (color, size, storage, etc.)</p>
            </div>
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
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Discount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {variants.map((variant, index) => (
                            <tr key={variant.id} className="border-b">
                                {/* Image */}
                                <td className="p-2">
                                    <div className="flex flex-col gap-1">
                                        {variant.imageUrl && !variant.image && (
                                            <div className="relative w-10 h-10 rounded overflow-hidden border">
                                                <Image src={variant.imageUrl} alt="variant" fill className="object-cover" sizes="40px" />
                                            </div>
                                        )}
                                        <Input
                                            type="file"
                                            className="w-32"
                                            accept="image/*"
                                            onChange={(e) => handleVariantChange(index, 'image', e.target.files?.[0] ?? null)}
                                        />
                                    </div>
                                </td>

                                {/* ✅ Color — value prop দিয়ে edit mode-এ prefill */}
                                <td className="p-2 min-w-[130px]">
                                    <Select
                                        value={toSelectValue(variant.color)}
                                        onValueChange={(v) => handleVariantChange(index, 'color', v)}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Color" /></SelectTrigger>
                                        <SelectContent>
                                            {variantData?.colors?.map(c => (
                                                <SelectItem key={c._id} value={c._id}>{c.colorName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </td>

                                {/* ✅ Size */}
                                <td className="p-2 min-w-[120px]">
                                    <Select
                                        value={toSelectValue(variant.size)}
                                        onValueChange={(v) => handleVariantChange(index, 'size', v)}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Size" /></SelectTrigger>
                                        <SelectContent>
                                            {variantData?.sizes?.map(s => (
                                                <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </td>

                                {/* ✅ Storage */}
                                <td className="p-2 min-w-[150px]">
                                    <Select
                                        value={toSelectValue(variant.storage)}
                                        onValueChange={(v) => handleVariantChange(index, 'storage', v)}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Storage" /></SelectTrigger>
                                        <SelectContent>
                                            {variantData?.storageTypes?.map(st => (
                                                <SelectItem key={st._id} value={st._id}>
                                                    {st.ram && st.rom ? `${st.ram} / ${st.rom}` : st.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </td>

                                {/* ✅ SIM Type */}
                                <td className="p-2 min-w-[130px]">
                                    <Select
                                        value={toSelectValue(variant.simType)}
                                        onValueChange={(v) => handleVariantChange(index, 'simType', v)}
                                    >
                                        <SelectTrigger><SelectValue placeholder="SIM" /></SelectTrigger>
                                        <SelectContent>
                                            {variantData?.simTypes?.length > 0
                                                ? variantData.simTypes.map(sim => (
                                                    <SelectItem key={sim._id} value={sim._id}>{sim.name}</SelectItem>
                                                ))
                                                : <div className="p-3 text-sm text-gray-500">No SIM types available</div>
                                            }
                                        </SelectContent>
                                    </Select>
                                </td>

                                {/* ✅ Condition */}
                                <td className="p-2 min-w-[130px]">
                                    <Select
                                        value={toSelectValue(variant.condition)}
                                        onValueChange={(v) => handleVariantChange(index, 'condition', v)}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Condition" /></SelectTrigger>
                                        <SelectContent>
                                            {variantData?.conditions?.map(cond => (
                                                <SelectItem key={cond._id} value={cond._id}>{cond.deviceCondition}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </td>

                                {/* ✅ Warranty */}
                                <td className="p-2 min-w-[130px]">
                                    <Select
                                        value={toSelectValue(variant.warranty)}
                                        onValueChange={(v) => handleVariantChange(index, 'warranty', v)}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Warranty" /></SelectTrigger>
                                        <SelectContent>
                                            {variantData?.warranties?.map(w => (
                                                <SelectItem key={w._id} value={w._id}>{w.warrantyName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </td>

                                <td className="p-2"><Input type="number" min="0" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))} required className="w-24 min-w-[100px]" /></td>
                                <td className="p-2"><Input type="number" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))} required className="w-24 min-w-[100px]" /></td>
                                <td className="p-2"><Input type="number" value={variant.discountPrice || 0} onChange={(e) => handleVariantChange(index, 'discountPrice', Number(e.target.value))} className="w-24 min-w-[100px]" /></td>
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
                <Button type="button" className="bg-teal-500 hover:bg-teal-600 text-white" onClick={addVariant}>
                    + Add Another Variant
                </Button>
            </div>
            {variants.length === 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 text-sm text-center">
                        ⚠️ No variants added. Click &quot;Add Another Variant&quot; to create your first product variant.
                    </p>
                </div>
            )}
        </div>
    );
}