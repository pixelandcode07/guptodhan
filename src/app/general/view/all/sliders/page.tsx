import { DataTable } from "@/components/TableHelper/data-table";
import { Slider, slider_columns } from "@/components/TableHelper/slider_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpDown } from "lucide-react";
import Link from "next/link";

function getData(): Slider[] {
  return [
    {
      id: 1,
      slider: "https://app-area.guptodhan.com/sliders/hand-phone.jpg",
      sub_title: "",
      title: "",
      slider_link: "",
      button_text: "",
      button_link: "",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 2,
      slider: "https://app-area.guptodhan.com/sliders/night-city.jpg",
      sub_title: "",
      title: "",
      slider_link: "",
      button_text: "",
      button_link: "",
      status: "Inactive",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 3,
      slider: "https://app-area.guptodhan.com/sliders/blue-abstract.jpg",
      sub_title: "",
      title: "",
      slider_link: "https://guptodhan.com/buy-sale",
      button_text: "Shop Now",
      button_link: "https://guptodhan.com/buy-sale",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 4,
      slider: "https://app-area.guptodhan.com/sliders/person-blender.jpg",
      sub_title: "",
      title: "",
      slider_link: "https://guptodhan.com/shop?category=electronics&subcategory=blender",
      button_text: "",
      button_link: "https://guptodhan.com/shop?category=electronics&subcategory=blender",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 5,
      slider: "https://app-area.guptodhan.com/sliders/shopping-bag.jpg",
      sub_title: "",
      title: "",
      slider_link: "/shop?store=guptodhan",
      button_text: "",
      button_link: "/shop?store=guptodhan",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 6,
      slider: "https://app-area.guptodhan.com/sliders/electronics.jpg",
      sub_title: "",
      title: "",
      slider_link: "/shop?category=electronics",
      button_text: "",
      button_link: "/shop?category=electronics",
      status: "Inactive",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 7,
      slider: "https://app-area.guptodhan.com/sliders/fashion.jpg",
      sub_title: "",
      title: "",
      slider_link: "/shop?category=fashion",
      button_text: "",
      button_link: "/shop?category=fashion",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 8,
      slider: "https://app-area.guptodhan.com/sliders/home-living.jpg",
      sub_title: "",
      title: "",
      slider_link: "/shop?category=home-living",
      button_text: "",
      button_link: "/shop?category=home-living",
      status: "Inactive",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 9,
      slider: "https://app-area.guptodhan.com/sliders/sports.jpg",
      sub_title: "",
      title: "",
      slider_link: "/shop?category=sports",
      button_text: "",
      button_link: "/shop?category=sports",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 10,
      slider: "https://app-area.guptodhan.com/sliders/shopping-person.jpg",
      sub_title: "Shop Now",
      title: "",
      slider_link: "/donate-anything",
      button_text: "Shop Now",
      button_link: "/shop?store=guptodhan",
      status: "Inactive",
      created_at: "2024-08-18 09:58:42 pm"
    }
  ];
}

export default function ViewAllSlidersPage() {
  const data = getData();
  
  return (
    <div className="m-5 p-5 border">
      <div className="mb-6">
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Sliders List</span>
        </h1>
      </div>
      
      <div className="flex items-center justify-end mb-4">
       
        
        <div className="flex flex-col items-end gap-2">
          
          <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <Input type="text" className="border border-gray-500 w-64" />
          </div>
            <Link href="/general/add/new/slider">
              <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Slider
              </Button>
            </Link>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Rearrange Slider
            </Button>
          </div>
        </div>
      </div>
      
      <DataTable columns={slider_columns} data={data} />
    </div>
  );
}
