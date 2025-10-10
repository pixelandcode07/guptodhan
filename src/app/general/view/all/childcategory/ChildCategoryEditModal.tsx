"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import UploadImage from "@/components/ReusableComponents/UploadImage";
import { toast } from "sonner";
import axios from "axios";

type ChildCategory = {
  _id?: string;
  name: string;
  category?: string;
  subCategory?: string;
  categoryId?: string;
  subCategoryId?: string;
  icon?: string;
  slug?: string;
  status: "Active" | "Inactive";
};

type CategoryOption = {
  label: string;
  value: string;
};

export default function ChildCategoryEditModal({ 
  open, 
  onOpenChange, 
  data, 
  onSaved, 
  onOptimisticUpdate 
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: ChildCategory | null;
  onSaved: () => void;
  onOptimisticUpdate?: (update: {
    _id: string;
    name: string;
    slug: string;
    status: "Active" | "Inactive";
    categoryName?: string;
    subCategoryName?: string;
    categoryId?: string;
    subCategoryId?: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("active");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [subCategoryId, setSubCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load categories for select
    (async () => {
      try {
        const res = await axios.get('/api/v1/ecommerce-category/ecomCategory', { params: { _ts: Date.now() } });
        const items = (res.data?.data || []) as Array<{ _id: string; name: string }>;
        setCategories(items.map(it => ({ label: it.name, value: it._id })));
      } catch {}
    })();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (categoryId) {
      (async () => {
        try {
          const res = await axios.get(`/api/v1/ecommerce-category/ecomSubCategory/category/${categoryId}`, { params: { _ts: Date.now() } });
          const items = (res.data?.data || []) as Array<{ _id: string; name: string }>;
          setSubCategories(items.map(it => ({ label: it.name, value: it._id })));
        } catch {}
      })();
    } else {
      setSubCategories([]);
    }
  }, [categoryId]);

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setSlug(data.slug || "");
      setStatus(data.status?.toLowerCase() || "active");
      setIconFile(null);
      
      if (data.categoryId) {
        setCategoryId(data.categoryId);
      } else if (typeof data.category === 'string') {
        setCategoryId(data.category);
      }
      
      if (data.subCategoryId) {
        setSubCategoryId(data.subCategoryId);
      } else if (typeof data.subCategory === 'string') {
        setSubCategoryId(data.subCategory);
      }
    }
  }, [data, open]);

  const onSubmit = async () => {
    if (!data?._id) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('status', status);
      if (categoryId) formData.append('category', categoryId);
      if (subCategoryId) formData.append('subCategory', subCategoryId);
      if (iconFile) formData.append('childCategoryIcon', iconFile);

      const res = await fetch(`/api/v1/ecommerce-category/ecomChildCategory/${data._id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update child category: ${res.status} ${res.statusText}`);
      }

      const result = await res.json();
      toast.success("Child category updated successfully!");

      // Optimistic update
      if (onOptimisticUpdate) {
        const selectedCategory = categories.find(c => c.value === categoryId);
        const selectedSubCategory = subCategories.find(s => s.value === subCategoryId);
        
        onOptimisticUpdate({
          _id: data._id,
          name,
          slug,
          status: status === "active" ? "Active" : "Inactive",
          categoryName: selectedCategory?.label,
          subCategoryName: selectedSubCategory?.label,
          categoryId,
          subCategoryId,
        });
      }

      onOpenChange(false);
      onSaved();
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err?.message || "Failed to update child category");
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
            Edit Child Category
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
                <Label className="text-sm font-medium text-gray-700">Subcategory</Label>
                <Select value={subCategoryId} onValueChange={setSubCategoryId} disabled={!categoryId}>
                  <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Name</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter child category name"
                />
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
              <p className="text-xs text-gray-600">Update the child category icon</p>
            </div>
            
            <div className="space-y-3">
              <UploadImage
                name="child_category_icon_edit"
                label="Child Category Icon"
                preview={data?.icon}
                onChange={(_name, file) => setIconFile(file)}
              />
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
