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
      const cat = data.category;
      if (typeof cat === 'object' && cat?._id) setCategoryId(cat._id);
      else if (typeof cat === 'string') setCategoryId(cat);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subcategory</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Featured</Label>
              <Select value={isFeatured} onValueChange={setIsFeatured}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Show On Navbar</Label>
              <Select value={isNavbar} onValueChange={setIsNavbar}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <UploadImageBtn value={iconFile} onChange={setIconFile} />
            </div>
            <div className="space-y-2">
              <Label>Banner</Label>
              <UploadImageBtn value={bannerFile} onChange={setBannerFile} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button onClick={onSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


