'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ArrowUpDown, Plus } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import { DataTable } from '@/components/TableHelper/data-table';
import { blog_bagegory_columns } from '@/components/TableHelper/blog_cagegory_columns';

export default function BlogCategoryTable() {
  const data = [
    {
      id: 1,
      name: 'Education',
      slug: 'education1730614987',
      featured: false,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Environment',
      slug: 'environment1730614992',
      featured: false,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Human Rights',
      slug: 'human-rights1730614998',
      featured: false,
      status: 'Active',
    },
    {
      id: 4,
      name: 'E-commerce',
      slug: 'ecommerce1731211092',
      featured: false,
      status: 'Active',
    },
    {
      id: 5,
      name: 'Donation',
      slug: 'donation1741673125',
      featured: false,
      status: 'Active',
    },
    {
      id: 6,
      name: 'Buy&Sale',
      slug: 'buysale1741673165',
      featured: false,
      status: 'Active',
    },
  ];

  return (
    <div className=" bg-white space-y-4">
      {/* Header */}
      <div className="flex flex-col pt-5 pr-5   md:flex-row justify-between items-center gap-3">
        <SectionTitle text="View All Blog Categories" />
        <div className="flex gap-2">
          <Button variant="secondary" className="flex items-center gap-1">
            <ArrowUpDown className="w-4 h-4" /> Rearrange Category
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add New Category
          </Button>
        </div>
      </div>

      <div className="px-5 pb-5">
        {/* Search */}
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search..."
            className="w-full md:w-64 rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className=" px-5 pb-5">
          {' '}
          <DataTable columns={blog_bagegory_columns} data={data} />
        </div>
      </div>
    </div>
  );
}
