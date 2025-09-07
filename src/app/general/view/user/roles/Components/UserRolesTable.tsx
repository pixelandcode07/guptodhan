'use client';

import { useState } from 'react';
import { DataTable } from '@/components/TableHelper/data-table';
import { user_roles_columns } from '@/components/TableHelper/user_role_columns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type ApiRoute = {
  sl: number;
  roleName: string;
  desc: string;
  createdAt: string;
  updatedAt: string;
};

interface UserRolesTableProps {
  data: ApiRoute[];
}

export default function UserRolesTable({ data }: UserRolesTableProps) {
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState<number | 'all'>(10);

  // Filter based on search
  const filteredData = data.filter(item =>
    item.roleName.toLowerCase().includes(search.toLowerCase())
  );

  // Apply slice based on entries dropdown
  const displayedData =
    entries === 'all' ? filteredData : filteredData.slice(0, entries);

  return (
    <div className="space-y-4">
      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm font-medium">
            Show:
          </label>
          <select
            id="entries"
            className="border rounded-md px-2 py-1 text-sm"
            value={entries}
            onChange={e =>
              setEntries(
                e.target.value === 'all' ? 'all' : Number(e.target.value)
              )
            }>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value="all">All</option>
          </select>
        </div>

        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:w-64 text-sm"
        />
      </div>

      {/* Create Button */}
      <div className="flex justify-end">
        <Button>
          <Plus />
          Create New Role
        </Button>
      </div>

      {/* DataTable */}
      <DataTable columns={user_roles_columns} data={displayedData} />
    </div>
  );
}
