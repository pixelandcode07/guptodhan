"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import UploadImageBtn from "@/components/ReusableComponents/UploadImageBtn";
import { toast } from "sonner";
import axios from "axios";

type SubCategory = {
  _id?: string;
  name: string;
  category?: { _id: string; name: string } | string;
  categoryId?: string;
  subCategoryIcon?: string;
  subCategoryBanner?: string;
  slug?: string;
  isFeatured?: boolean;
  isNavbar?: boolean;
  status: "Active" | "Inactive";
};

interface CategoryOption { label: string; value: string }

export default function SubCategoryEditModal({ open, onOpenChange, data, onSaved, onOptimisticUpdate }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: SubCategory | null;
  onSaved: () => void;
  onOptimisticUpdate?: (update: {
    _id: string;
    name: string;
    slug: string;
    status: "Active" | "Inactive";
    isFeatured: boolean;
    isNavbar: boolean;
    categoryName?: string;
    categoryId?: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isFeatured, setIsFeatured] = useState("no");
  const [isNavbar, setIsNavbar] = useState("no");
  const [status, setStatus] = useState("active");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // load categories for select
    (async () => {
      try {
        const res = await axios.get('/api/v1/ecommerce-category/ecomCategory', { params: { _ts: Date.now() } });
        const items = (res.data?.data || []) as Array<{ _id: string; name: string; categoryId: string }>;
        setCategories(items.map(it => ({ label: it.name, value: it._id })));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setSlug((data.slug || ""));
      setIsFeatured(data.isFeatured ? "yes" : "no");
      setIsNavbar(data.isNavbar ? "yes" : "no");
      setStatus((data.status || "Active").toLowerCase());
      setIconFile(null);
      setBannerFile(null);
      if (data.categoryId) {
        setCategoryId(data.categoryId);
      } else {
        const cat = data.category;
        if (typeof cat === 'object' && (cat as any)?._id) setCategoryId((cat as any)._id);
        else if (typeof cat === 'string') setCategoryId(cat);
      }
    }
  }, [data, open]);

  const onSubmit = async () => {
    if (!data?._id) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("status", status);
      formData.append("isFeatured", isFeatured === "yes" ? "true" : "false");
      formData.append("isNavbar", isNavbar === "yes" ? "true" : "false");
      if (categoryId) formData.append("category", categoryId);
      if (iconFile) formData.append("subCategoryIcon", iconFile);
      if (bannerFile) formData.append("subCategoryBanner", bannerFile);

      const res = await fetch(`/api/v1/ecommerce-category/ecomSubCategory/${data._id}`, {
        method: "PATCH",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to update subcategory");

      onOptimisticUpdate?.({
        _id: data._id,
        name,
        slug,
        status: status === "active" ? "Active" : "Inactive",
        isFeatured: isFeatured === "yes",
        isNavbar: isNavbar === "yes",
        categoryId,
        categoryName: categories.find(c => c.value === categoryId)?.label,
      });

      toast.success("Subcategory updated");
      onOpenChange(false);
      onSaved();
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err?.message || "Failed to update subcategory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            Edit Subcategory
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6 py-4">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-3">
              <h3 className="text-sm sm:text-base font-medium text-gray-900">Basic Information</h3>
              <p className="text-xs text-gray-600">Update the essential details</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Name</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter subcategory name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Slug</Label>
              <Input 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)}
                className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter slug"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Featured</Label>
                <Select value={isFeatured} onValueChange={setIsFeatured}>
                  <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Show On Navbar</Label>
                <Select value={isNavbar} onValueChange={setIsNavbar}>
                  <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-3">
              <h3 className="text-sm sm:text-base font-medium text-gray-900">Media Upload</h3>
              <p className="text-xs text-gray-600">Update the subcategory icon and banner</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Icon</Label>
                <UploadImageBtn value={iconFile} onChange={setIconFile} />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Banner</Label>
                <UploadImageBtn value={bannerFile} onChange={setBannerFile} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={loading}
            className="w-full sm:w-auto h-10 sm:h-11"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={loading}
            className="w-full sm:w-auto h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


