'use client';

import React, { useState, FormEvent, useEffect } from 'react';
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

// Helper Functions
const getIdFromRef = (value: unknown): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
        const record = value as { _id?: unknown; id?: unknown };
        if (typeof record._id === 'string') return record._id;
        if (typeof record.id === 'string') return record.id;
    }
    return '';
};

const normalizeToStringArray = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value
            .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            .map((item) => item.trim());
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
    const productId = productIdParamValue && productIdParamValue !== 'undefined' && productIdParamValue.trim() !== '' ? productIdParamValue : null;
    const isEditMode = !!productId;

    // Basic Info States
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [fullDescription, setFullDescription] = useState('');
    const [specification, setSpecification] = useState('');
    const [warrantyPolicy, setWarrantyPolicy] = useState('');
    const [productTags, setProductTags] = useState<string[]>([]);

    // Image States
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
    const [removedGalleryUrls, setRemovedGalleryUrls] = useState<string[]>([]);
    const [initialThumbnailUrl, setInitialThumbnailUrl] = useState<string | null>(null);
    const [removedThumbnailUrl, setRemovedThumbnailUrl] = useState<string | null>(null);

    // Pricing & Inventory States
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
    const [stock, setStock] = useState<number | undefined>(undefined);
    const [rewardPoints, setRewardPoints] = useState<number | undefined>(undefined);
    const [productCode, setProductCode] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    
    // ✅ NEW: Shipping Cost State
    const [shippingCost, setShippingCost] = useState<number | undefined>(undefined);

    // Categorization States
    const [store, setStore] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [childCategory, setChildCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [flag, setFlag] = useState('');
    const [unit, setUnit] = useState('');
    const [warranty, setWarranty] = useState('');

    // Dynamic Data States
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [childCategories, setChildCategories] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);

    // Offer & SEO States
    const [specialOffer, setSpecialOffer] = useState(false);
    const [offerEndTime, setOfferEndTime] = useState('');
    const [hasVariant, setHasVariant] = useState(false);
    const [variants, setVariants] = useState<IProductOption[]>([]);
    const [metaTitle, setMetaTitle] = useState('');
    const [metaKeywordTags, setMetaKeywordTags] = useState<string[]>([]);
    const [metaDescription, setMetaDescription] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;
    const [initialSubcategoryId, setInitialSubcategoryId] = useState<string>('');
    const [initialChildCategoryId, setInitialChildCategoryId] = useState<string>('');
    const [initialModelId, setInitialModelId] = useState<string>('');

    // Pricing Handler Logic
    const pricingFormData = {
        price: price ?? '',
        discountPrice: discountPrice ?? '',
        rewardPoints: rewardPoints ?? '',
        stock: stock ?? '',
        shippingCost: shippingCost ?? '', // ✅ Passed to PricingInventory
    };

    const handlePricingInputChange = (field: string, value: unknown) => {
        switch (field) {
            case 'price':
                setPrice(value === '' ? undefined : Number(value));
                break;
            case 'discountPrice':
                setDiscountPrice(value === '' ? undefined : Number(value));
                break;
            case 'rewardPoints':
                setRewardPoints(value === '' ? undefined : Number(value));
                break;
            case 'stock':
                setStock(value === '' ? undefined : Number(value));
                break;
            case 'shippingCost': // ✅ Handle new field
                setShippingCost(value === '' ? undefined : Number(value));
                break;
        }
    };

    const handlePricingNumberChange = (field: string, delta: number) => {
        switch (field) {
            case 'price':
                setPrice(prev => Math.max(0, (prev || 0) + delta));
                break;
            case 'discountPrice':
                setDiscountPrice(prev => Math.max(0, (prev || 0) + delta));
                break;
            case 'rewardPoints':
                setRewardPoints(prev => Math.max(0, (prev || 0) + delta));
                break;
            case 'stock':
                setStock(prev => Math.max(0, (prev || 0) + delta));
                break;
            case 'shippingCost': // ✅ Handle new field
                setShippingCost(prev => Math.max(0, (prev || 0) + delta));
                break;
        }
    };

    // --- Effects for Dropdowns ---
    useEffect(() => {
        const fetchSubcategories = async () => { if (category && token) { try { const res = await axios.get(`/api/v1/ecommerce-category/ecomSubCategory/category/${category}`, { headers: { Authorization: `Bearer ${token}` } }); setSubcategories(res.data?.data || []); setSubcategory(''); setChildCategories([]); setChildCategory(''); } catch (error) { console.error('Failed to fetch subcategories', error); } } else { setSubcategories([]); } }; fetchSubcategories();
    }, [category, token]);

    useEffect(() => {
        const fetchChildCategories = async () => { if (subcategory && token) { try { const res = await axios.get(`/api/v1/ecommerce-category/ecomChildCategory?subCategoryId=${subcategory}`, { headers: { Authorization: `Bearer ${token}` } }); setChildCategories(res.data?.data || []); setChildCategory(''); } catch (error) { console.error('Failed to fetch child categories', error); } } else { setChildCategories([]); } }; fetchChildCategories();
    }, [subcategory, token]);

    useEffect(() => {
        const fetchModels = async () => {
            if (brand && token) {
                try {
                    const res = await axios.get(`/api/v1/product-config/modelName?brandId=${brand}`, { headers: { Authorization: `Bearer ${token}` } });
                    const filteredModels = res.data?.data?.filter((m: any) => m.status === 'active') || [];
                    setModels(filteredModels);
                    if (initialModelId) {
                        setModel(initialModelId);
                    }
                } catch (error) {
                    console.error('Failed to fetch models', error);
                }
            } else {
                setModels([]);
            }
        };
        fetchModels();
    }, [brand, token, initialModelId]);

    // --- Pre-fill dropdowns in Edit Mode ---
    useEffect(() => {
        if (initialSubcategoryId && subcategories.length > 0) {
            setSubcategory(initialSubcategoryId);
        }
    }, [initialSubcategoryId, subcategories]);

    useEffect(() => {
        if (initialChildCategoryId && childCategories.length > 0) {
            setChildCategory(initialChildCategoryId);
        }
    }, [initialChildCategoryId, childCategories]);

    // --- Fetch Product Data for Editing ---
    useEffect(() => {
        const fetchExistingProduct = async () => {
            if (!isEditMode || !productId || !token) return;
            try {
                const res = await axios.get(`/api/v1/product/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const p = res.data?.data;
                if (!p) return;

                setTitle(p.productTitle || '');
                setShortDescription(p.shortDescription || '');
                setFullDescription(p.fullDescription || '');
                setSpecification(p.specification || '');
                setWarrantyPolicy(p.warrantyPolicy || '');
                const parsedProductTags = Array.isArray(p.productTag)
                    ? p.productTag.filter((tag: string) => typeof tag === 'string').map((tag: string) => tag.trim()).filter(Boolean)
                    : typeof p.productTag === 'string'
                        ? p.productTag.split(',').map((tag: string) => tag.trim()).filter(Boolean)
                        : [];
                setProductTags(parsedProductTags);

                setThumbnail(null);
                setThumbnailPreview(p.thumbnailImage || null);
                setInitialThumbnailUrl(p.thumbnailImage || null);
                setRemovedThumbnailUrl(null);
                setGalleryImages([]);
                const existingUrls = Array.isArray(p.photoGallery) ? p.photoGallery : [];
                setExistingGalleryUrls(existingUrls);
                setRemovedGalleryUrls([]);

                setPrice(typeof p.productPrice === 'number' ? p.productPrice : undefined);
                setDiscountPrice(typeof p.discountPrice === 'number' ? p.discountPrice : undefined);
                setStock(typeof p.stock === 'number' ? p.stock : undefined);
                setProductCode(p.sku || '');
                setRewardPoints(typeof p.rewardPoints === 'number' ? p.rewardPoints : undefined);
                
                // ✅ Load Existing Shipping Cost
                setShippingCost(typeof p.shippingCost === 'number' ? p.shippingCost : undefined);

                setStore(getIdFromRef(p.vendorStoreId));
                setCategory(getIdFromRef(p.category));
                setInitialSubcategoryId(getIdFromRef(p.subCategory));
                setInitialChildCategoryId(getIdFromRef(p.childCategory));
                setBrand(getIdFromRef(p.brand));
                setInitialModelId(getIdFromRef(p.productModel));
                setFlag(getIdFromRef(p.flag));
                setWarranty(getIdFromRef(p.warranty));
                setUnit(getIdFromRef(p.weightUnit));

                if (p.offerDeadline) {
                    setSpecialOffer(true);
                    const dt = new Date(p.offerDeadline);
                    const isoLocal = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 16);
                    setOfferEndTime(isoLocal);
                } else {
                    setSpecialOffer(false);
                    setOfferEndTime('');
                }

                setMetaTitle(p.metaTitle || '');
                const parsedMetaKeywords = Array.isArray(p.metaKeyword)
                    ? p.metaKeyword.filter((keyword: string) => typeof keyword === 'string').map((keyword: string) => keyword.trim()).filter(Boolean)
                    : typeof p.metaKeyword === 'string'
                        ? p.metaKeyword.split(',').map((keyword: string) => keyword.trim()).filter(Boolean)
                        : [];
                setMetaKeywordTags(parsedMetaKeywords);
                setMetaDescription(p.metaDescription || '');

                const opts = Array.isArray(p.productOptions) ? p.productOptions : [];
                if (opts.length > 0) {
                    setHasVariant(true);
                    // Map Variants logic
                    const colorNameToIdMap = new Map<string, string>(
                        initialData?.variantOptions?.colors?.map((c: any) => [c.colorName, c._id]) || []
                    );
                    const sizeNameToIdMap = new Map<string, string>(
                        initialData?.variantOptions?.sizes?.map((s: any) => [s.name, s._id]) || []
                    );
                    const storageNameToIdMap = new Map<string, string>(
                        initialData?.variantOptions?.storageTypes?.map((s: any) => {
                            const storageName = s.ram && s.rom ? `${s.ram} / ${s.rom}` : s.name || s._id;
                            return [storageName, s._id];
                        }) || []
                    );

                    const getFirstValue = (val: any) => Array.isArray(val) ? val[0] : val;
                    const getNameToId = (name: string, map: Map<string, string>) => map.get(name) || name;

                    const mapped = opts.map((opt: any, idx: number) => ({
                        id: Date.now() + idx,
                        image: null,
                        imageUrl: opt.productImage || '',
                        color: opt.color ? getNameToId(getFirstValue(opt.color), colorNameToIdMap) : '',
                        size: opt.size ? getNameToId(getFirstValue(opt.size), sizeNameToIdMap) : '',
                        storage: opt.storage ? getNameToId(opt.storage, storageNameToIdMap) : '',
                        simType: opt.simType || '',
                        condition: opt.condition || '',
                        warranty: opt.warranty || '',
                        stock: typeof opt.stock === 'number' ? opt.stock : 0,
                        price: typeof opt.price === 'number' ? opt.price : 0,
                        discountPrice: typeof opt.discountPrice === 'number' ? opt.discountPrice : 0,
                    }));
                    setVariants(mapped);
                } else {
                    setHasVariant(false);
                    setVariants([]);
                }
            } catch (err: any) {
                console.error('Failed to load product for edit', err?.response?.data || err?.message);
                toast.error('Failed to load product details');
            }
        };

        fetchExistingProduct();
    }, [isEditMode, productId, token, router]);

    // File Upload Handler
    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('/api/v1/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
            });
            return response.data?.url || '';
        } catch (error) {
            console.error(`Failed to upload file ${file.name}:`, error);
            throw new Error(`Could not upload ${file.name}.`);
        }
    };

    // --- FORM SUBMIT ---
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!token) return toast.error("Authentication required.");

        if (!isEditMode && !thumbnail) return toast.error("Thumbnail image is required.");
        if (!title || !store || !category) return toast.error("Please fill all required fields (*).");
        if (!price || price <= 0) return toast.error("Price is required and must be greater than 0.");

        const selectedStore = initialData?.stores?.find((s: any) => s._id === store || s.id === store);
        const vendorName = selectedStore?.storeName || '';

        // Validation for variants
        if (hasVariant) {
            if (variants.length === 0) {
                return toast.error("Please add at least one product variant.");
            }
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];
                if (variant.stock === undefined || variant.stock < 0) {
                    return toast.error(`Variant ${i + 1}: Stock must be 0 or greater.`);
                }
                if (!variant.price || variant.price <= 0) {
                    return toast.error(`Variant ${i + 1}: Price must be greater than 0.`);
                }
            }
        }

        setIsSubmitting(true);

        try {
            let thumbnailUrl = thumbnailPreview;
            if (thumbnail) {
                thumbnailUrl = await uploadFile(thumbnail);
            }

            const filteredExistingUrls = existingGalleryUrls.filter(
                (url) => !removedGalleryUrls.includes(url)
            );

            let newGalleryUrls: string[] = [];
            if (galleryImages.length > 0) {
                const galleryUrls = await Promise.all(
                    galleryImages.map(file => uploadFile(file))
                );
                newGalleryUrls = galleryUrls.filter(url => !!url);
            }

            const combinedGalleryUrls = [...filteredExistingUrls, ...newGalleryUrls];
            const finalGalleryUrls = combinedGalleryUrls.length > 0 ? combinedGalleryUrls : (thumbnailUrl ? [thumbnailUrl] : []);

            const productData = {
                productId: productCode || `PROD-${Date.now()}`,
                productTitle: title,
                vendorStoreId: store,
                vendorName: vendorName,
                shortDescription: shortDescription,
                fullDescription: fullDescription,
                specification: specification,
                warrantyPolicy: warrantyPolicy,
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
                
                // ✅ Submit Shipping Cost to Backend
                shippingCost: shippingCost || 0,

                category: category,
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
                productOptions: hasVariant
                    ? await Promise.all(
                        variants.map(async (variant) => {
                            const uploadedImage = variant.image
                                ? await uploadFile(variant.image as File)
                                : (variant.imageUrl || '');

                            const { image, imageUrl, ...rest } = variant;

                            return {
                                ...rest,
                                productImage: uploadedImage,
                                simType: normalizeToStringArray(variant.simType),
                                condition: normalizeToStringArray(variant.condition),
                                color: normalizeToStringArray(variant.color),
                                size: normalizeToStringArray(variant.size),
                            };
                        })
                    )
                    : [],
            };

            if (isEditMode && productId) {
                await axios.patch(`/api/v1/product/${productId}`, productData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success("Product updated successfully!");
                router.push('/general/view/all/product');
            } else {
                await axios.post('/api/v1/product', productData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success("Product created successfully!");
                router.push('/general/view/all/product');
            }
        } catch (error: any) {
            console.error("Submission Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || error.message || `Failed to ${isEditMode ? 'update' : 'create'} product.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (initialThumbnailUrl) {
                setRemovedThumbnailUrl(initialThumbnailUrl);
                setInitialThumbnailUrl(null);
            }
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        } else {
            setThumbnail(null);
            setThumbnailPreview(null);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="flex justify-end gap-2 sticky top-4 z-10 bg-gray-50/80 backdrop-blur-sm py-2 px-4 rounded-lg shadow-sm -mt-4">
                <Button type="button" variant="destructive">
                    <X className="mr-2 h-4 w-4" /> Discard
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    <Save className="mr-2 h-4 w-4" /> {isEditMode ? "Update Product" : "Save Product"}
                </Button>
            </div>

            <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="shadow-sm border-gray-200 flex flex-col h-full">
                        <CardHeader className="pb-4 border-b border-gray-100">
                            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                                Basic Information
                            </CardTitle>
                            <p className="text-sm text-gray-500 mt-1">Essential product details</p>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5 flex-1">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-gray-700">Product Title <span className="text-red-500">*</span></Label>
                                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter product name" required className="h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shortDescription" className="text-sm font-medium text-gray-700">Short Description <span className="text-xs text-gray-500 ml-2">(Max 255 characters)</span></Label>
                                <Textarea id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} maxLength={255} placeholder="Brief description" className="min-h-[100px] resize-none" />
                                <div className="text-xs text-gray-500 text-right">{shortDescription.length}/255</div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="productTags" className="text-sm font-medium text-gray-700">Product Tags <span className="text-xs text-gray-500 ml-2">(Press comma or enter to add)</span></Label>
                                <TagInput id="productTags" value={productTags} onChange={setProductTags} placeholder="Type a tag" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-gray-200 flex flex-col h-full">
                        <CardHeader className="pb-4 border-b border-gray-100">
                            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Thumbnail Image <span className="text-red-500">*</span></CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 flex-1">
                            <label htmlFor="thumbnail-upload" className="cursor-pointer group block w-full h-full">
                                <div className="flex items-center justify-center w-full h-full min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors hover:border-blue-400 hover:bg-blue-50/50">
                                    {thumbnailPreview ? (
                                        <div className="relative w-full h-full min-h-[300px] rounded-md overflow-hidden">
                                            <Image src={thumbnailPreview} alt="Thumbnail" fill style={{ objectFit: 'contain' }} className="rounded-md" />
                                            <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!thumbnail && thumbnailPreview) setRemovedThumbnailUrl(prev => prev ?? thumbnailPreview); setInitialThumbnailUrl(null); setThumbnail(null); setThumbnailPreview(null); }}><X className="h-4 w-4" /></Button>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500"><UploadCloud className="mx-auto h-10 w-10 sm:h-12 sm:w-12 mb-2 text-gray-400" /><p className="text-sm font-medium">Click to upload</p></div>
                                    )}
                                </div>
                                <Input id="thumbnail-upload" type="file" className="hidden" onChange={handleThumbnailChange} accept="image/*" />
                            </label>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="shadow-sm border-gray-200 flex flex-col h-full">
                        <CardHeader className="pb-4 border-b border-gray-100">
                            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Detailed Information</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 flex-1">
                            <Tabs defaultValue="description" className="w-full h-full flex flex-col">
                                <TabsList className="grid w-full grid-cols-3 bg-gray-50 h-auto p-1">
                                    <TabsTrigger value="description" className="text-xs sm:text-sm py-2.5 data-[state=active]:bg-white">Description</TabsTrigger>
                                    <TabsTrigger value="specification" className="text-xs sm:text-sm py-2.5 data-[state=active]:bg-white">Specification</TabsTrigger>
                                    <TabsTrigger value="warranty" className="text-xs sm:text-sm py-2.5 data-[state=active]:bg-white">Warranty</TabsTrigger>
                                </TabsList>
                                <TabsContent value="description" className="mt-4 border border-gray-200 rounded-lg p-3 sm:p-4 flex-1"><RichTextEditor value={fullDescription} onChange={setFullDescription} /></TabsContent>
                                <TabsContent value="specification" className="mt-4 border border-gray-200 rounded-lg p-3 sm:p-4 flex-1"><RichTextEditor value={specification} onChange={setSpecification} /></TabsContent>
                                <TabsContent value="warranty" className="mt-4 border border-gray-200 rounded-lg p-3 sm:p-4 flex-1"><RichTextEditor value={warrantyPolicy} onChange={setWarrantyPolicy} /></TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-gray-200 flex flex-col h-full">
                        <CardHeader className="pb-4 border-b border-gray-100">
                            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Pricing & Inventory</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4 flex-1">
                            <PricingInventory formData={pricingFormData} handleInputChange={handlePricingInputChange} handleNumberChange={handlePricingNumberChange} />
                            <div className="space-y-2"><Label htmlFor="sku" className="text-sm font-medium text-gray-700">Product Code (SKU)</Label><Input id="sku" value={productCode} onChange={(e) => setProductCode(e.target.value)} placeholder="Enter SKU" className="h-11" /></div>
                        </CardContent>
                    </Card>
                </div>

                <div className={`grid gap-4 sm:gap-6 ${hasVariant ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                    {!hasVariant && (
                        <ProductImageGallery galleryImages={galleryImages} setGalleryImages={setGalleryImages} existingGalleryUrls={existingGalleryUrls} onRemoveExisting={(url) => { setExistingGalleryUrls(prev => prev.filter(item => item !== url)); setRemovedGalleryUrls(prev => prev.includes(url) ? prev : [...prev, url]); }} />
                    )}
                    <Card className="shadow-sm border-gray-200 flex flex-col h-full">
                        <CardHeader className="pb-4 border-b border-gray-100"><CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Product Details</CardTitle></CardHeader>
                        <CardContent className="pt-6 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">Store <span className="text-red-500">*</span></Label><Select value={store} onValueChange={setStore}><SelectTrigger className="h-11"><SelectValue placeholder="Select store" /></SelectTrigger><SelectContent>{initialData?.stores?.map((s:any)=><SelectItem key={s._id} value={s._id}>{s.storeName}</SelectItem>)}</SelectContent></Select></div>
                                <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></Label><Select value={category} onValueChange={setCategory}><SelectTrigger className="h-11"><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{initialData?.categories?.map((c:any)=><SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                                <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">Subcategory</Label><Select value={subcategory} onValueChange={setSubcategory} disabled={!category}><SelectTrigger className="h-11"><SelectValue placeholder="Select subcategory" /></SelectTrigger><SelectContent>{subcategories.map((sc:any)=><SelectItem key={sc._id} value={sc._id}>{sc.name}</SelectItem>)}</SelectContent></Select></div>
                                <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">Child Category</Label><Select value={childCategory} onValueChange={setChildCategory} disabled={!subcategory}><SelectTrigger className="h-11"><SelectValue placeholder="Select child category" /></SelectTrigger><SelectContent>{childCategories.map((cc:any)=><SelectItem key={cc._id} value={cc._id}>{cc.name}</SelectItem>)}</SelectContent></Select></div>
                                <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">Brand</Label><Select value={brand} onValueChange={setBrand}><SelectTrigger className="h-11"><SelectValue placeholder="Select brand" /></SelectTrigger><SelectContent>{initialData?.brands?.map((b:any)=><SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}</SelectContent></Select></div>
                                <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">Model</Label><Select value={model} onValueChange={setModel} disabled={!brand}><SelectTrigger className="h-11"><SelectValue placeholder="Select model" /></SelectTrigger><SelectContent>{models.map((m:any)=><SelectItem key={m._id} value={m._id}>{m.modelName}</SelectItem>)}</SelectContent></Select></div>
                                <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">Flag</Label><Select value={flag} onValueChange={setFlag}><SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{initialData?.flags?.map((f:any)=><SelectItem key={f._id} value={f._id}>{f.name}</SelectItem>)}</SelectContent></Select></div>
                                <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">Unit</Label><Select value={unit} onValueChange={setUnit}><SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{initialData?.units?.map((u:any)=><SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>)}</SelectContent></Select></div>
                                <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">Warranty</Label><Select value={warranty} onValueChange={setWarranty}><SelectTrigger className="h-11"><SelectValue placeholder="Optional" /></SelectTrigger><SelectContent>{initialData?.warranties?.map((w:any)=><SelectItem key={w._id} value={w._id}>{w.warrantyName}</SelectItem>)}</SelectContent></Select></div>
                                <div className="space-y-2"><Label className="text-sm font-medium text-gray-700">Video URL</Label><Input id="videoUrl" value={videoUrl} onChange={(e)=>setVideoUrl(e.target.value)} placeholder="https://..." className="h-11" /></div>
                            </div>
                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                                <div><Label htmlFor="specialOffer" className="text-sm font-medium text-gray-700">Special Offer</Label><p className="text-xs text-gray-500 mt-0.5">Enable time-limited offers</p></div>
                                <Switch id="specialOffer" checked={specialOffer} onCheckedChange={setSpecialOffer} />
                            </div>
                            {specialOffer && <div className="space-y-2 pt-4 mt-4 border-t border-gray-100"><Label htmlFor="offerEndTime" className="text-sm font-medium text-gray-700">Offer End Time *</Label><Input id="offerEndTime" type="datetime-local" value={offerEndTime} onChange={(e)=>setOfferEndTime(e.target.value)} min={new Date().toISOString().slice(0, 16)} required className="h-11" /></div>}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <Label htmlFor="hasVariantSwitch">Product Has Variant?</Label>
                        <Switch id="hasVariantSwitch" checked={hasVariant} onCheckedChange={setHasVariant} />
                    </div>
                    {hasVariant && <ProductVariantForm variants={variants} setVariants={setVariants} variantData={initialData.variantOptions} />}
                </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-4 border-b border-gray-100"><CardTitle className="text-base sm:text-lg font-semibold text-gray-900">SEO Information</CardTitle><p className="text-sm text-gray-500 mt-1">Optional: Improve search engine visibility</p></CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="metaTitle" className="text-sm font-medium text-gray-700">Meta Title</Label><Input id="metaTitle" value={metaTitle} onChange={(e)=>setMetaTitle(e.target.value)} placeholder="SEO title" className="h-11" /></div>
                        <div className="space-y-2"><Label htmlFor="metaKeywords" className="text-sm font-medium text-gray-700">Meta Keywords <span className="text-xs text-gray-500 ml-2">(Press comma or enter to add)</span></Label><TagInput id="metaKeywords" value={metaKeywordTags} onChange={setMetaKeywordTags} placeholder="Type a keyword" /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="metaDescription" className="text-sm font-medium text-gray-700">Meta Description</Label><Textarea id="metaDescription" value={metaDescription} onChange={(e)=>setMetaDescription(e.target.value)} placeholder="SEO description" className="min-h-[100px] resize-none" /></div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="destructive"><X className="mr-2 h-4 w-4" /> Discard</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}<Save className="mr-2 h-4 w-4" /> {isEditMode ? "Update Product" : "Save Product"}</Button>
            </div>
        </form>
    );
}