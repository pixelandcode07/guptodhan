"use client"

import { DataTable } from "@/components/TableHelper/data-table";
import { getStorageColumns, type Storage } from "@/components/TableHelper/storage_columns";

interface StoragesTableProps {
  storages: Storage[];
  onEdit: (storage: Storage) => void;
  onDelete: (storage: Storage) => void;
}

export default function StoragesTable({ storages, onEdit, onDelete }: StoragesTableProps) {
  const columns = getStorageColumns({ onEdit, onDelete });
  
  return <DataTable columns={columns} data={storages} />;
}
