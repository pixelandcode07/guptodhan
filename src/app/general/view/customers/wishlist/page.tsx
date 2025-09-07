import { DataTable } from "@/components/TableHelper/data-table"
import { wishlist_columns, Wishlist } from "@/components/TableHelper/wishlist_columns"
import { Input } from "@/components/ui/input"

function getData(): Wishlist[] {
  return [
    {
      id: 1,
      category: "Gadget",
      image: "/placeholder-product.jpg",
      product: "JisuLife Handheld Fan Life9 Tiny Hurricane",
      customer_name: "Kawser Ahmed",
      email: "kawserahmed5459@gmail.com",
      contact: "01330666736",
      created_at: "2025-07-27 01:18:34 pm"
    },
    {
      id: 2,
      category: "Home & Living",
      image: "/placeholder-product.jpg",
      product: "Regal Metal Bed Black",
      customer_name: "Nowrin jahan",
      email: "2510sifathossain2000@gmail.com",
      contact: "01911127039",
      created_at: "2025-07-21 12:37:34 pm"
    },
    {
      id: 3,
      category: "Homemade",
      image: "/placeholder-product.jpg",
      product: "সেমাই পিঠা বাটি পিঠা",
      customer_name: "Rasel",
      email: "",
      contact: "01915891735",
      created_at: "2025-06-24 06:09:08 pm"
    },
    {
      id: 4,
      category: "Homemade",
      image: "/placeholder-product.jpg",
      product: "মাছ পিঠা",
      customer_name: "arian sasika",
      email: "",
      contact: "+881770488411",
      created_at: "2025-05-31 02:29:53 pm"
    },
    {
      id: 5,
      category: "Women Fashion",
      image: "/placeholder-product.jpg",
      product: "Versse Branded Stylish Ladies Handbag",
      customer_name: "MD DELOWAR HOSSAIN",
      email: "",
      contact: "01911585555",
      created_at: "2025-05-27 05:06:03 pm"
    },
    {
      id: 6,
      category: "Mobile",
      image: "/placeholder-product.jpg",
      product: "Excelltel PABX Telephone System Mini PBX MS series",
      customer_name: "Wifacan",
      email: "wifacan182@pricegh.com",
      contact: "",
      created_at: "2025-05-26 03:25:51 pm"
    },
    {
      id: 7,
      category: "Electronics",
      image: "/placeholder-product.jpg",
      product: "Toshiba 55' 55M550NP QLED 4K Google TV",
      customer_name: "Swopon Mridha",
      email: "",
      contact: "",
      created_at: "2025-05-25 12:06:14 am"
    },
    {
      id: 8,
      category: "Electronics",
      image: "/placeholder-product.jpg",
      product: "Realme Buds Wireless 3",
      customer_name: "Amir Hamza",
      email: "canva.amirhamza@gmail.com",
      contact: "",
      created_at: "2025-05-11 07:44:53 pm"
    },
    {
      id: 9,
      category: "Women Fashion",
      image: "/placeholder-product.jpg",
      product: "বিবিখানা পিঠা",
      customer_name: "Md Somrat Ahmed",
      email: "somratwww2004@gmail.com",
      contact: "",
      created_at: "2025-05-06 11:05:13 am"
    },
    {
      id: 10,
      category: "Women Fashion",
      image: "/placeholder-product.jpg",
      product: "পাকিস্তানি ইন্সপায়ার – তওয়াক্কাল কাতান প্রিমিয়াম সুইট কটন লন",
      customer_name: "Customer 10",
      email: "",
      contact: "",
      created_at: "2025-03-08 01:05:20 pm"
    }
  ];
}

export default function WishlistPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">WishList</span>
        </h1>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select className="border border-gray-300 rounded px-2 py-1">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </div>
      </div>
      
      <DataTable columns={wishlist_columns} data={data} />
    </div>
  );
}
