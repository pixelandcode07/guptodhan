
"use client";

import { useState } from "react";
import { DataTable } from "@/components/TableHelper/data-table";
import { VendorCategoryColumns } from "@/components/TableHelper/VendorCategoryColumns";
import { VendorCategory } from "@/types/VendorCategoryType";

interface ClientDataTableProps {
  initialData: VendorCategory[];
}

export default function ClientDataTable({ initialData }: ClientDataTableProps) {
  const [data, setData] = useState<VendorCategory[]>(initialData);

  return (
    <DataTable
      columns={VendorCategoryColumns}
      data={data}
      setData={setData}
      rearrangePath="/general/rearrange/vendor-categories"
    />
  );
}