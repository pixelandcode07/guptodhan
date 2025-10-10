"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/TableHelper/data-table";
import { customer_columns, Customer } from "@/components/TableHelper/customer_columns";
import CustomerHeader from "./CustomerHeader";
import CustomerFilters from "./CustomerFilters";

export default function CustomersClient({ initialRows }: { initialRows: Customer[] }) {
  const [rows, setRows] = useState<Customer[]>(initialRows || []);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setRows(initialRows || []);
  }, [initialRows]);

  const columns = useMemo(() => customer_columns, []);

  const filtered = useMemo(() => {
    const bySearch = (r: Customer) => {
      if (!searchText.trim()) return true;
      const search = searchText.toLowerCase();
      return r.name.toLowerCase().includes(search) || 
             r.email.toLowerCase().includes(search) ||
             r.phone.toLowerCase().includes(search) ||
             r.address.toLowerCase().includes(search);
    };

    return rows.filter(r => bySearch(r));
  }, [rows, searchText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 space-y-4 sm:space-y-6">
        <CustomerHeader />
        <CustomerFilters
          searchText={searchText}
          setSearchText={setSearchText}
          customers={rows}
        />
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <DataTable columns={columns} data={filtered} />
        </div>
      </div>
    </div>
  );
}
