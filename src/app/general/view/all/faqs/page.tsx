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

import { Plus } from 'lucide-react';
import { faq_columns } from '@/components/TableHelper/faq_categories';

type Faq = {
  id: number;
  category: string;
  qustion: string;
  answer: string;
  status: string;
};

const faq: Faq[] = [
  {
    id: 1,
    category: 'Shipping Information',
    qustion: 'Distinctio Et volup',
    answer: 'Qui illum ut quasi',
    status: 'Active',
  },
  {
    id: 2,
    category: 'Payment',
    qustion: 'Possimus asperiores',
    answer: 'Lorem quo elit labo',
    status: 'Active',
  },
  {
    id: 3,
    category: 'Shipping Information	',
    qustion: 'Temporibus qui sapie	',
    answer: 'Sint quibusdam facer',
    status: 'Active',
  },
  {
    id: 4,
    category: 'Shipping Information	',
    qustion: 'Veniam non et deser	',
    answer: 'Dolor eligendi magna	',
    status: 'Active',
  },
  {
    id: 5,
    category: 'Shipping ',
    qustion: 'Information	Voluptatibus sed aut',
    answer: '	Enim omnis quo reici',
    status: 'Active',
  },
];

export default function Tems() {
  const [search, setSearch] = useState('');

  const filteredBlogs = faq.filter(blog =>
    blog.category.toLowerCase().includes(search.toLowerCase())
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
                <Plus className="h-4 w-4 mr-2" />
                Add New FAQ
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href="#">
                <Plus className="h-4 w-4 mr-2" />
                Rearrange
              </a>
            </Button>
          </div>
        </div>
        <DataTable columns={faq_columns} data={faq} />
      </div>
    </div>
  );
}
