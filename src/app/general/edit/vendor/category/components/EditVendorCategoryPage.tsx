"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateVendorCategory } from "@/lib/MultiVendorApis/updateVendorCategory";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  category: { _id: string; name: string; slug: string; status: "active" | "inactive" };
  token: string;
}

export default function EditVendorCategoryForm({ category, token }: Props) {
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [status, setStatus] = useState(category.status);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await toast.promise(
        updateVendorCategory(category._id, { name, slug, status }, token),
        {
          loading: "Updating...",
          success: "Category updated!",
          error: (err) => err.message,
        }
      );
      router.push("/general/view/vendor/categories");
    } catch (error) {
      // toast handles it
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Slug</label>
        <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
          className="w-full border rounded-md p-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Update Category"}
      </Button>
    </form>
  );
}