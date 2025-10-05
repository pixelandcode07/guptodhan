"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { DataTable } from "@/components/TableHelper/data-table";
import { getChildCategoryColumns, type ChildCategory } from "@/components/TableHelper/childcategory_columns";

type ApiChildCategory = {
  _id: string;
  childCategoryId: string;
  name: string;
  category?: { _id: string; name: string } | string;
  subCategory?: { _id: string; name: string } | string;
  icon?: string;
  slug: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function ChildCategoriesClient() {
  const [rows, setRows] = useState<ChildCategory[]>([]);

  const fetchRows = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/ecommerce-category/ecomChildCategory", { params: { _ts: Date.now() } });
      const items: ApiChildCategory[] = res.data.data || [];
      console.log('📊 Raw API data:', items);
      const mapped: ChildCategory[] = items.map((it, index) => ({
        _id: it._id,
        childCategoryId: it.childCategoryId,
        id: index + 1,
        category: typeof it.category === 'object' && it.category ? it.category.name : (it.category || ''),
        subCategory: typeof it.subCategory === 'object' && it.subCategory ? it.subCategory.name : (it.subCategory || ''),
        name: it.name,
        icon: it.icon,
        slug: it.slug,
        status: it.status === "active" ? "Active" : "Inactive",
        created_at: it.createdAt,
      }));
      console.log('📊 Mapped data:', mapped);
      setRows(mapped);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }, message?: string };
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch child categories");
    }
  }, []);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const onDelete = useCallback(async (row: ChildCategory) => {
    try {
      if (!row._id) return;
      await axios.delete(`/api/v1/ecommerce-category/ecomChildCategory/${row._id}`);
      setRows(prev => prev.filter(r => r._id !== row._id));
      toast.success("Child category deleted successfully!");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }, message?: string };
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete child category');
    }
  }, []);

  const columns = useMemo(() => getChildCategoryColumns({ onEdit: () => toast.info('Edit coming soon'), onDelete }), [onDelete]);

  return (
    <div className="m-5 p-5 border ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Child Category List</span>
        </h1>
      </div>
      <DataTable columns={columns} data={rows} />
    </div>
  );
}
