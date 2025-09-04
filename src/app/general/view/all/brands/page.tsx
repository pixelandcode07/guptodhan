import { DataTable } from "@/components/TableHelper/data-table";
import { Brand, brand_columns } from "@/components/TableHelper/brand_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Move } from "lucide-react";

function getData(): Brand[] {
  return [
    {
      id: 1,
      name: "Honor",
      logo: "honor",
      banner: "honor",
      categories: ["Mobile"],
      subcategories: ["Smart Phone"],
      childcategories: ["Honor"],
      slug: "honor",
      status: "Active",
      featured: "Not Featured",
      created_at: "2023-05-14 07:36:39 pm"
    },
    {
      id: 2,
      name: "Samsung",
      logo: "samsung",
      banner: "samsung",
      categories: ["Mobile", "Electronics"],
      subcategories: ["Smart Phone", "Tablet"],
      childcategories: ["Galaxy", "Note"],
      slug: "samsung",
      status: "Active",
      featured: "Not Featured",
      created_at: "2023-05-14 07:36:45 pm"
    },
    {
      id: 3,
      name: "Apple",
      logo: "apple",
      banner: "apple",
      categories: ["Mobile", "Electronics"],
      subcategories: ["Smart Phone", "Laptop"],
      childcategories: ["iPhone", "MacBook"],
      slug: "apple",
      status: "Active",
      featured: "Not Featured",
      created_at: "2023-05-14 07:36:51 pm"
    },
    {
      id: 4,
      name: "Nike",
      logo: "nike",
      banner: "nike",
      categories: ["Sports", "Fashion"],
      subcategories: ["Shoes", "Clothing"],
      childcategories: ["Running", "Basketball"],
      slug: "nike",
      status: "Active",
      featured: "Not Featured",
      created_at: "2023-05-14 07:36:57 pm"
    },
    {
      id: 5,
      name: "Adidas",
      logo: "adidas",
      banner: "adidas",
      categories: ["Sports", "Fashion"],
      subcategories: ["Shoes", "Clothing"],
      childcategories: ["Football", "Training"],
      slug: "adidas",
      status: "Active",
      featured: "Not Featured",
      created_at: "2023-05-14 07:37:03 pm"
    },
    {
      id: 6,
      name: "Regal Furniture",
      logo: "Regal",
      banner: "furniture",
      categories: ["Home & Living"],
      subcategories: ["Furniture"],
      childcategories: ["Sofa", "Bed"],
      slug: "regal-furniture",
      status: "Active",
      featured: "Not Featured",
      created_at: "2023-05-14 07:37:09 pm"
    },
    {
      id: 7,
      name: "IKEA",
      logo: "IKEA",
      banner: "ikea",
      categories: ["Home & Living"],
      subcategories: ["Furniture", "Decor"],
      childcategories: ["Kitchen", "Living Room"],
      slug: "ikea",
      status: "Active",
      featured: "Not Featured",
      created_at: "2023-05-14 07:37:15 pm"
    },
    {
      id: 8,
      name: "havit",
      logo: "havit",
      banner: "HAVIT",
      categories: ["Gadget", "Computer"],
      subcategories: ["Charger", "All Laptop", "Processor"],
      childcategories: ["Gaming", "Office"],
      slug: "havit",
      status: "Active",
      featured: "Not Featured",
      created_at: "2023-05-14 07:37:21 pm"
    },
    {
      id: 9,
      name: "Logitech",
      logo: "logitech",
      banner: "logitech",
      categories: ["Computer", "Gadget"],
      subcategories: ["Mouse", "Keyboard"],
      childcategories: ["Gaming", "Office"],
      slug: "logitech",
      status: "Active",
      featured: "Not Featured",
      created_at: "2023-05-14 07:37:27 pm"
    },
    {
      id: 10,
      name: "Thirty Three",
      logo: "33",
      banner: "33",
      categories: ["Fashion"],
      subcategories: ["Clothing"],
      childcategories: ["Men", "Women"],
      slug: "thirty-three",
      status: "Active",
      featured: "Not Featured",
      created_at: "2023-05-14 07:37:33 pm"
    }
  ];
}

export default function ViewAllBrandsPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Product Brands</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Brand
        </Button>
        <Button variant="outline">
          <Move className="w-4 h-4 mr-2" />
          Rearrange Brand
        </Button>
      </div>
      <DataTable columns={brand_columns} data={data} />
    </div>
  );
}
