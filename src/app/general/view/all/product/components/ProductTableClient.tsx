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
  
  // ✅ ক্লায়েন্ট সাইড Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; // প্রতি পেজে 50 আইটেম
  
  const router = useRouter();
  const { data: session } = useSession();
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  useEffect(() => {
    console.log(`📊 সর্বমোট প্রোডাক্ট লোড: ${products.length}`);
  }, [products]);

  // ✅ মেপ সেটআপ
  useEffect(() => {
    const activeCategories = Array.isArray(initialData?.categories)
      ? initialData.categories
      : [];
    const cMap: Record<string, string> = {};
    activeCategories.forEach(c => {
      if (c._id && c.name) cMap[c._id] = c.name;
    });
    setCategoryMap(cMap);

    const activeStores = Array.isArray(initialData?.stores)
      ? initialData.stores
      : [];
    const sMap: Record<string, string> = {};
    activeStores.forEach(st => {
      if (st._id && st.storeName) sMap[st._id] = st.storeName;
    });
    setStoreMap(sMap);

    const activeFlags = Array.isArray(initialData?.flags)
      ? initialData.flags
      : [];
    const fMap: Record<string, string> = {};
    activeFlags.forEach(f => {
      if (f._id && f.name) fMap[f._id] = f.name;
    });
    setFlagMap(fMap);
  }, [initialData]);

  // ✅ প্রোডাক্ট ট্রান্সফর্ম করুন
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
        name: p.productTitle || "নামহীন প্রোডাক্ট",
        store: storeName,
        price: p.productPrice != null ? String(p.productPrice) : "0",
        offer_price: p.discountPrice != null ? String(p.discountPrice) : "",
        stock: p.stock != null ? String(p.stock) : "0",
        flag: flagName,
        status: p.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়',
        created_at: p.createdAt 
          ? new Date(p.createdAt).toLocaleDateString('bn-BD', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : "N/A",
      };
    });

    setRows(mapped);
  }, [products, categoryMap, storeMap, flagMap]);

  // ✅ ফিল্টার করা রোজ (সার্চ)
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    
    return rows.filter(row => 
      row.name.toLowerCase().includes(query) ||
      row.category.toLowerCase().includes(query) ||
      row.store.toLowerCase().includes(query) ||
      row.flag.toLowerCase().includes(query)
    );
  }, [rows, search]);

  // ✅ পেজিনেটেড রোজ
  const paginatedRows = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredRows.slice(startIdx, endIdx);
  }, [filteredRows, currentPage]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

  // ✅ রিসেট পেজ যখন সার্চ চেঞ্জ হয়
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ✅ হ্যান্ডলাররা
  const onView = useCallback((product: Product) => {
    if (product._id) {
      router.push(`/products/${product._id}`);
    } else {
      toast.error('প্রোডাক্ট আইডি পাওয়া যায়নি');
    }
  }, [router]);

  const onEdit = useCallback((product: Product) => {
    if (product._id) {
      router.push(`/general/edit/product/${product._id}`);
    } else {
      toast.error('প্রোডাক্ট আইডি পাওয়া যায়নি');
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
      toast.error("প্রোডাক্ট আইডি পাওয়া যায়নি");
      return;
    }

    const productId = productToToggle._id;
    const newStatus = productToToggle.status === "সক্রিয়" ? "inactive" : "active";
    
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
        `প্রোডাক্ট ${newStatus === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে!`
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
      console.error("❌ স্ট্যাটাস আপডেট এরর:", error);
      const msg = error.response?.data?.message || "স্ট্যাটাস আপডেট ব্যর্থ";
      toast.error(msg);
    } finally {
      setIsToggling(false);
    }
  }, [productToToggle, token, userRole, router]);

  const confirmDelete = useCallback(async () => {
    if (!productToDelete?._id) {
      toast.error("প্রোডাক্ট আইডি পাওয়া যায়নি");
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

      toast.success("প্রোডাক্ট ডিলিট করা হয়েছে!");
      setDeleteOpen(false);
      setProductToDelete(null);

      setProducts(prev => prev.filter(p => p._id !== productId));
      
      router.refresh();
    } catch (error: any) {
      console.error("❌ ডিলিট এরর:", error);
      const msg = error.response?.data?.message || "ডিলিট ব্যর্থ";
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
      toast.error('এক্সপোর্ট করার জন্য কোন প্রোডাক্ট নেই');
      return;
    }

    const success = downloadProductsCSV(rows);
    if (success) {
      toast.success(`${rows.length} টি প্রোডাক্ট এক্সপোর্ট করা হয়েছে`);
    } else {
      toast.error('এক্সপোর্ট ব্যর্থ');
    }
  }, [rows]);

  return (
    <>
      {/* ফিল্টার বার */}
      <FiltersBar
        search={search}
        onSearchChange={setSearch}
        isSearching={false}
        onDownloadCSV={onDownloadCSV}
      />

      {/* ডেটা টেবিল */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* টেবিল সংক্ষিপ্ত তথ্য */}
          <div className="bg-gray-50 border-b px-4 py-3 sm:px-6">
            <p className="text-sm text-gray-600">
              মোট {filteredRows.length} টি প্রোডাক্ট দেখাচ্ছে
              {search && ` "${search}" এর জন্য`}
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[840px]">
              {paginatedRows.length > 0 ? (
                <>
                  <DataTable columns={columns} data={paginatedRows} />
                  
                  {/* ✅ Pagination কন্ট্রোল - স্টাইল করা */}
                  <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                    <div className="text-sm text-gray-600 font-medium">
                      পৃষ্ঠা <span className="font-bold text-gray-900">{currentPage}</span> / <span className="font-bold text-gray-900">{totalPages}</span>
                      {filteredRows.length > 0 && (
                        <span className="ml-2">
                          ({(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredRows.length)} / {filteredRows.length})
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        ← পূর্ববর্তী
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        পরবর্তী →
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500 text-lg">
                    {search ? 'কোন প্রোডাক্ট মিলল না' : 'কোন প্রোডাক্ট পাওয়া যায়নি'}
                  </p>
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="mt-4 text-blue-600 hover:underline font-medium"
                    >
                      সার্চ ক্লিয়ার করুন
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ডায়ালগ */}
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