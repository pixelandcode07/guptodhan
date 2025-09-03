import { DataTable } from "@/components/TableHelper/data-table";
import { DeviceCondition, device_condition_columns } from "@/components/TableHelper/device_condition_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Move } from "lucide-react";

function getData(): DeviceCondition[] {
  return [
    { id: 1, name: "Brand New (Official)", created_at: "2023-06-05 10:34:14 am" },
    { id: 2, name: "Brand New (Unofficial)", created_at: "2023-07-17 03:50:39 am" },
    { id: 3, name: "Used (Few Scratches)", created_at: "2023-07-17 03:52:02 am" },
    { id: 4, name: "Used (Fresh Condition)", created_at: "2023-06-05 10:34:27 am" },
    { id: 5, name: "Refurbished", created_at: "2023-06-05 10:34:33 am" },
  ];
}

export default function ViewAllDeviceConditionsPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Device Conditions</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Device Condition
        </Button>
        <Button variant="outline">
          <Move className="w-4 h-4 mr-2" />
          Rearrange
        </Button>
      </div>
      <DataTable columns={device_condition_columns} data={data} />
    </div>
  );
}
