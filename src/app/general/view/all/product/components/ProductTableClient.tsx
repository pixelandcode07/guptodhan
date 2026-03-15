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
  slug?: string;
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
type ApiStore    = { _id: string; storeName: string; status: 'active' | 'inactive' };
type ApiFlag     = { _id: string; name: string; status: 'active' | 'inactive' };

interface ProductTableClientProps {
  initialData: {
    products: ApiProduct[];
    categories: ApiCategory[];
    stores: ApiStore[];
    flags: ApiFlag[];
  };
  initialPage?: number; // ✅ server থেকে pass করা (0-indexed)
}

export default function ProductTableClient({ initialData, initialPage = 0 }: ProductTableClientProps) {
  const router = useRouter();

  const [products, setProducts]           = useState<ApiProduct[]>(initialData.products || []);
  const [rows, setRows]                   = useState<Product[]>([]);
  const [categoryMap, setCategoryMap]     = useState<Record<string, string>>({});
  const [storeMap, setStoreMap]           = useState<Record<string, string>>({});
  const [flagMap, setFlagMap]             = useState<Record<string, string>>({});
  const [deleteOpen, setDeleteOpen]       = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting]       = useState(false);
  const [statusToggleOpen, setStatusToggleOpen] = useState(false);
  const [productToToggle, setProductToToggle]   = useState<Product | null>(null);
  const [isToggling, setIsToggling]       = useState(false);
  const [search, setSearch]               = useState('');

  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session['user'] & { role?: string } };
  const s        = session as AugmentedSession | null;
  const token    = s?.accessToken;
  const userRole = s?.user?.role;

  // ── Page change: URL update ───────────────────────────────────────────────
  const handlePageChange = useCallback((pageIndex: number) => {
    // ✅ router.replace — Next.js router জানবে, back button এ page restore হবে
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(pageIndex + 1));
    router.replace(`/general/view/all/product?${params.toString()}`, { scroll: false });
  }, [router]);

  // 1. Setup Maps
  useEffect(() => {
    const cMap: Record<string, string> = {};
    initialData.categories.filter(c => c.status === 'active').forEach(c => { cMap[c._id] = c.name; });
    setCategoryMap(cMap);

    const sMap: Record<string, string> = {};
    initialData.stores.filter(s => s.status === 'active').forEach(st => { sMap[st._id] = st.storeName; });
    setStoreMap(sMap);

    const fMap: Record<string, string> = {};
    initialData.flags.filter(f => f.status === 'active').forEach(f => { fMap[f._id] = f.name; });
    setFlagMap(fMap);
  }, [initialData]);

  // 2. Map Products → Rows
  useEffect(() => {
    if (!Array.isArray(products)) { setRows([]); return; }

    setRows(products.map((p, idx) => {
      let categoryName = '';
      if (typeof p.category === 'string')   categoryName = categoryMap[p.category] || p.category;
      else if (p.category?.name)            categoryName = p.category.name;
      categoryName = categoryName || 'N/A';

      let storeName = '';
      if (p.vendorName)                           storeName = p.vendorName;
      else if (typeof p.vendorStoreId === 'string') storeName = storeMap[p.vendorStoreId] || p.vendorStoreId;
      else if (p.vendorStoreId?.storeName)        storeName = p.vendorStoreId.storeName;
      storeName = storeName || 'N/A';

      let flagName = '';
      if (typeof p.flag === 'string') flagName = flagMap[p.flag] || p.flag;
      else if (p.flag?.name)          flagName = p.flag.name;
      else if (p.flag?._id)           flagName = flagMap[p.flag._id] || '';

      return {
        id:          idx + 1,
        _id:         p._id,
        slug:        p.slug || '',
        image:       p.thumbnailImage || '',
        category:    categoryName,
        name:        p.productTitle || '',
        store:       storeName,
        price:       p.productPrice   != null ? String(p.productPrice)  : '',
        offer_price: p.discountPrice  != null ? String(p.discountPrice) : '',
        stock:       p.stock          != null ? String(p.stock)         : '',
        flag:        flagName,
        status:      p.status === 'active' ? 'Active' : 'Inactive',
        created_at:  p.createdAt ? new Date(p.createdAt).toLocaleString() : '',
      };
    }));
  }, [products, categoryMap, storeMap, flagMap]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => r.name.toLowerCase().includes(q));
  }, [rows, search]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const onView = useCallback((product: Product) => {
    if (product.slug) router.push(`/product/${product.slug}`);
    else toast.error('Product not found');
  }, [router]);

  const onEdit = useCallback((product: Product) => {
    if (!product._id) { toast.error('Product ID not found.'); return; }
    // ✅ current page URL সহ returnPath পাঠানো
    const currentURL = window.location.pathname + window.location.search;
    const returnPath = encodeURIComponent(currentURL);
    router.push(`/general/edit/product/${product._id}?returnPath=${returnPath}`);
  }, [router]);

  const onDelete       = useCallback((p: Product) => { setProductToDelete(p); setDeleteOpen(true); }, []);
  const onToggleStatus = useCallback((p: Product) => { setProductToToggle(p); setStatusToggleOpen(true); }, []);

  const confirmStatusToggle = useCallback(async () => {
    if (!productToToggle?._id) return;
    const newStatus = productToToggle.status === 'Active' ? 'inactive' : 'active';
    setIsToggling(true);
    try {
      await axios.patch(`/api/v1/product/${productToToggle._id}`,
        { status: newStatus },
        { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(userRole ? { 'x-user-role': userRole } : {}) } }
      );
      toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
      setStatusToggleOpen(false);
      setProductToToggle(null);
      setProducts(prev => prev.map(p => p._id === productToToggle._id ? { ...p, status: newStatus as 'active' | 'inactive' } : p));
      router.refresh();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to update status');
    } finally {
      setIsToggling(false);
    }
  }, [productToToggle, token, userRole, router]);

  const confirmDelete = useCallback(async () => {
    if (!productToDelete?._id) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/v1/product/${productToDelete._id}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(userRole ? { 'x-user-role': userRole } : {}) },
      });
      toast.success('Product deleted!');
      setDeleteOpen(false);
      setProductToDelete(null);
      setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
      router.refresh();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  }, [productToDelete, token, userRole, router]);

  const columns = useMemo(
    () => getProductColumns({ onView, onEdit, onDelete, onToggleStatus }),
    [onView, onEdit, onDelete, onToggleStatus]
  );

  const onDownloadCSV = useCallback(() => {
    if (!downloadProductsCSV(rows)) toast.error('No data to export');
    else toast.success(`Exported ${rows.length} products`);
  }, [rows]);

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
            <DataTable
              columns={columns}
              data={filteredRows}
              initialPageIndex={initialPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <Dialogs
        deleteOpen={deleteOpen}
        onDeleteOpenChange={(open) => { if (!open) { setProductToDelete(null); setIsDeleting(false); } setDeleteOpen(open); }}
        productToDelete={productToDelete}
        isDeleting={isDeleting}
        onConfirmDelete={confirmDelete}
        statusToggleOpen={statusToggleOpen}
        onStatusToggleOpenChange={(open) => { if (!open) { setProductToToggle(null); setIsToggling(false); } setStatusToggleOpen(open); }}
        productToToggle={productToToggle}
        isToggling={isToggling}
        onConfirmToggle={confirmStatusToggle}
      />
    </>
  );
} 