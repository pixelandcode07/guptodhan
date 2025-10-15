'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { toast } from 'sonner';
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

  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session['user'] & { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field: string, delta: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, (prev[field as keyof ProductFormData] as number) + delta)
    }));
  };

  const uploadSingleImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await axios.post('/api/v1/image/upload', fd);
    return res.data?.secure_url || res.data?.url || '';
  };

  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const f of files) {
      const url = await uploadSingleImage(f);
      if (url) urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    try {
      setSubmitting(true);

      // Upload images
      const thumbnailUrl = formData.thumbnailImage ? await uploadSingleImage(formData.thumbnailImage) : '';
      let galleryUrls = formData.galleryImages?.length ? await uploadMultipleImages(formData.galleryImages) : [];
      // Ensure at least one gallery image as per backend validation
      if (galleryUrls.length === 0 && thumbnailUrl) {
        galleryUrls = [thumbnailUrl];
      }

      // Build payload matching backend validation
      const uniqueProductId = `${formData.productCode || 'PROD'}-${Date.now()}`;
      const payload = {
        productId: uniqueProductId,
        productTitle: formData.title,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        specification: formData.specification,
        warrantyPolicy: formData.warrantyPolicy,
        videoUrl: formData.videoUrl || undefined,
        photoGallery: galleryUrls,
        thumbnailImage: thumbnailUrl,
        productPrice: Number(formData.price) || 0,
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: formData.stock ? Number(formData.stock) : undefined,
        sku: formData.productCode || undefined,
        rewardPoints: formData.rewardPoints ? Number(formData.rewardPoints) : undefined,
        vendorStoreId: formData.store,
        category: formData.category,
        subCategory: formData.subcategory || undefined,
        childCategory: formData.childCategory || undefined,
        // omit brand if empty to avoid invalid ObjectId cast on backend
        brand: formData.brand ? formData.brand : undefined,
        productModel: formData.model || undefined,
        flag: formData.flag || undefined,
        warranty: formData.warranty,
        weightUnit: formData.unit || undefined,
        offerDeadline: formData.offerEndTime ? new Date(formData.offerEndTime) : undefined,
        metaTitle: formData.metaTitle || undefined,
        metaKeyword: formData.metaKeywords || undefined,
        metaDescription: formData.metaDescription || undefined,
        status: 'active' as const,
      };

      await axios.post('/api/v1/product', payload, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
          'Content-Type': 'application/json',
        },
      });

      toast.success('Product saved successfully');
      // Optionally reset minimal fields
      setFormData(prev => ({ ...prev, galleryImages: [], thumbnailImage: null }));
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSubmitting(false);
    }
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
