'use client';

import { useState } from 'react';

import SectionTitle from '@/components/ui/SectionTitle';
import { Pagination } from '@/components/ui/pagination';
import { DataTable } from '@/components/TableHelper/data-table';
import { testimonial_columns } from '@/components/TableHelper/testimonial_columns';
import { all_page_columns } from '@/components/TableHelper/all_page_columnd';

// Example data (you can fetch from API later)
const pageData = [
  {
    id: 1,
    image: 'https://github.com/shadcn.png',
    title: 'Sacha Lowe',
    url: 'https://github.com/shadcn.png',
    status: 'active',
  },
  {
    id: 2,
    image: 'https://github.com/shadcn.png',
    title: 'Sacha Lowe',
    url: 'https://github.com/shadcn.png',
    status: 'active',
  },
  {
    id: 3,

    image: 'https://github.com/shadcn.png',
    title: 'Sacha Lowe',
    url: 'https://github.com/shadcn.png',
    status: 'active',
  },
];

export default function AllPage() {
  const [search, setSearch] = useState('');

  const filteredData = pageData.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="View All Custom Pages" />
      <div className="px-5 p">
        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row pb-4 md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="entries" className="text-sm font-medium">
              Show:
            </label>
            <select
              id="entries"
              className="border rounded-md px-2 py-1 text-sm">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          <div>
            <input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border px-3 py-2 rounded-md w-full md:w-64 text-sm"
            />
          </div>
        </div>

        <DataTable columns={all_page_columns} data={pageData} />

        <Pagination />
      </div>
    </div>
  );
}
