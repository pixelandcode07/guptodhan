import { DataTable } from "@/components/TableHelper/data-table";
import { Product, product_columns } from "@/components/TableHelper/product_columns";
import { Input } from "@/components/ui/input";

function getData(): Product[] {
  return [
    {
      id: 1,
      image: "",
      category: "Home & Living",
      name: "RFL Polypropylene Classic Art Chair - Stylish &",
      store: "Home Plus",
      price: "2500",
      offer_price: "2000",
      stock: "50",
      flag: "",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 2,
      image: "",
      category: "Home & Living",
      name: "RFL Polypropylene Classic Art Chair - Stylish &",
      store: "Home Plus",
      price: "2500",
      offer_price: "2000",
      stock: "50",
      flag: "",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 3,
      image: "",
      category: "Home & Living",
      name: "RFL Polypropylene Classic Art Chair - Stylish &",
      store: "Home Plus",
      price: "2500",
      offer_price: "2000",
      stock: "50",
      flag: "",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 4,
      image: "",
      category: "Home & Living",
      name: "RFL Polypropylene Classic Art Chair - Stylish &",
      store: "Home Plus",
      price: "2500",
      offer_price: "2000",
      stock: "50",
      flag: "",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 5,
      image: "",
      category: "Home & Living",
      name: "RFL Polypropylene Classic Art Chair - Stylish &",
      store: "Home Plus",
      price: "2500",
      offer_price: "2000",
      stock: "50",
      flag: "",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 6,
      image: "",
      category: "Gadget",
      name: "DJI Osmo Mobile 6 Smartphone Gimbal - 3-Axis Sta",
      store: "Guptodhan",
      price: "2500",
      offer_price: "2000",
      stock: "50",
      flag: "",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 7,
      image: "",
      category: "Men's Fashion",
      name: "লেগ পিস",
      store: "Heart Beat",
      price: "2500",
      offer_price: "2000",
      stock: "50",
      flag: "",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 8,
      image: "",
      category: "Organic",
      name: "লেগ পিস",
      store: "Ready Fish Farm",
      price: "2500",
      offer_price: "2000",
      stock: "50",
      flag: "",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 9,
      image: "",
      category: "Organic",
      name: "লেগ পিস",
      store: "Ready Fish Farm",
      price: "2500",
      offer_price: "2000",
      stock: "50",
      flag: "",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 10,
      image: "",
      category: "Organic",
      name: "লেগ পিস",
      store: "Ready Fish Farm",
      price: "2500",
      offer_price: "2000",
      stock: "50",
      flag: "",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    }
  ];
}

export default function ViewAllProductsPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Product List</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
      </div>
      <DataTable columns={product_columns} data={data} />
    </div>
  );
}
