"use client"

import { DataTable } from "@/components/TableHelper/data-table";
import { getSimColumns, type Sim } from "@/components/TableHelper/sim_columns";

interface SimsTableProps {
  sims: Sim[];
  onEdit: (sim: Sim) => void;
  onDelete: (sim: Sim) => void;
}

export default function SimsTable({ sims, onEdit, onDelete }: SimsTableProps) {
  const columns = getSimColumns({ onEdit, onDelete });
  
  return <DataTable columns={columns} data={sims} />;
}
