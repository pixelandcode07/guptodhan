'use client';

import { all_page_columns } from '@/components/TableHelper/all_page_columns';
import { DataTable } from '@/components/TableHelper/data-table';
import { useState } from 'react';

type PageData = {
  id: number;
  image: string;
  title: string;
  url: string;
  status: string;
};

type Props = {
  pages: PageData[];
};

export default function AllPagesTable({ pages }: Props) {
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(10);

  const filteredData = pages.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const displayedData = filteredData.slice(0, entries);

  return (
    <div>
      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row pb-4 md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm font-medium">
            Show:
          </label>
          <select
            id="entries"
            className="border rounded-md px-2 py-1 text-sm"
            value={entries}
            onChange={e => setEntries(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
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

      <DataTable columns={all_page_columns} data={displayedData} />
    </div>
  );
}
