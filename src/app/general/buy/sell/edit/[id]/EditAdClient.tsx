// src/app/general/buy/sell/edit/[id]/EditAdClient.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useState, useMemo } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FiveUploadImageBtn from "@/components/ReusableComponents/FiveUploadImageBtn";
import Image from "next/image";

// Location Data
import { division_wise_locations } from "@/data/division_wise_locations";
const divisions = Object.keys(division_wise_locations);

// Zod Schema (status removed from main form)
const formSchema = z.object({
    title: z.string().min(5, "Title too short"),
    categoryId: z.string().min(1, "Select category"),
    subCategoryId: z.string().min(1, "Select sub-category"),
    division: z.string().min(1, "Select division"),
    district: z.string().min(1, "Select district"),
    upazila: z.string().min(1, "Select upazila"),
    condition: z.enum(["new", "used"]),
    authenticity: z.enum(["original", "refurbished"]),
    brand: z.string().optional(),
    productModel: z.string().optional(),
    edition: z.string().optional(),
    description: z.string().min(20, "Description too short"),
    price: z.coerce.number().positive("Price must be positive"),
    isNegotiable: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
    ad: any;
    categories: any[];
    token: string;
    adId: string;
};

export default function EditAdClient({ ad, categories, token, adId }: Props) {
    const [newImages, setNewImages] = useState<(File | null)[]>(new Array(5).fill(null));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isStatusUpdating, setIsStatusUpdating] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ad.title || "",
            categoryId: ad.category._id,
            subCategoryId: ad.subCategory._id,
            division: ad.division || "",
            district: ad.district || "",
            upazila: ad.upazila || "",
            condition: ad.condition || "used",
            authenticity: ad.authenticity || "original",
            brand: ad.brand || "",
            productModel: ad.productModel || "",
            edition: ad.edition || "",
            description: ad.description || "",
            price: ad.price || 0,
            isNegotiable: ad.isNegotiable || false,
        },
    });

    const selectedDivision = watch("division");
    const selectedDistrict = watch("district");
    const selectedCategoryId = watch("categoryId");
    const selectedCategory = categories.find((c: any) => c._id === selectedCategoryId);

    const districts = useMemo(() => {
        if (!selectedDivision) return [];
        return Object.keys(division_wise_locations[selectedDivision] || {});
    }, [selectedDivision]);

    const upazilas = useMemo(() => {
        if (!selectedDivision || !selectedDistrict) return [];
        return division_wise_locations[selectedDivision][selectedDistrict] || [];
    }, [selectedDivision, selectedDistrict]);

    // Convert File to Base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Main Form Submit (Content + Images Only)
    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);

        const newImageBase64: string[] = [];
        const existingImages: string[] = [];

        for (let i = 0; i < 5; i++) {
            if (newImages[i]) {
                const base64 = await fileToBase64(newImages[i]!);
                newImageBase64.push(base64);
            } else if (ad.images[i]) {
                existingImages.push(ad.images[i]);
            }
        }

        const payload: any = { ...data };

        if (newImageBase64.length > 0) payload.images = newImageBase64;
        if (existingImages.length > 0) payload.existingImages = existingImages;

        try {
            await axios.patch(`/api/v1/classifieds/ads/${adId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success("Ad updated successfully!");
            router.push("/general/buy/sell/listing");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update ad");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Separate Status Update (Admin Only)
    const updateStatus = async (newStatus: string) => {
        if (newStatus === ad.status) return;

        setIsStatusUpdating(true);
        try {
            await axios.patch(
                `/api/v1/classifieds/ads/status/${adId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success(`Status changed to ${newStatus}`);
            // Optionally refresh page or update ad.status in state
            setTimeout(() => window.location.reload(), 800);
        } catch (err: any) {
            toast.error("Failed to update status");
        } finally {
            setIsStatusUpdating(false);
        }
    };

    return (
        <>
            <Toaster position="top-center" richColors />

            <div className="container mx-auto py-10 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">Edit Ad - {ad.title}</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Title */}
                    <div>
                        <Label>Title</Label>
                        <Input {...register("title")} />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    {/* Category & Subcategory */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Label>Category</Label>
                            <Select
                                onValueChange={(v) => {
                                    setValue("categoryId", v);
                                    setValue("subCategoryId", "");
                                }}
                                defaultValue={ad.category._id}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat: any) => (
                                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Sub Category</Label>
                            <Select
                                disabled={!selectedCategory}
                                onValueChange={(v) => setValue("subCategoryId", v)}
                                value={watch("subCategoryId")}
                            >
                                <SelectTrigger><SelectValue placeholder="Select category first" /></SelectTrigger>
                                <SelectContent>
                                    {selectedCategory?.subCategories.map((sub: any) => (
                                        <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <Label className="text-lg font-semibold">Location</Label>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                            <Select
                                onValueChange={(v) => {
                                    setValue("division", v);
                                    setValue("district", "");
                                    setValue("upazila", "");
                                }}
                                value={watch("division")}
                            >
                                <SelectTrigger><SelectValue placeholder="Division" /></SelectTrigger>
                                <SelectContent>
                                    {divisions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Select
                                disabled={!selectedDivision}
                                onValueChange={(v) => {
                                    setValue("district", v);
                                    setValue("upazila", "");
                                }}
                                value={watch("district")}
                            >
                                <SelectTrigger><SelectValue placeholder="District" /></SelectTrigger>
                                <SelectContent>
                                    {districts.map((dist) => <SelectItem key={dist} value={dist}>{dist}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Select
                                disabled={!selectedDistrict}
                                onValueChange={(v) => setValue("upazila", v)}
                                value={watch("upazila")}
                            >
                                <SelectTrigger><SelectValue placeholder="Upazila / Area" /></SelectTrigger>
                                <SelectContent>
                                    {upazilas.map((area) => <SelectItem key={area} value={area}>{area}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Condition & Authenticity */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Label>Condition</Label>
                            <Select onValueChange={(v) => setValue("condition", v as any)} defaultValue={ad.condition}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="used">Used</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Authenticity</Label>
                            <Select onValueChange={(v) => setValue("authenticity", v as any)} defaultValue={ad.authenticity}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="original">Original</SelectItem>
                                    <SelectItem value="refurbished">Refurbished</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Brand, Model, Edition */}
                    <div className="grid grid-cols-3 gap-4">
                        <div><Label>Brand</Label><Input {...register("brand")} /></div>
                        <div><Label>Model</Label><Input {...register("productModel")} /></div>
                        <div><Label>Edition (Optional)</Label><Input {...register("edition")} /></div>
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Textarea rows={6} {...register("description")} />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <div className="flex items-end gap-8">
                        <div className="flex-1">
                            <Label>Price (BDT)</Label>
                            <Input type="number" {...register("price")} />
                            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                        </div>
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="negotiable"
                                checked={watch("isNegotiable")}
                                onCheckedChange={(c) => setValue("isNegotiable", !!c)}
                            />
                            <Label htmlFor="negotiable">Negotiable</Label>
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <Label>Images (Click to replace)</Label>
                        <div className="grid grid-cols-5 gap-4 mt-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="relative group cursor-pointer">
                                    {newImages[i] ? (
                                        <Image
                                            src={URL.createObjectURL(newImages[i]!)}
                                            alt="New"
                                            width={200}
                                            height={200}
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                    ) : ad.images[i] ? (
                                        <Image
                                            src={ad.images[i]}
                                            alt="Current"
                                            width={200}
                                            height={200}
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                    ) : (
                                        <div className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 bg-gray-50">
                                            Add Image
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                                        <FiveUploadImageBtn
                                            value={newImages[i]}
                                            onChange={(file) => {
                                                const updated = [...newImages];
                                                updated[i] = file;
                                                setNewImages(updated);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Current images are shown. Hover and click to replace.
                        </p>
                    </div>

                    {/* Admin Status Change - Separate API */}
                    <Card className="bg-orange-50 border-orange-200">
                        <CardHeader>
                            <CardTitle>Admin: Change Ad Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select
                                value={ad.status}
                                onValueChange={updateStatus}
                                disabled={isStatusUpdating}
                            >
                                <SelectTrigger className="w-64">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="sold">Sold</SelectItem>
                                </SelectContent>
                            </Select>
                            {isStatusUpdating && <p className="text-sm text-orange-600 mt-2">Updating status...</p>}
                        </CardContent>
                    </Card>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Updating Ad..." : "Update Ad"}
                    </Button>
                </form>
            </div>
        </>
    );
}