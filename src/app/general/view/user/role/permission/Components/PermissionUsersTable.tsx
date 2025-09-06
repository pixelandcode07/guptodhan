'use client';

import { useState } from 'react';
import { DataTable } from '@/components/TableHelper/data-table';
import { role_parmition_columns } from '@/components/TableHelper/role_parmition_user_columns';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

type ApiRoute = {
  sl: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createAt: string;
};

interface PermissionUsersTableProps {
  data: ApiRoute[];
}

export default function PermissionUsersTable({
  data,
}: PermissionUsersTableProps) {
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState<number | 'all'>(10);

  // Filter data by search
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Slice data based on entries dropdown
  const displayedData =
    entries === 'all' ? filteredData : filteredData.slice(0, entries);

  return (
    <div className="space-y-4">
      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 pb-4">
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

        <div className="flex gap-2 items-center w-full md:w-auto">
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

      {/* DataTable */}
      <DataTable columns={role_parmition_columns} data={displayedData} />
    </div>
  );
}
