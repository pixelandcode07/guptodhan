'use client';

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import ProductVariantForm, { IProductOption } from './Components/ProductVariantForm';
import ProductImageGallery from './Components/ProductImageGallery';
import PricingInventory from './Components/PricingInventory';
import TagInput from './Components/TagInput';

// ✅ SIMPLE HELPER - NO FANCY IMPORTS
const getIdFromRef = (value: unknown): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const record = value as { _id?: unknown; id?: unknown };
    if (record._id) return String(record._id);
    if (record.id) return String(record.id);
  }
  return '';
};

const normalizeToStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => getIdFromRef(item)).filter(Boolean);
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return [value.trim()];
  }
  return [];
};

// ✅ SIMPLE BUTTON - NATIVE HTML
function SimpleButton({
  type = 'button',
  onClick,
  disabled,
  children,
  variant = 'default',
  className = '',
}: any) {
  const baseClass = 'px-4 py-2 rounded-md transition-colors font-medium';
  let variantClass = '';

  if (variant === 'destructive') variantClass = 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50';
  else if (variant === 'outline') variantClass = 'border border-slate-300 hover:bg-slate-50';
  else variantClass = 'bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}

// ✅ SIMPLE SELECT - NATIVE HTML
function SimpleSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
}: any) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full h-10 px-3 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
    >
      <option value="">{placeholder}</option>
      {options?.map((opt: any) => (
        <option key={getIdFromRef(opt)} value={getIdFromRef(opt)}>
          {opt.name || opt.storeName || opt.modelName || opt.warrantyName || 'N/A'}
        </option>
      ))}
    </select>
  );
}

// ✅ SIMPLE SWITCH - NATIVE HTML
function SimpleSwitch({ checked, onChange }: any) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 cursor-pointer"
    />
  );
}

// ✅ SIMPLE TEXTAREA EDITOR - NO RICHTEXT
function SimpleEditor({
  value,
  onChange,
  placeholder = '',
}: any) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-32 p-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
    />
  );
}

