'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProductForm({ initialData }: any) {
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

    const [rewardPoints, setRewardPoints] = useState(0);
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

    const [specialOffer, setSpecialOffer] = useState(false);
    const [offerEndTime, setOfferEndTime] = useState('');

    const [hasVariant, setHasVariant] = useState(false);
    const [variants, setVariants] = useState<IProductOption[]>([]);

    const [metaTitle, setMetaTitle] = useState('');
    const [metaKeywords, setMetaKeywords] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [stock, setStock] = useState(10);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;
    
    const [subcategories, setSubcategories] = useState([]);
    
    useEffect(() => {
        const fetchSubcategories = async () => {
            if (category && token) {
                try {
                    const res = await axios.get(`/api/v1/ecommerce-category/ecomSubCategory/category/${category}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setSubcategories(res.data?.data || []);
                } catch (error) {
                    console.error('Failed to fetch subcategories');
                }
            } else {
                setSubcategories([]);
            }
        };
        fetchSubcategories();
    }, [category, token]);
    
    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
        });
        return response.data.url;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!token) return toast.error("Authentication required.");
        setIsSubmitting(true);

        try {
            let thumbnailUrl = '';
            if (thumbnail) thumbnailUrl = await uploadFile(thumbnail);

            let galleryUrls: string[] = [];
            if (galleryImages.length > 0) {
                galleryUrls = await Promise.all(galleryImages.map(file => uploadFile(file)));
            }

            // ✅ FIX: Using the correct state variables to build the payload
            const productData = {
                productId: productCode || `PROD-${Date.now()}`,
                productTitle: title,
                shortDescription: shortDescription,
                fullDescription: fullDescription,
                specification: specification,
                warrantyPolicy: warrantyPolicy,
                productTag: tags ? tags.split(',').map(t => t.trim()) : [],
                videoUrl: videoUrl || undefined,
                photoGallery: galleryUrls.length > 0 ? galleryUrls : (thumbnailUrl ? [thumbnailUrl] : []),
                thumbnailImage: thumbnailUrl,
                productPrice: price,
                discountPrice: discountPrice || undefined,
                stock: stock,
                sku: productCode || undefined,
                rewardPoints: rewardPoints,
                vendorStoreId: store,
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
                    image: variant.image ? await uploadFile(variant.image) : (variant.imageUrl || ''),
                }))) : [],
            };

            await axios.post('/api/v1/product', productData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            toast.success("Product created successfully!");
        } catch (error: any) {
            console.error("Submission Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to create product.");
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-end gap-2 sticky top-4 z-10 bg-gray-50/80 backdrop-blur-sm py-2 px-4 rounded-lg shadow-sm -mt-4">
                <Button type="button" variant="destructive">
                    <X className="mr-2 h-4 w-4" />
                    Discard
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Product
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
                                    <TabsContent value="description" className="mt-4 border rounded-md p-2">
                                        <RichTextEditor value={fullDescription} onChange={setFullDescription} />
                                    </TabsContent>
                                    <TabsContent value="specification" className="mt-4 border rounded-md p-2">
                                        <RichTextEditor value={specification} onChange={setSpecification} />
                                    </TabsContent>
                                    <TabsContent value="warranty" className="mt-4 border rounded-md p-2">
                                        <RichTextEditor value={warrantyPolicy} onChange={setWarrantyPolicy} />
                                    </TabsContent>
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
                        <CardHeader>
                            <CardTitle>Product Thumbnail Image *</CardTitle>
                        </CardHeader>
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
                            <div>
                                <Label>Reward Points</Label>
                                <Input type="number" value={rewardPoints} onChange={(e) => setRewardPoints(Number(e.target.value))} />
                            </div>
                            <div>
                                <Label>Product Code</Label>
                                <Input value={productCode} onChange={(e) => setProductCode(e.target.value)} />
                            </div>
                            <div>
                                <Label>Select Store *</Label>
                                <Select value={store} onValueChange={setStore}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select One" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {initialData?.stores?.map((s: any) => (
                                            <SelectItem key={s._id} value={s._id}>
                                                {s.storeName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Category *</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select One" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {initialData?.categories?.map((c: any) => (
                                            <SelectItem key={c._id} value={c._id}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Subcategory</Label>
                                <Select value={subcategory} onValueChange={setSubcategory} disabled={!category}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select One" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subcategories.map((sc: any) => (
                                            <SelectItem key={sc._id} value={sc._id}>
                                                {sc.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Child Category</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select One" />
                                    </SelectTrigger>
                                    <SelectContent>{/* Options */}</SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Brand</Label>
                                <Select value={brand} onValueChange={setBrand}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select One" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {initialData?.brands?.map((b: any) => (
                                            <SelectItem key={b._id} value={b._id}>
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Model</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select One" />
                                    </SelectTrigger>
                                    <SelectContent>{/* Options */}</SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Flag</Label>
                                <Select value={flag} onValueChange={setFlag}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select One" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {initialData?.flags?.map((f: any) => (
                                            <SelectItem key={f._id} value={f._id}>
                                                {f.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Unit</Label>
                                <Select value={unit} onValueChange={setUnit}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select One" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {initialData?.units?.map((u: any) => (
                                            <SelectItem key={u._id} value={u._id}>
                                                {u.name}
                                            </SelectItem>
                                        ))}
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
                                    <Label>Offer End Time</Label>
                                    <Input type="datetime-local" value={offerEndTime} onChange={(e) => setOfferEndTime(e.target.value)} />
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
                    {hasVariant && <ProductVariantForm variants={variants} setVariants={setVariants} />}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Product SEO Information (Optional)</CardTitle>
                </CardHeader>
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
                    <X className="mr-2 h-4 w-4" />
                    Discard
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Product
                </Button>
            </div>
        </form>
    );
}