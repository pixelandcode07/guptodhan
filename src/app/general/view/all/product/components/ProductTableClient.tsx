'use client';

import { DataTable } from "@/components/TableHelper/data-table";
import { Product, getProductColumns } from "@/components/TableHelper/product_columns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FiltersBar from "./FiltersBar";
import { downloadProductsCSV } from "./csv";
import Dialogs from "./Dialogs";

// Types
type ApiProduct = {
  _id: string;
  productId: string;
  productTitle: string;
  category?: { _id?: string; name?: string } | string | null;
  vendorStoreId?: { _id?: string; storeName?: string } | string | null;
  vendorName?: string | null;
  brand?: { _id?: string; name?: string } | string | null;
  flag?: { _id?: string; name?: string } | string | null;
  warranty?: { _id?: string; warrantyName?: string } | string | null;
  weightUnit?: { _id?: string; name?: string } | string | null;
  productPrice?: number;
  discountPrice?: number;
  stock?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  thumbnailImage?: string;
};

type ApiCategory = { _id: string; name: string; status: 'active' | 'inactive'; };
type ApiStore = { _id: string; storeName: string; status: 'active' | 'inactive'; };
type ApiFlag = { _id: string; name: string; status: 'active' | 'inactive'; };

interface ProductTableClientProps {
  initialData: {
    products: ApiProduct[];
    categories: ApiCategory[];
    stores: ApiStore[];
    flags: ApiFlag[];
  };
}

