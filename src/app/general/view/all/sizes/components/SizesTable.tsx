"use client"

import { DataTable } from "@/components/TableHelper/data-table";
import { getSizeColumns, type Size } from "@/components/TableHelper/size_columns";

interface SizesTableProps {
  sizes: Size[];
  onEdit: (size: Size) => void;
  onDelete: (size: Size) => void;
}

export default function SizesTable({
  sizes,
  onEdit,
  onDelete,
}: SizesTableProps) {
  const columns = getSizeColumns({ onDelete, onEdit });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <DataTable columns={columns} data={sizes} />
    </div>
  );
}
