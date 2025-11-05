'use client';

import { DataTable } from "@/components/TableHelper/data-table";
import { Product, getProductColumns } from "@/components/TableHelper/product_columns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      let categoryName = '';
      if (typeof p.category === 'string') {
        categoryName = categoryMap[p.category] || p.category;
      } else if (p.category && typeof p.category === 'object' && 'name' in p.category) {
        categoryName = p.category.name || '';
      }
      // Show "N/A" if category name is empty or not found
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
        _id: p._id,  // Store MongoDB ID for navigation
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
    if (product._id) {
      router.push(`/products/${product._id}`);
    } else {
      // Fallback: try to find by name if _id is missing
      const originalProduct = products.find(p => p.productTitle === product.name);
      if (originalProduct) {
        router.push(`/products/${originalProduct._id}`);
      } else {
        toast.error('Product ID not found');
      }
    }
  }, [products, router]);

  const onEdit = useCallback((product: Product) => {
    console.log('Edit button clicked for product:', product);
    if (product._id) {
      console.log('Navigating to edit page with ID:', product._id);
      router.push(`/general/edit/product/${product._id}`);
    } else {
      // Fallback: try to find by name if _id is missing
      const originalProduct = products.find(p => p.productTitle === product.name);
      if (originalProduct && originalProduct._id) {
        console.log('Found product by name, navigating with ID:', originalProduct._id);
        router.push(`/general/edit/product/${originalProduct._id}`);
      } else {
        toast.error('Product ID not found. Cannot edit product.');
        console.error('Product not found for editing:', product);
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

  const downloadCSV = useCallback(() => {
    if (rows.length === 0) {
      toast.error('No products data available to export');
      return;
    }

    // Prepare CSV headers
    const headers = [
      'ID',
      'Product Name',
      'Category',
      'Store',
      'Price',
      'Offer Price',
      'Stock',
      'Flag',
      'Status',
      'Created At'
    ];

    // Convert product data to CSV format
    const csvData = rows.map(product => [
      product.id,
      product.name,
      product.category,
      product.store,
      product.price,
      product.offer_price,
      product.stock,
      product.flag || '',
      product.status,
      product.created_at
    ]);

    // Combine headers and data, escape quotes and wrap in quotes
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${rows.length} product(s) successfully`);
  }, [rows]);

  return (
    <>
      {/* Filters Section with Download Button */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Search by Product Name</label>
              <input
                type="text"
                placeholder="Search by product name..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors h-10 sm:h-auto"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={downloadCSV}
                className="h-10 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

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
