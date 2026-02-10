'use client';

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { Loader2, Save, X, UploadCloud, ChevronLeft, Image as ImageIcon, DollarSign, Layers, Tag, Settings, Box } from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ProductImageGallery from './Components/ProductImageGallery';
import ProductVariantForm, { IProductOption } from './Components/ProductVariantForm';
import TagInput from './Components/TagInput';
import PricingInventory from './Components/PricingInventory';

// --- Helper Functions ---
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

export default function ProductForm({ initialData, productId: propProductId }: any) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productIdParam = searchParams?.get('id');
    const productIdParamValue = propProductId || productIdParam;
    const productId = productIdParamValue && productIdParamValue !== 'undefined' ? productIdParamValue : null;
    const isEditMode = !!productId;
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    // --- LISTS FROM PROPS ---
    const listStores = initialData?.stores || [];
    const listCategories = initialData?.categories || [];
    const listBrands = initialData?.brands || [];
    const listFlags = initialData?.flags || [];
    const listUnits = initialData?.units || [];
    const listWarranties = initialData?.warranties || [];
    const allModelsList = initialData?.models || [];
    const variantOptions = initialData?.variantOptions || {};

    // --- STATES ---
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

    // Dropdowns
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

    // --- 1. LOAD PRODUCT DATA ---
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
                    toast.error("Product data not found!");
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

                // Fetch Dependents
                const promises = [];
                if (catId) {
                    promises.push(axios.get(`/api/v1/ecommerce-category/ecomSubCategory/category/${catId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => setSubcategories(r.data?.data || [])));
                }
                if (subId) {
                    promises.push(axios.get(`/api/v1/ecommerce-category/ecomChildCategory?subCategoryId=${subId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => setChildCategories(r.data?.data || [])));
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
                toast.error('❌ Failed to load product details.');
                isInitialLoad.current = false;
            } finally {
                setIsLoadingProduct(false);
            }
        };
        fetchExistingProduct();
    }, [isEditMode, productId, token]);

    // --- DEPENDENT EFFECTS ---
    useEffect(() => {
        if (isInitialLoad.current) return;
        const fetchSubcategories = async () => {
            if (category && token) {
                try {
                    const res = await axios.get(`/api/v1/ecommerce-category/ecomSubCategory/category/${category}`, { headers: { Authorization: `Bearer ${token}` } });
                    setSubcategories(res.data?.data || []);
                    setSubcategory(''); setChildCategory(''); setChildCategories([]);
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

    // --- HANDLERS ---
    const handleCategoryChange = (val: string) => { setCategory(val); setSubcategory(''); setChildCategory(''); };
    const handleSubcategoryChange = (val: string) => { setSubcategory(val); setChildCategory(''); };
    const handleBrandChange = (val: string) => { setBrand(val); setModel(''); };
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { if (initialThumbnailUrl) { setRemovedThumbnailUrl(initialThumbnailUrl); setInitialThumbnailUrl(null); } setThumbnail(file); setThumbnailPreview(URL.createObjectURL(file)); } else { setThumbnail(null); setThumbnailPreview(null); } };

    // --- PRICING HELPERS ---
    const pricingFormData = { 
        price: price ?? '', 
        discountPrice: discountPrice ?? '', 
        rewardPoints: rewardPoints ?? '', 
        stock: stock ?? '', 
        shippingCost: shippingCost ?? '' 
    };

    const handlePricingInputChange = (field: string, value: unknown) => {
        const numVal = value === '' ? undefined : Number(value);
        if (field === 'price') setPrice(numVal);
        if (field === 'discountPrice') setDiscountPrice(numVal);
        if (field === 'rewardPoints') setRewardPoints(numVal);
        if (field === 'stock') setStock(numVal);
        if (field === 'shippingCost') setShippingCost(numVal);
    };
    
    const handlePricingNumberChange = (field: string, delta: number) => {
        const updater = (prev: number | undefined) => Math.max(0, (prev || 0) + delta);
        if (field === 'price') setPrice(updater);
        if (field === 'discountPrice') setDiscountPrice(updater);
        if (field === 'rewardPoints') setRewardPoints(updater);
        if (field === 'stock') setStock(updater);
        if (field === 'shippingCost') setShippingCost(updater);
    };

    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        try { const response = await axios.post('/api/v1/upload', formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }); return response.data?.url || ''; } catch (error) { throw new Error('Upload failed'); }
    };

    // --- SUBMIT ---
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!token) return toast.error("⚠️ Authentication required.");
        if (!isEditMode && !thumbnail) return toast.error("⚠️ Thumbnail is required.");
        if (!title || !store || !category) return toast.error("⚠️ Fill required fields.");
        if (!price || price <= 0) return toast.error("⚠️ Price is required.");

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
                
                // ✅ FIXED: Map variants correctly, using global unit
                productOptions: hasVariant ? await Promise.all(variants.map(async (v) => {
                    const img = v.image ? await uploadFile(v.image as File) : (v.imageUrl || '');
                    return { 
                        productImage: img, 
                        simType: normalizeToStringArray(v.simType), 
                        condition: normalizeToStringArray(v.condition), 
                        unit: normalizeToStringArray(unit), // ✅ Use global unit
                        color: normalizeToStringArray(v.color), 
                        size: normalizeToStringArray(v.size),
                        storage: v.storage || undefined,
                        warranty: v.warranty || undefined,
                        stock: v.stock || 0,
                        price: v.price || 0,
                        discountPrice: v.discountPrice || 0
                    };
                })) : [],
            };

            const endpoint = isEditMode ? `/api/v1/product/${productId}` : '/api/v1/product';
            const method = isEditMode ? axios.patch : axios.post;
            await method(endpoint, productData, { headers: { 'Authorization': `Bearer ${token}` } });
            toast.success(isEditMode ? "✅ Product updated!" : "✅ Product created!");
            router.push('/general/view/all/product');
        } catch (error: any) {
            console.error("Submission Error:", error);
            toast.error(`❌ Operation Failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingProduct) return <div className="flex justify-center items-center h-screen bg-slate-50"><Loader2 className="animate-spin h-10 w-10 text-slate-400" /></div>;

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 mb-6 shadow-sm">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button type="button" variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-slate-100"><ChevronLeft className="h-5 w-5 text-slate-600" /></Button>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-slate-900">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => router.back()} className="hidden sm:flex border-slate-300">Discard</Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white min-w-[120px]">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save</Button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* --- LEFT COLUMN --- */}
                <div className="lg:col-span-8 space-y-5">
                    {/* General */}
                    <Card className="border-slate-200 shadow-sm"><CardHeader className="py-4 border-b border-slate-50"><CardTitle className="text-base font-semibold">General Information</CardTitle></CardHeader><CardContent className="pt-5 space-y-4"><div className="space-y-1.5"><Label>Product Name <span className="text-red-500">*</span></Label><Input value={title} onChange={e => setTitle(e.target.value)} required className="h-10" /></div><div className="space-y-1.5"><Label>Short Description</Label><Textarea value={shortDescription} onChange={e => setShortDescription(e.target.value)} maxLength={255} className="resize-none h-20" /><div className="text-xs text-right text-muted-foreground">{shortDescription.length}/255</div></div></CardContent></Card>
                    
                    {/* Details */}
                    <Card className="border-slate-200 shadow-sm"><CardHeader className="py-4 border-b border-slate-50"><CardTitle className="text-base font-semibold">Product Description</CardTitle></CardHeader><CardContent className="pt-5"><Tabs defaultValue="description"><TabsList className="grid w-full grid-cols-3 mb-4 bg-slate-100 h-9"><TabsTrigger value="description" className="text-xs">Description</TabsTrigger><TabsTrigger value="specification" className="text-xs">Specs</TabsTrigger><TabsTrigger value="warranty" className="text-xs">Warranty</TabsTrigger></TabsList><TabsContent value="description"><RichTextEditor value={fullDescription} onChange={setFullDescription} /></TabsContent><TabsContent value="specification"><RichTextEditor value={specification} onChange={setSpecification} /></TabsContent><TabsContent value="warranty"><RichTextEditor value={warrantyPolicy} onChange={setWarrantyPolicy} /></TabsContent></Tabs></CardContent></Card>
                    
                    {/* Variants */}
                    <Card className="border-slate-200 shadow-sm"><CardHeader className="py-4 bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between"><div className="flex items-center gap-2"><Box className="h-4 w-4 text-slate-500" /><CardTitle className="text-base font-semibold">Variants</CardTitle></div><div className="flex items-center gap-2"><Label className="text-xs font-normal text-muted-foreground">Enable</Label><Switch checked={hasVariant} onCheckedChange={setHasVariant} /></div></CardHeader><CardContent className="p-0">{hasVariant ? <div className="p-5"><ProductVariantForm variants={variants} setVariants={setVariants} variantData={variantOptions} /></div> : <div className="p-8 text-center text-sm text-muted-foreground">Variants disabled. Toggle switch to add options.</div>}</CardContent></Card>
                    
                    {/* SEO */}
                    <Card className="border-slate-200 shadow-sm"><CardHeader className="py-4 border-b border-slate-50"><CardTitle className="text-base font-semibold">SEO Settings</CardTitle></CardHeader><CardContent className="pt-5 space-y-4"><div className="space-y-1.5"><Label>Meta Title</Label><Input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className="h-9" /></div><div className="space-y-1.5"><Label>Meta Keywords</Label><TagInput value={metaKeywordTags} onChange={setMetaKeywordTags} /></div><div className="space-y-1.5"><Label>Meta Description</Label><Textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} className="h-20" /></div></CardContent></Card>
                </div>

                {/* --- RIGHT COLUMN --- */}
                <div className="lg:col-span-4 space-y-5">
                    
                    {/* Media */}
                    <Card className="border-slate-200 shadow-sm"><CardHeader className="py-4 border-b border-slate-50 flex flex-row items-center gap-2"><ImageIcon className="h-4 w-4 text-slate-500" /><CardTitle className="text-base font-semibold">Media</CardTitle></CardHeader><CardContent className="pt-5 space-y-4"><div className="space-y-2"><Label className="text-xs font-medium uppercase text-muted-foreground">Thumbnail</Label><label htmlFor="thumb-up" className="block w-full aspect-square border-2 border-dashed border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 cursor-pointer relative overflow-hidden flex items-center justify-center transition-all">{thumbnailPreview ? <Image src={thumbnailPreview} alt="Thumbnail" fill className="object-cover" /> : <div className="text-center p-4 text-slate-400"><UploadCloud className="h-8 w-8 mx-auto mb-2" /><span className="text-xs">Upload</span></div>}<Input id="thumb-up" type="file" className="hidden" onChange={handleThumbnailChange} accept="image/*" /></label></div>{!hasVariant && <div className="space-y-2"><Label className="text-xs font-medium uppercase text-muted-foreground">Gallery</Label><ProductImageGallery galleryImages={galleryImages} setGalleryImages={setGalleryImages} existingGalleryUrls={existingGalleryUrls} onRemoveExisting={(url) => { setExistingGalleryUrls(prev => prev.filter(i => i !== url)); setRemovedGalleryUrls(prev => prev.includes(url) ? prev : [...prev, url]); }} /></div>}</CardContent></Card>

                    {/* Organization */}
                    <Card className="border-slate-200 shadow-sm"><CardHeader className="py-4 border-b border-slate-50 flex flex-row items-center gap-2"><Layers className="h-4 w-4 text-slate-500" /><CardTitle className="text-base font-semibold">Organization</CardTitle></CardHeader><CardContent className="pt-5 space-y-4"><div className="space-y-1.5"><Label>Store</Label><Select value={store} onValueChange={setStore}><SelectTrigger className="h-9"><SelectValue placeholder="Select Store" /></SelectTrigger><SelectContent>{listStores.map((s:any)=><SelectItem key={getIdFromRef(s)} value={getIdFromRef(s)}>{s.storeName}</SelectItem>)}</SelectContent></Select></div><Separator /><div className="space-y-1.5"><Label>Category</Label><Select value={category} onValueChange={handleCategoryChange}><SelectTrigger className="h-9"><SelectValue placeholder="Select Category" /></SelectTrigger><SelectContent>{listCategories.map((c:any)=><SelectItem key={getIdFromRef(c)} value={getIdFromRef(c)}>{c.name}</SelectItem>)}</SelectContent></Select></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1.5"><Label>Subcategory</Label><Select value={subcategory} onValueChange={handleSubcategoryChange} disabled={!category}><SelectTrigger className="h-9"><SelectValue placeholder="Sub" /></SelectTrigger><SelectContent>{subcategories.map((s:any)=><SelectItem key={getIdFromRef(s)} value={getIdFromRef(s)}>{s.name}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label>Child</Label><Select value={childCategory} onValueChange={setChildCategory} disabled={!subcategory}><SelectTrigger className="h-9"><SelectValue placeholder="Child" /></SelectTrigger><SelectContent>{childCategories.map((c:any)=><SelectItem key={getIdFromRef(c)} value={getIdFromRef(c)}>{c.name}</SelectItem>)}</SelectContent></Select></div></div><Separator /><div className="space-y-1.5"><Label>Brand</Label><Select value={brand} onValueChange={handleBrandChange}><SelectTrigger className="h-9"><SelectValue placeholder="Select Brand" /></SelectTrigger><SelectContent>{listBrands.map((b:any)=><SelectItem key={getIdFromRef(b)} value={getIdFromRef(b)}>{b.name}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label>Model</Label><Select value={model} onValueChange={setModel} disabled={!brand}><SelectTrigger className="h-9"><SelectValue placeholder={!brand ? "Select Brand" : "Select Model"} /></SelectTrigger><SelectContent>{filteredModels.length ? filteredModels.map((m:any)=><SelectItem key={getIdFromRef(m)} value={getIdFromRef(m)}>{m.modelName}</SelectItem>) : <SelectItem value="none" disabled>No models</SelectItem>}</SelectContent></Select></div><div className="space-y-1.5"><Label>Tags</Label><TagInput value={productTags} onChange={setProductTags} /></div></CardContent></Card>

                    {/* Pricing */}
                    <Card className="border-slate-200 shadow-sm"><CardHeader className="py-4 border-b border-slate-50 flex flex-row items-center gap-2"><DollarSign className="h-4 w-4 text-slate-500" /><CardTitle className="text-base font-semibold">Pricing</CardTitle></CardHeader><CardContent className="pt-5 space-y-4"><PricingInventory formData={pricingFormData} handleInputChange={handlePricingInputChange} handleNumberChange={handlePricingNumberChange} /><div className="space-y-1.5"><Label>SKU</Label><Input value={productCode} onChange={e => setProductCode(e.target.value)} className="h-9" /></div><div className="bg-slate-50 p-3 rounded-md flex items-center justify-between border border-slate-100"><div className="space-y-0.5"><Label>Special Offer</Label><p className="text-[10px] text-muted-foreground">Limited time deal</p></div><Switch checked={specialOffer} onCheckedChange={setSpecialOffer} /></div>{specialOffer && <div className="space-y-1.5 animate-in fade-in"><Label>End Date</Label><Input type="datetime-local" value={offerEndTime} onChange={e => setOfferEndTime(e.target.value)} className="h-9" /></div>}</CardContent></Card>

                    {/* Attributes */}
                    <Card className="border-slate-200 shadow-sm"><CardHeader className="py-4 border-b border-slate-50 flex flex-row items-center gap-2"><Settings className="h-4 w-4 text-slate-500" /><CardTitle className="text-base font-semibold">Attributes</CardTitle></CardHeader><CardContent className="pt-5 space-y-4"><div className="grid grid-cols-2 gap-3"><div className="space-y-1.5"><Label>Flag</Label><Select value={flag} onValueChange={setFlag}><SelectTrigger className="h-9"><SelectValue placeholder="Flag" /></SelectTrigger><SelectContent>{listFlags.map((f:any)=><SelectItem key={getIdFromRef(f)} value={getIdFromRef(f)}>{f.name}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label>Unit</Label><Select value={unit} onValueChange={setUnit}><SelectTrigger className="h-9"><SelectValue placeholder="Unit" /></SelectTrigger><SelectContent>{listUnits.map((u:any)=><SelectItem key={getIdFromRef(u)} value={getIdFromRef(u)}>{u.name}</SelectItem>)}</SelectContent></Select></div></div><div className="space-y-1.5"><Label>Warranty</Label><Select value={warranty} onValueChange={setWarranty}><SelectTrigger className="h-9"><SelectValue placeholder="Select Warranty" /></SelectTrigger><SelectContent>{listWarranties.map((w:any)=><SelectItem key={getIdFromRef(w)} value={getIdFromRef(w)}>{w.warrantyName}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label>Video URL</Label><Input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="h-9" placeholder="YouTube link" /></div></CardContent></Card>
                </div>
            </div>
        </form>
    );
}