'use client';

import { useState } from 'react';

import { DataTable } from '@/components/TableHelper/data-table';
import { role_parmition_columns } from '@/components/TableHelper/role_parmition_user_columns';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/SectionTitle';
import { RefreshCcw } from 'lucide-react';

// Example data (you can fetch from API later)

type ApiRoute = {
  sl: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createAt: string;
};
const apiRoutes: ApiRoute[] = [
  {
    sl: 1,
    name: 'MD Siam madbar',
    email: 'siammadbor858@gmail.com',
    phone: '	01724977798',
    address: 'Bangladesh',
    createAt: '2025-03-13 02:13:56 pm',
  },
];

export default function PermitionUsers() {
  const [search, setSearch] = useState('');

  const filteredData = apiRoutes.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="Permision Route List" />
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
          <div className="flex gap-2 items-center">
            <input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border px-3 py-2 rounded-md w-full md:w-64 text-sm"
            />
            <Button>
              <RefreshCcw />
              Regenerate Role
            </Button>
          </div>
        </div>
        <DataTable columns={role_parmition_columns} data={filteredData} />
      </div>
    </div>
  );
}