export default function ProductForm({ initialData, productId: propProductId }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdParam = searchParams?.get('id');
  const productIdParamValue = propProductId || productIdParam;
  const productId = productIdParamValue && productIdParamValue !== 'undefined' ? productIdParamValue : null;
  const isEditMode = !!productId;
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  // LISTS
  const listStores = initialData?.stores || [];
  const listCategories = initialData?.categories || [];
  const listBrands = initialData?.brands || [];
  const listFlags = initialData?.flags || [];
  const listUnits = initialData?.units || [];
  const listWarranties = initialData?.warranties || [];
  const allModelsList = initialData?.models || [];
  const variantOptions = initialData?.variantOptions || {};

  // STATES
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [specification, setSpecification] = useState('');
  const [warrantyPolicy, setWarrantyPolicy] = useState('');
  const [productTags, setProductTags] = useState<string[]>([]);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  const [removedGalleryUrls, setRemovedGalleryUrls] = useState<string[]>([]);
  const [initialThumbnailUrl, setInitialThumbnailUrl] = useState<string | null>(null);
  const [removedThumbnailUrl, setRemovedThumbnailUrl] = useState<string | null>(null);

  const [price, setPrice] = useState<number | undefined>(undefined);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number | undefined>(undefined);
  const [rewardPoints, setRewardPoints] = useState<number | undefined>(undefined);
  const [productCode, setProductCode] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [shippingCost, setShippingCost] = useState<number | undefined>(undefined);

  const [store, setStore] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [childCategory, setChildCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [flag, setFlag] = useState('');
  const [unit, setUnit] = useState('');
  const [warranty, setWarranty] = useState('');

  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [childCategories, setChildCategories] = useState<any[]>([]);
  const [filteredModels, setFilteredModels] = useState<any[]>([]);

  const [specialOffer, setSpecialOffer] = useState(false);
  const [offerEndTime, setOfferEndTime] = useState('');
  const [hasVariant, setHasVariant] = useState(false);
  const [variants, setVariants] = useState<IProductOption[]>([]);

  const [metaTitle, setMetaTitle] = useState('');
  const [metaKeywordTags, setMetaKeywordTags] = useState<string[]>([]);
  const [metaDescription, setMetaDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEditMode);

  const isInitialLoad = useRef(true);

  // LOAD PRODUCT
  useEffect(() => {
    const fetchExistingProduct = async () => {
      if (!isEditMode || !productId || !token) {
        setIsLoadingProduct(false);
        isInitialLoad.current = false;
        return;
      }
      try {
        const res = await axios.get(`/api/v1/product/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = res.data?.data;

        if (!p) {
          toast.error('Product data not found!');
          setIsLoadingProduct(false);
          return;
        }

        setTitle(p.productTitle || '');
        setShortDescription(p.shortDescription || '');
        setFullDescription(p.fullDescription || '');
        setSpecification(p.specification || '');
        setWarrantyPolicy(p.warrantyPolicy || '');
        setProductTags(Array.isArray(p.productTag) ? p.productTag.filter((t: any) => typeof t === 'string').map((t: string) => t.trim()) : []);
        setThumbnailPreview(p.thumbnailImage || null);
        setInitialThumbnailUrl(p.thumbnailImage || null);
        setExistingGalleryUrls(Array.isArray(p.photoGallery) ? p.photoGallery : []);

        setPrice(p.productPrice);
        setDiscountPrice(p.discountPrice);
        setStock(p.stock);
        setProductCode(p.sku || '');
        setRewardPoints(p.rewardPoints);
        setShippingCost(p.shippingCost);
        setVideoUrl(p.videoUrl || '');

        const catId = getIdFromRef(p.category);
        const subId = getIdFromRef(p.subCategory);
        const brandIdRef = getIdFromRef(p.brand);

        const promises = [];
        if (catId) {
          promises.push(
            axios.get(`/api/v1/ecommerce-category/ecomSubCategory/category/${catId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => setSubcategories(r.data?.data || []))
          );
        }
        if (subId) {
          promises.push(
            axios.get(`/api/v1/ecommerce-category/ecomChildCategory?subCategoryId=${subId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => setChildCategories(r.data?.data || []))
          );
        }
        if (brandIdRef) {
          const matched = allModelsList.filter((m: any) => getIdFromRef(m.brand) === brandIdRef);
          setFilteredModels(matched);
        }

        await Promise.all(promises);

        setStore(getIdFromRef(p.vendorStoreId));
        setCategory(catId);
        setSubcategory(subId);
        setChildCategory(getIdFromRef(p.childCategory));
        setBrand(brandIdRef);
        setModel(getIdFromRef(p.productModel));
        setFlag(getIdFromRef(p.flag));
        setUnit(getIdFromRef(p.weightUnit));
        setWarranty(getIdFromRef(p.warranty));

        if (p.offerDeadline) {
          setSpecialOffer(true);
          setOfferEndTime(new Date(new Date(p.offerDeadline).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16));
        }
        setMetaTitle(p.metaTitle || '');
        setMetaKeywordTags(p.metaKeyword ? p.metaKeyword.split(',').map((k: string) => k.trim()) : []);
        setMetaDescription(p.metaDescription || '');

        if (p.productOptions?.length > 0) {
          setHasVariant(true);
          setVariants(p.productOptions.map((opt: any, idx: number) => ({
            ...opt,
            id: Date.now() + idx,
            imageUrl: opt.productImage || '',
            color: getIdFromRef(Array.isArray(opt.color) ? opt.color[0] : opt.color),
            size: getIdFromRef(Array.isArray(opt.size) ? opt.size[0] : opt.size),
            storage: getIdFromRef(opt.storage),
            simType: Array.isArray(opt.simType) ? opt.simType[0] : opt.simType,
            condition: Array.isArray(opt.condition) ? opt.condition[0] : opt.condition,
            warranty: opt.warranty || '',
            stock: opt.stock || 0,
            price: opt.price || 0,
            discountPrice: opt.discountPrice || 0,
          })));
        }

        setTimeout(() => { isInitialLoad.current = false; }, 500);
      } catch (err: any) {
        console.error('Failed to load product', err);
        toast.error('Failed to load product details.');
        isInitialLoad.current = false;
      } finally {
        setIsLoadingProduct(false);
      }
    };
    fetchExistingProduct();
  }, [isEditMode, productId, token]);

  // DEPENDENT EFFECTS
  useEffect(() => {
    if (isInitialLoad.current) return;
    const fetchSubcategories = async () => {
      if (category && token) {
        try {
          const res = await axios.get(`/api/v1/ecommerce-category/ecomSubCategory/category/${category}`, { headers: { Authorization: `Bearer ${token}` } });
          setSubcategories(res.data?.data || []);
          setSubcategory('');
          setChildCategory('');
          setChildCategories([]);
        } catch (error) { console.error(error); }
      } else { setSubcategories([]); setSubcategory(''); }
    };
    fetchSubcategories();
  }, [category, token]);

  useEffect(() => {
    if (isInitialLoad.current) return;
    const fetchChildCategories = async () => {
      if (subcategory && token) {
        try {
          const res = await axios.get(`/api/v1/ecommerce-category/ecomChildCategory?subCategoryId=${subcategory}`, { headers: { Authorization: `Bearer ${token}` } });
          setChildCategories(res.data?.data || []);
          setChildCategory('');
        } catch (error) { console.error(error); }
      } else { setChildCategories([]); setChildCategory(''); }
    };
    fetchChildCategories();
  }, [subcategory, token]);

  useEffect(() => {
    if (isInitialLoad.current) return;
    if (brand) {
      const matched = allModelsList.filter((m: any) => getIdFromRef(m.brand) === brand);
      setFilteredModels(matched);
      setModel('');
    } else { setFilteredModels([]); setModel(''); }
  }, [brand, allModelsList]);

  // HANDLERS
  const pricingFormData = { price: price ?? '', discountPrice: discountPrice ?? '', rewardPoints: rewardPoints ?? '', stock: stock ?? '', shippingCost: shippingCost ?? '' };
  const handlePricingInputChange = (field: string, value: unknown) => {
    const numVal = value === '' ? undefined : Number(value);
    if (field === 'price') setPrice(numVal);
    if (field === 'discountPrice') setDiscountPrice(numVal);
    if (field === 'rewardPoints') setRewardPoints(numVal);
    if (field === 'stock') setStock(numVal);
    if (field === 'shippingCost') setShippingCost(numVal);
  };
  const handlePricingNumberChange = (field: string, delta: number) => {
    if (field === 'price') setPrice(Math.max(0, (price || 0) + delta));
    if (field === 'discountPrice') setDiscountPrice(Math.max(0, (discountPrice || 0) + delta));
    if (field === 'rewardPoints') setRewardPoints(Math.max(0, (rewardPoints || 0) + delta));
    if (field === 'stock') setStock(Math.max(0, (stock || 0) + delta));
    if (field === 'shippingCost') setShippingCost(Math.max(0, (shippingCost || 0) + delta));
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    try { const response = await axios.post('/api/v1/upload', formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }); return response.data?.url || ''; } catch (error) { throw new Error('Upload failed'); }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error('Authentication required.');
    if (!isEditMode && !thumbnail) return toast.error('Thumbnail is required.');
    if (!title || !store || !category) return toast.error('Fill required fields.');
    if (!price || price <= 0) return toast.error('Price is required.');

    setIsSubmitting(true);
    try {
      let thumbnailUrl = thumbnailPreview;
      if (thumbnail) thumbnailUrl = await uploadFile(thumbnail);

      const filteredGallery = existingGalleryUrls.filter(url => !removedGalleryUrls.includes(url));
      let newGalleryUrls: string[] = [];
      if (galleryImages.length > 0) newGalleryUrls = (await Promise.all(galleryImages.map(file => uploadFile(file)))).filter(Boolean);
      const finalGalleryUrls = [...filteredGallery, ...newGalleryUrls];
      if (finalGalleryUrls.length === 0 && thumbnailUrl) finalGalleryUrls.push(thumbnailUrl as string);

      const productData = {
        productId: productCode || `PROD-${Date.now()}`,
        productTitle: title,
        vendorStoreId: store,
        vendorName: listStores.find((s: any) => getIdFromRef(s) === store)?.storeName || '',
        shortDescription, fullDescription, specification, warrantyPolicy, productTag: productTags,
        videoUrl: videoUrl || undefined,
        photoGallery: finalGalleryUrls,
        thumbnailImage: thumbnailUrl,
        removedPhotoGallery: removedGalleryUrls.length > 0 ? removedGalleryUrls : undefined,
        removeThumbnail: removedThumbnailUrl || undefined,
        productPrice: price || 0,
        discountPrice: discountPrice || undefined,
        stock: stock || 0,
        sku: productCode || undefined,
        rewardPoints: rewardPoints || 0,
        shippingCost: shippingCost || 0,
        category, subCategory: subcategory || undefined, childCategory: childCategory || undefined,
        brand: brand || undefined, productModel: model || undefined,
        flag: flag || undefined, warranty: warranty || undefined, weightUnit: unit || undefined,
        offerDeadline: offerEndTime ? new Date(offerEndTime) : undefined,
        metaTitle: metaTitle || undefined,
        metaKeyword: metaKeywordTags.join(', '),
        metaDescription: metaDescription || undefined,
        status: 'active',
        productOptions: hasVariant ? await Promise.all(variants.map(async (v) => {
          const img = v.image ? await uploadFile(v.image as File) : (v.imageUrl || '');
          return { productImage: img, simType: normalizeToStringArray(v.simType), condition: normalizeToStringArray(v.condition), unit: normalizeToStringArray(unit), color: normalizeToStringArray(v.color), size: normalizeToStringArray(v.size), storage: v.storage || undefined, warranty: v.warranty || undefined, stock: v.stock || 0, price: v.price || 0, discountPrice: v.discountPrice || 0 };
        })) : [],
      };

      const endpoint = isEditMode ? `/api/v1/product/${productId}` : '/api/v1/product';
      const method = isEditMode ? axios.patch : axios.post;
      await method(endpoint, productData, { headers: { 'Authorization': `Bearer ${token}` } });
      toast.success(isEditMode ? 'Product updated!' : 'Product created!');
      router.push('/general/view/all/product');
    } catch (error: any) {
      console.error('Submission Error:', error);
      toast.error(`Operation Failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { if (initialThumbnailUrl) { setRemovedThumbnailUrl(initialThumbnailUrl); setInitialThumbnailUrl(null); } setThumbnail(file); setThumbnailPreview(URL.createObjectURL(file)); } };

  if (isLoadingProduct) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-10 w-10" /></div>;

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-slate-50 pb-20">
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add Product'}</h1>
          <div className="flex gap-2">
            <SimpleButton variant="outline" onClick={() => router.back()}>Discard</SimpleButton>
            <SimpleButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</SimpleButton>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-8 space-y-5">
          <Card><CardHeader><CardTitle>General</CardTitle></CardHeader><CardContent className="space-y-4"><div><Label>Product Name *</Label><Input value={title} onChange={e => setTitle(e.target.value)} required className="mt-1" /></div><div><Label>Short Description</Label><Textarea value={shortDescription} onChange={e => setShortDescription(e.target.value)} maxLength={255} className="mt-1 h-20" /><div className="text-xs text-right text-slate-400 mt-1">{shortDescription.length}/255</div></div></CardContent></Card>

          <Card><CardHeader><CardTitle>Description & Details</CardTitle></CardHeader><CardContent className="space-y-4"><div><Label>Full Description</Label><SimpleEditor value={fullDescription} onChange={setFullDescription} /></div><div><Label>Specifications</Label><SimpleEditor value={specification} onChange={setSpecification} /></div><div><Label>Warranty Policy</Label><SimpleEditor value={warrantyPolicy} onChange={setWarrantyPolicy} /></div></CardContent></Card>

          <Card><CardHeader><CardTitle>Variants</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between mb-4"><Label>Enable Variants</Label><SimpleSwitch checked={hasVariant} onChange={setHasVariant} /></div>{hasVariant && <ProductVariantForm variants={variants} setVariants={setVariants} variantData={variantOptions} />}</CardContent></Card>

          <Card><CardHeader><CardTitle>SEO</CardTitle></CardHeader><CardContent className="space-y-4"><div><Label>Meta Title</Label><Input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className="mt-1" /></div><div><Label>Meta Keywords</Label><TagInput value={metaKeywordTags} onChange={setMetaKeywordTags} /></div><div><Label>Meta Description</Label><Textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} className="mt-1 h-20" /></div></CardContent></Card>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <Card><CardHeader><CardTitle>Thumbnail</CardTitle></CardHeader><CardContent><label htmlFor="thumb" className="block w-full aspect-square border-2 border-dashed border-slate-300 rounded-lg cursor-pointer flex items-center justify-center hover:bg-slate-50">{thumbnailPreview ? <Image src={thumbnailPreview} alt="Thumb" fill className="object-cover" /> : <span className="text-slate-400">Upload</span>}<Input id="thumb" type="file" className="hidden" onChange={handleThumbnailChange} accept="image/*" /></label></CardContent></Card>

          {!hasVariant && <ProductImageGallery galleryImages={galleryImages} setGalleryImages={setGalleryImages} existingGalleryUrls={existingGalleryUrls} onRemoveExisting={(url) => { setExistingGalleryUrls(p => p.filter(i => i !== url)); setRemovedGalleryUrls(p => p.includes(url) ? p : [...p, url]); }} />}

          <Card><CardHeader><CardTitle>Organization</CardTitle></CardHeader><CardContent className="space-y-4"><div><Label>Store *</Label><SimpleSelect value={store} onChange={setStore} options={listStores} placeholder="Select Store" /></div><div><Label>Category *</Label><SimpleSelect value={category} onChange={(v) => { setCategory(v); setSubcategory(''); setChildCategory(''); }} options={listCategories} placeholder="Select Category" /></div><div className="grid grid-cols-2 gap-2"><div><Label>Subcategory</Label><SimpleSelect value={subcategory} onChange={(v) => { setSubcategory(v); setChildCategory(''); }} options={subcategories} placeholder="Sub" disabled={!category} /></div><div><Label>Child</Label><SimpleSelect value={childCategory} onChange={setChildCategory} options={childCategories} placeholder="Child" disabled={!subcategory} /></div></div><div><Label>Brand</Label><SimpleSelect value={brand} onChange={(v) => { setBrand(v); setModel(''); }} options={listBrands} placeholder="Select Brand" /></div><div><Label>Model</Label><SimpleSelect value={model} onChange={setModel} options={filteredModels} placeholder={!brand ? 'Select Brand' : 'Select Model'} disabled={!brand} /></div><div><Label>Tags</Label><TagInput value={productTags} onChange={setProductTags} /></div></CardContent></Card>

          <Card><CardHeader><CardTitle>Pricing</CardTitle></CardHeader><CardContent className="space-y-4"><PricingInventory formData={pricingFormData} handleInputChange={handlePricingInputChange} handleNumberChange={handlePricingNumberChange} /><div><Label>SKU</Label><Input value={productCode} onChange={e => setProductCode(e.target.value)} className="mt-1" /></div><div className="border-t pt-4"><Label>Special Offer</Label><SimpleSwitch checked={specialOffer} onChange={setSpecialOffer} /></div>{specialOffer && <div><Label>End Date *</Label><Input type="datetime-local" value={offerEndTime} onChange={e => setOfferEndTime(e.target.value)} required className="mt-1" /></div>}</CardContent></Card>

          <Card><CardHeader><CardTitle>Attributes</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-2 gap-2"><div><Label>Flag</Label><SimpleSelect value={flag} onChange={setFlag} options={listFlags} placeholder="Flag" /></div><div><Label>Unit</Label><SimpleSelect value={unit} onChange={setUnit} options={listUnits} placeholder="Unit" /></div></div><div><Label>Warranty</Label><SimpleSelect value={warranty} onChange={setWarranty} options={listWarranties} placeholder="Warranty" /></div><div><Label>Video URL</Label><Input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="mt-1" placeholder="YouTube link" /></div></CardContent></Card>
        </div>
      </div>
    </form>
  );
}