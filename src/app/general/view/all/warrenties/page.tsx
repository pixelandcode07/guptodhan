import { DataTable } from "@/components/TableHelper/data-table";
import { Warranty, warranty_columns } from "@/components/TableHelper/warranty_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Move } from "lucide-react";

function getData(): Warranty[] {
  return [
    { id: 1, name: "10 Days Replacement Guarentee", created_at: "2023-06-07 11:16:37 pm" },
    { id: 2, name: "10 Days Cashback Guarantee", created_at: "2023-07-17 03:53:13 am" },
    { id: 3, name: "1 Year Replacement Warrenty", created_at: "2023-06-07 11:16:37 pm" },
    { id: 4, name: "1 Yr Replacement & 2 Yr Service Warrenty", created_at: "2023-07-17 03:53:13 am" },
    { id: 5, name: "2 Years Service Warrenty", created_at: "2023-06-07 11:16:37 pm" },
  ];
}

export default function ViewAllWarrantiesPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Product Warranty</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Warranty Type
        </Button>
        <Button variant="outline">
          <Move className="w-4 h-4 mr-2" />
          Rearrange
        </Button>
      </div>
      <DataTable columns={warranty_columns} data={data} />
    </div>
  );
}
