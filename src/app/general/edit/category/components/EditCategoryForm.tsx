'use client';

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UploadImage from "@/components/ReusableComponents/UploadImage";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
      router.push("/general/view/all/category");
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err?.message || "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Category Details</h2>
            <p className="text-sm text-gray-600 mt-1">
              Update the basic information, visibility and media for this category.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status === 'active' ? 'Active' : 'Inactive'}
            </span>
            {isFeatured === 'yes' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Featured
              </span>
            )}
            {isNavbar === 'yes' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                Navbar
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="border-b border-gray-100 p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Basic Information</h3>
              <p className="text-sm text-gray-600 mt-1">Set the category name and slug.</p>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Smartphones"
                />
                <p className="text-[11px] text-gray-500">This is the public display name for the category.</p>
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g., smartphones"
                />
                <p className="text-[11px] text-gray-500">Used in the URL. Keep it lowercase and hyphen-separated.</p>
              </div>
            </div>
          </div>

          {/* Visibility & Placement */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="border-b border-gray-100 p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Visibility & Placement</h3>
              <p className="text-sm text-gray-600 mt-1">Control visibility across your storefront.</p>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <p className="text-[11px] text-gray-500">Inactive categories are hidden from customers.</p>
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
                <p className="text-[11px] text-gray-500">Showcase this category prominently on the homepage.</p>
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
                <p className="text-[11px] text-gray-500">Display this category in the top navigation.</p>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="border-b border-gray-100 p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Media</h3>
              <p className="text-sm text-gray-600 mt-1">Upload the icon and banner for the category.</p>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category Icon</Label>
                <UploadImage
                  name="categoryIcon"
                  preview={category?.categoryIcon}
                  onChange={(_name, file) => setIconFile(file)}
                />
                <p className="text-[11px] text-gray-500">Recommended: Square image, PNG/JPG up to 1MB.</p>
              </div>
              <div className="space-y-2">
                <Label>Category Banner</Label>
                <UploadImage
                  name="categoryBanner"
                  preview={category?.categoryBanner}
                  onChange={(_name, file) => setBannerFile(file)}
                />
                <p className="text-[11px] text-gray-500">Recommended: Wide image, PNG/JPG up to 1MB.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <Button onClick={onSubmit} disabled={submitting} className="w-full sm:w-auto">
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


