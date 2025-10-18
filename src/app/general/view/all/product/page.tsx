"use client";

import { DataTable } from "@/components/TableHelper/data-table";
import { Product, product_columns } from "@/components/TableHelper/product_columns";
import { Input } from "@/components/ui/input";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { toast } from "sonner";

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

export default function ViewAllProductsPage() {
  const [rows, setRows] = useState<Product[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [storeMap, setStoreMap] = useState<Record<string, string>>({});
  const { data: session } = useSession();
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } };
  const s = session as AugmentedSession | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

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

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('/api/v1/ecommerce-category/ecomCategory', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        },
      });
      const items: ApiCategory[] = Array.isArray(res.data?.data) ? res.data.data : [];
      const active = items.filter(c => c.status === 'active');
      const map: Record<string, string> = {};
      for (const c of active) map[c._id] = c.name;
      setCategoryMap(map);
    } catch {
      setCategoryMap({});
    }
  }, [token, userRole]);

  const fetchStores = useCallback(async () => {
    try {
      const res = await axios.get('/api/v1/vendor-store', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        },
      });
      const items: ApiStore[] = Array.isArray(res.data?.data) ? res.data.data : [];
      const active = items.filter(s => s.status === 'active');
      const map: Record<string, string> = {};
      for (const st of active) map[st._id] = st.storeName;
      setStoreMap(map);
    } catch {
      setStoreMap({});
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchStores();
  }, [fetchProducts, fetchCategories, fetchStores]);

  useEffect(() => {
    const mapped: Product[] = products.map((p, idx) => {
      const categoryName = typeof p.category === 'string'
        ? (categoryMap[p.category] || p.category)
        : (p.category?.name || '');
      const storeName = typeof p.vendorStoreId === 'string'
        ? (storeMap[p.vendorStoreId] || p.vendorStoreId)
        : (p.vendorStoreId?.storeName || '');
      return {
        id: idx + 1,
        image: p.thumbnailImage || "",
        category: categoryName,
        name: p.productTitle || "",
        store: storeName,
        price: p.productPrice != null ? String(p.productPrice) : "",
        offer_price: p.discountPrice != null ? String(p.discountPrice) : "",
        stock: p.stock != null ? String(p.stock) : "",
        flag: p.flag || "",
        status: p.status === 'active' ? 'Active' : 'Inactive',
        created_at: p.createdAt ? new Date(p.createdAt).toLocaleString() : "",
      };
    });
    setRows(mapped);
  }, [products, categoryMap, storeMap]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">All Products</h1>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Search by Product Name</label>
                <input
                  type="text"
                  placeholder="Search by product name..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors h-10 sm:h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
            <div className="min-w-[840px]">
              <DataTable columns={product_columns} data={rows} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
