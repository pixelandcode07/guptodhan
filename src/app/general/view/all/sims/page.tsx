import { DataTable } from "@/components/TableHelper/data-table";
import { Sim, sim_columns } from "@/components/TableHelper/sim_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function getData(): Sim[] {
  return [
    { id: 1, name: "Dual e-SIM", created_at: "2023-06-05 10:25:43 am" },
    { id: 2, name: "Dual SIM", created_at: "2023-06-05 10:25:36 am" },
    { id: 3, name: "Single e-SIM", created_at: "2023-06-05 10:25:30 am" },
    { id: 4, name: "Single SIM", created_at: "2023-06-05 10:25:24 am" },
  ];
}

export default function ViewAllSimsPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Sim Type</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Sim Type
        </Button>
      </div>
      <DataTable columns={sim_columns} data={data} />
    </div>
  );
}
