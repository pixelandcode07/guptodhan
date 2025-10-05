import { DataTable } from "@/components/TableHelper/data-table";
import { slider_columns } from "@/components/TableHelper/slider_columns";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import dbConnect from '@/lib/db';
import { SliderServices } from '@/lib/modules/slider-form/sliderForm.service';

export const dynamic = 'force-dynamic';
import SlidersClient from './SlidersClient';

export default async function ViewAllSlidersPage() {
  await dbConnect();
  const items = await SliderServices.getAllSlidersFromDB();
  const rows = items.map((it: any, idx: number) => ({
    id: idx + 1,
    slider: it.image,
    sub_title: it.subTitleWithColor,
    title: it.bannerTitleWithColor,
    slider_link: it.sliderLink,
    button_text: it.buttonWithColor,
    button_link: it.buttonLink,
    status: (it.status === 'active' ? 'Active' : 'Inactive'),
    created_at: new Date(it.createdAt || it.created_at || Date.now()).toLocaleString(),
    _id: (it?._id && typeof it._id === 'object' && 'toString' in it._id) ? (it._id as any).toString() : String(it._id),
  }));
  
  return (
    <div className="m-5 p-5 border">
      <div className="mb-6">
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Sliders List</span>
        </h1>
      </div>
      
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-2">
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
      
      <SlidersClient initialRows={rows} />
    </div>
  );
}
