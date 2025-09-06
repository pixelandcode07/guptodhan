"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type UpazilaThana = {
  id: number
  district: string
  upazila_thana_english: string
  upazila_thana_bangla: string
  website: string
}

export const upazila_thana_columns: ColumnDef<UpazilaThana>[] = [
  {
    accessorKey: "id",
    header: "SL",
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => {
      const district = row.getValue("district") as string;
      return (
        <div className="max-w-xs truncate" title={district}>
          {district}
        </div>
      );
    },
  },
  {
    accessorKey: "upazila_thana_english",
    header: "Upazila/Thana (English)",
    cell: ({ row }) => {
      const upazilaThanaEnglish = row.getValue("upazila_thana_english") as string;
      return (
        <div className="max-w-xs truncate" title={upazilaThanaEnglish}>
          {upazilaThanaEnglish}
        </div>
      );
    },
  },
  {
    accessorKey: "upazila_thana_bangla",
    header: "Upazila/Thana (Bangla)",
    cell: ({ row }) => {
      const upazilaThanaBangla = row.getValue("upazila_thana_bangla") as string;
      return (
        <div className="max-w-xs truncate" title={upazilaThanaBangla}>
          {upazilaThanaBangla}
        </div>
      );
    },
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const website = row.getValue("website") as string;
      return (
        <div className="max-w-xs truncate" title={website}>
          {website}
        </div>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
