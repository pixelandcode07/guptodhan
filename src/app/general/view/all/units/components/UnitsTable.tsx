"use client";

import { DataTable } from "@/components/TableHelper/data-table";
import { getUnitColumns } from "@/components/TableHelper/unit_columns";
import { type Unit } from "@/components/TableHelper/unit_columns";

interface UnitsTableProps {
  units: Unit[];
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
}

export default function UnitsTable({ units, onEdit, onDelete }: UnitsTableProps) {
  const columns = getUnitColumns({ onEdit, onDelete });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <DataTable columns={columns} data={units} />
    </div>
  );
}
