import { DataTable } from "@/components/TableHelper/data-table";
import { slider_columns } from "@/components/TableHelper/slider_columns";
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
      <SlidersClient initialRows={rows} />
    </div>
  );
}
