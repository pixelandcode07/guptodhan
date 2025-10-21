"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { DataTable } from "@/components/TableHelper/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Move } from "lucide-react";
import Link from "next/link";
import { Brand, getBrandColumns } from "@/components/TableHelper/brand_columns";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ApiBrand = {
  _id: string
  brandId: string
  name: string
  brandLogo: string
  brandBanner: string
  category: string
  subCategory: string
  childCategory: string
  status: "active" | "inactive"
  featured: "featured" | "not_featured"
  createdAt: string
}

export default function BrandsClient() {
  const { data: session } = useSession()
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } }
  const s = session as AugmentedSession | null
  const token = s?.accessToken
  const userRole = s?.user?.role

  const [brands, setBrands] = useState<Brand[]>([])
  const [, setLoading] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("")

  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Brand | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    subCategory: "",
    childCategory: "",
    status: "Active" as "Active" | "Inactive",
  })
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false)
  const [featuredBrand, setFeaturedBrand] = useState<Brand | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchBrands = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get("/api/v1/product-config/brandName")
      const apiBrands: ApiBrand[] = data?.data || []
      
      // Fetch all categories, subcategories, and child categories for mapping
      const [categoriesRes, subcategoriesRes, childCategoriesRes] = await Promise.all([
        axios.get("/api/v1/ecommerce-category/ecomCategory", {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        }),
        axios.get("/api/v1/ecommerce-category/ecomSubCategory", {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        }),
        axios.get("/api/v1/ecommerce-category/ecomChildCategory", {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        }),
      ])

      const categories = categoriesRes.data?.data || []
      const subcategories = subcategoriesRes.data?.data || []
      const childCategories = childCategoriesRes.data?.data || []

      // Create lookup maps
      const categoryMap = new Map(categories.map((cat: any) => [cat._id, cat.name]))
      const subcategoryMap = new Map(subcategories.map((sub: any) => [sub._id, sub.name]))
      const childCategoryMap = new Map(childCategories.map((child: any) => [child._id, child.name]))

      const mapped: Brand[] = apiBrands.map((b, index) => ({
        _id: b._id,
        id: index + 1,
        name: b.name,
        logo: b.brandLogo,
        banner: b.brandBanner,
        categories: b.category ? [categoryMap.get(b.category) || b.category] : [],
        subcategories: b.subCategory ? [subcategoryMap.get(b.subCategory) || b.subCategory] : [],
        childcategories: b.childCategory ? [childCategoryMap.get(b.childCategory) || b.childCategory] : [],
        slug: b.brandId,
        status: b.status === "active" ? "Active" : "Inactive",
        featured: b.featured === "featured" ? "Featured" : "Not Featured",
        created_at: new Date(b.createdAt).toLocaleString(),
      }))
      setBrands(mapped)
    } catch (error) {
      console.error("Error fetching brands:", error)
    } finally {
      setLoading(false)
    }
  }, [token, userRole])

  useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

  const onEdit = useCallback((brand: Brand) => {
    setEditing(brand)
    setEditForm({
      name: brand.name,
      category: brand.categories?.[0] || "",
      subCategory: brand.subcategories?.[0] || "",
      childCategory: brand.childcategories?.[0] || "",
      status: brand.status,
    })
    setEditOpen(true)
  }, [])

  const onDelete = useCallback((brand: Brand) => {
    setBrandToDelete(brand)
    setDeleteOpen(true)
  }, [])

  const onToggleFeatured = useCallback((brand: Brand) => {
    setFeaturedBrand(brand)
    setFeaturedModalOpen(true)
  }, [])

  const columns = useMemo(() => getBrandColumns({ onEdit, onDelete, onToggleFeatured }), [onEdit, onDelete, onToggleFeatured])

  const filteredBrands = useMemo(() => {
    const bySearch = (b: Brand) =>
      !searchText || b.name.toLowerCase().includes(searchText.toLowerCase())
    const byStatus = (b: Brand) =>
      !statusFilter || b.status === statusFilter
    const result = brands.filter((b) => bySearch(b) && byStatus(b))
    return result.map((b, idx) => ({ ...b, id: idx + 1 }))
  }, [brands, searchText, statusFilter])

  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Product Brands</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <Link href="/general/add/new/brand">
            <Plus className="w-4 h-4 mr-2" />
            Add New Brand
          </Link>
        </Button>
        <Button variant="outline">
          <Move className="w-4 h-4 mr-2" />
          Rearrange Brand
        </Button>
      </div>

      {/* Table Filters Row */}
      <div className="mb-4 p-3 border bg-gray-50 rounded">
        <div className="grid grid-cols-5 gap-4">
          <div></div>
          <div>
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              placeholder="Filter by name..."
              className="w-full text-sm border border-gray-300"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>

      <DataTable columns={columns} data={filteredBrands} />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Name</Label>
              <div className="col-span-3">
                <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Category</Label>
              <div className="col-span-3">
                <Input value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Subcategory</Label>
              <div className="col-span-3">
                <Input value={editForm.subCategory} onChange={(e) => setEditForm({ ...editForm, subCategory: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Child Category</Label>
              <div className="col-span-3">
                <Input value={editForm.childCategory} onChange={(e) => setEditForm({ ...editForm, childCategory: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Status</Label>
              <div className="col-span-3">
                <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v as typeof editForm.status })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!editing) return
                try {
                  await axios.patch(`/api/v1/product-config/brandName/${editing._id}`, {
                    name: editForm.name,
                    category: editForm.category,
                    subCategory: editForm.subCategory,
                    childCategory: editForm.childCategory,
                    status: editForm.status === "Active" ? "active" : "inactive",
                    brandId: editForm.name.trim().toLowerCase().replace(/\s+/g, "-"),
                  }, {
                    headers: {
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      ...(userRole ? { "x-user-role": userRole } : {}),
                      "Content-Type": "application/json",
                    }
                  })
                  toast.success("Brand updated")
                  setEditOpen(false)
                  await fetchBrands()
                } catch {
                  toast.error("Update failed")
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={featuredModalOpen} onOpenChange={setFeaturedModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Toggle Featured Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to {featuredBrand?.featured === "Featured" ? "remove" : "set"} &quot;{featuredBrand?.name}&quot; as {featuredBrand?.featured === "Featured" ? "not featured" : "featured"}?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeaturedModalOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!featuredBrand) return
                try {
                  const newFeaturedStatus = featuredBrand.featured === "Featured" ? "Not Featured" : "Featured"
                  await axios.patch(`/api/v1/product-config/brandName/${featuredBrand._id}`, {
                    featured: newFeaturedStatus === "Featured" ? "featured" : "not_featured",
                  }, {
                    headers: {
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      ...(userRole ? { "x-user-role": userRole } : {}),
                      "Content-Type": "application/json",
                    }
                  })
                  toast.success(`Brand ${newFeaturedStatus === "Featured" ? "featured" : "unfeatured"} successfully`)
                  setFeaturedModalOpen(false)
                  await fetchBrands()
                } catch {
                  toast.error("Failed to update featured status")
                }
              }}
            >
              {featuredBrand?.featured === "Featured" ? "Remove Featured" : "Set as Featured"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={(open) => {
        if (!open) {
          setBrandToDelete(null)
          setIsDeleting(false)
        }
        setDeleteOpen(open)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p>
              Are you sure you want to delete "{brandToDelete?.name}"? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" disabled={isDeleting} onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={async () => {
                if (!brandToDelete) return
                setIsDeleting(true)
                try {
                  await axios.delete(`/api/v1/product-config/brandName/${brandToDelete._id}`, {
                    headers: {
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      ...(userRole ? { "x-user-role": userRole } : {}),
                    },
                  })
                  toast.success("Brand deleted")
                  setDeleteOpen(false)
                  setBrandToDelete(null)
                  await fetchBrands()
                } catch {
                  toast.error("Delete failed")
                } finally {
                  setIsDeleting(false)
                }
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

