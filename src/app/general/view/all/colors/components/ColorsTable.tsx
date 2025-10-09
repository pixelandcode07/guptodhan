"use client"

import { DataTable } from "@/components/TableHelper/data-table";
import { getColorColumns, type Color } from "@/components/TableHelper/color_columns";

interface ColorsTableProps {
  colors: Color[];
  onEdit: (color: Color) => void;
  onDelete: (color: Color) => void;
}

export default function ColorsTable({ colors, onEdit, onDelete }: ColorsTableProps) {
  const columns = getColorColumns({ onEdit, onDelete });
  
  return <DataTable columns={columns} data={colors} />;
}
