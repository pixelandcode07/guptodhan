'use client';

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UploadImage from "@/components/ReusableComponents/UploadImage";

type Category = {
  _id: string;
  name: string;
  slug?: string;
  categoryIcon?: string;
  categoryBanner?: string;
  isFeatured?: boolean;
  isNavbar?: boolean;
  status?: "Active" | "Inactive" | "active" | "inactive";
};

export default function EditCategoryForm({
  category,
  token,
  userRole,
}: {
  category: Category;
  token?: string;
  userRole?: string;
}) {
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [isFeatured, setIsFeatured] = useState(category?.isFeatured ? "yes" : "no");
  const [isNavbar, setIsNavbar] = useState(category?.isNavbar ? "yes" : "no");
  const [status, setStatus] = useState((category?.status || "Active").toString().toLowerCase());
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!category) return;
    setName(category.name || "");
    setSlug(category.slug || "");
    setIsFeatured(category.isFeatured ? "yes" : "no");
    setIsNavbar(category.isNavbar ? "yes" : "no");
    setStatus((category.status || "Active").toString().toLowerCase());
    setIconFile(null);
    setBannerFile(null);
  }, [category]);

  const onSubmit = async () => {
    if (!category?._id) return;
    if (userRole !== "admin") {
      toast.error("Access denied: Admin privileges required");
      return;
    }
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("status", status);
      formData.append("isFeatured", isFeatured === "yes" ? "true" : "false");
      formData.append("isNavbar", isNavbar === "yes" ? "true" : "false");
      if (iconFile) formData.append("categoryIcon", iconFile);
      if (bannerFile) formData.append("categoryBanner", bannerFile);

      const res = await fetch(`/api/v1/ecommerce-category/ecomCategory/${category._id}`, {
        method: "PATCH",
        body: formData,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || "Failed to update category");
      }
      toast.success("Category updated");
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err?.message || "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="enter-category-slug"
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Featured</Label>
          <Select value={isFeatured} onValueChange={setIsFeatured}>
            <SelectTrigger>
              <SelectValue placeholder="Is featured?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Show on Navbar</Label>
          <Select value={isNavbar} onValueChange={setIsNavbar}>
            <SelectTrigger>
              <SelectValue placeholder="Show on navbar?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Category Icon</Label>
          <UploadImage
            name="categoryIcon"
            preview={category?.categoryIcon}
            onChange={(_name, file) => setIconFile(file)}
          />
        </div>
        <div className="space-y-2">
          <Label>Category Banner</Label>
          <UploadImage
            name="categoryBanner"
            preview={category?.categoryBanner}
            onChange={(_name, file) => setBannerFile(file)}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button onClick={onSubmit} disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}


