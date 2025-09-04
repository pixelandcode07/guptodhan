import { DataTable } from "@/components/TableHelper/data-table";
import { Subcategory, subcategory_columns } from "@/components/TableHelper/subcategory_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Move } from "lucide-react";

function getData(): Subcategory[] {
  return [
    { id: 1, category: "Computer", name: "UPS", icon: "", image: "", slug: "ups", featured: "Not Featured", status: "Active", created_at: "2024-08-18 09:58:42 pm" },
    { id: 2, category: "Computer", name: "Keyboard", icon: "", image: "", slug: "keyboard", featured: "Not Featured", status: "Active", created_at: "2024-08-18 09:58:42 pm" },
    { id: 3, category: "Computer", name: "Mouse", icon: "", image: "", slug: "mouse", featured: "Not Featured", status: "Active", created_at: "2024-08-18 09:58:42 pm" },
    { id: 4, category: "Computer", name: "Monitor", icon: "", image: "", slug: "monitor", featured: "Not Featured", status: "Active", created_at: "2024-08-18 09:58:42 pm" },
  ];
}

export default function ViewAllSubcategoriesPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Subcategory List</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Subcategory
        </Button>
        <Button variant="outline">
          <Move className="w-4 h-4 mr-2" />
          Rearrange Subcategory
        </Button>
      </div>
      <DataTable columns={subcategory_columns} data={data} />
    </div>
  );
}
