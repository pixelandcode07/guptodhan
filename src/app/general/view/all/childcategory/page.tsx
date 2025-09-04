import { DataTable } from "@/components/TableHelper/data-table";
import { ChildCategory, childcategory_columns } from "@/components/TableHelper/childcategory_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Move } from "lucide-react";

function getData(): ChildCategory[] {
  return [
    { id: 1, category: "Organic", subcategory: "Meat", icon: "", name: "Rabbit Meat", slug: "rabbit-meat-1756104507-9yk8n", status: "Active", created_at: "2024-08-18 09:58:42 pm" },
    { id: 2, category: "Organic", subcategory: "Meat", icon: "", name: "Kobutor", slug: "kobutor-1756104447-sZeQf", status: "Active", created_at: "2024-08-18 09:58:42 pm" },
    { id: 3, category: "Organic", subcategory: "Meat", icon: "", name: "Quail Meat", slug: "quail-meat-1756104348-PIgZy", status: "Active", created_at: "2024-08-18 09:58:42 pm" },
    { id: 4, category: "Organic", subcategory: "Meat", icon: "", name: "Mutton", slug: "mutton-1756104245-xYgg9", status: "Active", created_at: "2024-08-18 09:58:42 pm" },
  ];
}

export default function ViewAllChildCategoriesPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Child Category List</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        {/* <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Child Category
        </Button>
        <Button variant="outline">
          <Move className="w-4 h-4 mr-2" />
          Rearrange Child Category
        </Button> */}
      </div>
      <DataTable columns={childcategory_columns} data={data} />
    </div>
  );
}
