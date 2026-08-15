'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

interface VariantOption {
  _id: string;
  id?: string;
  name?: string;
  colorName?: string;
  warrantyName?: string;
  deviceCondition?: string;
  ram?: string;
  rom?: string;
  // ✅ NEW: country fields
  code?: string;
  flag?: string;
}

export interface IProductOption {
  id: number;
  image?: File | null;
  imageUrl?: string;
  color: string;
  size: string;
  country?: string; // ✅ NEW: Country Support
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
  isCallForPrice?: boolean; // ✅ NEW: For conditionally hiding prices
  variantData: {
    warranties: VariantOption[];
    conditions: VariantOption[];
    simTypes: VariantOption[];
    colors: VariantOption[];
    sizes: VariantOption[];
    storageTypes: VariantOption[];
    countries: VariantOption[]; // ✅ NEW: Countries list from DB
  };
}

const getOptionId = (item: VariantOption): string => {
  return String(item._id || item.id || '');
};

const toSelectValue = (value: string | undefined): string | undefined => {
  if (!value || value.trim() === '') return undefined;
  return value;
};

export default function ProductVariantForm({ variants, setVariants, variantData, isCallForPrice = false }: ProductVariantFormProps) {
  const [previewImages, setPreviewImages] = useState<{ [key: number]: string }>({});

  const colorMap = useMemo(() => new Map(variantData.colors?.map(c => [getOptionId(c), c.colorName]) || []), [variantData.colors]);
  const sizeMap = useMemo(() => new Map(variantData.sizes?.map(s => [getOptionId(s), s.name]) || []), [variantData.sizes]);
  
  // ✅ MAGIC FIX: URL স্ট্রিং মুছে শুধু দেশের নাম রাখা হলো যাতে নিচের সামারিতে সুন্দর দেখায়
  const countryMap = useMemo(
    () =>
      new Map(
        variantData.countries?.map((c) => [
          getOptionId(c),
          c.name || 'Unknown',
        ]) || []
      ),
    [variantData.countries]
  );
  
  const warrantyMap = useMemo(() => new Map(variantData.warranties?.map(w => [getOptionId(w), w.warrantyName]) || []), [variantData.warranties]);
  const storageMap = useMemo(() => new Map(variantData.storageTypes?.map(s => [getOptionId(s), s.ram && s.rom ? `${s.ram}/${s.rom}` : s.name || 'Unknown Storage']) || []), [variantData.storageTypes]);
  const conditionMap = useMemo(() => new Map(variantData.conditions?.map(c => [getOptionId(c), c.deviceCondition]) || []), [variantData.conditions]);
  const simTypeMap = useMemo(() => new Map(variantData.simTypes?.map(s => [getOptionId(s), s.name]) || []), [variantData.simTypes]);

  const getColorName = useCallback((id: string) => colorMap.get(id) || 'None', [colorMap]);
  const getSizeName = useCallback((id: string) => sizeMap.get(id) || 'None', [sizeMap]);
  const getCountryName = useCallback((id: string) => countryMap.get(id) || 'None', [countryMap]); // ✅ NEW Get Name
  const getWarrantyName = useCallback((id: string) => warrantyMap.get(id) || 'None', [warrantyMap]);
  const getStorageName = useCallback((id: string) => storageMap.get(id) || 'None', [storageMap]);

  const handleVariantChange = useCallback((index: number, field: string, value: any) => {
    setVariants(prev => {
      const updatedVariants = [...prev];
      updatedVariants[index] = { ...updatedVariants[index], [field]: value };
      return updatedVariants;
    });
  }, [setVariants]);

  const handleImageUpload = useCallback((index: number, file: File | null) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewImages(prev => ({
        ...prev,
        [variants[index].id]: preview
      }));
      handleVariantChange(index, 'image', file);
    }
  }, [variants, handleVariantChange]);

  const addVariant = useCallback(() => {
    setVariants(prev => [...prev, {
      id: Date.now(),
      color: '',
      size: '',
      country: '', // ✅ Init Country
      storage: '',
      simType: '',
      condition: '',
      warranty: '',
      stock: 0,
      price: 0,
      discountPrice: 0
    }]);
  }, [setVariants]);

  const removeVariant = useCallback((index: number) => {
    const variantId = variants[index].id;
    setVariants(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[variantId];
      return newPreviews;
    });
  }, [variants, setVariants]);

  return (
    <div className="space-y-4">
      {variants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <div className="p-3 bg-white rounded-full shadow-sm mb-3">
            <Plus className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-4">No variants added yet</p>
          <Button
            type="button"
            onClick={addVariant}
            className="bg-slate-900 text-white hover:bg-slate-800 h-9 px-4 text-xs font-semibold"
          >
            Add Variant
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {variants.map((variant, index) => (
              <VariantCard
                key={variant.id}
                variant={variant}
                index={index}
                isCallForPrice={isCallForPrice} // ✅ Pass conditionally
                previewImage={previewImages[variant.id]}
                onVariantChange={handleVariantChange}
                onImageUpload={handleImageUpload}
                onRemove={removeVariant}
                variantData={variantData}
                getColorName={getColorName}
                getSizeName={getSizeName}
                getCountryName={getCountryName} // ✅ Pass Country Name Handler
                getStorageName={getStorageName}
                getWarrantyName={getWarrantyName}
              />
            ))}
          </div>
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              onClick={addVariant}
              variant="outline"
              className="w-full sm:w-auto border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 h-10"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Another Variant
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

interface VariantCardProps {
  variant: IProductOption;
  index: number;
  previewImage?: string;
  isCallForPrice: boolean; // ✅ Type Definition updated
  onVariantChange: (index: number, field: string, value: any) => void;
  onImageUpload: (index: number, file: File | null) => void;
  onRemove: (index: number) => void;
  variantData: {
    warranties: VariantOption[];
    conditions: VariantOption[];
    simTypes: VariantOption[];
    colors: VariantOption[];
    sizes: VariantOption[];
    storageTypes: VariantOption[];
    countries: VariantOption[];
  };
  getColorName: (id: string) => string;
  getSizeName: (id: string) => string;
  getCountryName: (id: string) => string;
  getStorageName: (id: string) => string;
  getWarrantyName: (id: string) => string;
}

const VariantCard = React.memo(({
  variant,
  index,
  previewImage,
  isCallForPrice,
  onVariantChange,
  onImageUpload,
  onRemove,
  variantData,
  getColorName,
  getSizeName,
  getCountryName,
  getStorageName,
  getWarrantyName,
}: VariantCardProps) => {

  const handleColorChange = useCallback((val: string) => onVariantChange(index, 'color', val), [index, onVariantChange]);
  const handleSizeChange = useCallback((val: string) => onVariantChange(index, 'size', val), [index, onVariantChange]);
  const handleCountryChange = useCallback((val: string) => onVariantChange(index, 'country', val), [index, onVariantChange]); // ✅ NEW
  const handleStorageChange = useCallback((val: string) => onVariantChange(index, 'storage', val), [index, onVariantChange]);
  const handleSimTypeChange = useCallback((val: string) => onVariantChange(index, 'simType', val), [index, onVariantChange]);
  const handleConditionChange = useCallback((val: string) => onVariantChange(index, 'condition', val), [index, onVariantChange]);
  const handleWarrantyChange = useCallback((val: string) => onVariantChange(index, 'warranty', val), [index, onVariantChange]);
  const handleStockChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onVariantChange(index, 'stock', Number(e.target.value)), [index, onVariantChange]);
  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onVariantChange(index, 'price', Number(e.target.value)), [index, onVariantChange]);
  const handleDiscountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onVariantChange(index, 'discountPrice', Number(e.target.value)), [index, onVariantChange]);
  const handleRemoveClick = useCallback(() => onRemove(index), [index, onRemove]);
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onImageUpload(index, e.target.files?.[0] || null), [index, onImageUpload]);

  return (
    <div className="relative border border-slate-200 rounded-lg p-4 bg-white shadow-sm transition-all hover:border-slate-300">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Option {index + 1}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          onClick={handleRemoveClick}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-28 flex-shrink-0 flex flex-col gap-2">
          <Label className="text-[11px] font-semibold text-slate-500 uppercase">Photo</Label>
          <label className="cursor-pointer flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all relative overflow-hidden bg-white">
            {(previewImage || variant.imageUrl) ? (
              <Image
                src={previewImage || variant.imageUrl || ''}
                alt={`Variant ${index}`}
                fill
                className="object-cover"
                sizes="(max-width: 112px) 100vw, 112px"
              />
            ) : (
              <div className="text-center">
                <ImageIcon className="h-5 w-5 text-slate-300 mx-auto mb-1" />
                <span className="text-[9px] text-slate-400 font-medium">Upload</span>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">

          <div>
            <Label className="text-[11px] font-medium text-slate-700 mb-1 block">Color</Label>
            <Select value={toSelectValue(variant.color)} onValueChange={handleColorChange}>
              <SelectTrigger className="h-8 text-xs bg-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {variantData.colors?.map(c => <SelectItem key={getOptionId(c)} value={getOptionId(c)} className="text-xs">{c.colorName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[11px] font-medium text-slate-700 mb-1 block">Size</Label>
            <Select value={toSelectValue(variant.size)} onValueChange={handleSizeChange}>
              <SelectTrigger className="h-8 text-xs bg-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {variantData.sizes?.map(s => <SelectItem key={getOptionId(s)} value={getOptionId(s)} className="text-xs">{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* ✅ MAGIC FIX: Country Field with Flag Image rendering */}
          <div>
            <Label className="text-[11px] font-medium text-slate-700 mb-1 block">Country</Label>
            <Select value={toSelectValue(variant.country)} onValueChange={handleCountryChange}>
              <SelectTrigger className="h-8 text-xs bg-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {variantData.countries?.map((c) => {
                  const id = getOptionId(c);
                  return (
                    <SelectItem key={id} value={id} className="text-xs">
                      <div className="flex items-center gap-2">
                        {/* ফ্লাগ থাকলে ছবিটি দেখাবে */}
                        {c.flag && (
                          <img src={c.flag} alt={c.name || 'flag'} className="w-4 h-3 object-cover rounded-[2px] border border-gray-200" />
                        )}
                        <span>{c.name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[11px] font-medium text-slate-700 mb-1 block">Storage</Label>
            <Select value={toSelectValue(variant.storage)} onValueChange={handleStorageChange}>
              <SelectTrigger className="h-8 text-xs bg-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {variantData.storageTypes?.map(s => (
                  <SelectItem key={getOptionId(s)} value={getOptionId(s)} className="text-xs">
                    {s.ram && s.rom ? `${s.ram}/${s.rom}` : s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[11px] font-medium text-slate-700 mb-1 block">SIM Type</Label>
            <Select value={toSelectValue(variant.simType)} onValueChange={handleSimTypeChange}>
              <SelectTrigger className="h-8 text-xs bg-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {variantData.simTypes?.map(s => <SelectItem key={getOptionId(s)} value={getOptionId(s)} className="text-xs">{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[11px] font-medium text-slate-700 mb-1 block">Condition</Label>
            <Select value={toSelectValue(variant.condition)} onValueChange={handleConditionChange}>
              <SelectTrigger className="h-8 text-xs bg-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {variantData.conditions?.map(c => <SelectItem key={getOptionId(c)} value={getOptionId(c)} className="text-xs">{c.deviceCondition}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[11px] font-medium text-slate-700 mb-1 block">Warranty</Label>
            <Select value={toSelectValue(variant.warranty)} onValueChange={handleWarrantyChange}>
              <SelectTrigger className="h-8 text-xs bg-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {variantData.warranties?.map(w => <SelectItem key={getOptionId(w)} value={getOptionId(w)} className="text-xs">{w.warrantyName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[11px] font-medium text-slate-700 mb-1 block">Stock</Label>
            <Input type="number" value={variant.stock} onChange={handleStockChange} className="h-8 text-xs bg-white" placeholder="0" />
          </div>

          {/* ✅ CONDITIONALLY HIDE PRICING INPUTS IF CALL FOR PRICE IS TRUE */}
          {!isCallForPrice && (
            <>
              <div>
                <Label className="text-[11px] font-medium text-slate-700 mb-1 block">Price</Label>
                <Input type="number" value={variant.price} onChange={handlePriceChange} className="h-8 text-xs bg-white" placeholder="0" />
              </div>

              <div>
                <Label className="text-[11px] font-medium text-slate-700 mb-1 block">Discount</Label>
                <Input type="number" value={variant.discountPrice} onChange={handleDiscountChange} className="h-8 text-xs bg-white" placeholder="0" />
              </div>
            </>
          )}

        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500 font-medium">
        <span className="flex items-center gap-1">Color: <span className="text-slate-800">{getColorName(variant.color)}</span></span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1">Size: <span className="text-slate-800">{getSizeName(variant.size)}</span></span>
        <span className="text-slate-300">|</span>
        {/* ✅ Country in summary without URL */}
        <span className="flex items-center gap-1">Country: <span className="text-slate-800">{getCountryName(variant.country || '')}</span></span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1">Storage: <span className="text-slate-800">{getStorageName(variant.storage || '')}</span></span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1">Warranty: <span className="text-slate-800">{getWarrantyName(variant.warranty || '')}</span></span>
      </div>
    </div>
  );
}); 

VariantCard.displayName = 'VariantCard';