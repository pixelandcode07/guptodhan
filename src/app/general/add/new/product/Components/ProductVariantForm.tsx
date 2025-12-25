'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface VariantOption {
  _id: string;
  name?: string;
  colorName?: string;
  warrantyName?: string;
  deviceCondition?: string;
}

export interface IProductOption {
  id: number;
  image?: File | null;
  imageUrl?: string;
  color: string;  // ✅ Store as ID string
  size: string;   // ✅ Store as ID string
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
    warranties: VariantOption[];
    conditions: VariantOption[];
    simTypes: VariantOption[];
    colors: VariantOption[];
    sizes: VariantOption[];
    storageTypes: VariantOption[];
  };
}

export default function ProductVariantForm({ variants, setVariants, variantData }: ProductVariantFormProps) {
  const [previewImages, setPreviewImages] = useState<{ [key: number]: string }>({});

  // ✅ Get color display name from ID
  const getColorName = (colorId: string) => {
    if (!colorId) return 'No Color Selected';
    const color = variantData.colors.find(c => c._id === colorId);
    return color?.colorName || colorId;
  };

  // ✅ Get size display name from ID
  const getSizeName = (sizeId: string) => {
    if (!sizeId) return 'No Size Selected';
    const size = variantData.sizes.find(s => s._id === sizeId);
    return size?.name || sizeId;
  };

  // ✅ Get warranty display name from ID
  const getWarrantyName = (warrantyId: string) => {
    if (!warrantyId) return 'Not Selected';
    const warranty = variantData.warranties.find(w => w._id === warrantyId);
    return warranty?.warrantyName || warrantyId;
  };

  // ✅ Get condition display name from ID
  const getConditionName = (conditionId: string) => {
    if (!conditionId) return 'Not Selected';
    const condition = variantData.conditions.find(c => c._id === conditionId);
    return condition?.deviceCondition || conditionId;
  };

  // ✅ Get storage display name from ID
  const getStorageName = (storageId: string) => {
    if (!storageId) return 'Not Selected';
    const storage = variantData.storageTypes.find(s => s._id === storageId);
    return storage?.name || storageId;
  };

  // Handle variant field change
  const handleVariantChange = (index: number, field: string, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setVariants(updatedVariants);
  };

  // Handle image upload
  const handleImageUpload = (index: number, file: File | null) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewImages(prev => ({ ...prev, [index]: preview }));
      handleVariantChange(index, 'image', file);
    }
  };

  // Add new variant
  const addVariant = () => {
    const newVariant: IProductOption = {
      id: Date.now(),
      color: '',
      size: '',
      stock: 0,
      price: 0,
      discountPrice: 0,
      storage: '',
      simType: '',
      condition: '',
      warranty: '',
    };
    setVariants([...variants, newVariant]);
  };

  // Remove variant
  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
    const newPreviews = { ...previewImages };
    delete newPreviews[variants[index].id];
    setPreviewImages(newPreviews);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Product Variants
      </h2>

      {variants.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No variants added yet</p>
          <Button type="button" onClick={addVariant} className="bg-teal-500 hover:bg-teal-600">
            <Plus className="mr-2 h-4 w-4" /> Add First Variant
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {variants.map((variant, index) => (
              <div key={variant.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-700">Variant {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeVariant(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Image Upload */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Product Image</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e.target.files?.[0] || null)}
                        className="flex-1"
                      />
                    </div>
                    {previewImages[variant.id] && (
                      <div className="mt-2 relative w-20 h-20">
                        <img
                          src={previewImages[variant.id]}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-md border border-gray-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Color Selection - ✅ FIXED: value={color._id} */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Color *</Label>
                    <Select
                      value={variant.color || ''}
                      onValueChange={(value) => handleVariantChange(index, 'color', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Color" />
                      </SelectTrigger>
                      <SelectContent>
                        {variantData.colors && variantData.colors.length > 0 ? (
                          variantData.colors.map(color => (
                            <SelectItem key={color._id} value={color._id}>
                              {color.colorName || 'Unknown'}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">No colors available</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Size Selection - ✅ FIXED: value={size._id} */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Size *</Label>
                    <Select
                      value={variant.size || ''}
                      onValueChange={(value) => handleVariantChange(index, 'size', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {variantData.sizes && variantData.sizes.length > 0 ? (
                          variantData.sizes.map(size => (
                            <SelectItem key={size._id} value={size._id}>
                              {size.name || 'Unknown'}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">No sizes available</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stock */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Stock *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Price (BDT) *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  {/* Discount Price */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Discount Price</Label>
                    <Input
                      type="number"
                      min="0"
                      value={variant.discountPrice || 0}
                      onChange={(e) => handleVariantChange(index, 'discountPrice', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  {/* Storage - ✅ FIXED: value={storage._id} */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Storage</Label>
                    <Select
                      value={variant.storage || ''}
                      onValueChange={(value) => handleVariantChange(index, 'storage', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Storage" />
                      </SelectTrigger>
                      <SelectContent>
                        {variantData.storageTypes && variantData.storageTypes.length > 0 ? (
                          variantData.storageTypes.map(storage => (
                            <SelectItem key={storage._id} value={storage._id}>
                              {storage.name || storage._id}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">No storage types available</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* SIM Type - ✅ FIXED: value={simType._id} */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">SIM Type</Label>
                    <Select
                      value={variant.simType || ''}
                      onValueChange={(value) => handleVariantChange(index, 'simType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SIM Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {variantData.simTypes && variantData.simTypes.length > 0 ? (
                          variantData.simTypes.map(simType => (
                            <SelectItem key={simType._id} value={simType._id}>
                              {simType.name || 'Unknown'}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">No SIM types available</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Condition - ✅ FIXED: value={condition._id} */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Condition</Label>
                    <Select
                      value={variant.condition || ''}
                      onValueChange={(value) => handleVariantChange(index, 'condition', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {variantData.conditions && variantData.conditions.length > 0 ? (
                          variantData.conditions.map(condition => (
                            <SelectItem key={condition._id} value={condition._id}>
                              {condition.deviceCondition || 'Unknown'}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">No conditions available</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Warranty - ✅ FIXED: value={warranty._id} */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Warranty</Label>
                    <Select
                      value={variant.warranty || ''}
                      onValueChange={(value) => handleVariantChange(index, 'warranty', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Warranty" />
                      </SelectTrigger>
                      <SelectContent>
                        {variantData.warranties && variantData.warranties.length > 0 ? (
                          variantData.warranties.map(warranty => (
                            <SelectItem key={warranty._id} value={warranty._id}>
                              {warranty.warrantyName || 'Unknown'}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">No warranties available</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Summary - ✅ ENHANCED: Display selected values properly */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Summary:</strong>
                  </p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>Color: <strong>{getColorName(variant.color)}</strong></p>
                    <p>Size: <strong>{getSizeName(variant.size)}</strong></p>
                    <p>Storage: <strong>{getStorageName(variant.storage)}</strong></p>
                    <p>Stock: <strong>{variant.stock}</strong> | Price: <strong>৳{variant.price}</strong></p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button type="button" onClick={addVariant} className="bg-teal-500 hover:bg-teal-600">
              <Plus className="mr-2 h-4 w-4" /> Add Another Variant
            </Button>
          </div>
        </>
      )}
    </div>
  );
}