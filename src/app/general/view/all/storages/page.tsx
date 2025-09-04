import { DataTable } from "@/components/TableHelper/data-table";
import { Storage, storage_columns } from "@/components/TableHelper/storage_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Move } from "lucide-react";

function getData(): Storage[] {
  return [
    { id: 1, ram: "2", rom: "64 GB", status: "Active", created_at: "2024-08-18 09:57:21 pm" },
    { id: 2, ram: "120", rom: "32 GB", status: "Active", created_at: "2024-08-18 09:57:12 pm" },
    { id: 3, ram: "12", rom: "12", status: "Active", created_at: "2025-07-03 05:03:46 pm" },
    { id: 4, ram: "8", rom: "512 GB", status: "Active", created_at: "2025-03-08 12:14:49 pm" },
    { id: 5, ram: "12GB", rom: "256 GB", status: "Active", created_at: "2024-08-18 09:57:26 pm" },
    { id: 6, ram: "16", rom: "512GB", status: "Active", created_at: "2024-08-18 09:57:16 pm" },
    { id: 7, ram: "4", rom: "128 GB", status: "Inactive", created_at: "2024-08-18 09:57:30 pm" },
    { id: 8, ram: "6", rom: "64 GB", status: "Active", created_at: "2024-08-18 09:57:35 pm" },
    { id: 9, ram: "10", rom: "256 GB", status: "Active", created_at: "2024-08-18 09:57:40 pm" },
    { id: 10, ram: "14", rom: "1 TB", status: "Active", created_at: "2024-08-18 09:57:45 pm" },
    { id: 11, ram: "18", rom: "2 TB", status: "Active", created_at: "2024-08-18 09:57:50 pm" },
    { id: 12, ram: "20", rom: "4 TB", status: "Inactive", created_at: "2024-08-18 09:57:55 pm" },
    { id: 13, ram: "24", rom: "8 TB", status: "Active", created_at: "2024-08-18 09:58:00 pm" },
    { id: 14, ram: "32", rom: "16 TB", status: "Active", created_at: "2024-08-18 09:58:05 pm" },
    { id: 15, ram: "64", rom: "32 TB", status: "Active", created_at: "2024-08-18 09:58:10 pm" },
    { id: 16, ram: "128", rom: "64 TB", status: "Active", created_at: "2024-08-18 09:58:15 pm" }
  ];
}

export default function ViewAllStoragesPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Storage Types</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Storage Type
        </Button>
        <Button variant="outline">
          <Move className="w-4 h-4 mr-2" />
          Rearrange Storage Type
        </Button>
      </div>
      <DataTable columns={storage_columns} data={data} />
    </div>
  );
}
