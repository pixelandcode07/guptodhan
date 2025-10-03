"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { DataTable } from "@/components/TableHelper/data-table";
import { getCategoryColumns, type Category } from "@/components/TableHelper/category_columns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useSession } from "next-auth/react";

type ApiCategory = {
  _id: string;
  categoryId: string;
  name: string;
  categoryIcon: string;
  categoryBanner?: string;
  isFeatured: boolean;
  isNavbar: boolean;
  slug: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function CategoriesClient() {
  const { data: session } = useSession();
  const s = session as (undefined | { accessToken?: string; user?: { role?: string } });
  const token = s?.accessToken;
  const userRole = s?.user?.role;
  const [rows, setRows] = useState<Category[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchRows = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/ecommerce-category/ecomCategory", {
        params: { _ts: Date.now() },
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      const items: ApiCategory[] = res.data.data || [];
      const mapped: Category[] = items.map((it, index) => ({
        _id: it._id,
        categoryId: it.categoryId,
        id: index + 1,
        name: it.name,
        categoryIcon: it.categoryIcon,
        categoryBanner: it.categoryBanner,
        slug: it.slug,
        isFeatured: it.isFeatured,
        isNavbar: it.isNavbar,
        status: it.status === "active" ? "Active" : "Inactive",
        created_at: it.createdAt,
      }));
      setRows(mapped);
    } catch (e: unknown) {
      console.error("Error fetching categories:", e);
      const err = e as { response?: { data?: { message?: string } }, message?: string };
      const msg = err?.response?.data?.message || err?.message || "Failed to fetch categories";
      toast.error(msg);
    }
  }, [token, userRole]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const onDelete = useCallback(async (row: Category) => {
    try {
      if (!row._id) return;
      await axios.delete(`/api/v1/ecommerce-category/ecomCategory/${row._id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      setRows(prev => prev.filter(r => r._id !== row._id));
      toast.success("Category deleted successfully!");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }, message?: string };
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete category');
    }
  }, [token, userRole]);

  const columns = useMemo(() => getCategoryColumns({ onEdit: () => toast.info('Edit coming soon'), onDelete }), [onDelete]);

  const filtered = useMemo(() => {
    return rows.filter(r => statusFilter === "all" || r.status.toLowerCase() === statusFilter);
  }, [rows, statusFilter]);

  return (
    <div className="m-5 p-5 border ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Category List</span>
        </h1>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/general/rearrange/categories" className="px-3 py-2 border rounded bg-white hover:bg-gray-50">Rearrange Category</Link>
          <Link href="/general/add/new/category" className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded">Add New Category</Link>
        </div>
      </div>
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}


