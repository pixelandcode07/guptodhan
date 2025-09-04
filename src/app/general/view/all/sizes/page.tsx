import { DataTable } from "@/components/TableHelper/data-table";
import { Size, size_columns } from "@/components/TableHelper/size_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Move } from "lucide-react";

function getData(): Size[] {
  return [
    { id: 1, name: "L", status: "Active", created_at: "2024-08-18 09:57:21 pm" },
    { id: 2, name: "S", status: "Active", created_at: "2024-08-18 09:57:12 pm" },
    { id: 3, name: "M L XI", status: "Active", created_at: "2025-07-03 05:03:46 pm" },
    { id: 4, name: "XXL", status: "Active", created_at: "2025-03-08 12:14:49 pm" },
    { id: 5, name: "XL", status: "Active", created_at: "2024-08-18 09:57:26 pm" },
    { id: 6, name: "M", status: "Active", created_at: "2024-08-18 09:57:16 pm" },
  ];
}

export default function ViewAllSizesPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Product Sizes</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Size
        </Button>
        <Button variant="outline">
          <Move className="w-4 h-4 mr-2" />
          Rearrange Size
        </Button>
      </div>
      <DataTable columns={size_columns} data={data} />
    </div>
  );
}
