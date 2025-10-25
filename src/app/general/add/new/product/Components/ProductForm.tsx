'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

// Import UI Components
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProductForm({ initialData }: any) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams?.get('id');
    const isEditMode = !!productId;
    
    // --- State Management ---
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [fullDescription, setFullDescription] = useState('');
    const [specification, setSpecification] = useState('');
    const [warrantyPolicy, setWarrantyPolicy] = useState('');
    const [tags, setTags] = useState('');
    
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);

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
    const [metaKeywords, setMetaKeywords] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
    const [stock, setStock] = useState<number | undefined>(undefined);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    // Keep initial IDs to set after dependent lists load (for edit mode)
    const [initialSubcategoryId, setInitialSubcategoryId] = useState<string>('');
    const [initialChildCategoryId, setInitialChildCategoryId] = useState<string>('');
    const [initialModelId, setInitialModelId] = useState<string>('');

    // Pricing form data
    const pricingFormData = {
        price: price ?? '',
        discountPrice: discountPrice ?? '',
        rewardPoints: rewardPoints ?? '',
        stock: stock ?? '',
    };

    // Handler functions for pricing component
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
        }
    };
    
    // All useEffects for dependent dropdowns (no changes here)
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
                    console.log('Fetching models for brand:', brand);
                    const res = await axios.get(`/api/v1/product-config/modelName?brandId=${brand}`, { headers: { Authorization: `Bearer ${token}` } }); 
                    console.log('Models API response:', res.data?.data);
                    const filteredModels = res.data?.data?.filter((m: any) => m.status === 'active') || [];
                    console.log('Filtered models:', filteredModels);
                    setModels(filteredModels); 
                    // If we have an initial model from edit mode, set it once models are loaded
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

    // When subcategories are loaded in edit mode, set initial subcategory
    useEffect(() => {
        if (initialSubcategoryId && subcategories.length > 0) {
            setSubcategory(initialSubcategoryId);
        }
    }, [initialSubcategoryId, subcategories]);

    // When child categories are loaded in edit mode, set initial child category
    useEffect(() => {
        if (initialChildCategoryId && childCategories.length > 0) {
            setChildCategory(initialChildCategoryId);
        }
    }, [initialChildCategoryId, childCategories]);

    // Fetch existing product details in edit mode and pre-fill form
    useEffect(() => {
        const fetchExistingProduct = async () => {
            if (!isEditMode || !productId || !token) return;
            try {
                const res = await axios.get(`/api/v1/product/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const p = res.data?.data;
                if (!p) return;

                // Basic fields
                setTitle(p.productTitle || '');
                setShortDescription(p.shortDescription || '');
                setFullDescription(p.fullDescription || '');
                setSpecification(p.specification || '');
                setWarrantyPolicy(p.warrantyPolicy || '');
                setTags(Array.isArray(p.productTag) ? p.productTag.join(', ') : '');

                // Media previews (keep files empty; use URL previews)
                setThumbnail(null);
                setThumbnailPreview(p.thumbnailImage || null);
                setGalleryImages([]);
                setGalleryImagePreviews(Array.isArray(p.photoGallery) ? p.photoGallery : []);

                // Pricing & inventory
                setPrice(typeof p.productPrice === 'number' ? p.productPrice : undefined);
                setDiscountPrice(typeof p.discountPrice === 'number' ? p.discountPrice : undefined);
                setStock(typeof p.stock === 'number' ? p.stock : undefined);
                setProductCode(p.sku || '');
                setRewardPoints(typeof p.rewardPoints === 'number' ? p.rewardPoints : undefined);

                // Selects
                setStore(p.vendorStoreId || '');
                setCategory(p.category || '');
                setInitialSubcategoryId(p.subCategory || '');
                setInitialChildCategoryId(p.childCategory || '');
                setBrand(p.brand || '');
                setInitialModelId(p.productModel || '');
                setFlag(p.flag || '');
                setWarranty(p.warranty || '');
                setUnit(p.weightUnit || '');

                // Offer
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

                // SEO
                setMetaTitle(p.metaTitle || '');
                setMetaKeywords(p.metaKeyword || '');
                setMetaDescription(p.metaDescription || '');

                // Variants
                const opts = Array.isArray(p.productOptions) ? p.productOptions : [];
                if (opts.length > 0) {
                    setHasVariant(true);
                    const mapped = opts.map((opt: any, idx: number) => ({
                        id: Date.now() + idx,
                        image: null,
                        imageUrl: opt.productImage || '',
                        color: opt.color || '',
                        size: opt.size || '',
                        storage: opt.storage || '',
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
                toast.error('Failed to load product details for editing');
            }
        };

        fetchExistingProduct();
    }, [isEditMode, productId, token]);

    // ✅ পরিবর্তন ১: uploadFile ফাংশনকে আরও শক্তিশালী করা হয়েছে
    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('/api/v1/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
            });
            const url = response.data?.url; // API থেকে আসা URL
            if (!url || typeof url !== 'string') {
                // যদি URL না আসে বা স্ট্রিং না হয়, তাহলে error throw করবে
                throw new Error(`API did not return a valid URL for file: ${file.name}`);
            }
            return url;
        } catch (error) {
            console.error(`Failed to upload file ${file.name}:`, error);
            // আপলোড ব্যর্থ হলে একটি এরর থ্রো করবে যা handleSubmit-এর catch ব্লকে ধরা পড়বে
            throw new Error(`Could not upload ${file.name}. Please try again.`);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!token) return toast.error("Authentication required.");
        
        // ✅ পরিবর্তন ২: ক্লায়েন্ট সাইডে প্রাথমিক ভ্যালিডেশন
        if (!isEditMode && !thumbnail) {
            return toast.error("Thumbnail image is required.");
        }
        if (!title || !store || !category) {
            return toast.error("Please fill all required fields (*).");
        }
        
        // Validate pricing
        if (!price || price <= 0) {
            return toast.error("Price is required and must be greater than 0.");
        }
        
        // Validate special offer date
        if (specialOffer) {
            if (!offerEndTime) {
                return toast.error("Offer end time is required when special offer is enabled.");
            }
            const offerDate = new Date(offerEndTime);
            const now = new Date();
            if (offerDate <= now) {
                return toast.error("Offer end time must be in the future.");
            }
        }
        
        // Validate variants if hasVariant is enabled
        if (hasVariant) {
            if (variants.length === 0) {
                return toast.error("Please add at least one product variant.");
            }
            
            // Validate each variant
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];
                if (!variant.stock || variant.stock <= 0) {
                    return toast.error(`Variant ${i + 1}: Stock must be greater than 0.`);
                }
                if (!variant.price || variant.price <= 0) {
                    return toast.error(`Variant ${i + 1}: Price must be greater than 0.`);
                }
                if (variant.discountPrice && variant.discountPrice >= variant.price) {
                    return toast.error(`Variant ${i + 1}: Discount price must be less than regular price.`);
                }
            }
        }
        
        setIsSubmitting(true);

        try {
            // thumbnail এবং gallery image আপলোড করা
            let thumbnailUrl = thumbnailPreview; // Use existing thumbnail if in edit mode
            if (thumbnail) {
                thumbnailUrl = await uploadFile(thumbnail);
            }

            let validGalleryUrls = galleryImagePreviews || []; // Use existing gallery images if in edit mode
            if (galleryImages.length > 0) {
                const galleryUrls = await Promise.all(
                    galleryImages.map(file => uploadFile(file))
                );
                validGalleryUrls = galleryUrls.filter(url => !!url);
            }

            const productData = {
                productId: productCode || `PROD-${Date.now()}`,
                productTitle: title,
                vendorStoreId: store,
                shortDescription: shortDescription,
                fullDescription: fullDescription,
                specification: specification,
                warrantyPolicy: warrantyPolicy,
                productTag: tags ? tags.split(',').map(t => t.trim()) : [],
                videoUrl: videoUrl || undefined,
                
                // ✅ পরিবর্তন ৩: আপলোড করা URL ব্যবহার করা
                photoGallery: validGalleryUrls.length > 0 ? validGalleryUrls : [thumbnailUrl],
                thumbnailImage: thumbnailUrl, // এখন এটি সর্বদা একটি ভ্যালিড URL হবে
                
                productPrice: price || 0,
                discountPrice: discountPrice || undefined,
                stock: stock || 0,
                sku: productCode || undefined,
                rewardPoints: rewardPoints || 0,
                category: category,
                subCategory: subcategory || undefined,
                childCategory: childCategory || undefined,
                brand: brand || undefined,
                productModel: model || undefined,
                flag: flag || undefined,
                warranty: warranty,
                weightUnit: unit || undefined,
                offerDeadline: offerEndTime ? new Date(offerEndTime) : undefined,
                metaTitle: metaTitle || undefined,
                metaKeyword: metaKeywords || undefined,
                metaDescription: metaDescription || undefined,
                status: 'active',
                productOptions: hasVariant ? await Promise.all(variants.map(async variant => ({
                    ...variant,
                    image: variant.image ? await uploadFile(variant.image as File) : (variant.imageUrl || ''),
                }))) : [],
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
            }
        } catch (error: any) {
            // এখন uploadFile থেকে আসা এররও এখানে ধরা পড়বে
            console.error("Submission Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || error.message || `Failed to ${isEditMode ? 'update' : 'create'} product.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        } else {
            setThumbnail(null);
            setThumbnailPreview(null);
        }
    };
    
    // JSX কোডে কোনো পরিবর্তন প্রয়োজন নেই, তাই এটি সংক্ষিপ্ত করা হলো
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... আপনার JSX কোড এখানে থাকবে ... */}
            {/* ... কোনো পরিবর্তন নেই ... */}
             <div className="flex justify-end gap-2 sticky top-4 z-10 bg-gray-50/80 backdrop-blur-sm py-2 px-4 rounded-lg shadow-sm -mt-4">
                <Button type="button" variant="destructive">
                    <X className="mr-2 h-4 w-4" /> Discard
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    <Save className="mr-2 h-4 w-4" /> {isEditMode ? "Update Product" : "Save Product"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                             <div>
                                 <Label>Title *</Label>
                                 <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Product Name Here" required />
                             </div>
                             <div>
                                 <Label>Short Description (Max 255 Characters)</Label>
                                 <Textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} maxLength={255} placeholder="Enter Short Description Here" />
                             </div>
                             <div>
                                <Tabs defaultValue="description" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                                        <TabsTrigger value="description">Full Description</TabsTrigger>
                                        <TabsTrigger value="specification">Specification</TabsTrigger>
                                        <TabsTrigger value="warranty">Warranty Policy</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="description" className="mt-4 border rounded-md p-2"><RichTextEditor value={fullDescription} onChange={setFullDescription} /></TabsContent>
                                    <TabsContent value="specification" className="mt-4 border rounded-md p-2"><RichTextEditor value={specification} onChange={setSpecification} /></TabsContent>
                                    <TabsContent value="warranty" className="mt-4 border rounded-md p-2"><RichTextEditor value={warrantyPolicy} onChange={setWarrantyPolicy} /></TabsContent>
                                </Tabs>
                             </div>
                             <div>
                                 <Label>Tags (for search result)</Label>
                                 <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., Fashion, Dress, Shirt" />
                             </div>
                         </CardContent>
                    </Card>

                    {!hasVariant && <ProductImageGallery galleryImages={galleryImages} setGalleryImages={setGalleryImages} />}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Product Thumbnail Image *</CardTitle></CardHeader>
                        <CardContent className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg p-2">
                             <label htmlFor="thumbnail-upload" className="cursor-pointer text-center flex flex-col items-center justify-center h-full w-full">
                                 {thumbnailPreview ? (
                                     <div className="relative w-full h-full">
                                         <Image src={thumbnailPreview} alt="Thumbnail Preview" fill style={{ objectFit: 'contain' }} className="rounded-md" />
                                         <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full" onClick={() => { setThumbnail(null); setThumbnailPreview(null); }}>
                                             <X className="h-4 w-4" />
                                         </Button>
                                     </div>
                                 ) : (
                                     <div className="text-center text-gray-500">
                                         <UploadCloud className="mx-auto h-12 w-12" />
                                         <p>Drag and drop a file here or click</p>
                                     </div>
                                 )}
                                 <Input id="thumbnail-upload" type="file" className="hidden" onChange={handleThumbnailChange} accept="image/*" />
                             </label>
                         </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            {/* Pricing & Inventory Section */}
                            <PricingInventory 
                                formData={pricingFormData}
                                handleInputChange={handlePricingInputChange}
                                handleNumberChange={handlePricingNumberChange}
                            />
                            
                             <div>
                                 <Label>Product Code (SKU)</Label>
                                 <Input value={productCode} onChange={(e) => setProductCode(e.target.value)} />
                             </div>
                            <div>
                                <Label>Select Store *</Label>
                                <Select value={store} onValueChange={setStore} required>
                                    <SelectTrigger><SelectValue placeholder="Select One" /></SelectTrigger>
                                    <SelectContent>
                                        {initialData?.stores?.map((s: any) => <SelectItem key={s._id} value={s._id}>{s.storeName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Category *</Label>
                                <Select value={category} onValueChange={setCategory} required>
                                    <SelectTrigger><SelectValue placeholder="Select One" /></SelectTrigger>
                                    <SelectContent>
                                        {initialData?.categories?.map((c: any) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Subcategory</Label>
                                <Select value={subcategory} onValueChange={setSubcategory} disabled={!category || subcategories.length === 0}>
                                    <SelectTrigger><SelectValue placeholder="Select Category First" /></SelectTrigger>
                                    <SelectContent>
                                        {subcategories.map((sc: any) => <SelectItem key={sc._id} value={sc._id}>{sc.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Child Category</Label>
                                <Select value={childCategory} onValueChange={setChildCategory} disabled={!subcategory || childCategories.length === 0}>
                                    <SelectTrigger><SelectValue placeholder="Select Subcategory First" /></SelectTrigger>
                                    <SelectContent>
                                        {childCategories.map((cc: any) => <SelectItem key={cc._id} value={cc._id}>{cc.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div>
                                 <Label>Brand</Label>
                                 <Select value={brand} onValueChange={setBrand}>
                                     <SelectTrigger><SelectValue placeholder="Select One" /></SelectTrigger>
                                     <SelectContent>
                                         {initialData?.brands?.map((b: any) => <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}
                                     </SelectContent>
                                 </Select>
                             </div>
                             <div>
                                 <Label>Model</Label>
                                 <Select value={model} onValueChange={setModel} disabled={!brand || models.length === 0}>
                                     <SelectTrigger><SelectValue placeholder="Select Brand First" /></SelectTrigger>
                                     <SelectContent>
                                         {models.map((m: any) => <SelectItem key={m._id} value={m._id} className="text-black">{m.modelName}</SelectItem>)}
                                     </SelectContent>
                                 </Select>
                             </div>
                             <div>
                                 <Label>Flag</Label>
                                 <Select value={flag} onValueChange={setFlag}>
                                     <SelectTrigger><SelectValue placeholder="Select One" /></SelectTrigger>
                                     <SelectContent>
                                         {initialData?.flags?.map((f: any) => <SelectItem key={f._id} value={f._id}>{f.name}</SelectItem>)}
                                     </SelectContent>
                                 </Select>
                             </div>
                             <div>
                                 <Label>Unit</Label>
                                 <Select value={unit} onValueChange={setUnit}>
                                     <SelectTrigger><SelectValue placeholder="Select One" /></SelectTrigger>
                                     <SelectContent>
                                         {initialData?.units?.map((u: any) => <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>)}
                                     </SelectContent>
                                 </Select>
                             </div>
                             <div>
                                 <Label>Warranty</Label>
                                 <Select value={warranty} onValueChange={setWarranty}>
                                     <SelectTrigger><SelectValue placeholder="Select One" /></SelectTrigger>
                                     <SelectContent>
                                         {initialData?.warranties?.map((w: any) => <SelectItem key={w._id} value={w._id}>{w.warrantyName}</SelectItem>)}
                                     </SelectContent>
                                 </Select>
                             </div>
                             <div>
                                 <Label>Video URL</Label>
                                 <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                             </div>
                             <div className="flex items-center justify-between">
                                 <Label>Special Offer</Label>
                                 <Switch checked={specialOffer} onCheckedChange={setSpecialOffer} />
                             </div>
                             {specialOffer && (
                                 <div>
                                     <Label>Offer End Time *</Label>
                                     <Input 
                                         type="datetime-local" 
                                         value={offerEndTime} 
                                         onChange={(e) => setOfferEndTime(e.target.value)}
                                         min={new Date().toISOString().slice(0, 16)}
                                         required
                                     />
                                 </div>
                             )}
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
                    {hasVariant && (
                        // ✅ পরিবর্তন: initialData.variantOptions পাস করা হচ্ছে
                        <ProductVariantForm 
                            variants={variants} 
                            setVariants={setVariants}
                            variantData={initialData.variantOptions}
                        />
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Product SEO Information (Optional)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                             <Label>Meta Title</Label>
                             <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                         </div>
                         <div>
                             <Label>Meta Keywords</Label>
                             <Input value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} />
                         </div>
                     </div>
                     <div>
                         <Label>Meta Description</Label>
                         <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
                     </div>
                 </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="destructive">
                    <X className="mr-2 h-4 w-4" /> Discard
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    <Save className="mr-2 h-4 w-4" /> {isEditMode ? "Update Product" : "Save Product"}
                </Button>
            </div>
        </form>
    );
}