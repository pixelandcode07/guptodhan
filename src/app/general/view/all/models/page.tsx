import { DataTable } from "@/components/TableHelper/data-table";
import { Model, model_columns } from "@/components/TableHelper/model_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Move } from "lucide-react";

function getData(): Model[] {
  return [
    {
      id: 1,
      brand: "Honor",
      modelName: "Honor Pad X9 WIFI",
      code: "",
      slug: "honor-pad-x9-wifi",
      status: "Active",
      created_at: "2023-05-14 07:36:39 pm"
    },
    {
      id: 2,
      brand: "Honor",
      modelName: "Honor Pad X8a Wifi (4GB+64GB)",
      code: "",
      slug: "honor-pad-x8a-wifi-4gb-64gb",
      status: "Active",
      created_at: "2023-05-14 07:36:45 pm"
    },
    {
      id: 3,
      brand: "Honor",
      modelName: "HONOR Pad X8a LTE",
      code: "",
      slug: "honor-pad-x8a-lte",
      status: "Active",
      created_at: "2023-05-14 07:36:51 pm"
    },
    {
      id: 4,
      brand: "Honor",
      modelName: "Honor Pad 9",
      code: "",
      slug: "honor-pad-9",
      status: "Active",
      created_at: "2023-05-14 07:36:57 pm"
    },
    {
      id: 5,
      brand: "Honor",
      modelName: "HONOR X5b",
      code: "",
      slug: "honor-x5b",
      status: "Active",
      created_at: "2023-05-14 07:37:03 pm"
    },
    {
      id: 6,
      brand: "Honor",
      modelName: "HONOR 90 Lite",
      code: "",
      slug: "honor-90-lite",
      status: "Active",
      created_at: "2023-05-14 07:37:09 pm"
    },
    {
      id: 7,
      brand: "Honor",
      modelName: "HONOR X8b",
      code: "",
      slug: "honor-x8b",
      status: "Active",
      created_at: "2023-05-14 07:37:15 pm"
    },
    {
      id: 8,
      brand: "Honor",
      modelName: "HONOR X9a",
      code: "",
      slug: "honor-x9a",
      status: "Active",
      created_at: "2023-05-14 07:37:21 pm"
    },
    {
      id: 9,
      brand: "Honor",
      modelName: "HONOR 90",
      code: "",
      slug: "honor-90",
      status: "Active",
      created_at: "2023-05-14 07:37:27 pm"
    },
    {
      id: 10,
      brand: "Honor",
      modelName: "HONOR Magic5 Pro",
      code: "",
      slug: "honor-magic5-pro",
      status: "Active",
      created_at: "2023-05-14 07:37:33 pm"
    },
    {
      id: 11,
      brand: "Honor",
      modelName: "HONOR Magic5 Lite",
      code: "",
      slug: "honor-magic5-lite",
      status: "Active",
      created_at: "2023-05-14 07:37:39 pm"
    },
    {
      id: 12,
      brand: "Honor",
      modelName: "HONOR Magic5",
      code: "",
      slug: "honor-magic5",
      status: "Active",
      created_at: "2023-05-14 07:37:45 pm"
    },
    {
      id: 13,
      brand: "Honor",
      modelName: "HONOR Magic4 Pro",
      code: "",
      slug: "honor-magic4-pro",
      status: "Active",
      created_at: "2023-05-14 07:37:51 pm"
    },
    {
      id: 14,
      brand: "Honor",
      modelName: "HONOR Magic4",
      code: "",
      slug: "honor-magic4",
      status: "Active",
      created_at: "2023-05-14 07:37:57 pm"
    },
    {
      id: 15,
      brand: "Honor",
      modelName: "HONOR Magic3 Pro+",
      code: "",
      slug: "honor-magic3-pro-plus",
      status: "Active",
      created_at: "2023-05-14 07:38:03 pm"
    },
    {
      id: 16,
      brand: "Samsung",
      modelName: "Galaxy S24 Ultra",
      code: "SM-S928B",
      slug: "galaxy-s24-ultra",
      status: "Active",
      created_at: "2023-05-14 07:38:09 pm"
    },
    {
      id: 17,
      brand: "Samsung",
      modelName: "Galaxy S24+",
      code: "SM-S926B",
      slug: "galaxy-s24-plus",
      status: "Active",
      created_at: "2023-05-14 07:38:15 pm"
    },
    {
      id: 18,
      brand: "Samsung",
      modelName: "Galaxy S24",
      code: "SM-S921B",
      slug: "galaxy-s24",
      status: "Active",
      created_at: "2023-05-14 07:38:21 pm"
    },
    {
      id: 19,
      brand: "Apple",
      modelName: "iPhone 15 Pro Max",
      code: "A3090",
      slug: "iphone-15-pro-max",
      status: "Active",
      created_at: "2023-05-14 07:38:27 pm"
    },
    {
      id: 20,
      brand: "Apple",
      modelName: "iPhone 15 Pro",
      code: "A3092",
      slug: "iphone-15-pro",
      status: "Active",
      created_at: "2023-05-14 07:38:33 pm"
    },
    {
      id: 21,
      brand: "Apple",
      modelName: "iPhone 15 Plus",
      code: "A3091",
      slug: "iphone-15-plus",
      status: "Active",
      created_at: "2023-05-14 07:38:39 pm"
    },
    {
      id: 22,
      brand: "Apple",
      modelName: "iPhone 15",
      code: "A3093",
      slug: "iphone-15",
      status: "Active",
      created_at: "2023-05-14 07:38:45 pm"
    },
    {
      id: 23,
      brand: "Nike",
      modelName: "Air Max 270",
      code: "AH8050",
      slug: "air-max-270",
      status: "Active",
      created_at: "2023-05-14 07:38:51 pm"
    },
    {
      id: 24,
      brand: "Nike",
      modelName: "Air Force 1",
      code: "CW2288",
      slug: "air-force-1",
      status: "Active",
      created_at: "2023-05-14 07:38:57 pm"
    },
    {
      id: 25,
      brand: "Adidas",
      modelName: "Ultraboost 22",
      code: "GZ0127",
      slug: "ultraboost-22",
      status: "Active",
      created_at: "2023-05-14 07:39:03 pm"
    }
  ];
}

export default function ViewAllModelsPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Product Models</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Model
        </Button>
        <Button variant="outline">
          <Move className="w-4 h-4 mr-2" />
          Rearrange Model
        </Button>
      </div>
      <DataTable columns={model_columns} data={data} />
    </div>
  );
}
