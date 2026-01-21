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
    totalCount: number;
  };
}

type AugmentedSession = Session & { 
  accessToken?: string; 
  user?: Session["user"] & { role?: string } 
};

export default function ProductTableClient({ initialData }: ProductTableClientProps) {
  const [products, setProducts] = useState<ApiProduct[]>(
    Array.isArray(initialData?.products) ? initialData.products : []
  );
  const [rows, setRows] = useState<Product[]>([]);
  
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = Infinity; // No limit - show all
  
  const router = useRouter();
  const { data: session } = useSession();
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  useEffect(() => {
    console.log(`Total products loaded: ${products.length}`);
  }, [products]);

  useEffect(() => {
    const cMap: Record<string, string> = {};
    const activeCategories = Array.isArray(initialData?.categories)
      ? initialData.categories
      : [];
    activeCategories.forEach(c => {
      if (c._id && c.name) cMap[c._id] = c.name;
    });
    setCategoryMap(cMap);

    const sMap: Record<string, string> = {};
    const activeStores = Array.isArray(initialData?.stores)
      ? initialData.stores
      : [];
    activeStores.forEach(st => {
      if (st._id && st.storeName) sMap[st._id] = st.storeName;
    });
    setStoreMap(sMap);

    const fMap: Record<string, string> = {};
    const activeFlags = Array.isArray(initialData?.flags)
      ? initialData.flags
      : [];
    activeFlags.forEach(f => {
      if (f._id && f.name) fMap[f._id] = f.name;
    });
    setFlagMap(fMap);
  }, [initialData]);

  useEffect(() => {
    if (!Array.isArray(products)) {
      setRows([]);
      return;
    }

    const mapped: Product[] = products.map((p, idx) => {
      let categoryName = 'N/A';
      if (typeof p.category === 'string') {
        categoryName = categoryMap[p.category] || p.category || 'N/A';
      } else if (p.category && typeof p.category === 'object') {
        categoryName = p.category.name || 'N/A';
      }
      
      let storeName = 'N/A';
      if (p.vendorName) {
        storeName = p.vendorName;
      } else if (typeof p.vendorStoreId === 'string') {
        storeName = storeMap[p.vendorStoreId] || p.vendorStoreId || 'N/A';
      } else if (p.vendorStoreId && typeof p.vendorStoreId === 'object') {
        storeName = p.vendorStoreId.storeName || 'N/A';
      }
      
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

    setRows(mapped);
  }, [products, categoryMap, storeMap, flagMap]);

  const filteredRows = useMemo(() => {
    let filtered = rows;

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(row => row.status === 'Active');
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(row => row.status === 'Inactive');
    }

    // Search filter
    const query = search.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(row => 
        row.name.toLowerCase().includes(query) ||
        row.category.toLowerCase().includes(query) ||
        row.store.toLowerCase().includes(query) ||
        row.flag.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [rows, search, statusFilter]);

  const paginatedRows = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredRows.slice(startIdx, endIdx);
  }, [filteredRows, currentPage]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

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
      
      setProducts(prev => 
        prev.map(p => 
          p._id === productId 
            ? { ...p, status: newStatus as 'active' | 'inactive' } 
            : p
        )
      );
      
      router.refresh();
    } catch (error: any) {
      console.error("Error toggling status:", error);
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

      setProducts(prev => prev.filter(p => p._id !== productId));
      
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting product:", error);
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
      <FiltersBar
        search={search}
        onSearchChange={setSearch}
        isSearching={false}
        onDownloadCSV={onDownloadCSV}
      />

      {/* Status Filter Buttons */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({rows.length})
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'active'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Active ({rows.filter(p => p.status === 'Active').length})
        </button>
        <button
          onClick={() => setStatusFilter('inactive')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'inactive'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Inactive ({rows.filter(p => p.status === 'Inactive').length})
        </button>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b px-4 py-3 sm:px-6">
            <p className="text-sm text-gray-600">
              Showing {filteredRows.length} product{filteredRows.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[840px]">
              {paginatedRows.length > 0 ? (
                <>
                  <DataTable columns={columns} data={paginatedRows} />
                </>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500 text-lg">
                    {search ? 'No products match your search' : 'No products available'}
                  </p>
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="mt-4 text-blue-600 hover:underline font-medium"
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