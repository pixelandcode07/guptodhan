'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

export interface IProductOption {
  id: number;
  image?: File | null;
  imageUrl?: string; // ✅ FIX: Added this optional property
  unit?: string;
  simType?: string;
  warranty?: string;
  condition?: string;
  stock: number;
  price: number;
  discountPrice?: number;
}

interface ProductVariantFormProps {
  variants: IProductOption[];
  setVariants: React.Dispatch<React.SetStateAction<IProductOption[]>>;
}

export default function ProductVariantForm({ variants, setVariants }: ProductVariantFormProps) {
  
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
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">SIM Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Warranty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Condition</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Stock*</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price*</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Disc. Price</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Action</th>
                </tr>
            </thead>
            <tbody className="bg-white">
                {variants.map((variant, index) => (
                <tr key={variant.id} className="border-b">
                    <td className="px-2 py-2"><Input type="file" className="w-32" onChange={(e) => handleVariantChange(index, 'image', e.target.files ? e.target.files[0] : null)} /></td>
                    <td className="px-2 py-2"><Select onValueChange={(v) => handleVariantChange(index, 'unit', v)}><SelectTrigger><SelectValue placeholder="Select One"/></SelectTrigger><SelectContent>{/* Options */}</SelectContent></Select></td>
                    <td className="px-2 py-2"><Select onValueChange={(v) => handleVariantChange(index, 'simType', v)}><SelectTrigger><SelectValue placeholder="Select One"/></SelectTrigger><SelectContent>{/* Options */}</SelectContent></Select></td>
                    <td className="px-2 py-2"><Select onValueChange={(v) => handleVariantChange(index, 'warranty', v)}><SelectTrigger><SelectValue placeholder="Select One"/></SelectTrigger><SelectContent>{/* Options */}</SelectContent></Select></td>
                    <td className="px-2 py-2"><Select onValueChange={(v) => handleVariantChange(index, 'condition', v)}><SelectTrigger><SelectValue placeholder="Select One"/></SelectTrigger><SelectContent>{/* Options */}</SelectContent></Select></td>
                    <td className="px-2 py-2"><Input type="number" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))} required /></td>
                    <td className="px-2 py-2"><Input type="number" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))} required /></td>
                    <td className="px-2 py-2"><Input type="number" value={variant.discountPrice || ''} onChange={(e) => handleVariantChange(index, 'discountPrice', Number(e.target.value))} /></td>
                    <td className="px-2 py-2 text-center">
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