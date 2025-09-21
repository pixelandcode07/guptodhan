"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Select from "react-select"; // A great library for advanced select boxes
import { useForm, Controller } from "react-hook-form";
import { brandOptions, modelOptions } from "@/data/data"; // Assuming you have this data file
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define the structure of our form data
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

    // Get data from the previous step's URL
    const category = searchParams?.get("category") ?? "";
    const subcategory = searchParams?.get("subcategory") ?? "";
    const division = searchParams?.get("division") ?? "";
    const city = searchParams?.get("city") ?? "";
    const area = searchParams?.get("area") ?? "";




    const {
        register,
        handleSubmit,
        control,
        setValue,
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

        const fileArray = Array.from(files).slice(0, 5); // Limit to 5 photos
        setValue("photos", fileArray);

        // Clean up old previews to prevent memory leaks
        photoPreviews.forEach(URL.revokeObjectURL);

        const previews = fileArray.map((file) => URL.createObjectURL(file));
        setPhotoPreviews(previews);
    };

    const onSubmit = (data: FormData) => {
        // Create the final product object to be sent to the API
        const newProduct = {
            ...data,
            // Convert select options to simple string values
            brand: data.brand?.value,
            model: data.model?.value,
            edition: data.edition?.value,
            // Add the params from the URL
            category: category,
            subcategory: subcategory,
            location: {
                division,
                city,
                area
            },
        };
        console.log("Final Product Data:", newProduct);

        // In a real app, you would send `newProduct` and `data.photos` to your API here.
        // For now, we save it to localStorage as a mock database.
        const existingProducts = JSON.parse(localStorage.getItem("products") || "[]");
        localStorage.setItem("products", JSON.stringify([newProduct, ...existingProducts]));

        alert("Product submitted successfully!");
        router.push("/home/buyandsell");
    };

    return (
        <div className="flex justify-center items-center bg-gray-50 p-6 min-h-screen">
            <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Fill in the details</h1>
                <p className="text-gray-600 mb-6 text-center">
                    Posting in: <span className="font-semibold text-primary">{category}</span> / <span className="font-semibold text-primary">{subcategory}</span> / <span className="font-semibold text-primary">{division}</span>
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 border-t pt-8"
                >
                    {/* Column 1 - Basic Information */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold border-b pb-2">Product Details</h2>

                        <div>
                            <Label className="font-semibold">Condition*</Label>
                            <Controller
                                name="condition"
                                control={control}
                                rules={{ required: "Condition is required" }}
                                render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4 mt-2">
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="New" id="c-new" /><Label htmlFor="c-new">New</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="Used" id="c-used" /><Label htmlFor="c-used">Used</Label></div>
                                    </RadioGroup>
                                )}
                            />
                            {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>}
                        </div>

                        <div>
                            <Label className="font-semibold">Authenticity*</Label>
                            <Controller name="authenticity" control={control} rules={{ required: "Authenticity is required" }}
                                render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4 mt-2">
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="Original" id="a-original" /><Label htmlFor="a-original">Original</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="Refurbished" id="a-refurbished" /><Label htmlFor="a-refurbished">Refurbished</Label></div>
                                    </RadioGroup>
                                )}
                            />
                            {errors.authenticity && <p className="text-red-500 text-sm mt-1">{errors.authenticity.message}</p>}
                        </div>

                        <div>
                            <Label className="font-semibold">Brand</Label>
                            <Controller name="brand" control={control}
                                render={({ field }) => <Select {...field} options={brandOptions} isClearable />}
                            />
                        </div>

                        <div>
                            <Label className="font-semibold">Model</Label>
                            <Controller name="model" control={control}
                                render={({ field }) => <Select {...field} options={modelOptions} isClearable />}
                            />
                        </div>

                        <div>
                            <Label htmlFor="title" className="font-semibold">Ad Title*</Label>
                            <Input id="title" {...register("title", { required: "Title is required" })} />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="description" className="font-semibold">Description*</Label>
                            <Textarea id="description" {...register("description", { required: "Description is required" })} />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="price" className="font-semibold">Price*</Label>
                            <Input id="price" type="number" {...register("price", { required: "Price is required", valueAsNumber: true })} />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                        </div>
                    </div>

                    {/* Column 2 - Photos + Contact Info */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold border-b pb-2">Photos & Contact</h2>

                        <div>
                            <Label className="font-semibold">Add up to 5 photos*</Label>
                            <Input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="mt-2" />
                            <div className="flex space-x-2 mt-4">
                                {photoPreviews.map((src, idx) => (
                                    <Image
                                        key={idx}
                                        src={src}
                                        alt={`Preview ${idx + 1}`}
                                        width={80} // ✅ FIX: Added width prop
                                        height={80} // ✅ FIX: Added height prop
                                        className="object-cover rounded-md border"
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="name" className="font-semibold">Your Name*</Label>
                            <Input id="name" {...register("name", { required: "Your name is required" })} />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="email" className="font-semibold">Your Email*</Label>
                            <Input id="email" type="email" {...register("email", { required: "Your email is required" })} />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="phone" className="font-semibold">Your Phone Number*</Label>
                            <Input id="phone" {...register("phone", { required: "Your phone number is required" })} />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
                        <Button type="submit" className="w-full md:w-1/3">
                            Post Ad
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}