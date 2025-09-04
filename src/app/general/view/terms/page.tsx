'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/TableHelper/data-table';

import SectionTitle from '@/components/ui/SectionTitle';
import { fact_columns } from '@/components/TableHelper/fact_columns';
import { terms_columns } from '@/components/TableHelper/terms_columns';

type Tems = {
  id: number;
  img: string;
  name: string;
  desc: string;
};

const tems: Tems[] = [
  {
    id: 1,
    img: 'https://github.com/shadcn.png',
    name: 'Rana Beach',
    desc: 'Autem Vel in volupta',
  },
  {
    id: 1,
    img: 'https://github.com/shadcn.png',
    name: 'Rana Beach',
    desc: 'Autem Vel in volupta',
  },
  {
    id: 2,
    img: 'https://github.com/shadcn.png',
    name: 'Rana Beach',
    desc: 'Autem Vel in volupta',
  },
  {
    id: 3,
    img: 'https://github.com/shadcn.png',
    name: 'Rana Beach',
    desc: 'Autem Vel in volupta',
  },
  {
    id: 4,
    img: 'https://github.com/shadcn.png',
    name: 'Rana Beach',
    desc: 'Autem Vel in volupta',
  },
];

export default function Tems() {
  const [search, setSearch] = useState('');

  const filteredBlogs = tems.filter(blog =>
    blog.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className=" bg-white">
      <div className="flex w-full justify-between items-center pt-5 flex-wrap">
        <div className="">
          <SectionTitle text="FAQ List" />
        </div>
      </div>
      <div className="p-5 pt-">
        {' '}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          {/* Show Entries Dropdown */}
          <div className="flex items-center gap-2">
            <span>Show</span>
            <Select defaultValue="10">
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span>entries</span>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <Input
              placeholder="Search blogs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
        <div className=" py-4 pr-5 flex justify-end ">
          <div className="flex gap-2 jstify-end">
            {' '}
            <Button size="sm" asChild>
              <a href="#">
                {/* <ListOrdered className="h-4 w-4 mr-2" /> */}
                Add New
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href="#">
                {/* <ListOrdered className="h-4 w-4 mr-2" /> */}
                Rearrange
              </a>
            </Button>
          </div>
        </div>
        <DataTable columns={terms_columns} data={tems} />
      </div>
    </div>
  );
}