export default function ProductTableClient({ initialData }: ProductTableClientProps) {
  // ✅ Initialize state directly with Server Data (Fastest)
  const [products, setProducts] = useState<ApiProduct[]>(initialData.products || []);
  const [rows, setRows] = useState<Product[]>([]);
  
  // Maps
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [storeMap, setStoreMap] = useState<Record<string, string>>({});
  const [flagMap, setFlagMap] = useState<Record<string, string>>({});

  // UI State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusToggleOpen, setStatusToggleOpen] = useState(false);
  const [productToToggle, setProductToToggle] = useState<Product | null>(null);
  const [isToggling, setIsToggling] = useState(false);
  const [search, setSearch] = useState<string>("");
  
  const router = useRouter();
  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  // 1. Setup Maps
  useEffect(() => {
    const activeCategories = initialData.categories.filter(c => c.status === 'active');
    const cMap: Record<string, string> = {};
    for (const c of activeCategories) cMap[c._id] = c.name;
    setCategoryMap(cMap);

    const activeStores = initialData.stores.filter(s => s.status === 'active');
    const sMap: Record<string, string> = {};
    for (const st of activeStores) sMap[st._id] = st.storeName;
    setStoreMap(sMap);

    const activeFlags = initialData.flags.filter(f => f.status === 'active');
    const fMap: Record<string, string> = {};
    for (const f of activeFlags) fMap[f._id] = f.name;
    setFlagMap(fMap);
  }, [initialData]);

  // 2. Map Products to Table Rows
  useEffect(() => {
    // Safety check to prevent .map crash
    if (!Array.isArray(products)) {
        console.error("Products is not an array:", products);
        setRows([]);
        return;
    }

    const mapped: Product[] = products.map((p, idx) => {
      // Logic to resolve Category Name
      let categoryName = '';
      if (typeof p.category === 'string') {
        categoryName = categoryMap[p.category] || p.category;
      } else if (p.category && typeof p.category === 'object' && 'name' in p.category) {
        categoryName = p.category.name || '';
      }
      categoryName = categoryName || 'N/A';
      
      // Logic to resolve Store Name
      let storeName = '';
      if (p.vendorName) {
        storeName = p.vendorName;
      } else if (typeof p.vendorStoreId === 'string') {
        storeName = storeMap[p.vendorStoreId] || p.vendorStoreId;
      } else if (p.vendorStoreId && typeof p.vendorStoreId === 'object' && 'storeName' in p.vendorStoreId) {
        storeName = p.vendorStoreId.storeName || '';
      }
      storeName = storeName || 'N/A';
      
      // Logic to resolve Flag Name
      let flagName = "";
      if (typeof p.flag === "string") {
        flagName = flagMap[p.flag] || p.flag;
      } else if (p.flag && typeof p.flag === "object") {
        const flagId = "_id" in p.flag ? p.flag._id : undefined;
        const flagLabel = "name" in p.flag ? p.flag.name : undefined;
        flagName = flagLabel || (flagId ? flagMap[flagId] : "") || "";
      }
      
      return {
        id: idx + 1,
        _id: p._id,
        image: p.thumbnailImage || "",
        category: categoryName,
        name: p.productTitle || "",
        store: storeName,
        price: p.productPrice != null ? String(p.productPrice) : "",
        offer_price: p.discountPrice != null ? String(p.discountPrice) : "",
        stock: p.stock != null ? String(p.stock) : "",
        flag: flagName,
        status: p.status === 'active' ? 'Active' : 'Inactive',
        created_at: p.createdAt ? new Date(p.createdAt).toLocaleString() : "",
      };
    });
    setRows(mapped);
  }, [products, categoryMap, storeMap, flagMap]);

  // REMOVED: The initial useEffect that calls fetchProductsInitial().
  // Reason: We already have data from SSR. Fetching again causes flickering and lag.

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r => r.name.toLowerCase().includes(q))
  }, [rows, search])

  // --- Handlers ---

  const onView = useCallback((product: Product) => {
    if (product._id) {
      router.push(`/products/${product._id}`);
    } else {
      toast.error('Product ID not found');
    }
  }, [router]);

  const onEdit = useCallback((product: Product) => {
    if (product._id) {
      router.push(`/general/edit/product/${product._id}`);
    } else {
      toast.error('Product ID not found. Cannot edit product.');
    }
  }, [router]);

  const onDelete = useCallback((product: Product) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  }, []);

  const onToggleStatus = useCallback((product: Product) => {
    setProductToToggle(product);
    setStatusToggleOpen(true);
  }, []);

  const confirmStatusToggle = useCallback(async () => {
    if (!productToToggle) return;
    const productId = productToToggle._id; 
    
    if (!productId) {
      toast.error("Product ID not found");
      return;
    }

    const newStatus = productToToggle.status === "Active" ? "inactive" : "active";
    setIsToggling(true);
    try {
      await axios.patch(`/api/v1/product/${productId}`, 
        { status: newStatus },
        { 
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { 'x-user-role': userRole } : {}),
          }
        }
      );
      toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      setStatusToggleOpen(false);
      setProductToToggle(null);
      
      // Optimistic Update (No need to refetch everything)
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, status: newStatus as 'active' | 'inactive' } : p));
      
      router.refresh(); // Tells Server Components to refresh data in background
    } catch (error: any) {
      console.error("Error toggling product status:", error);
      const msg = error.response?.data?.message || "Failed to update product status";
      toast.error(msg);
    } finally {
      setIsToggling(false);
    }
  }, [productToToggle, token, userRole, router]);

  const confirmDelete = useCallback(async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const productId = productToDelete._id;
      if (!productId) throw new Error("Product ID not found");

      await axios.delete(`/api/v1/product/${productId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      toast.success("Product deleted successfully!");
      setDeleteOpen(false);
      setProductToDelete(null);

      // Optimistic Update
      setProducts(prev => prev.filter(p => p._id !== productId));
      
      router.refresh(); // Refresh server data
    } catch (error: any) {
      console.error("Error deleting product:", error);
      const msg = error.response?.data?.message || "Failed to delete product";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  }, [productToDelete, token, userRole, router]);

  const columns = useMemo(() => getProductColumns({ onView, onEdit, onDelete, onToggleStatus }), [onView, onEdit, onDelete, onToggleStatus]);

  const onDownloadCSV = useCallback(() => {
    if (!downloadProductsCSV(rows)) {
      toast.error('No products data available to export')
    } else {
      toast.success(`Exported ${rows.length} product(s) successfully`)
    }
  }, [rows])

  return (
    <>
      <FiltersBar
        search={search}
        onSearchChange={setSearch}
        isSearching={false}
        onDownloadCSV={onDownloadCSV}
      />

      <div className="mb-4 sm:mb-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
          <div className="min-w-[840px]">
            <DataTable columns={columns} data={filteredRows} />
          </div>
        </div>
      </div>

      <Dialogs
        deleteOpen={deleteOpen}
        onDeleteOpenChange={(open) => {
          if (!open) {
            setProductToDelete(null);
            setIsDeleting(false);
          }
          setDeleteOpen(open);
        }}
        productToDelete={productToDelete}
        isDeleting={isDeleting}
        onConfirmDelete={confirmDelete}
        statusToggleOpen={statusToggleOpen}
        onStatusToggleOpenChange={(open) => {
          if (!open) {
            setProductToToggle(null);
            setIsToggling(false);
          }
          setStatusToggleOpen(open);
        }}
        productToToggle={productToToggle}
        isToggling={isToggling}
        onConfirmToggle={confirmStatusToggle}
      />
    </>
  );
}