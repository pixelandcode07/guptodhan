"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { brandOptions, editionOptions, modelOptions } from "@/data/data";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";



type FormData = {
    condition: string;
    authenticity: string;
    brand: { value: string; label: string } | null;
    model: { value: string; label: string } | null;
    edition: { value: string; label: string } | null;
    title: string;
    description: string;
    price: number;
    name: string;
    email: string;
    phone: string;
    photos: File[];
};

export default function ProductForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const category = searchParams?.get("category") ?? "";
    const subcategory = searchParams?.get("subcategory") ?? "";
    const location = searchParams?.get("location") ?? "";

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            brand: null,
            model: null,
            edition: null,
            photos: [],
        },
    });

    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files).slice(0, 5); // limit to 5
        setValue("photos", fileArray);

        const previews = fileArray.map((file) => URL.createObjectURL(file));
        setPhotoPreviews(previews);
    };

    const onSubmit = (data: FormData) => {
        // console.log("Submitted Data:", data);

        // Create product object
        const newProduct = {
            condition: data?.condition,
            authenticity: data?.authenticity,
            brand: data?.brand,
            model: data?.model,
            edition: data?.edition,
            title: data?.title,
            description: data?.description,
            price: data?.price,
            name: data?.name,
            email: data?.email,
            phone: data?.phone,
            category: category,
            subcategory: subcategory,
            location: location,

        }
        console.log("newProduct", newProduct)

        // Save to localStorage (mock DB for now)
        const existingProducts = JSON.parse(localStorage.getItem("products") || "[]");
        localStorage.setItem("products", JSON.stringify([newProduct, ...existingProducts]));

        // Redirect to Buy & Sell Home
        router.push("/home/buyandsell");
        alert("Form submitted successfully!");
    };

    return (
        <div className="flex justify-center items-center bg-gray-50 p-6">
            <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">Fill in the details</h1>
                <p className="text-gray-600 mb-4 text-center">
                    Category: <span className="font-semibold">{category}</span> <br />
                    Subcategory: <span className="font-semibold">{subcategory}</span> <br />
                    Location: <span className="font-semibold">{location}</span>
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50"
                >
                    {/* Column 1 - Basic Information */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Basic Information</h2>

                        <div>
                            <Label className="block mb-2">Condition</Label>
                            <Controller
                                name="condition"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex items-center space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="New" id="condition-new" />
                                            <Label htmlFor="condition-new">New</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Used" id="condition-used" />
                                            <Label htmlFor="condition-used">Used</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>

                        {/* Authenticity */}
                        <div>
                            <Label className="block mb-2">Authenticity</Label>
                            <Controller
                                name="authenticity"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex items-center space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Original" id="auth-original" />
                                            <Label htmlFor="auth-original">Original</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Refurbished" id="auth-refurbished" />
                                            <Label htmlFor="auth-refurbished">Refurbished</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>

                        {/* Brand */}
                        <div>
                            <Label className="mb-2">Brand</Label>
                            <Controller
                                name="brand"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} options={brandOptions} isClearable />
                                )}
                            />
                        </div>

                        {/* Model */}
                        <div>
                            <Label className="mb-2">Model</Label>
                            <Controller
                                name="model"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} options={modelOptions} isClearable />
                                )}
                            />
                        </div>

                        {/* Edition */}
                        <div>
                            <Label className="mb-2">Edition</Label>
                            <Controller
                                name="edition"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} options={editionOptions} isClearable />
                                )}
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <Label htmlFor="title" className="mb-2">Title</Label>
                            <Input id="title" {...register("title", { required: true })} />
                            {errors.title && (
                                <span className="text-red-500 text-sm">Title is required</span>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description" className="mb-2">Description</Label>
                            <Textarea
                                id="description"
                                {...register("description", { required: true })}
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <Label htmlFor="price" className="mb-2">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                {...register("price", { required: true, valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    {/* Column 2 - Photos + Contact Info */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Photos & Contact Info</h2>

                        {/* Photos */}
                        <div>
                            <Label className="mb-2">Add up to 5 photos</Label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoChange}
                                className="mt-2"
                            />
                            <div className="flex space-x-2 mt-3">
                                {photoPreviews.map((src, idx) => (
                                    <Image
                                        key={idx}
                                        src={src}
                                        alt={`Preview ${idx + 1}`}
                                        className="w-20 h-20 object-cover rounded-md border"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <Label htmlFor="name" className="mb-2">Name</Label>
                            <Input id="name" {...register("name", { required: true })} />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="mb-2">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email", { required: true })}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <Label htmlFor="phone" className="mb-2">Phone Number</Label>
                            <Input id="phone" {...register("phone", { required: true })} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-1 md:col-span-2 flex justify-center">
                        <Button type="submit" className="w-full md:w-1/3">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
