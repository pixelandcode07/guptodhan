"use client"

import { DataTable } from "@/components/TableHelper/data-table";
import { getWarrantyColumns, type Warranty } from "@/components/TableHelper/warranty_columns";

interface WarrantiesTableProps {
  warranties: Warranty[];
  onEdit: (warranty: Warranty) => void;
  onDelete: (warranty: Warranty) => void;
}

export default function WarrantiesTable({ warranties, onEdit, onDelete }: WarrantiesTableProps) {
  const columns = getWarrantyColumns({ onEdit, onDelete });
  
  return <DataTable columns={columns} data={warranties} />;
}
