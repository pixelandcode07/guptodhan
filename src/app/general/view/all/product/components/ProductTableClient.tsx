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

// ✅ Types
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

type ApiCategory = { _id: string; name: string; status: 'active' | 'inactive' };
type ApiStore = { _id: string; storeName: string; status: 'active' | 'inactive' };
type ApiFlag = { _id: string; name: string; status: 'active' | 'inactive' };

interface ProductTableClientProps {
  initialData: {
    products: ApiProduct[];
    categories: ApiCategory[];
    stores: ApiStore[];
    flags: ApiFlag[];
  };
}

type AugmentedSession = Session & { 
  accessToken?: string; 
  user?: Session["user"] & { role?: string } 
};

export default function ProductTableClient({ initialData }: ProductTableClientProps) {
  // ✅ State Management
  const [products, setProducts] = useState<ApiProduct[]>(
    Array.isArray(initialData?.products) ? initialData.products : []
  );
  const [rows, setRows] = useState<Product[]>([]);
  
  // Maps for lookups
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
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  // ✅ Debug log
  useEffect(() => {
    console.log(`📊 Products loaded in client: ${products.length}`);
  }, [products]);

  // ✅ 1. Setup Maps from initialData
  useEffect(() => {
    // Category Map
    const activeCategories = Array.isArray(initialData?.categories)
      ? initialData.categories.filter(c => c.status === 'active')
      : [];
    const cMap: Record<string, string> = {};
    activeCategories.forEach(c => {
      if (c._id && c.name) cMap[c._id] = c.name;
    });
    setCategoryMap(cMap);

    // Store Map
    const activeStores = Array.isArray(initialData?.stores)
      ? initialData.stores.filter(s => s.status === 'active')
      : [];
    const sMap: Record<string, string> = {};
    activeStores.forEach(st => {
      if (st._id && st.storeName) sMap[st._id] = st.storeName;
    });
    setStoreMap(sMap);

    // Flag Map
    const activeFlags = Array.isArray(initialData?.flags)
      ? initialData.flags.filter(f => f.status === 'active')
      : [];
    const fMap: Record<string, string> = {};
    activeFlags.forEach(f => {
      if (f._id && f.name) fMap[f._id] = f.name;
    });
    setFlagMap(fMap);
  }, [initialData]);

  // ✅ 2. Transform Products to Table Rows
  useEffect(() => {
    if (!Array.isArray(products)) {
      console.error("❌ Products is not an array:", products);
      setRows([]);
      return;
    }

    console.log(`🔄 Transforming ${products.length} products to table rows...`);

    const mapped: Product[] = products.map((p, idx) => {
      // Resolve Category Name
      let categoryName = 'N/A';
      if (typeof p.category === 'string') {
        categoryName = categoryMap[p.category] || p.category || 'N/A';
      } else if (p.category && typeof p.category === 'object') {
        categoryName = p.category.name || 'N/A';
      }
      
      // Resolve Store Name
      let storeName = 'N/A';
      if (p.vendorName) {
        storeName = p.vendorName;
      } else if (typeof p.vendorStoreId === 'string') {
        storeName = storeMap[p.vendorStoreId] || p.vendorStoreId || 'N/A';
      } else if (p.vendorStoreId && typeof p.vendorStoreId === 'object') {
        storeName = p.vendorStoreId.storeName || 'N/A';
      }
      
      // Resolve Flag Name
      let flagName = "";
      if (typeof p.flag === "string") {
        flagName = flagMap[p.flag] || p.flag || "";
      } else if (p.flag && typeof p.flag === "object") {
        flagName = p.flag.name || "";
      }
      
      return {
        id: idx + 1,
        _id: p._id || '',
        image: p.thumbnailImage || "",
        category: categoryName,
        name: p.productTitle || "Untitled Product",
        store: storeName,
        price: p.productPrice != null ? String(p.productPrice) : "0",
        offer_price: p.discountPrice != null ? String(p.discountPrice) : "",
        stock: p.stock != null ? String(p.stock) : "0",
        flag: flagName,
        status: p.status === 'active' ? 'Active' : 'Inactive',
        created_at: p.createdAt 
          ? new Date(p.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : "N/A",
      };
    });

    console.log(`✅ Transformed ${mapped.length} rows`);
    setRows(mapped);
  }, [products, categoryMap, storeMap, flagMap]);

  // ✅ 3. Filtered Rows (Search)
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    
    const filtered = rows.filter(row => 
      row.name.toLowerCase().includes(query) ||
      row.category.toLowerCase().includes(query) ||
      row.store.toLowerCase().includes(query) ||
      row.flag.toLowerCase().includes(query)
    );

    console.log(`🔍 Search "${query}" found ${filtered.length} results`);
    return filtered;
  }, [rows, search]);

  // ✅ 4. Handlers
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
      toast.error('Product ID not found');
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
    if (!productToToggle?._id) {
      toast.error("Product ID not found");
      return;
    }

    const productId = productToToggle._id;
    const newStatus = productToToggle.status === "Active" ? "inactive" : "active";
    
    setIsToggling(true);
    try {
      await axios.patch(
        `/api/v1/product/${productId}`, 
        { status: newStatus },
        { 
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { 'x-user-role': userRole } : {}),
          }
        }
      );

      toast.success(
        `Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`
      );
      
      setStatusToggleOpen(false);
      setProductToToggle(null);
      
      // ✅ Optimistic Update
      setProducts(prev => 
        prev.map(p => 
          p._id === productId 
            ? { ...p, status: newStatus as 'active' | 'inactive' } 
            : p
        )
      );
      
      router.refresh();
    } catch (error: any) {
      console.error("❌ Error toggling status:", error);
      const msg = error.response?.data?.message || "Failed to update status";
      toast.error(msg);
    } finally {
      setIsToggling(false);
    }
  }, [productToToggle, token, userRole, router]);

  const confirmDelete = useCallback(async () => {
    if (!productToDelete?._id) {
      toast.error("Product ID not found");
      return;
    }

    const productId = productToDelete._id;
    setIsDeleting(true);

    try {
      await axios.delete(`/api/v1/product/${productId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      toast.success("Product deleted successfully!");
      setDeleteOpen(false);
      setProductToDelete(null);

      // ✅ Optimistic Update
      setProducts(prev => prev.filter(p => p._id !== productId));
      
      router.refresh();
    } catch (error: any) {
      console.error("❌ Error deleting product:", error);
      const msg = error.response?.data?.message || "Failed to delete product";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  }, [productToDelete, token, userRole, router]);

  const columns = useMemo(
    () => getProductColumns({ onView, onEdit, onDelete, onToggleStatus }), 
    [onView, onEdit, onDelete, onToggleStatus]
  );

  const onDownloadCSV = useCallback(() => {
    if (!rows || rows.length === 0) {
      toast.error('No products data available to export');
      return;
    }

    const success = downloadProductsCSV(rows);
    if (success) {
      toast.success(`Exported ${rows.length} product(s) successfully`);
    } else {
      toast.error('Failed to export products');
    }
  }, [rows]);

  return (
    <>
      {/* Filters Bar */}
      <FiltersBar
        search={search}
        onSearchChange={setSearch}
        isSearching={false}
        onDownloadCSV={onDownloadCSV}
      />

      {/* Data Table */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[840px]">
              {filteredRows.length > 0 ? (
                <DataTable columns={columns} data={filteredRows} />
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500 text-lg">
                    {search ? 'No products match your search' : 'No products available'}
                  </p>
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="mt-4 text-blue-600 hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
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