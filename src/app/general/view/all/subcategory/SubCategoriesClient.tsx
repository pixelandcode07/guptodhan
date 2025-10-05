"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { DataTable } from "@/components/TableHelper/data-table";
import { getSubCategoryColumns, type SubCategory } from "@/components/TableHelper/subcategory_columns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Move } from "lucide-react";

type ApiSubCategory = {
  _id: string;
  subCategoryId: string;
  name: string;
  category?: { _id: string; name: string } | string;
  subCategoryIcon?: string;
  subCategoryBanner?: string;
  isFeatured: boolean;
  isNavbar: boolean;
  slug: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function SubCategoriesClient() {
  const [rows, setRows] = useState<SubCategory[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchRows = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/ecommerce-category/ecomSubCategory", { params: { _ts: Date.now() } });
      const items: ApiSubCategory[] = res.data.data || [];
      const mapped: SubCategory[] = items.map((it, index) => ({
        _id: it._id,
        subCategoryId: it.subCategoryId,
        id: index + 1,
        category: typeof it.category === 'object' && it.category ? it.category.name : (it.category || ''),
        name: it.name,
        subCategoryIcon: it.subCategoryIcon,
        subCategoryBanner: it.subCategoryBanner,
        slug: it.slug,
        isFeatured: it.isFeatured,
        isNavbar: it.isNavbar,
        status: it.status === "active" ? "Active" : "Inactive",
        created_at: it.createdAt,
      }));
      setRows(mapped);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }, message?: string };
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch subcategories");
    }
  }, []);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const onDelete = useCallback(async (row: SubCategory) => {
    try {
      if (!row._id) return;
      await axios.delete(`/api/v1/ecommerce-category/ecomSubCategory/${row._id}`);
      setRows(prev => prev.filter(r => r._id !== row._id));
      toast.success("Subcategory deleted successfully!");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }, message?: string };
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete subcategory');
    }
  }, []);

  const columns = useMemo(() => getSubCategoryColumns({ onEdit: () => toast.info('Edit coming soon'), onDelete }), [onDelete]);

  const filtered = useMemo(() => rows.filter(r => statusFilter === "all" || r.status.toLowerCase() === statusFilter), [rows, statusFilter]);

  return (
    <div className="m-5 p-5 border ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Subcategory List</span>
        </h1>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/general/rearrange/subcategories" className="px-3 py-2 border rounded bg-white hover:bg-gray-50 flex items-center gap-2">
            <Move className="w-4 h-4" />
            Rearrange Subcategory
          </Link>
          <Link href="/general/add/new/subcategory" className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded">Add New Subcategory</Link>
        </div>
      </div>
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}


