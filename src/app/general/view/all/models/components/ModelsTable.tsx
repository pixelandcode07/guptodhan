"use client"

import { useCallback, useMemo } from "react";
import { DataTable } from "@/components/TableHelper/data-table";
import { Model, getModelColumns } from "@/components/TableHelper/model_columns";

interface ModelsTableProps {
  models: Model[];
  onEdit: (model: Model) => void;
  onDelete: (model: Model) => void;
}

export default function ModelsTable({ models, onEdit, onDelete }: ModelsTableProps) {
  const columns = useMemo(() => getModelColumns({ onEdit, onDelete }), [onEdit, onDelete]);

  return <DataTable columns={columns} data={models} />;
}
