"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UploadImageBtn from "@/app/general/buy/sell/config/components/UploadImageBtn";
import Select from "react-select";
import { useSession } from "next-auth/react";
import FancyLoadingPage from "@/app/general/loading";

interface FormInputs {
    name: string;
    icon: File | null;
    status: "pending" | "active" | "inactive";
    slug: string;
    existingIconUrl?: string;
}

export default function EditCategoryPage() {
    const { data: session } = useSession();
    const token = session?.accessToken;
    const params = useParams();
    const categoryId = params?.id;
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, reset, control, watch } = useForm<FormInputs>({
        defaultValues: {
            name: "",
            icon: null,
            status: "active",
            slug: "",
            existingIconUrl: "",
        },
    });

    const iconFile = watch("icon");

    // Fetch backend data
    useEffect(() => {
        if (!categoryId) return;

        const fetchCategory = async () => {
            try {
                setLoading(true);
                // const baseUrl = process.env.NEXTAUTH_URL;
                const { data } = await axios.get(`/api/v1/public/classifieds-categories/${categoryId}`);
                const category = data.data;

                reset({
                    name: category.name,
                    slug: category.slug,
                    status: category.status,
                    icon: null,
                    existingIconUrl: category.icon,
                });
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch category data");
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [categoryId, reset]);

    const onSubmit: SubmitHandler<FormInputs> = async (formData) => {
        try {
            // const baseUrl = process.env.NEXTAUTH_URL;
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("slug", formData.slug);
            formDataToSend.append("status", formData.status);

            if (formData.icon) {
                formDataToSend.append("icon", formData.icon);
            }

            await axios.patch(`/api/v1/classifieds-categories/${categoryId}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`, // attach token
                    "x-user-role": session?.user?.role
                },
            });

            toast.success("Category updated successfully!");
            router.push("/general/categories?page=view");
        } catch (err) {
            console.error(err);
            toast.error("Update failed!");
        }
    };

    if (loading) return <FancyLoadingPage />

    return (
        <div className="p-5 bg-white shadow rounded-md">
            <h1 className="text-lg font-semibold mb-5">Edit Category</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block mb-1">Name</label>
                    <Input {...register("name")} placeholder="Enter category name" />
                </div>

                {/* Slug */}
                <div>
                    <label className="block mb-1">Slug</label>
                    <Input {...register("slug")} placeholder="Enter slug" />
                </div>

                {/* Status */}
                <div>
                    <label className="block mb-1">Status</label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={[
                                    // { value: "pending", label: "Pending" },
                                    { value: "active", label: "Active" },
                                    { value: "inactive", label: "Inactive" },
                                ]}
                                value={{ value: field.value, label: field.value.charAt(0).toUpperCase() + field.value.slice(1) }}
                                onChange={(val) => field.onChange(val?.value)}
                            />
                        )}
                    />
                </div>

                {/* Icon */}
                <div>
                    <label className="block mb-1">Icon</label>
                    <Controller
                        name="icon"
                        control={control}
                        render={({ field }) => (
                            <UploadImageBtn
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {/* Show existing icon preview if user didn't upload new */}
                    {!iconFile && watch("existingIconUrl") && (
                        <img src={watch("existingIconUrl")} alt="Existing Icon" className="mt-2 w-24 h-24 object-cover rounded" />
                    )}
                </div>

                <Button type="submit">Save Changes</Button>
            </form>
        </div>
    );
}
