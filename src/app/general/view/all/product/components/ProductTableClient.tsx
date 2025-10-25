'use client';

import { DataTable } from "@/components/TableHelper/data-table";
import { Product, getProductColumns } from "@/components/TableHelper/product_columns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import StatusToggleDialog from "./StatusToggleDialog";
import DeleteProductDialog from "./DeleteProductDialog";

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
  const router = useRouter();
  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  // Initialize maps from server data
  useEffect(() => {
    // Build category map
    const activeCategories = initialData.categories.filter(c => c.status === 'active');
    const categoryMap: Record<string, string> = {};
    for (const c of activeCategories) categoryMap[c._id] = c.name;
    setCategoryMap(categoryMap);

    // Build store map
    const activeStores = initialData.stores.filter(s => s.status === 'active');
    const storeMap: Record<string, string> = {};
    for (const st of activeStores) storeMap[st._id] = st.storeName;
    setStoreMap(storeMap);

    // Build flag map
    const activeFlags = initialData.flags.filter(f => f.status === 'active');
    const flagMap: Record<string, string> = {};
    for (const f of activeFlags) flagMap[f._id] = f.name;
    setFlagMap(flagMap);
  }, [initialData]);

  const fetchProducts = useCallback(async () => {
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
      const categoryName = typeof p.category === 'string'
        ? (categoryMap[p.category] || p.category)
        : (p.category?.name || '');
      const storeName = typeof p.vendorStoreId === 'string'
        ? (storeMap[p.vendorStoreId] || p.vendorStoreId)
        : (p.vendorStoreId?.storeName || '');
      const flagName = p.flag ? (flagMap[p.flag] || p.flag) : "";
      return {
        id: idx + 1,
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

  const onView = useCallback((product: Product) => {
    const originalProduct = products.find(p => p.productTitle === product.name);
    if (originalProduct) {
      router.push(`/products/${originalProduct._id}`);
    }
  }, [products, router]);

  const onEdit = useCallback((product: Product) => {
    const originalProduct = products.find(p => p.productTitle === product.name);
    if (originalProduct) {
      router.push(`/general/edit/product/${originalProduct._id}`);
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
    
    const originalProduct = products.find(p => p.productTitle === productToToggle.name);
    if (!originalProduct) {
      toast.error("Product not found");
      return;
    }

    const newStatus = productToToggle.status === "Active" ? "inactive" : "active";
    setIsToggling(true);
    
    try {
      await axios.patch(`/api/v1/product/${originalProduct._id}`, 
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
      await fetchProducts();
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
  }, [productToToggle, products, token, userRole, fetchProducts]);

  const confirmDelete = useCallback(async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      const originalProduct = products.find(p => p.productTitle === productToDelete.name);
      if (!originalProduct) {
        throw new Error("Product not found");
      }

      await axios.delete(`/api/v1/product/${originalProduct._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      
      toast.success("Product deleted successfully!");
      setDeleteOpen(false);
      setProductToDelete(null);
      
      await fetchProducts();
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
  }, [productToDelete, products, token, userRole, fetchProducts]);

  const columns = useMemo(() => getProductColumns({ onView, onEdit, onDelete, onToggleStatus }), [onView, onEdit, onDelete, onToggleStatus]);

  return (
    <>
      {/* Table Section */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
          <div className="min-w-[840px]">
            <DataTable columns={columns} data={rows} />
          </div>
        </div>
      </div>

      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setProductToDelete(null);
            setIsDeleting(false);
          }
          setDeleteOpen(open);
        }}
        productName={productToDelete?.name}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
      />

      <StatusToggleDialog
        open={statusToggleOpen}
        onOpenChange={(open) => {
          if (!open) {
            setProductToToggle(null);
            setIsToggling(false);
          }
          setStatusToggleOpen(open);
        }}
        product={productToToggle}
        isToggling={isToggling}
        onConfirm={confirmStatusToggle}
      />
    </>
  );
}
