import { DataTable } from "@/components/TableHelper/data-table";
import { Banner, banner_columns } from "@/components/TableHelper/banner_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpDown } from "lucide-react";

function getData(): Banner[] {
  return [
    {
      id: 1,
      banner: "https://app-area.guptodhan.com/banners/donate-people.jpg",
      sub_title: "Donate Anything",
      title: "Donate Anything",
      description: "Donate Anything",
      button_text: "Donate Anything",
      position: "top",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 2,
      banner: "https://app-area.guptodhan.com/banners/green-donate-box.jpg",
      sub_title: "",
      title: "বেচুন - বাঁচুন",
      description: "",
      button_text: "Shop Now",
      position: "top",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 3,
      banner: "https://app-area.guptodhan.com/banners/furniture.jpg",
      sub_title: "Trending Collection",
      title: "Furniture Sale",
      description: "Up to 25% OFF",
      button_text: "Shop Now",
      position: "middle",
      status: "Inactive",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 4,
      banner: "https://app-area.guptodhan.com/banners/blue-shoe.jpg",
      sub_title: "New Collection",
      title: "Women Sale",
      description: "",
      button_text: "Shop Now",
      position: "middle",
      status: "Inactive",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 5,
      banner: "https://app-area.guptodhan.com/banners/purple-blue.jpg",
      sub_title: "New Arrivals",
      title: "Sports Shoes",
      description: "",
      button_text: "Shop Now",
      position: "bottom",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 6,
      banner: "https://app-area.guptodhan.com/banners/30-off.jpg",
      sub_title: "30% Off Our Entire Shop",
      title: "Black Friday",
      description: "Use Code Blkfr123 at Checkout",
      button_text: "Shop Now",
      position: "bottom",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 7,
      banner: "https://app-area.guptodhan.com/banners/fitness-man.jpg",
      sub_title: "Top Products",
      title: "Fitness Equipment For Health",
      description: "Only until the end of this week.",
      button_text: "Shop Now",
      position: "bottom",
      status: "Inactive",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 8,
      banner: "https://app-area.guptodhan.com/banners/camera-lens.jpg",
      sub_title: "Accessories Collection",
      title: "",
      description: "",
      button_text: "Shop Now",
      position: "shop",
      status: "Inactive",
      created_at: "2024-08-18 09:58:42 pm"
    }
  ];
}

export default function BannersPage() {
  const data = getData();
  
  return (
    <div className="m-5 p-5 border">
      <div className="mb-6">
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Banners List</span>
        </h1>
      </div>
      
      <div className="flex items-center justify-end mb-4">
        <div className="flex flex-col items-end gap-2">
          {/* <div className="flex items-center gap-2">
            <span>Search:</span>
            <Input type="text" className="border border-gray-500 w-64" />
          </div> */}
          <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <Input type="text" className="border border-gray-500 w-64" />
          </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Banner
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Rearrange Banners
            </Button>
          </div>
        </div>
      </div>
      
      <DataTable columns={banner_columns} data={data} />
    </div>
  );
}
