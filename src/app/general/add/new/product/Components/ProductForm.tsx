'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import ImageUpload from './ImageUpload';
import ImageGalleryUpload from './ImageGalleryUpload';
import { Minus, Plus, Calendar } from 'lucide-react';

interface ProductFormData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  specification: string;
  warrantyPolicy: string;
  thumbnailImage: File | null;
  galleryImages: File[];
  price: number;
  discountPrice: number;
  rewardPoints: number;
  stock: number;
  productCode: string;
  store: string;
  category: string;
  subcategory: string;
  childCategory: string;
  brand: string;
  model: string;
  flag: string;
  warranty: string;
  unit: string;
  videoUrl: string;
  specialOffer: boolean;
  offerEndTime: string;
  hasVariant: boolean;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
}

export default function ProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    specification: '',
    warrantyPolicy: '',
    thumbnailImage: null,
    galleryImages: [],
    price: 0,
    discountPrice: 0,
    rewardPoints: 0,
    stock: 10,
    productCode: 'YYWIW482',
    store: '',
    category: '',
    subcategory: '',
    childCategory: '',
    brand: '',
    model: '',
    flag: '',
    warranty: '',
    unit: '',
    videoUrl: 'https://youtube.com/YGUYUTYG',
    specialOffer: true,
    offerEndTime: '',
    hasVariant: true,
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
  });

  const handleInputChange = (field: keyof ProductFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field: keyof ProductFormData, delta: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, (prev[field] as number) + delta)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard all changes?')) {
      // Reset form or navigate away
      console.log('Form discarded');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
     

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Product Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
           Add New Product
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Title<span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter Product Name Here"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="shortDescription" className="text-sm font-medium">
                Short Description (Max 255 Characters)
              </Label>
              <Textarea
                id="shortDescription"
                placeholder="Enter Short Description Here"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                className="mt-1"
                maxLength={255}
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Full Description</Label>
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Full Description</TabsTrigger>
                  <TabsTrigger value="specification">Specification</TabsTrigger>
                  <TabsTrigger value="warranty">Warranty Policy</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4">
                  <RichTextEditor
                    value={formData.fullDescription}
                    onChange={(value) => handleInputChange('fullDescription', value)}
                  />
                </TabsContent>
                <TabsContent value="specification" className="mt-4">
                  <RichTextEditor
                    value={formData.specification}
                    onChange={(value) => handleInputChange('specification', value)}
                  />
                </TabsContent>
                <TabsContent value="warranty" className="mt-4">
                  <RichTextEditor
                    value={formData.warrantyPolicy}
                    onChange={(value) => handleInputChange('warrantyPolicy', value)}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Product Images
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Product Thumbnail Image<span className="text-red-500">*</span>
              </Label>
              <ImageUpload
                image={formData.thumbnailImage}
                setImage={(file) => handleInputChange('thumbnailImage', file)}
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Product Image Gallery
              </Label>
              <ImageGalleryUpload
                images={formData.galleryImages}
                setImages={(files) => handleInputChange('galleryImages', files)}
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Pricing & Inventory
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Price (In BDT)<span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleNumberChange('price', -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleNumberChange('price', 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Discount Price</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleNumberChange('discountPrice', -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={formData.discountPrice}
                  onChange={(e) => handleInputChange('discountPrice', Number(e.target.value))}
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleNumberChange('discountPrice', 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Reward Points</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleNumberChange('rewardPoints', -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={formData.rewardPoints}
                  onChange={(e) => handleInputChange('rewardPoints', Number(e.target.value))}
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleNumberChange('rewardPoints', 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Stock</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleNumberChange('stock', -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleNumberChange('stock', 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Product Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="productCode" className="text-sm font-medium">Product Code</Label>
              <Input
                id="productCode"
                value={formData.productCode}
                onChange={(e) => handleInputChange('productCode', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Select Store</Label>
              <Select value={formData.store} onValueChange={(value) => handleInputChange('store', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select One" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="store1">Store 1</SelectItem>
                  <SelectItem value="store2">Store 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Category<span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select One" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Subcategory</Label>
              <Select value={formData.subcategory} onValueChange={(value) => handleInputChange('subcategory', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select One" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sub1">Subcategory 1</SelectItem>
                  <SelectItem value="sub2">Subcategory 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Child Category</Label>
              <Select value={formData.childCategory} onValueChange={(value) => handleInputChange('childCategory', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select One" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="child1">Child Category 1</SelectItem>
                  <SelectItem value="child2">Child Category 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Brand</Label>
              <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select One" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand1">Brand 1</SelectItem>
                  <SelectItem value="brand2">Brand 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Model</Label>
              <Select value={formData.model} onValueChange={(value) => handleInputChange('model', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select One" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="model1">Model 1</SelectItem>
                  <SelectItem value="model2">Model 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Flag</Label>
              <Select value={formData.flag} onValueChange={(value) => handleInputChange('flag', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select One" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flag1">Flag 1</SelectItem>
                  <SelectItem value="flag2">Flag 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Warranty</Label>
              <Select value={formData.warranty} onValueChange={(value) => handleInputChange('warranty', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select One" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2year">2 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select One" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="kg">Kilogram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <Label htmlFor="videoUrl" className="text-sm font-medium">Video URL</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Offers */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Offers
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.specialOffer}
                onCheckedChange={(checked) => handleInputChange('specialOffer', checked)}
              />
              <Label className="text-sm font-medium">Special Offer</Label>
            </div>

            {formData.specialOffer && (
              <div>
                <Label htmlFor="offerEndTime" className="text-sm font-medium">Offer End Time</Label>
                <div className="relative mt-1">
                  <Input
                    id="offerEndTime"
                    type="datetime-local"
                    value={formData.offerEndTime}
                    onChange={(e) => handleInputChange('offerEndTime', e.target.value)}
                    placeholder="mm/dd/yyyy --:-- --"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Variants
          </h2>
          
          <div className="flex items-center space-x-3">
            <Switch
              checked={formData.hasVariant}
              onCheckedChange={(checked) => handleInputChange('hasVariant', checked)}
            />
            <Label className="text-sm font-medium">Product Has Variant ?</Label>
          </div>
        </div>

        {/* Product SEO Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Product SEO Information (Optional)
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="metaTitle" className="text-sm font-medium">Meta Title</Label>
              <Input
                id="metaTitle"
                placeholder="Meta Title"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="metaKeywords" className="text-sm font-medium">Meta Keywords</Label>
              <Input
                id="metaKeywords"
                value={formData.metaKeywords}
                onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription" className="text-sm font-medium">Meta Description</Label>
              <Textarea
                id="metaDescription"
                placeholder="Meta Description Here"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDiscard}
          >
            Discard
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Save Product
          </Button>
        </div>
      </form>
    </div>
  );
}
