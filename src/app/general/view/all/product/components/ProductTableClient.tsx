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

type ApiProduct = {
  _id: string;
  productId: string;
  productTitle: string;
  category?: { name?: string } | string;
  vendorStoreId?: { storeName?: string } | string;
  productPrice?: number;
  discountPrice?: number;
  stock?: number;
  flag?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  thumbnailImage?: string;
};

type ApiCategory = {
  _id: string;
  name: string;
  status: 'active' | 'inactive';
};

type ApiStore = {
  _id: string;
  storeName: string;
  status: 'active' | 'inactive';
};

type ApiFlag = {
  _id: string;
  name: string;
  status: 'active' | 'inactive';
};

interface ProductTableClientProps {
  initialData: {
    products: ApiProduct[];
    categories: ApiCategory[];
    stores: ApiStore[];
    flags: ApiFlag[];
  };
}

export default function ProductTableClient({ initialData }: ProductTableClientProps) {
  const [rows, setRows] = useState<Product[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>(initialData.products);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [storeMap, setStoreMap] = useState<Record<string, string>>({});
  const [flagMap, setFlagMap] = useState<Record<string, string>>({});
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

  useEffect(() => {
    const activeCategories = initialData.categories.filter(c => c.status === 'active');
    const categoryMap: Record<string, string> = {};
    for (const c of activeCategories) categoryMap[c._id] = c.name;
    setCategoryMap(categoryMap);

    const activeStores = initialData.stores.filter(s => s.status === 'active');
    const storeMap: Record<string, string> = {};
    for (const st of activeStores) storeMap[st._id] = st.storeName;
    setStoreMap(storeMap);

    const activeFlags = initialData.flags.filter(f => f.status === 'active');
    const flagMap: Record<string, string> = {};
    for (const f of activeFlags) flagMap[f._id] = f.name;
    setFlagMap(flagMap);
  }, [initialData]);

  const fetchProductsInitial = useCallback(async () => {
    try {
      const res = await axios.get('/api/v1/product', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        },
      });
      const items: ApiProduct[] = Array.isArray(res.data?.data) ? res.data.data : [];
      setProducts(items);
    } catch {
      toast.error('Failed to load products');
    }
  }, [token, userRole]);

  useEffect(() => {
    const mapped: Product[] = products.map((p, idx) => {
      let categoryName = '';
      if (typeof p.category === 'string') {
        categoryName = categoryMap[p.category] || p.category;
      } else if (p.category && typeof p.category === 'object' && 'name' in p.category) {
        categoryName = p.category.name || '';
      }
      categoryName = categoryName || 'N/A';
      
      let storeName = '';
      if (typeof p.vendorStoreId === 'string') {
        storeName = storeMap[p.vendorStoreId] || p.vendorStoreId;
      } else if (p.vendorStoreId && typeof p.vendorStoreId === 'object' && 'storeName' in p.vendorStoreId) {
        storeName = p.vendorStoreId.storeName || '';
      }
      storeName = storeName || 'N/A';
      
      const flagName = p.flag ? (flagMap[p.flag] || p.flag) : "";
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

  useEffect(() => {
    fetchProductsInitial()
  }, [fetchProductsInitial])

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r => r.name.toLowerCase().includes(q))
  }, [rows, search])

  const onView = useCallback((product: Product) => {
    if (product._id) {
      router.push(`/products/${product._id}`);
    } else {
      const originalProduct = products.find(p => p.productTitle === product.name);
      if (originalProduct) {
        router.push(`/products/${originalProduct._id}`);
      } else {
        toast.error('Product ID not found');
      }
    }
  }, [products, router]);

  const onEdit = useCallback((product: Product) => {
    if (product._id) {
      router.push(`/general/edit/product/${product._id}`);
    } else {
      const originalProduct = products.find(p => p.productTitle === product.name);
      if (originalProduct && originalProduct._id) {
        router.push(`/general/edit/product/${originalProduct._id}`);
      } else {
        toast.error('Product ID not found. Cannot edit product.');
      }
    }
  }, [products, router]);

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
    const productId = productToToggle._id || products.find(p => p.productTitle === productToToggle.name)?._id;
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
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, status: newStatus as 'active' | 'inactive' } : p))
    } catch (error: unknown) {
      console.error("Error toggling product status:", error);
      let errorMessage = "Failed to update product status";
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsToggling(false);
    }
  }, [productToToggle, products, token, userRole]);

  const confirmDelete = useCallback(async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const productId = productToDelete._id || products.find(p => p.productTitle === productToDelete.name)?._id;
      if (!productId) {
        throw new Error("Product ID not found");
      }
      await axios.delete(`/api/v1/product/${productId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      toast.success("Product deleted successfully!");
      setDeleteOpen(false);
      setProductToDelete(null);
      setProducts(prev => prev.filter(p => p._id !== productId))
    } catch (error: unknown) {
      console.error("Error deleting product:", error);
      let errorMessage = "Failed to delete product";
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [productToDelete, products, token, userRole]);

  const columns = useMemo(() => getProductColumns({ onView, onEdit, onDelete, onToggleStatus }), [onView, onEdit, onDelete, onToggleStatus]);

  const onDownloadCSV = useCallback(() => {
    if (!downloadProductsCSV(rows)) {
      toast.error('No products data available to export')
    } else {
      toast.success(`Exported ${rows.length} product(s) successfully`)
    }
  }, [rows])

  const handleSearchEnter = useCallback((v: string) => {
    setSearch(v)
  }, [])

  return (
    <>
      <FiltersBar search={search} onSearchChange={setSearch} onSearchEnter={handleSearchEnter} isSearching={false} onDownloadCSV={onDownloadCSV} />

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
