"use client";

import { DataTable } from "@/components/TableHelper/data-table";
import { Slider, slider_columns } from "@/components/TableHelper/slider_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ViewAllSlidersPage() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<Slider[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchSliders = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/slider-form');
        const json = await res.json();
        const items = (json?.data || []) as any[];
        const mapped: Slider[] = items.map((it, idx) => ({
          id: idx + 1,
          slider: it.image,
          sub_title: it.subTitleWithColor,
          title: it.bannerTitleWithColor,
          slider_link: it.sliderLink,
          button_text: it.buttonWithColor,
          button_link: it.buttonLink,
          status: (it.status === 'active' ? 'Active' : 'Inactive') as Slider['status'],
          created_at: new Date(it.createdAt || it.created_at || Date.now()).toLocaleString(),
        }));
        if (mounted) setRows(mapped);
      } catch (e) {
        // noop
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchSliders();
    return () => { mounted = false };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.sub_title.toLowerCase().includes(q) ||
      r.slider_link.toLowerCase().includes(q) ||
      r.button_text.toLowerCase().includes(q)
    );
  }, [rows, search]);
  
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
              <Input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-500 w-64" />
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
      
      <DataTable columns={slider_columns} data={filtered} />
      {isLoading && <div className="mt-3 text-sm text-gray-500">Loading...</div>}
    </div>
  );
}
