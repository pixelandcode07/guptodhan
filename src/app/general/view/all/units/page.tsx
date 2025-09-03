import { DataTable } from "@/components/TableHelper/data-table";
import { Unit, unit_columns } from "@/components/TableHelper/unit_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Move } from "lucide-react";

function getData(): Unit[] {
  return [
    { id: 1, name: "Meter", status: "Active", created_at: "2023-05-14 07:36:39 pm" },
    { id: 2, name: "Ton", status: "Active", created_at: "2023-05-14 07:36:45 pm" },
    { id: 3, name: "Litre", status: "Active", created_at: "2023-05-14 07:36:51 pm" },
    { id: 4, name: "Gram", status: "Active", created_at: "2023-05-14 07:36:57 pm" },
    { id: 5, name: "KG", status: "Active", created_at: "2023-05-14 07:37:03 pm" },
    { id: 6, name: "Piece", status: "Active", created_at: "2023-05-14 07:37:09 pm" }
  ];
}

export default function ViewAllUnitsPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Product Units</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Unit
        </Button>
        <Button variant="outline">
          <Move className="w-4 h-4 mr-2" />
          Rearrange Unit
        </Button>
      </div>
      
      {/* Table Filters Row */}
      <div className="mb-4 p-3 border bg-gray-50 rounded">
        <div className="grid grid-cols-5 gap-4">
          <div></div> {/* SL column - no filter */}
          <div>
            <Input
              type="text"
              placeholder="Filter by name..."
              className="w-full text-sm border border-gray-300"
            />
          </div>
          <div>
            <select
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div></div> {/* Created At column - no filter */}
          <div></div> {/* Action column - no filter */}
        </div>
      </div>
      
      <DataTable columns={unit_columns} data={data} />
    </div>
  );
}
