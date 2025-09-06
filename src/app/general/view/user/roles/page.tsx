'use client';

import { useState } from 'react';

import { DataTable } from '@/components/TableHelper/data-table';
import { user_roles_columns } from '@/components/TableHelper/user_role_columns';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/SectionTitle';
import { Plus } from 'lucide-react';

// Example data (you can fetch from API later)

type ApiRoute = {
  sl: number;
  roleName: string;
  desc: string;
  createdAt: string;
  updatedAt: string;
};
const apiRoutes: ApiRoute[] = [
  {
    sl: 1,
    roleName: 'Producting	',
    desc: 'Producting',
    createdAt: '2025-07-06 11:42:14 pm',
    updatedAt: '2025-08-20 09:53:10 pm',
  },
];

export default function PermitionUsers() {
  const [search, setSearch] = useState('');

  const filteredData = apiRoutes.filter(item =>
    item.roleName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="User Route List" />
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
          </div>
        </div>
        <div className="flex justify-end mb-2">
          {' '}
          <Button>
            <Plus />
            Create New Role
          </Button>
        </div>
        <DataTable columns={user_roles_columns} data={filteredData} />
      </div>
    </div>
  );
}
