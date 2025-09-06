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

import { ListOrdered, Plus } from 'lucide-react';
import { faq_categories_columns } from '@/components/TableHelper/faq_columns';

type FaqCategories = {
  id: number;
  name: string;
  slug: string;
  status: string;
};

const faqCategories: FaqCategories[] = [
  {
    id: 1,
    name: 'Shipping Information',
    slug: 'shipping-information1731584415',
    status: 'activ',
  },
  {
    id: 2,
    name: 'Payment',
    slug: 'payment1731584042',
    status: 'activ',
  },
  {
    id: 3,
    name: 'Orders & Returns',
    slug: 'orders-returns1731584051',
    status: 'activ',
  },
];

export default function Tems() {
  const [search, setSearch] = useState('');

  const filteredBlogs = faqCategories.filter(blog =>
    blog.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className=" bg-white">
      <div className="flex w-full justify-between items-center pt-5 flex-wrap">
        <div className="">
          <SectionTitle text="View All faq Categories" />
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
                <ListOrdered className="h-4 w-4 mr-2" />
                Reanrrange Category
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href="#">
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </a>
            </Button>
          </div>
        </div>
        <DataTable columns={faq_categories_columns} data={faqCategories} />
      </div>
    </div>
  );
}
