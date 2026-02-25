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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { Loader2, Save, X, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import ProductVariantForm, { IProductOption } from './ProductVariantForm';
import ProductImageGallery from './ProductImageGallery';
import PricingInventory from './PricingInventory';
import TagInput from './TagInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// ✅ ObjectId extract helper
const getIdFromRef = (value: unknown): string => {
    if (!value) return '';
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'object' && value !== null) {
        const record = value as { _id?: unknown; id?: unknown };
        if (record._id) return String(record._id).trim();
        if (record.id) return String(record.id).trim();
    }
    return '';
};

// ✅ Valid MongoDB ObjectId check (24-char hex)
const isObjectId = (val: string): boolean =>
    !!val && /^[a-f\d]{24}$/i.test(val.trim());

// ✅ Only return value if it's a valid ObjectId, otherwise empty string
const safeObjectId = (val?: string): string =>
    val && isObjectId(val) ? val.trim() : '';

export default function ProductForm({ initialData, productId: propProductId }: any) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productIdParam = searchParams?.get('id');
    const productIdParamValue = propProductId || productIdParam;
    const productId = productIdParamValue && productIdParamValue !== 'undefined' && productIdParamValue.trim() !== '' ? productIdParamValue : null;
    const isEditMode = !!productId;

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

    const [rewardPoints, setRewardPoints] = useState<number | undefined>(undefined);
    const [productCode, setProductCode] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

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
    const [models, setModels] = useState<any[]>([]);

    const [specialOffer, setSpecialOffer] = useState(false);
    const [offerEndTime, setOfferEndTime] = useState('');
    const [hasVariant, setHasVariant] = useState(false);
    const [variants, setVariants] = useState<IProductOption[]>([]);
    const [metaTitle, setMetaTitle] = useState('');
    const [metaKeywordTags, setMetaKeywordTags] = useState<string[]>([]);
    const [metaDescription, setMetaDescription] = useState('');
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
    const [stock, setStock] = useState<number | undefined>(undefined);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingProduct, setIsLoadingProduct] = useState(isEditMode);

    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    // ✅ Refs to prevent useEffect race conditions
    const isInitialLoad = useRef(true);
    const initialModelIdRef = useRef<string>('');
    const initialSubcategoryIdRef = useRef<string>('');
    const initialChildCategoryIdRef = useRef<string>('');

    const pricingFormData = {
        price: price ?? '',
        discountPrice: discountPrice ?? '',
        rewardPoints: rewardPoints ?? '',
        stock: stock ?? '',
    };

    const handlePricingInputChange = (field: string, value: unknown) => {
        switch (field) {
            case 'price': setPrice(value === '' ? undefined : Number(value)); break;
            case 'discountPrice': setDiscountPrice(value === '' ? undefined : Number(value)); break;
            case 'rewardPoints': setRewardPoints(value === '' ? undefined : Number(value)); break;
            case 'stock': setStock(value === '' ? undefined : Number(value)); break;
        }
    };

    const handlePricingNumberChange = (field: string, delta: number) => {
        switch (field) {
            case 'price': setPrice(prev => Math.max(0, (prev || 0) + delta)); break;
            case 'discountPrice': setDiscountPrice(prev => Math.max(0, (prev || 0) + delta)); break;
            case 'rewardPoints': setRewardPoints(prev => Math.max(0, (prev || 0) + delta)); break;
            case 'stock': setStock(prev => Math.max(0, (prev || 0) + delta)); break;
        }
    };

    // --- Fetch Subcategories (user change only) ---
    useEffect(() => {
        if (isInitialLoad.current) return;
        const fetchSubcategories = async () => {
            if (category && token) {
                try {
                    const res = await axios.get(`/api/v1/ecommerce-category/ecomSubCategory/category/${category}`, { headers: { Authorization: `Bearer ${token}` } });
                    setSubcategories(res.data?.data || []);
                    setSubcategory('');
                    setChildCategories([]);
                    setChildCategory('');
                } catch (error) { console.error(error); }
            } else {
                setSubcategories([]);
            }
        };
        fetchSubcategories();
    }, [category, token]);

    // --- Fetch Child Categories (user change only) ---
    useEffect(() => {
        if (isInitialLoad.current) return;
        const fetchChildCategories = async () => {
            if (subcategory && token) {
                try {
                    const res = await axios.get(`/api/v1/ecommerce-category/ecomChildCategory?subCategoryId=${subcategory}`, { headers: { Authorization: `Bearer ${token}` } });
                    setChildCategories(res.data?.data || []);
                    setChildCategory('');
                } catch (error) { console.error(error); }
            } else {
                setChildCategories([]);
            }
        };
        fetchChildCategories();
    }, [subcategory, token]);

    // --- Fetch Models (user change only) ---
    useEffect(() => {
        if (isInitialLoad.current) return;
        const fetchModels = async () => {
            if (brand && token) {
                try {
                    const res = await axios.get(`/api/v1/product-config/modelName?brandId=${brand}`, { headers: { Authorization: `Bearer ${token}` } });
                    setModels(res.data?.data?.filter((m: any) => m.status === 'active') || []);
                    setModel('');
                } catch (error) { console.error(error); }
            } else {
                setModels([]);
            }
        };
        fetchModels();
    }, [brand, token]);

    // --- Set subcategory after list loads (edit mode) ---
    useEffect(() => {
        if (!isEditMode || !initialSubcategoryIdRef.current) return;
        if (subcategories.length > 0) {
            const id = initialSubcategoryIdRef.current;
            const exists = subcategories.some((s: any) => s._id === id);
            if (exists) {
                setSubcategory(id);
                initialSubcategoryIdRef.current = '';
            }
        }
    }, [subcategories, isEditMode]);

    // --- Set child category after list loads (edit mode) ---
    useEffect(() => {
        if (!isEditMode || !initialChildCategoryIdRef.current) return;
        if (childCategories.length > 0) {
            const id = initialChildCategoryIdRef.current;
            const exists = childCategories.some((c: any) => c._id === id);
            if (exists) {
                setChildCategory(id);
                initialChildCategoryIdRef.current = '';
            }
        }
    }, [childCategories, isEditMode]);

    // --- Set model after list loads (edit mode) ---
    useEffect(() => {
        if (!isEditMode || !initialModelIdRef.current) return;
        if (models.length > 0) {
            const id = initialModelIdRef.current;
            const exists = models.some((m: any) => m._id === id);
            if (exists) {
                setModel(id);
                initialModelIdRef.current = '';
            }
        }
    }, [models, isEditMode]);

    // --- Main: Load existing product ---
    useEffect(() => {
        const fetchExistingProduct = async () => {
            if (!isEditMode || !productId || !token) {
                setIsLoadingProduct(false);
                isInitialLoad.current = false;
                return;
            }
            try {
                // ✅ /raw endpoint — ObjectId হিসেবে ফেরত দেয়, name string না
                const res = await axios.get(`/api/v1/product/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const p = res.data?.data;
                if (!p) {
                    toast.error('Product data not found!');
                    setIsLoadingProduct(false);
                    return;
                }

                // Basic info
                setTitle(p.productTitle || '');
                setShortDescription(p.shortDescription || '');
                setFullDescription(p.fullDescription || '');
                setSpecification(p.specification || '');
                setWarrantyPolicy(p.warrantyPolicy || '');
                const parsedProductTags = Array.isArray(p.productTag)
                    ? p.productTag.filter((t: string) => typeof t === 'string').map((t: string) => t.trim()).filter(Boolean)
                    : typeof p.productTag === 'string'
                        ? p.productTag.split(',').map((t: string) => t.trim()).filter(Boolean)
                        : [];
                setProductTags(parsedProductTags);

                // Images
                setThumbnail(null);
                setThumbnailPreview(p.thumbnailImage || null);
                setInitialThumbnailUrl(p.thumbnailImage || null);
                setRemovedThumbnailUrl(null);
                setGalleryImages([]);
                setExistingGalleryUrls(Array.isArray(p.photoGallery) ? p.photoGallery : []);
                setRemovedGalleryUrls([]);

                // Pricing
                setPrice(typeof p.productPrice === 'number' ? p.productPrice : undefined);
                setDiscountPrice(typeof p.discountPrice === 'number' ? p.discountPrice : undefined);
                setStock(typeof p.stock === 'number' ? p.stock : undefined);
                setProductCode(p.sku || '');
                setRewardPoints(typeof p.rewardPoints === 'number' ? p.rewardPoints : undefined);
                setVideoUrl(p.videoUrl || '');

                // IDs
                const catId = getIdFromRef(p.category);
                const subId = getIdFromRef(p.subCategory);
                const childId = getIdFromRef(p.childCategory);
                const brandId = getIdFromRef(p.brand);
                const modelId = getIdFromRef(p.productModel);

                setStore(getIdFromRef(p.vendorStoreId));
                setFlag(getIdFromRef(p.flag));
                setWarranty(getIdFromRef(p.warranty));
                setUnit(getIdFromRef(p.weightUnit));

                // Store refs for dependent fetches
                if (subId) initialSubcategoryIdRef.current = subId;
                if (childId) initialChildCategoryIdRef.current = childId;
                if (modelId) initialModelIdRef.current = modelId;

                // Fetch dependent lists in parallel
                const promises: Promise<void>[] = [];
                if (catId) {
                    promises.push(
                        axios.get(`/api/v1/ecommerce-category/ecomSubCategory/category/${catId}`, { headers: { Authorization: `Bearer ${token}` } })
                            .then(r => setSubcategories(r.data?.data || []))
                            .catch(() => {})
                    );
                }
                if (subId) {
                    promises.push(
                        axios.get(`/api/v1/ecommerce-category/ecomChildCategory?subCategoryId=${subId}`, { headers: { Authorization: `Bearer ${token}` } })
                            .then(r => setChildCategories(r.data?.data || []))
                            .catch(() => {})
                    );
                }
                if (brandId) {
                    promises.push(
                        axios.get(`/api/v1/product-config/modelName?brandId=${brandId}`, { headers: { Authorization: `Bearer ${token}` } })
                            .then(r => setModels(r.data?.data?.filter((m: any) => m.status === 'active') || []))
                            .catch(() => {})
                    );
                }
                await Promise.all(promises);

                // Set main dropdowns
                if (catId) setCategory(catId);
                if (brandId) setBrand(brandId);

                // Offer deadline
                if (p.offerDeadline) {
                    setSpecialOffer(true);
                    const dt = new Date(p.offerDeadline);
                    setOfferEndTime(new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
                } else {
                    setSpecialOffer(false);
                    setOfferEndTime('');
                }

                // SEO
                setMetaTitle(p.metaTitle || '');
                const parsedMetaKeywords = typeof p.metaKeyword === 'string'
                    ? p.metaKeyword.split(',').map((k: string) => k.trim()).filter(Boolean)
                    : Array.isArray(p.metaKeyword) ? p.metaKeyword : [];
                setMetaKeywordTags(parsedMetaKeywords);
                setMetaDescription(p.metaDescription || '');

                // ✅ Variants — /raw endpoint থেকে ObjectId আসে সরাসরি
                const opts = Array.isArray(p.productOptions) ? p.productOptions : [];
                if (opts.length > 0) {
                    setHasVariant(true);
                    const mapped = opts.map((opt: any, idx: number) => {
                        // safeObjectId: valid 24-char hex ObjectId হলেই রাখো
                        const colorId = safeObjectId(getIdFromRef(Array.isArray(opt.color) ? opt.color[0] : opt.color));
                        const sizeId = safeObjectId(getIdFromRef(Array.isArray(opt.size) ? opt.size[0] : opt.size));
                        const storageId = safeObjectId(getIdFromRef(opt.storage));
                        const simTypeId = safeObjectId(getIdFromRef(Array.isArray(opt.simType) ? opt.simType[0] : opt.simType));
                        const conditionId = safeObjectId(getIdFromRef(Array.isArray(opt.condition) ? opt.condition[0] : opt.condition));
                        const warrantyId = safeObjectId(getIdFromRef(opt.warranty));

                        return {
                            id: Date.now() + idx,
                            image: null,
                            imageUrl: opt.productImage || '',
                            color: colorId,
                            size: sizeId,
                            storage: storageId,
                            simType: simTypeId,
                            condition: conditionId,
                            warranty: warrantyId,
                            stock: typeof opt.stock === 'number' ? opt.stock : 0,
                            price: typeof opt.price === 'number' ? opt.price : 0,
                            discountPrice: typeof opt.discountPrice === 'number' ? opt.discountPrice : 0,
                        };
                    });
                    setVariants(mapped);
                } else {
                    setHasVariant(false);
                    setVariants([]);
                }
            } catch (err: any) {
                console.error('Failed to load product for edit', err?.response?.data || err?.message);
                toast.error(err?.response?.data?.message || 'Failed to load product details for editing');
            } finally {
                setIsLoadingProduct(false);
                setTimeout(() => {
                    isInitialLoad.current = false;
                }, 300);
            }
        };

        fetchExistingProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, productId, token]);

    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('/api/v1/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
            });
            const url = response.data?.url;
            if (!url || typeof url !== 'string') throw new Error(`API did not return a valid URL for: ${file.name}`);
            return url;
        } catch (error) {
            console.error(`Failed to upload file ${file.name}:`, error);
            throw new Error(`Could not upload ${file.name}. Please try again.`);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!token) return toast.error('Authentication required.');
        if (!isEditMode && !thumbnail) return toast.error('Thumbnail image is required.');
        if (!title || !store || !category) return toast.error('Please fill all required fields (*).');

        const selectedStore = initialData?.stores?.find((s: any) => s._id === store || s.id === store);
        if (!selectedStore?.storeName) return toast.error('Unable to determine vendor name. Please select a valid store.');

        const userVendorId = (session?.user as any)?.vendorId;
        if (userVendorId) {
            const storeVendorId = selectedStore?.vendorId;
            if (storeVendorId && storeVendorId !== userVendorId) return toast.error('You are not authorized to manage products for this store.');
        }

        if (!price || price <= 0) return toast.error('Price is required and must be greater than 0.');

        if (specialOffer) {
            if (!offerEndTime) return toast.error('Offer end time is required when special offer is enabled.');
            if (new Date(offerEndTime) <= new Date()) return toast.error('Offer end time must be in the future.');
        }

        if (hasVariant) {
            if (variants.length === 0) return toast.error('Please add at least one product variant.');
            for (let i = 0; i < variants.length; i++) {
                const v = variants[i];
                if (v.stock === undefined || v.stock < 0) return toast.error(`Variant ${i + 1}: Stock must be 0 or greater.`);
                if (!v.price || v.price <= 0) return toast.error(`Variant ${i + 1}: Price must be greater than 0.`);
                if (v.discountPrice && v.discountPrice >= v.price) return toast.error(`Variant ${i + 1}: Discount price must be less than regular price.`);
            }
        }

        setIsSubmitting(true);

        try {
            if (!thumbnail && !thumbnailPreview) { setIsSubmitting(false); return toast.error('Thumbnail image is required.'); }

            let thumbnailUrl = thumbnailPreview;
            if (thumbnail) thumbnailUrl = await uploadFile(thumbnail);
            if (!thumbnailUrl) { setIsSubmitting(false); return toast.error('Thumbnail image is required.'); }

            const filteredExistingUrls = existingGalleryUrls.filter(url => !removedGalleryUrls.includes(url));
            let newGalleryUrls: string[] = [];
            if (galleryImages.length > 0) {
                newGalleryUrls = (await Promise.all(galleryImages.map(f => uploadFile(f)))).filter(Boolean);
            }
            const finalGalleryUrls = [...filteredExistingUrls, ...newGalleryUrls];
            if (finalGalleryUrls.length === 0) finalGalleryUrls.push(thumbnailUrl);

            const vendorName = selectedStore?.storeName || '';

            const productData = {
                productId: productCode || `PROD-${Date.now()}`,
                productTitle: title,
                vendorStoreId: store,
                vendorName,
                shortDescription,
                fullDescription,
                specification,
                warrantyPolicy,
                productTag: productTags,
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
                category,
                subCategory: subcategory || undefined,
                childCategory: childCategory || undefined,
                brand: brand || undefined,
                productModel: model || undefined,
                flag: flag || undefined,
                warranty: warranty || undefined,
                weightUnit: unit || undefined,
                offerDeadline: offerEndTime ? new Date(offerEndTime) : undefined,
                metaTitle: metaTitle || undefined,
                metaKeyword: metaKeywordTags.length > 0 ? metaKeywordTags.join(', ') : undefined,
                metaDescription: metaDescription || undefined,
                status: 'active',
                // ✅ FIXED: শুধু valid ObjectId পাঠাও — plain string পাঠালে CastError হয়
                productOptions: hasVariant
                    ? await Promise.all(
                        variants.map(async (variant) => {
                            const uploadedImage = variant.image
                                ? await uploadFile(variant.image as File)
                                : (variant.imageUrl || '');

                            return {
                                productImage: uploadedImage,
                                // Array fields: valid ObjectId থাকলে array, না হলে []
                                color:     isObjectId(variant.color || '')     ? [variant.color]     : [],
                                size:      isObjectId(variant.size || '')      ? [variant.size]      : [],
                                simType:   isObjectId(variant.simType || '')   ? [variant.simType]   : [],
                                condition: isObjectId(variant.condition || '') ? [variant.condition] : [],
                                // Single ref fields: valid ObjectId থাকলে পাঠাও, না হলে undefined
                                storage:   isObjectId(variant.storage || '')   ? variant.storage  : undefined,
                                warranty:  isObjectId(variant.warranty || '')  ? variant.warranty : undefined,
                                stock: variant.stock,
                                price: variant.price,
                                discountPrice: variant.discountPrice,
                            };
                        })
                    )
                    : [],
            };

            if (isEditMode && productId) {
                await axios.patch(`/api/v1/product/${productId}`, productData, { headers: { Authorization: `Bearer ${token}` } });
                toast.success('Product updated successfully!');
                router.push('/products/all');
            } else {
                await axios.post('/api/v1/product', productData, { headers: { Authorization: `Bearer ${token}` } });
                toast.success('Product created successfully!');
                router.push('/products/all');
            }
        } catch (error: any) {
            console.error('Submission Error:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || error.message || `Failed to ${isEditMode ? 'update' : 'create'} product.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (initialThumbnailUrl) { setRemovedThumbnailUrl(initialThumbnailUrl); setInitialThumbnailUrl(null); }
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        } else {
            setThumbnail(null);
            setThumbnailPreview(null);
        }
    };

    if (isLoadingProduct)
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
                <span className="ml-3 text-gray-600">Loading product data...</span>
            </div>
        );

    return (
        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
            {/* Fixed Action Bar – Mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg lg:hidden">
                <div className="flex justify-end gap-3 p-4">
                    <Button type="button" variant="outline" size="sm" className="flex-1 sm:flex-initial" onClick={() => router.back()}>
                        <X className="mr-2 h-4 w-4" /> Discard
                    </Button>
                    <Button type="submit" disabled={isSubmitting} size="sm" className="flex-1 sm:flex-initial">
                        {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                        <Save className="mr-2 h-4 w-4" />
                        {isEditMode ? 'Update Product' : 'Save Product'}
                    </Button>
                </div>
            </div>

            <div className="space-y-8 pb-24 lg:pb-8">
                {/* Section 1: Basic Info + Thumbnail */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                            <CardTitle className="text-xl font-bold text-gray-900">Basic Information</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">Core product details</p>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="font-semibold">Product Title <span className="text-red-500">*</span></Label>
                                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Hybrid Car 2025 Edition" required className="h-12 text-base" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shortDescription" className="font-semibold">Short Description <span className="text-xs text-gray-500 ml-2">(Max 255 chars)</span></Label>
                                <Textarea id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} maxLength={255} placeholder="A powerful hybrid vehicle..." className="min-h-32 resize-none" />
                                <p className="text-xs text-right text-gray-500">{shortDescription.length}/255</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="productTags" className="font-semibold">Product Tags <span className="text-xs text-gray-500 ml-2">(comma or enter)</span></Label>
                                <TagInput value={productTags} onChange={setProductTags} placeholder="vehicle, hybrid, luxury..." />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                            <CardTitle className="text-xl font-bold text-gray-900">Thumbnail Image <span className="text-red-500">*</span></CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <label htmlFor="thumbnail-upload" className="block cursor-pointer">
                                <div className="border-3 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50/30 transition-all min-h-96 flex items-center justify-center">
                                    {thumbnailPreview ? (
                                        <div className="relative w-full h-96 group">
                                            <Image src={thumbnailPreview} alt="Thumbnail" fill className="object-contain rounded-lg" />
                                            <Button type="button" variant="destructive" size="icon" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setThumbnail(null); setThumbnailPreview(null); setInitialThumbnailUrl(null); }}>
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <UploadCloud className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                            <p className="font-semibold text-gray-700">Click to upload thumbnail</p>
                                            <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, WebP</p>
                                        </div>
                                    )}
                                </div>
                                <Input id="thumbnail-upload" type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                            </label>
                        </CardContent>
                    </Card>
                </div>

                {/* Section 2: Detailed Content + Pricing */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                            <CardTitle className="text-xl font-bold">Detailed Information</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Tabs defaultValue="description" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
                                    <TabsTrigger value="description">Description</TabsTrigger>
                                    <TabsTrigger value="specification">Specification</TabsTrigger>
                                    <TabsTrigger value="warranty">Warranty Policy</TabsTrigger>
                                </TabsList>
                                <TabsContent value="description"><RichTextEditor value={fullDescription} onChange={setFullDescription} /></TabsContent>
                                <TabsContent value="specification"><RichTextEditor value={specification} onChange={setSpecification} /></TabsContent>
                                <TabsContent value="warranty"><RichTextEditor value={warrantyPolicy} onChange={setWarrantyPolicy} /></TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
                            <CardTitle className="text-xl font-bold">Pricing & Inventory</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <PricingInventory formData={pricingFormData} handleInputChange={handlePricingInputChange} handleNumberChange={handlePricingNumberChange} />
                            <div className="space-y-2">
                                <Label htmlFor="sku" className="font-semibold">Product SKU</Label>
                                <Input id="sku" value={productCode} onChange={(e) => setProductCode(e.target.value)} placeholder="e.g. HYBRID-2025-X" className="h-12" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section 3: Gallery + Product Details */}
                <div className={`grid gap-8 ${hasVariant ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                    {!hasVariant && (
                        <ProductImageGallery
                            galleryImages={galleryImages}
                            setGalleryImages={setGalleryImages}
                            existingGalleryUrls={existingGalleryUrls}
                            onRemoveExisting={(url) => {
                                setExistingGalleryUrls(prev => prev.filter(item => item !== url));
                                setRemovedGalleryUrls(prev => [...prev, url]);
                            }}
                        />
                    )}

                    <Card className="shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg">
                            <CardTitle className="text-xl font-bold">Product Details</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Store <span className="text-red-500">*</span></Label>
                                    <Select value={store} onValueChange={setStore}>
                                        <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select store" /></SelectTrigger>
                                        <SelectContent>
                                            {initialData?.stores?.filter((s: any) => { const vid = (session?.user as any)?.vendorId; return !vid || s.vendorId === vid; })
                                                ?.map((s: any) => <SelectItem key={s._id} value={s._id}>{s.storeName}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></Label>
                                    <Select value={category} onValueChange={(val) => { setCategory(val); if (!isInitialLoad.current) { setSubcategory(''); setChildCategory(''); } }}>
                                        <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select category" /></SelectTrigger>
                                        <SelectContent>
                                            {initialData?.categories?.map((c: any) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Subcategory</Label>
                                    <Select value={subcategory} onValueChange={(val) => { setSubcategory(val); if (!isInitialLoad.current) setChildCategory(''); }} disabled={!category || subcategories.length === 0}>
                                        <SelectTrigger className="h-11 w-full"><SelectValue placeholder={!category ? 'Select category first' : 'Select subcategory'} /></SelectTrigger>
                                        <SelectContent>
                                            {subcategories.map((sc: any) => <SelectItem key={sc._id} value={sc._id}>{sc.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Child Category</Label>
                                    <Select value={childCategory} onValueChange={setChildCategory} disabled={!subcategory || childCategories.length === 0}>
                                        <SelectTrigger className="h-11 w-full"><SelectValue placeholder={!subcategory ? 'Select subcategory first' : 'Select child category'} /></SelectTrigger>
                                        <SelectContent>
                                            {childCategories.map((cc: any) => <SelectItem key={cc._id} value={cc._id}>{cc.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Brand</Label>
                                    <Select value={brand} onValueChange={(val) => { setBrand(val); if (!isInitialLoad.current) setModel(''); }}>
                                        <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select brand" /></SelectTrigger>
                                        <SelectContent>
                                            {initialData?.brands?.map((b: any) => <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Model</Label>
                                    <Select value={model} onValueChange={setModel} disabled={!brand || models.length === 0}>
                                        <SelectTrigger className="h-11 w-full"><SelectValue placeholder={!brand ? 'Select brand first' : 'Select model'} /></SelectTrigger>
                                        <SelectContent>
                                            {models.map((m: any) => <SelectItem key={m._id} value={m._id}>{m.modelName}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Flag</Label>
                                    <Select value={flag} onValueChange={setFlag}>
                                        <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            {initialData?.flags?.map((f: any) => <SelectItem key={f._id} value={f._id}>{f.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Unit</Label>
                                    <Select value={unit} onValueChange={setUnit}>
                                        <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            {initialData?.units?.map((u: any) => <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Warranty</Label>
                                    <Select value={warranty} onValueChange={setWarranty}>
                                        <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select warranty" /></SelectTrigger>
                                        <SelectContent>
                                            {initialData?.warranties?.map((w: any) => <SelectItem key={w._id} value={w._id}>{w.warrantyName}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Video URL</Label>
                                    <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." className="h-11" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 cursor-pointer">Special Offer</Label>
                                    <p className="text-xs text-gray-500 mt-0.5">Enable time-limited offers</p>
                                </div>
                                <Switch checked={specialOffer} onCheckedChange={setSpecialOffer} />
                            </div>
                            {specialOffer && (
                                <div className="space-y-2 pt-4 mt-4 border-t border-gray-100">
                                    <Label className="text-sm font-medium text-gray-700">Offer End Time <span className="text-red-500">*</span></Label>
                                    <Input type="datetime-local" value={offerEndTime} onChange={(e) => setOfferEndTime(e.target.value)} min={new Date().toISOString().slice(0, 16)} required className="h-11" />
                                </div>
                            )}
                        </CardContent>
                        <Separator className="my-8" />
                    </Card>
                </div>

                {/* Variants Section */}
                <Card className="shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <Label className="text-lg font-semibold">Does this product have variants? (Color, Size, etc.)</Label>
                            <Switch checked={hasVariant} onCheckedChange={setHasVariant} className="scale-125" />
                        </div>
                        {hasVariant && (
                            <div className="mt-6">
                                <ProductVariantForm
                                    variants={variants}
                                    setVariants={setVariants}
                                    variantData={initialData.variantOptions}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* SEO Section */}
                <Card className="shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                        <CardTitle className="text-xl font-bold">SEO & Metadata</CardTitle>
                        <p className="text-sm text-gray-600">Optimize for search engines (optional but recommended)</p>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="font-semibold">Meta Title</Label>
                                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Product - Best Price" className="h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold">Meta Keywords</Label>
                                <TagInput value={metaKeywordTags} onChange={setMetaKeywordTags} placeholder="keyword1, keyword2..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-semibold">Meta Description</Label>
                            <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Product description for SEO..." className="min-h-32" />
                        </div>
                    </CardContent>
                </Card>

                {/* Desktop Action Buttons */}
                <div className="hidden lg:flex justify-end gap-4 pt-6">
                    <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
                        <X className="mr-2 h-5 w-5" /> Discard Changes
                    </Button>
                    <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-48">
                        {isSubmitting && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
                        <Save className="mr-2 h-5 w-5" />
                        {isEditMode ? 'Update Product' : 'Save Product'}
                    </Button>
                </div>
            </div>
        </form>
    );
}