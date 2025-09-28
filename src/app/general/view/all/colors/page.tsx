import { DataTable } from "@/components/TableHelper/data-table";
import { Color, color_columns } from "@/components/TableHelper/color_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Move } from "lucide-react";

function getData(): Color[] {
  return [
    { id: 1, name: "Jam", code: "#551841", status: "Active", created_at: "2023-06-05 10:34:14 am" },
    { id: 2, name: "Badami", code: "#dbba9b", status: "Active", created_at: "2023-07-17 03:50:39 am" },
    { id: 3, name: "Pixel Colour", code: "#a1887f", status: "Active", created_at: "2023-07-17 03:52:02 am" },
    { id: 4, name: "Turquoiso", code: "#40e0d0", status: "Active", created_at: "2023-06-05 10:34:27 am" },
    { id: 5, name: "Mint green", code: "#eaffea", status: "Active", created_at: "2023-06-05 10:34:33 am" },
    { id: 6, name: "Ivory", code: "#fffcee", status: "Active", created_at: "2023-06-05 10:34:40 am" },
    { id: 7, name: "Gray", code: "#808080", status: "Active", created_at: "2023-06-05 10:34:47 am" },
    { id: 8, name: "Rupali silvar", code: "#a9a9a9", status: "Active", created_at: "2023-06-05 10:34:54 am" },
    { id: 9, name: "Space Gray", code: "#a7adba", status: "Active", created_at: "2023-06-05 10:35:01 am" },
    { id: 10, name: "Ocean blue", code: "#c8ecf8", status: "Active", created_at: "2023-06-05 10:35:08 am" },
    { id: 11, name: "Velvet Black", code: "#241f20", status: "Active", created_at: "2023-06-05 10:35:15 am" },
    { id: 12, name: "Silk Purple", code: "#55146e", status: "Active", created_at: "2023-06-05 10:35:22 am" },
    { id: 13, name: "Black", code: "#0b0a0a", status: "Active", created_at: "2023-06-05 10:35:29 am" },
    { id: 14, name: "Epi green", code: "#dcf8ee", status: "Active", created_at: "2023-06-05 10:35:36 am" },
    { id: 15, name: "Desert gold", code: "#f9f2e9", status: "Active", created_at: "2023-06-05 10:35:43 am" }
  ];
}

export default function ViewAllColorsPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Product Colors</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Color
        </Button>
       
      </div>
      <DataTable columns={color_columns} data={data} />
    </div>
  );
}
