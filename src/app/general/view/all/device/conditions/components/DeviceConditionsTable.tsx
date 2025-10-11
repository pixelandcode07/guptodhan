"use client"

import { DataTable } from "@/components/TableHelper/data-table";
import { getDeviceConditionColumns, type DeviceCondition } from "@/components/TableHelper/device_condition_columns";

interface DeviceConditionsTableProps {
  conditions: DeviceCondition[];
  onEdit: (condition: DeviceCondition) => void;
  onDelete: (condition: DeviceCondition) => void;
}

export default function DeviceConditionsTable({ conditions, onEdit, onDelete }: DeviceConditionsTableProps) {
  const columns = getDeviceConditionColumns({ onEdit, onDelete });
  
  return <DataTable columns={columns} data={conditions} />;
}
