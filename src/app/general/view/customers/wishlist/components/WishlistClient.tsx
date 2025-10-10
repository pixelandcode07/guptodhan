"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/TableHelper/data-table";
import { wishlist_columns, Wishlist } from "@/components/TableHelper/wishlist_columns";
import WishlistHeader from "./WishlistHeader";
import WishlistFilters from "./WishlistFilters";

export default function WishlistClient({ initialRows }: { initialRows: Wishlist[] }) {
  const [rows, setRows] = useState<Wishlist[]>(initialRows || []);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setRows(initialRows || []);
  }, [initialRows]);

  const columns = useMemo(() => wishlist_columns, []);

  const filtered = useMemo(() => {
    const bySearch = (r: Wishlist) => {
      if (!searchText.trim()) return true;
      const search = searchText.toLowerCase();
      return r.product.toLowerCase().includes(search) || 
             r.customer_name.toLowerCase().includes(search) ||
             r.email.toLowerCase().includes(search) ||
             r.category.toLowerCase().includes(search);
    };

    return rows.filter(r => bySearch(r));
  }, [rows, searchText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 space-y-4 sm:space-y-6">
        <WishlistHeader />
        <WishlistFilters
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <DataTable columns={columns} data={filtered} />
        </div>
      </div>
    </div>
  );
}
