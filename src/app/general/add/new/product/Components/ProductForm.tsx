'use client';

import React, { useState } from 'react';
import BasicInfo from './BasicInfo';
import ImageSection from './ImageSection';
import PricingInventory from './PricingInventory';
import ProductBasicDetails from './ProductBasicDetails';
import StoreSelection from './StoreSelection';
import CategorySelection from './CategorySelection';
import BrandModelSelection from './BrandModelSelection';
import ProductAttributes from './ProductAttributes';
import OffersVariants from './OffersVariants';
import SEOInfo from './SEOInfo';
import ActionButtons from './ActionButtons';

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

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field: string, delta: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, (prev[field as keyof ProductFormData] as number) + delta)
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
        <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicInfo 
          formData={{
            title: formData.title,
            shortDescription: formData.shortDescription,
            fullDescription: formData.fullDescription,
            specification: formData.specification,
            warrantyPolicy: formData.warrantyPolicy,
          }}
          handleInputChange={handleInputChange}
        />

        <ImageSection 
          formData={{
            thumbnailImage: formData.thumbnailImage,
            galleryImages: formData.galleryImages,
          }}
          handleInputChange={handleInputChange}
        />

        <PricingInventory 
          formData={{
            price: formData.price,
            discountPrice: formData.discountPrice,
            rewardPoints: formData.rewardPoints,
            stock: formData.stock,
          }}
          handleInputChange={handleInputChange}
          handleNumberChange={handleNumberChange}
        />

        <ProductBasicDetails 
          formData={{
            productCode: formData.productCode,
            videoUrl: formData.videoUrl,
          }}
          handleInputChange={handleInputChange}
        />

        <StoreSelection 
          formData={{
            store: formData.store,
          }}
          handleInputChange={handleInputChange}
        />

        <CategorySelection 
          formData={{
            category: formData.category,
            subcategory: formData.subcategory,
            childCategory: formData.childCategory,
          }}
          handleInputChange={handleInputChange}
        />

        <BrandModelSelection 
          formData={{
            brand: formData.brand,
            model: formData.model,
          }}
          handleInputChange={handleInputChange}
        />

        <ProductAttributes 
          formData={{
            flag: formData.flag,
            warranty: formData.warranty,
            unit: formData.unit,
          }}
          handleInputChange={handleInputChange}
        />

        <OffersVariants 
          formData={{
            specialOffer: formData.specialOffer,
            offerEndTime: formData.offerEndTime,
            hasVariant: formData.hasVariant,
          }}
          handleInputChange={handleInputChange}
        />

        <SEOInfo 
          formData={{
            metaTitle: formData.metaTitle,
            metaKeywords: formData.metaKeywords,
            metaDescription: formData.metaDescription,
          }}
          handleInputChange={handleInputChange}
        />

        <ActionButtons 
          onDiscard={handleDiscard}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
}
