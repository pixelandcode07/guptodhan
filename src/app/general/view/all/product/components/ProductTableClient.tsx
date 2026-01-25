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
  console.log("\n\n");
  console.log("╔═══════════════════════════════════════════════════════════════╗");
  console.log("║  🔵 FRONTEND: ProductTableClient - MOUNT                      ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝");
  
  console.log("\n📊 [INITIAL DATA]");
  console.log(`  ├─ Products: ${initialData.products?.length || 0}`);
  console.log(`  ├─ Categories: ${initialData.categories?.length || 0}`);
  console.log(`  ├─ Stores: ${initialData.stores?.length || 0}`);
  console.log(`  └─ Flags: ${initialData.flags?.length || 0}\n`);

  // ✅ Initialize state directly with Server Data
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
    console.log("\n📋 [EFFECT-1] Setting up category, store, and flag maps...");
    
    const activeCategories = initialData.categories.filter(c => c.status === 'active');
    const cMap: Record<string, string> = {};
    for (const c of activeCategories) cMap[c._id] = c.name;
    setCategoryMap(cMap);
    console.log(`  ✅ Category map: ${Object.keys(cMap).length} items`);

    const activeStores = initialData.stores.filter(s => s.status === 'active');
    const sMap: Record<string, string> = {};
    for (const st of activeStores) sMap[st._id] = st.storeName;
    setStoreMap(sMap);
    console.log(`  ✅ Store map: ${Object.keys(sMap).length} items`);

    const activeFlags = initialData.flags.filter(f => f.status === 'active');
    const fMap: Record<string, string> = {};
    for (const f of activeFlags) fMap[f._id] = f.name;
    setFlagMap(fMap);
    console.log(`  ✅ Flag map: ${Object.keys(fMap).length} items\n`);
  }, [initialData]);

  // 2. Map Products to Table Rows
  useEffect(() => {
    console.log("\n📋 [EFFECT-2] Transforming products to table rows...");
    console.log(`  ├─ Processing ${products?.length || 0} products`);
    
    if (!Array.isArray(products)) {
      console.error("  ❌ ERROR: Products is not an array!");
      setRows([]);
      return;
    }

    const startTime = Date.now();

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

    const transformTime = Date.now() - startTime;
    setRows(mapped);
    
    console.log(`  ├─ ✅ Transformed ${mapped.length} products in ${transformTime}ms`);
    console.log(`  └─ Done\n`);
  }, [products, categoryMap, storeMap, flagMap]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = !q ? rows : rows.filter(r => r.name.toLowerCase().includes(q))
    
    console.log(`🔍 [FILTER] "${search}" → ${filtered.length}/${rows.length} results`);
    
    return filtered
  }, [rows, search])

  // --- Handlers ---

  const onView = useCallback((product: Product) => {
    console.log(`👁️  [ACTION] View: ${product.name} (${product._id})`);
    
    if (product._id) {
      router.push(`/products/${product._id}`);
    } else {
      toast.error('Product ID not found');
    }
  }, [router]);

  const onEdit = useCallback((product: Product) => {
    console.log(`✏️  [ACTION] Edit: ${product.name} (${product._id})`);
    
    if (product._id) {
      router.push(`/general/edit/product/${product._id}`);
    } else {
      toast.error('Product ID not found. Cannot edit product.');
    }
  }, [router]);

  const onDelete = useCallback((product: Product) => {
    console.log(`🗑️  [ACTION] Delete (confirm): ${product.name} (${product._id})`);
    setProductToDelete(product);
    setDeleteOpen(true);
  }, []);

  const onToggleStatus = useCallback((product: Product) => {
    console.log(`🔄 [ACTION] Toggle Status (confirm): ${product.name} - Current: ${product.status}`);
    setProductToToggle(product);
    setStatusToggleOpen(true);
  }, []);

  const confirmStatusToggle = useCallback(async () => {
    if (!productToToggle) return;
    const productId = productToToggle._id;
    
    console.log("\n╔═══════════════════════════════════════════════════════════════╗");
    console.log("║  🟠 FRONTEND: Confirm Status Toggle                          ║");
    console.log("╚═══════════════════════════════════════════════════════════════╝");
    console.log(`\n🔄 [TOGGLE] Product ID: ${productId}`);
    console.log(`🔄 [TOGGLE] Current Status: ${productToToggle.status}`);
    
    if (!productId) {
      toast.error("Product ID not found");
      return;
    }

    const newStatus = productToToggle.status === "Active" ? "inactive" : "active";
    console.log(`🔄 [TOGGLE] New Status: ${newStatus}`);
    
    setIsToggling(true);
    try {
      console.log(`\n📡 [API] Sending PATCH request to /api/v1/product/${productId}`);
      
      await axios.patch(`/api/v1/product/${productId}`, 
        { status: newStatus },
        { 
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { 'x-user-role': userRole } : {}),
          }
        }
      );
      
      console.log("✅ [API] Status updated successfully\n");
      toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      setStatusToggleOpen(false);
      setProductToToggle(null);
      
      // ✅ Optimistic Update
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, status: newStatus as 'active' | 'inactive' } : p));
      
      router.refresh();
      console.log("🟢 [COMPLETE] Status toggle done\n");
    } catch (error: any) {
      console.error("❌ [API ERROR] Failed to toggle status:");
      console.error(`   ${error.response?.data?.message || error.message}\n`);
      const msg = error.response?.data?.message || "Failed to update product status";
      toast.error(msg);
    } finally {
      setIsToggling(false);
    }
  }, [productToToggle, token, userRole, router]);

  const confirmDelete = useCallback(async () => {
    if (!productToDelete) return;
    
    console.log("\n╔═══════════════════════════════════════════════════════════════╗");
    console.log("║  🔴 FRONTEND: Confirm Delete                                ║");
    console.log("╚═══════════════════════════════════════════════════════════════╝");
    console.log(`\n🗑️  [DELETE] Product ID: ${productToDelete._id}`);
    console.log(`🗑️  [DELETE] Product Name: ${productToDelete.name}`);
    
    setIsDeleting(true);
    try {
      const productId = productToDelete._id;
      if (!productId) throw new Error("Product ID not found");

      console.log(`\n📡 [API] Sending DELETE request to /api/v1/product/${productId}`);

      await axios.delete(`/api/v1/product/${productId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      console.log("✅ [API] Product deleted successfully\n");
      toast.success("Product deleted successfully!");
      setDeleteOpen(false);
      setProductToDelete(null);

      // ✅ Optimistic Update
      setProducts(prev => prev.filter(p => p._id !== productId));
      
      router.refresh();
      console.log("🟢 [COMPLETE] Delete done\n");
    } catch (error: any) {
      console.error("❌ [API ERROR] Failed to delete product:");
      console.error(`   ${error.response?.data?.message || error.message}\n`);
      const msg = error.response?.data?.message || "Failed to delete product";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  }, [productToDelete, token, userRole, router]);

  const columns = useMemo(() => getProductColumns({ onView, onEdit, onDelete, onToggleStatus }), [onView, onEdit, onDelete, onToggleStatus]);

  const onDownloadCSV = useCallback(() => {
    console.log(`📥 [ACTION] Download CSV: ${rows.length} products`);
    
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
        onSearchChange={(value) => {
          setSearch(value);
        }}
        isSearching={false}
        onDownloadCSV={onDownloadCSV}
      />

      {/* ✅ Product summary */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-semibold">
          📊 Total: {products.length} products | 
          Showing: {filteredRows.length} | 
          Hidden: {products.length - filteredRows.length}
        </p>
      </div>

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