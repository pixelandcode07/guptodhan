"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UploadImageBtn from "@/components/ReusableComponents/UploadImageBtn";

type CategoryFormData = {
    name: string;
    status: string;
};

export default function EditDonationCat() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const { data: session } = useSession();
    const token = (session?.user as { accessToken?: string; role?: string })?.accessToken;
    const adminRole = (session?.user as { role?: string })?.role === "admin";

    const [iconFile, setIconFile] = useState<File | string | null>(null);
    const [statusValue, setStatusValue] = useState<string>("active");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { isSubmitting },
    } = useForm<CategoryFormData>({
        defaultValues: {
            name: "",
            status: "active",
        },
    });

    // Fetch category data by ID
    useEffect(() => {
        const fetchCategory = async () => {
            // if (!token) return;
            try {
                const { data } = await axios.get(`/api/v1/public/donation-categories/${id}`);

                // Debug log to check data
                console.log("Fetched Category by ID:", data);

                // Update form fields
                // setValue("name", data?.name || "");
                // setValue("status", data?.status || "active");
                // setStatusValue(data?.status || "active");
                // setIconFile(data?.icon || null);
            } catch (error: any) {
                console.error(error);
                toast.error(error?.response?.data?.message || "Failed to fetch category");
            }
        };

        if (id && token) fetchCategory();
    }, [id, token, setValue]);

    // Handle form submit
    const onSubmit = async (formData: CategoryFormData) => {
        if (!adminRole) {
            toast.error("Only admins can update categories!");
            return;
        }

        try {
            const form = new FormData();
            form.append("name", formData.name);
            form.append("status", formData.status);

            if (iconFile && iconFile instanceof File) {
                form.append("icon", iconFile);
            }

            await axios.patch(`/api/v1/donation-categories/${id}`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Category updated successfully!");
            router.push("/general/donation/categories?page=view-category");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Error updating category");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
            <h2 className="text-2xl font-semibold mb-6 text-center">
                Edit Donation Category
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Category Name */}
                <div>
                    <Label htmlFor="name" className="mb-2">
                        Category Name
                    </Label>
                    <Input
                        id="name"
                        {...register("name")}
                        // , { required: "Category name is required" }
                    />
                </div>

                {/* Category Icon */}
                <div>
                    <Label htmlFor="icon">Category Icon</Label>
                    <UploadImageBtn
                        value={iconFile}
                        onChange={(file) => setIconFile(file)}
                        onRemove={() => setIconFile(null)}
                    />
                </div>

                {/* Category Status */}
                <div>
                    <Label htmlFor="status" className="mb-2">
                        Category Status
                    </Label>
                    <Select
                        value={statusValue}
                        onValueChange={(value) => {
                            setStatusValue(value);
                            setValue("status", value);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isSubmitting || !adminRole}>
                    {isSubmitting ? "Updating..." : "Update Category"}
                </Button>
            </form>
        </div>
    );
}
